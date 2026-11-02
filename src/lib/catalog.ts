import { applications, rootApplicationId } from '../data/applications'
import { cadFiles, cadPreviews } from '../data/cad'
import { documents, serviceVideos } from '../data/documents'
import { knowledgeItems } from '../data/knowledge'
import { productModels } from '../data/productModels'
import { products } from '../data/products'
import { services } from '../data/services'
import { serviceProviderDemo } from '../config/demo'
import { ahlstarDrawing } from '../data/drawings/ahlstar'
import { xfp150eDrawing } from '../data/drawings/xfp150e'
import { ahlstarSpareParts } from '../data/spareParts/ahlstar'
import { xfpSpareParts } from '../data/spareParts/xfp'
import { xfpVariants } from '../data/xfp'
import type {
  Application,
  ApplicationTeaser,
  PartHit,
  PartOwner,
  Product,
  ProductVariant,
  Service,
  SparePart,
  SparePartCatalogue,
} from '../types'

/* Lookups over the mock catalogue in src/data. */

export function getApplication(id: string) {
  return applications.find((app) => app.id === id)
}

export const rootApplication = getApplication(rootApplicationId)!

/** Nested URL from the slugs of the application and its ancestors, e.g. /applications/<area>/<app>. */
export function applicationPath(app: Application) {
  const slugs = applicationTrail(app)
    .slice(1)
    .map((node) => node.slug)
  return ['/applications', ...slugs].join('/')
}

/** The application at a URL: follows each slug down from the root. Undefined if any step doesn't match. */
export function findApplication(slugs: string[]) {
  let node: Application | undefined = rootApplication
  for (const slug of slugs) {
    node = node && childApplications(node).find((child) => child.slug === slug)
  }
  return node
}

/** The application and its ancestors, outermost first. */
export function applicationTrail(app: Application): Application[] {
  const trail = [app]
  let parent = app.parentId ? getApplication(app.parentId) : undefined
  while (parent) {
    trail.unshift(parent)
    parent = parent.parentId ? getApplication(parent.parentId) : undefined
  }
  return trail
}

/** Image tile data for an application (title, caption, link). */
export function applicationTeaser(app: Application): ApplicationTeaser {
  return {
    title: app.name,
    caption: app.summary,
    to: applicationPath(app),
    // The tile shows the title, so the image is decorative.
    image: { ...app.cardImage, alt: '' },
  }
}

export function childApplications(app: Application) {
  return app.children.map(getApplication).filter((child) => child !== undefined)
}

function descendantIds(app: Application): string[] {
  return [app.id, ...childApplications(app).flatMap(descendantIds)]
}

/** Products suitable for the application or any application below it. The root lists everything. */
export function productsForApplication(app: Application) {
  if (app.id === rootApplicationId) return products
  const ids = new Set(descendantIds(app))
  return products.filter((product) => product.applications.some((id) => ids.has(id)))
}

export function getService(id: string) {
  return services.find((service) => service.id === id)
}

export function servicesFor(ids: string[]) {
  return ids.map(getService).filter((service) => service !== undefined)
}

export function knowledgeFor(ids: string[]) {
  return ids
    .map((id) => knowledgeItems.find((item) => item.id === id))
    .filter((item) => item !== undefined)
}

/** A Products & solutions group with its products and services looked up. */
export type ResolvedProductGroup = {
  id: string
  title: string
  products: Product[]
  services: Service[]
}

/**
 * Groups for an application's Products & solutions tab: its `productGroups` in
 * order, or (without them) the matching products grouped by category.
 */
export function productGroupsFor(app: Application): ResolvedProductGroup[] {
  if (app.productGroups) {
    return app.productGroups.map((group) => ({
      id: group.id,
      title: group.title,
      products: (group.productIds ?? []).map(getProduct).filter((p) => p !== undefined),
      services: servicesFor(group.serviceIds ?? []),
    }))
  }
  return groupBy(productsForApplication(app), (product) => product.category).map(
    ([category, products]) => ({ id: category, title: category, products, services: [] }),
  )
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id)
}

export function productPath(product: Product) {
  return `/products/${product.id}`
}

export function getModel(id: string) {
  return productModels.find((model) => model.id === id)
}

export function modelsFor(productId: string) {
  return productModels.filter((model) => model.productId === productId)
}

const productVariants = [...xfpVariants]
// The demo AHLSTAR model first, so search links shared part numbers to it.
const sparePartCatalogues = [
  xfpSpareParts,
  ...ahlstarSpareParts.filter((c) => c.forIds.includes(serviceProviderDemo.ahlstarModelId)),
  ...ahlstarSpareParts.filter((c) => !c.forIds.includes(serviceProviderDemo.ahlstarModelId)),
]

