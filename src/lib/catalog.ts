import { applications, rootApplicationId } from '../data/applications'
import { documents } from '../data/documents'
import { productModels } from '../data/productModels'
import { products } from '../data/products'
import { spareParts } from '../data/spareParts'
import type { Application, ApplicationTeaser, Document, DocumentType, Product } from '../types'

/* Lookups over the mock catalogue in src/data. */

export function getApplication(id: string) {
  return applications.find((app) => app.id === id)
}

export const rootApplication = getApplication(rootApplicationId)!

export function applicationPath(app: Application) {
  return app.id === rootApplicationId ? '/applications' : `/applications/${app.id}`
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
    image: { ...app.heroImage, alt: '' },
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

export function getProduct(id: string) {
  return products.find((product) => product.id === id)
}

export function productPath(product: Product) {
  return `/products/${product.id}`
}

export function modelsFor(productId: string) {
  return productModels.filter((model) => model.productId === productId)
}

export function sparePartsFor(productId: string) {
  return spareParts.filter((part) => part.productId === productId)
}

export function documentsFor(productId: string) {
  return documents.filter((doc) => doc.productIds.includes(productId))
}

const modelFileTypes: DocumentType[] = ['BIM model', 'CAD drawing']

/** BIM and CAD files (the BIM tab), as opposed to written documentation. */
export function isModelFile(doc: Document) {
  return modelFileTypes.includes(doc.type)
}

/**
 * Products where every word of the query appears in the name, family, category,
 * summary or a model name. An empty query matches everything.
 */
export function searchProducts(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  return products.filter((product) => {
    const haystack = [
      product.name,
      product.family,
      product.category,
      product.summary,
      ...modelsFor(product.id).map((model) => model.name),
    ]
      .join(' ')
      .toLowerCase()
    return words.every((word) => haystack.includes(word))
  })
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
