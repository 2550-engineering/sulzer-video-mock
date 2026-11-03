import type { CartArticle } from '../cart/CartContext'
import type { PumpVariant, ResultArticle } from '../types'
import { articleById, toAvailability } from './articles'
import { getVariant } from './variants'

/*
 * What can go in the cart: catalogue articles (XFP variants, AHLSTAR models)
 * and sized pumps with a product number. Sized pumps without one are
 * configured to order and need a quotation.
 */

/** A catalogue variant or model as a cart line; undefined when it is discontinued. */
export function articleCartArticle(article: ResultArticle): CartArticle | undefined {
  if (article.availability.status === 'discontinued') return undefined
  return {
    kind: 'product',
    refId: article.id,
    partNumber: article.productNumber,
    name: article.code,
    variantId: article.id,
    unitPrice: article.listPrice,
    availability: article.availability,
  }
}

/** A sized pump as a cart line (pump and motor); undefined for configured, "on request" pumps. */
export function sizedCartArticle(variant: PumpVariant): CartArticle | undefined {
  if (!variant.productNumber) return undefined
  return {
    kind: 'product',
    refId: variant.id,
    partNumber: variant.productNumber,
    name: variant.name,
    variantId: variant.id,
    unitPrice: variant.pumpPrice + variant.motorPrice,
    availability: toAvailability(variant.availability, variant.leadTime),
  }
}

/** The cart line for a sized pump, variant or model id; undefined when it needs a quotation. */
export function cartArticleFor(id: string): CartArticle | undefined {
  const sized = getVariant(id)
  if (sized) return sizedCartArticle(sized)
  const article = articleById(id)
  return article && articleCartArticle(article)
}

/** The product (e.g. "ahlstar") of a sized pump, variant or model id. */
export const productIdOf = (id: string) => getVariant(id)?.productId ?? articleById(id)?.productId
