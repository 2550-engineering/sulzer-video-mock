import type {
  Availability,
  DutyPoint,
  ModelAvailability,
  ProductModel,
  ProductVariant,
  ResultArticle,
} from '../types'
import {
  getModel,
  getProduct,
  getProductVariant,
  modelsFor,
  variantPath,
  variantsFor,
} from './catalog'
import { discontinued } from './availability'
import { bepFlowAt, headAt } from './pumpCurves'
import { maxFlowRatio, modelCurve, ratedPoint, variantPerformance } from './variantCurves'

/*
 * Search result items for products with many sizes: configured variants
 * where a product has them (XFP), otherwise its models (AHLSTAR). Built once.
 */

const modelAvailability: Record<ModelAvailability, Availability['status']> = {
  'In stock': 'in-stock',
  'Fast delivery': 'lead-time',
  'Made to order': 'made-to-order',
}

/** Working days per lead time on the Models tab (3 working days, 2 weeks, 10–12 weeks). */
const modelLeadDays: Record<ModelAvailability, number> = {
  'In stock': 3,
  'Fast delivery': 10,
  'Made to order': 60,
}

/** A model's or sized pump's availability ("In stock", "Made to order" …) as a cart availability. */
export const toAvailability = (
  availability: ModelAvailability,
  leadTime: string,
): Availability => ({
  status: modelAvailability[availability],
  leadTime,
  leadTimeDays: modelLeadDays[availability],
})

function fromVariant(variant: ProductVariant): ResultArticle {
  const rated = ratedPoint(variant)
  const { series } = variantPerformance(variant, rated)
  return {
    id: variant.id,
    kind: 'variant',
    productId: variant.productId,
    code: variant.code,
    productNumber: variant.productNumber,
    category: variant.category,
    modelId: variant.modelId,
    supply: `3×${variant.voltage}, ${variant.frequency} Hz`,
    applicationIds: variant.applicationIds,
    frequency: variant.frequency,
    phase: variant.phase,
    power: variant.power,
    speed: variant.speed,
    housing: variant.housingMaterial,
    inlet: variant.connection.inlet,
    outlet: variant.connection.outlet,
    maxFlow: Math.round(bepFlowAt(series.curve, series.scale) * maxFlowRatio),
    maxHead: Math.round(headAt(series.curve, series.scale, 0) * 10) / 10,
    exApproved: variant.exApproved,
    impellerType: variant.impeller.type,
    impellerDiameter: variant.impeller.diameter,
    ipClass: variant.ipClass,
    listPrice: variant.listPrice,
    availability: variant.availability,
    discontinued: variant.discontinued,
    to: variantPath(variant),
    curve: series,
    speedRatio: variant.speed / (getModel(variant.modelId)?.speed ?? variant.speed),
    rated,
  }
}

function fromModel(model: ProductModel): ResultArticle {
  const curve = modelCurve(model)
  const rated = { flow: model.flow, head: model.head }
  return {
    id: model.id,
    kind: 'model',
    productId: model.productId,
    code: model.name,
    productNumber: model.productNumber,
    category: getProduct(model.productId)?.family ?? '',
    modelId: model.id,
    supply: model.frequency === 60 ? '3×460 V, 60 Hz' : '3×400 V, 50 Hz',
    applicationIds: getProduct(model.productId)?.applications ?? [],
    frequency: model.frequency,
    phase: 3,
    power: model.power,
    speed: model.speed,
    housing: model.casingMaterial,
    inlet: model.connection.suction ?? model.connection.discharge,
    outlet: model.connection.discharge,
    maxFlow: Math.round(model.flow * maxFlowRatio),
    maxHead: Math.round(curve.shutOffHead * 10) / 10,
    exApproved: false,
    impellerType: 'Closed',
    impellerDiameter: model.impeller,
    ipClass: 'IP55',
    listPrice: model.listPrice,
    availability: model.discontinued
      ? discontinued
      : toAvailability(model.availability, model.leadTime),
    discontinued: model.discontinued,
    to: `/products/${model.productId}/${model.id}`,
    curve: { id: model.id, name: model.name, curve, scale: 1, trimRatio: 1, operatingPoint: rated },
    speedRatio: 1,
    rated,
  }
}

const cache = new Map<string, ResultArticle[]>()

/** A product's variants, or else its models, as result items (empty for one-off products). */
export function articlesFor(productId: string): ResultArticle[] {
  let list = cache.get(productId)
  if (!list) {
    const variants = variantsFor(productId)
    list = variants.length > 0 ? variants.map(fromVariant) : modelsFor(productId).map(fromModel)
    cache.set(productId, list)
  }
  return list
}

/** The result item for a variant or model id. */
export function getArticle(productId: string, id: string) {
  return articlesFor(productId).find((article) => article.id === id)
}

/** The result item for any catalogue variant or model id, e.g. a project item's. */
export function articleById(id: string) {
  const productId = getProductVariant(id)?.productId ?? getModel(id)?.productId
  return productId ? getArticle(productId, id) : undefined
}

/** A catalogue article's rated point as a duty point, for adding it to a project. */
export const articleDutyPoint = (article: ResultArticle): DutyPoint => ({
  flow: article.rated.flow,
  head: article.rated.head,
  liquid: 'water',
  temperature: 20,
  frequency: article.frequency,
})

/** The model's own article, or its variants' when the product is sold as variants. */
export function articlesOfModel(modelId: string) {
  const model = getModel(modelId)
  if (!model) return []
  const all = articlesFor(model.productId)
  const variants = variantsFor(model.productId, model.id)
  return variants.length > 0
    ? all.filter((a) => variants.some((v) => v.id === a.id))
    : all.filter((a) => a.id === model.id)
}

export type ArticleSort = 'relevance' | 'power' | 'flow' | 'head' | 'price'

const sortValue: Record<Exclude<ArticleSort, 'relevance'>, (a: ResultArticle) => number> = {
  power: (a) => a.power,
  flow: (a) => a.maxFlow,
  head: (a) => a.maxHead,
  price: (a) => a.listPrice,
}

/** Sorted copy, smallest first; ties keep search order. "relevance" keeps search order. */
export function sortArticles(articles: ResultArticle[], sort: ArticleSort) {
  if (sort === 'relevance') return articles
  const value = sortValue[sort]
  return articles
    .map((article, index) => ({ article, index }))
    .sort((a, b) => value(a.article) - value(b.article) || a.index - b.index)
    .map(({ article }) => article)
}
