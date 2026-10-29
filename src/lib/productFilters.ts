import { searchPage as copy } from '../data/catalogPages'
import { products as allProducts } from '../data/products'
import type { FilterGroup, Product } from '../types'
import { applicationTrail, childApplications, getApplication, rootApplication } from './catalog'

/*
 * Filters on the /products results: Category, Application, Liquid temperature
 * and Max. flow. Within a group options are OR'ed, across groups AND'ed.
 * Pure, so the URL alone decides what is shown.
 */

export const facetIds = ['category', 'application', 'temp', 'flow'] as const
export type FacetId = (typeof facetIds)[number]

/** Selected option values per filter group, as in the URL. */
export type FilterSelection = Record<FacetId, string[]>

export type FacetOption = { value: string; label: string; count: number; selected: boolean }
export type Facet = FilterGroup & { id: FacetId; options: FacetOption[] }

type OptionDef = { value: string; label: string; matches: (product: Product) => boolean }

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** The first or last number in a formatted spec, e.g. "-40 .. 180 °C" → 180, "5 000 m³/h" → 5000. */
export function specNumber(text: string, which: 'first' | 'last') {
  const numbers = text.replace(/(\d)\s(?=\d{3}\b)/g, '$1').match(/-?\d+(\.\d+)?/g) ?? []
  const picked = which === 'first' ? numbers[0] : numbers.at(-1)
  return picked === undefined ? undefined : Number(picked)
}

type Bucket = { value: string; label: string; above?: number; upTo?: number }

function bucketOptions(buckets: Bucket[], valueOf: (product: Product) => number | undefined) {
  return buckets.map<OptionDef>((bucket) => ({
    value: bucket.value,
    label: bucket.label,
    matches: (product) => {
      const value = valueOf(product)
      if (value === undefined) return false
      return (
        (bucket.above === undefined || value > bucket.above) &&
        (bucket.upTo === undefined || value <= bucket.upTo)
      )
    },
  }))
}

/** The top-level application area (e.g. Municipal water supply) of an application id. */
function areaOf(applicationId: string) {
  const app = getApplication(applicationId)
  return app && applicationTrail(app)[1]?.id
}

/** Every product category, in catalogue order. Each has at least one product. */
export const productCategories = [...new Set(allProducts.map((product) => product.category))]

/** Products A–Z filtered to one category, e.g. /products?category=split-case-pumps. */
export const categoryPath = (category: string) => `/products?category=${slugify(category)}`

const definitions: Record<FacetId, OptionDef[]> = {
  category: productCategories.map((category) => ({
    value: slugify(category),
    label: category,
    matches: (product) => product.category === category,
  })),
  application: childApplications(rootApplication).map((area) => ({
    value: area.id,
    label: area.name,
    matches: (product) => product.applications.some((id) => areaOf(id) === area.id),
  })),
  temp: bucketOptions(copy.filters.tempBuckets, (product) =>
    product.keySpecs ? specNumber(product.keySpecs.liquidTemp, 'last') : undefined,
  ),
  flow: bucketOptions(copy.filters.flowBuckets, (product) =>
    product.keySpecs ? specNumber(product.keySpecs.maxFlow, 'first') : undefined,
  ),
}

export const emptySelection = (): FilterSelection => ({
  category: [],
  application: [],
  temp: [],
  flow: [],
})

export const hasFilters = (selection: FilterSelection) =>
  facetIds.some((id) => selection[id].length > 0)

/** The selected options of one group. Unknown values (e.g. edited URLs) are ignored. */
function selectedOptions(id: FacetId, selection: FilterSelection) {
  return definitions[id].filter((option) => selection[id].includes(option.value))
}

function matchesAll(product: Product, selection: FilterSelection, except?: FacetId) {
  return facetIds.every((id) => {
    if (id === except) return true
    const options = selectedOptions(id, selection)
    return options.length === 0 || options.some((option) => option.matches(product))
  })
}

/** The products that pass every filter group, in their original order. */
export function filterProducts(products: Product[], selection: FilterSelection) {
  return products.filter((product) => matchesAll(product, selection))
}

/**
 * Filter groups with their options and counts. An option's count is how many
 * products it would show, given the other groups' selections. Options with no
 * products are left out unless selected.
 */
export function facetsFor(products: Product[], selection: FilterSelection): Facet[] {
  return facetIds.map((id) => {
    const base = products.filter((product) => matchesAll(product, selection, id))
    return {
      id,
      label: copy.filters.groups[id],
      options: definitions[id]
        .map((option) => ({
          value: option.value,
          label: option.label,
          count: base.filter(option.matches).length,
          selected: selection[id].includes(option.value),
        }))
        .filter((option) => option.count > 0 || option.selected),
    }
  })
}
