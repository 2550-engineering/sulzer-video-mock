import { useParams, useSearchParams } from 'react-router'
import { getProduct } from '../lib/catalog'
import {
  configuredArticle,
  configuredResult,
  configuredVariant,
  dutyFromParams,
  projectContext,
  ratedDuty,
} from '../lib/configured'
import { useProjects } from '../projects/useProjects'

/**
 * The configured pump of /products/:id/config/:variantId, rebuilt from the
 * URL: the variant, and the duty point it runs at (the project item's, a
 * sizing's ?q=&h=, or else its rated point).
 */
export function useConfiguredPump() {
  const { id = '', variantId = '' } = useParams()
  const [params] = useSearchParams()
  const { projects } = useProjects()
  const product = getProduct(id)
  const variant = product && configuredVariant(product.id, variantId)
  if (!product || !variant) return { product, variant: undefined } as const

  const fromProject = projectContext(projects, params)
  const askedDuty = fromProject?.item.dutyPoint ?? dutyFromParams(params)
  const duty = askedDuty ?? ratedDuty(variant)
  const result = configuredResult(variant, duty)
  const article = configuredArticle(variant, duty, result)
  return { product, variant, duty, atDuty: askedDuty !== undefined, result, article, fromProject }
}
