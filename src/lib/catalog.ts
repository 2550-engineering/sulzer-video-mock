import { applications, rootApplicationId } from '../data/applications'
import { cadFiles, cadPreviews } from '../data/cad'
import { documents, serviceVideos } from '../data/documents'
import { knowledgeItems } from '../data/knowledge'
import { productModels } from '../data/productModels'
import { products } from '../data/products'
import { services } from '../data/services'
import { spareParts } from '../data/spareParts'
import type { Application, ApplicationTeaser, Product, Service } from '../types'

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

export function sparePartsFor(productId: string) {
  return spareParts.filter((part) => part.productId === productId)
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