export function getProductVariant(id: string) {
  return productVariants.find((variant) => variant.id === id)
}

export function variantsFor(productId: string, modelId?: string) {
  return productVariants.filter(
    (variant) => variant.productId === productId && (!modelId || variant.modelId === modelId),
  )
}

export const variantPath = (variant: ProductVariant) =>
  `/products/${variant.productId}/${variant.id}`

/** The configured variant or model a parts list belongs to. */
export function partOwner(id: string): PartOwner | undefined {
  const variant = getProductVariant(id)
  if (variant) {
    return { id, productId: variant.productId, name: variant.code, kind: 'variant' }
  }
  const model = getModel(id)
  return model && { id, productId: model.productId, name: model.name, kind: 'model' }
}

/**
 * The owner's Spare parts tab on its own page: /products/xfp/<variant> or
 * /products/ahlstar/<model>, #spare-parts. `query` adds e.g. part= or view=.
 */
export function sparePartsPath(owner: PartOwner, query: Record<string, string> = {}) {
  const search = new URLSearchParams(query).toString()
  return `/products/${owner.productId}/${owner.id}${search ? `?${search}` : ''}#spare-parts`
}

/**
 * Pumps whose Spare parts tab a product number or model code leads to: every
 * configured variant and every model with a parts list. Spaces are ignored,
 * so "XFP150E" and "24150" both match.
 */
export function findSparePartOwners(query: string): PartOwner[] {
  const q = query.toLowerCase().replace(/\s+/g, '')
  if (q.length < 2) return []
  const owners = [
    ...productVariants.map((variant) => partOwner(variant.id)!),
    ...productModels
      .filter((model) => sparePartsFor(model.id))
      .map((model) => partOwner(model.id)!),
  ]
  return owners.filter(
    (owner) =>
      ownerProductNumber(owner).startsWith(q) ||
      owner.name.toLowerCase().replace(/\s+/g, '').includes(q),
  )
}

/** The article number of the variant or model itself. */
export const ownerProductNumber = (owner: PartOwner) =>
  (owner.kind === 'variant' ? getProductVariant(owner.id) : getModel(owner.id))?.productNumber ?? ''

/** The owner's own page: /products/<product>/<variant or model>. */
export const ownerPath = (owner: PartOwner) => `/products/${owner.productId}/${owner.id}`

/** The Spare parts tab with this part selected. */
export const partPath = ({ part, owner }: PartHit) => sparePartsPath(owner, { part: part.id })

const drawings = [xfp150eDrawing, ahlstarDrawing]

export function getDrawing(id: string) {
  return drawings.find((drawing) => drawing.id === id)
}

/**
 * Every spare part with the variant or model it belongs to, for search. A part
 * number shared by several models is listed once, with the first (the demo
 * model comes first).
 */
export const partHits: PartHit[] = (() => {
  const byNumber = new Map<string, PartHit>()
  for (const catalogue of sparePartCatalogues) {
    const owner = partOwner(catalogue.forIds[0])!
    for (const part of catalogue.parts) {
      if (!byNumber.has(part.partNumber)) byNumber.set(part.partNumber, { part, owner })
    }
  }
  return [...byNumber.values()]
})()

/** Spare parts of a variant or model, or undefined when there is no parts list for it yet. */
export function sparePartsFor(id: string) {
  return sparePartCatalogues.find((catalogue) => catalogue.forIds.includes(id))
}

/** The BOM as built in one production version (the current one by default). */
export function partsInVersion(catalogue: SparePartCatalogue, versionId?: string): SparePart[] {
  const changes = catalogue.versions.find((version) => version.id === versionId)?.changes ?? {}
  return catalogue.parts.map((part) => (changes[part.id] ? { ...part, ...changes[part.id] } : part))
}

export function documentsFor(productId: string) {
  return documents.filter((doc) => doc.productIds.includes(productId))
}

export function videosFor(productId: string) {
  return serviceVideos.filter((video) => video.productIds.includes(productId))
}

export function cadFilesFor(productId: string) {
  return cadFiles.filter((file) => file.productId === productId)
}

export function cadPreviewFor(productId: string) {
  return cadPreviews[productId]
}

/** Group items by a key, keeping first-seen order. */
export function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const k = key(item)
    groups.set(k, [...(groups.get(k) ?? []), item])
  }
  return [...groups]
}
