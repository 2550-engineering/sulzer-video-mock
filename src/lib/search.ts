import { applications } from '../data/applications'
import { documents } from '../data/documents'
import { knowledgeItems } from '../data/knowledge'
import { productModels } from '../data/productModels'
import { products } from '../data/products'
import { services } from '../data/services'
import { xfpVariants } from '../data/xfp'
import type {
  Application,
  Document,
  KnowledgeItem,
  PartHit,
  Product,
  ProductModel,
  ProductVariant,
  SearchKind,
  SearchResult,
  ResultArticle,
  SearchScope,
  Service,
} from '../types'
import { articlesFor, articlesOfModel, getArticle } from './articles'
import { getApplication, getProduct, partHits, partPath } from './catalog'

/*
 * Site search over the mock catalogue. Pure and deterministic: no state, no
 * timers, no network, and the same query always gives the same results in the
 * same order. See docs/phase2-module2-plan.md §3.
 */

/** Lowercase, accents and quotes removed, single spaces. */
export function normalizeQuery(query: string) {
  return fold(query)
    .replace(/["'“”‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function fold(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

const tokensOf = (query: string) => normalizeQuery(query).split(' ').filter(Boolean)

/** Display order when scores tie. */
const kindOrder: SearchKind[] = [
  'product',
  'variant',
  'model',
  'part',
  'document',
  'service',
  'knowledge',
  'application',
]

/** "XFP 100C CB1.5 …" → "xfp100ccb1.5…", so "XFP100" finds it as typed. */
const compact = (text: string) => text.replace(/\s+/g, '')

type Entry = {
  result: SearchResult
  /** Folded name, the strongest field. */
  name: string
  /** Folded secondary fields: family, numbers, related product and application names. */
  secondary: string[]
  /** Folded body text, e.g. the summary. */
  body: string
}

function entry(
  result: SearchResult,
  name: string,
  secondary: (string | undefined)[],
  body = '',
): Entry {
  return {
    result,
    name: fold(name),
    secondary: secondary.filter((field) => field !== undefined).map(fold),
    body: fold(body),
  }
}

const names = (ids: string[], lookup: (id: string) => { name: string } | undefined) =>
  ids.map((id) => lookup(id)?.name)

/** Built once: every searchable object with its weighted fields, in data order. */
const index: Entry[] = [
  ...products.map((product) =>
    entry(
      { kind: 'product', product, score: 0 },
      product.name,
      [
        product.family,
        product.category,
        product.standard,
        ...names(product.applications, getApplication),
      ],
      product.summary,
    ),
  ),
  ...productModels.map((model) => {
    const product = getProduct(model.productId)!
    return entry(
      { kind: 'model', model, product, score: 0 },
      model.name,
      [model.productNumber, product.name, product.family],
      [
        model.connection.suction && `DN ${model.connection.suction}`,
        `DN ${model.connection.discharge}`,
        model.casingMaterial,
        model.shaftSeal,
      ].join(' '),
    )
  }),
  // Configured variants by long model code and product number. Not by category or
  // family, so a general search ("wastewater") still lists product ranges.
  ...xfpVariants.map((variant) =>
    entry(
      { kind: 'variant', variant, product: getProduct(variant.productId)!, score: 0 },
      variant.code,
      [variant.productNumber, compact(variant.code)],
    ),
  ),
  // Spare parts by name and part number.
  ...partHits.map((hit) =>
    entry({ kind: 'part', ...hit, score: 0 }, hit.part.name, [hit.part.partNumber]),
  ),
  ...documents.map((document) =>
    entry({ kind: 'document', document, score: 0 }, document.title, [
      document.number,
      document.type,
      ...names(document.productIds, getProduct),
    ]),
  ),
  ...services.map((service) =>
    entry({ kind: 'service', service, score: 0 }, service.name, [], service.summary),
  ),
  ...knowledgeItems.map((item) =>
    entry({ kind: 'knowledge', item, score: 0 }, item.title, [item.type], item.teaser),
  ),
  // Every application except the root ("Applications").
  ...applications
    .filter((application) => application.parentId !== null)
    .map((application) =>
      entry(
        { kind: 'application', application, score: 0 },
        application.name,
        [getApplication(application.parentId!)?.name],
        application.summary,
      ),
    ),
]

const startsAWord = (text: string, token: string) =>
  text.startsWith(token) || text.includes(` ${token}`)

/** Points for one token in one entry, 0 if it appears nowhere. */
function tokenScore({ name, secondary, body }: Entry, token: string) {
  if (startsAWord(name, token)) return 30
  if (name.includes(token)) return 20
  if (secondary.some((field) => field === token)) return 15
  if (secondary.some((field) => startsAWord(field, token))) return 12
  if (secondary.some((field) => field.includes(token))) return 10
  if (body.includes(token)) return 4
  return 0
}

/** An entry's score for a query, or 0 when any token is missing. */
function score(entry: Entry, query: string, tokens: string[]) {
  let total = 0
  for (const token of tokens) {
    const points = tokenScore(entry, token)
    if (points === 0) return 0
    total += points
  }
  // Exact name matches rank above everything else, of any kind.
  if (entry.name === query) total += 1000
  else if (entry.name.startsWith(query)) total += 25
  return total
}

export type SearchResponse = {
  results: SearchResult[]
  counts: Record<SearchKind | 'all', number>
}

/**
 * Every product, model, document, service and application where each word of
 * the query appears in a field. Ranked by score, then kind, then data order.
 * An empty query finds nothing.
 */
export function search(query: string): SearchResponse {
  const normalized = normalizeQuery(query)
  const tokens = tokensOf(query)
  const scored = index
    .map((entry, position) => ({ entry, position, score: score(entry, normalized, tokens) }))
    .filter((hit) => tokens.length > 0 && hit.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        kindOrder.indexOf(a.entry.result.kind) - kindOrder.indexOf(b.entry.result.kind) ||
        a.position - b.position,
    )

  const results = scored.map(({ entry, score }) => ({ ...entry.result, score }))
  const counts = {
    all: results.length,
    product: 0,
    variant: 0,
    model: 0,
    part: 0,
    document: 0,
    service: 0,
    knowledge: 0,
    application: 0,
  }
  for (const result of results) counts[result.kind]++
  return { results, counts }
}

/** Tabs of the results page, in order. */
export const resultTabs = ['all', 'products', 'documentation', 'support', 'pages'] as const
export type ResultTab = (typeof resultTabs)[number]

/**
 * The results page for a query: /products?q=<normalised query>, optionally
 * opening a result tab (?tab=documentation). Without a query: Products A–Z.
 */
export function searchPath(query: string, tab?: ResultTab) {
  const q = normalizeQuery(query)
  if (!q) return '/products'
  return `/products?q=${encodeURIComponent(q)}${tab ? `&tab=${tab}` : ''}`
}

export type SearchGroups = {
  /** Product ranges, found by name or through one of their models. */
  products: Product[]
  /** Configured products, by model code or product number. */
  variants: ProductVariant[]
  parts: PartHit[]
  documents: Document[]
  services: Service[]
  knowledge: KnowledgeItem[]
  applications: Application[]
}

/**
 * Search results for the results page, in search order. A product found
 * through one of its models (a size or article number) counts as a product hit.
 */
export function searchGroups(query: string): SearchGroups {
  const products = new Set<Product>()
  const groups: SearchGroups = {
    products: [],
    variants: [],
    parts: [],
    documents: [],
    services: [],
    knowledge: [],
    applications: [],
  }
  for (const result of search(query).results) {
    switch (result.kind) {
      case 'product':
      case 'model':
        products.add(result.product)
        break
      case 'variant':
        groups.variants.push(result.variant)
        break
      case 'part':
        groups.parts.push({ part: result.part, owner: result.owner })
        break
      case 'document':
        groups.documents.push(result.document)
        break
      case 'service':
        groups.services.push(result.service)
        break
      case 'knowledge':
        groups.knowledge.push(result.item)
        break
      case 'application':
        groups.applications.push(result.application)
        break
    }
  }
  return { ...groups, products: [...products] }
}

/**
 * The Products tab lists every variant or model instead of product rows when
 * the search is about one product with many sizes (pressing Search, not the
 * suggestions):
 * - the term is that product's name ("XFP", "AHLSTAR"): all its variants or models;
 * - the term finds variants or models directly (a model code or product
 *   number, "XFP100", "100-80-250", "2415"): those, as long as every product
 *   it finds is one of theirs.
 * Otherwise (e.g. "pump") it returns null and the tab lists product rows.
 */
export function searchArticles(query: string): ResultArticle[] | null {
  const q = normalizeQuery(query)
  if (!q) return null
  const family = products.find((product) => normalizeQuery(product.name) === q)
  if (family) {
    const all = articlesFor(family.id)
    return all.length > 1 ? all : null
  }

  const { results } = search(query)
  const found = new Map<string, ResultArticle>()
  for (const result of results) {
    if (result.kind === 'variant') {
      const article = getArticle(result.variant.productId, result.variant.id)
      if (article) found.set(article.id, article)
    } else if (result.kind === 'model') {
      for (const article of articlesOfModel(result.model.id)) found.set(article.id, article)
    }
  }
  if (found.size === 0) return null
  const families = new Set([...found.values()].map((article) => article.productId))
  const onlyTheirs = results
    .filter((result) => result.kind === 'product')
    .every((result) => families.has(result.product.id))
  return onlyTheirs ? [...found.values()] : null
}

/**
 * Where submitting a search goes. Products: the results page. Part numbers:
 * straight to the part when the number matches exactly one, else All results.
 * Documents: the Documentation tab.
 */
export function scopePath(query: string, scope: SearchScope) {
  if (scope === 'documents') return searchPath(query, 'documentation')
  if (scope === 'parts') {
    const q = compact(normalizeQuery(query))
    const exact = partHits.filter((hit) => hit.part.partNumber === q)
    return exact.length === 1 ? partPath(exact[0]) : searchPath(query, 'all')
  }
  return searchPath(query)
}

/** Suggestions start at this many characters. */
export const minSuggestLength = 1

/** A product range, a configured product or a model, in the Products suggestion group. */
export type ProductSuggestion =
  | { kind: 'product'; product: Product }
  | { kind: 'variant'; variant: ProductVariant; product: Product }
  | { kind: 'model'; model: ProductModel; product: Product }

/**
 * The digits of a query that looks like (part of) a product number, e.g.
 * "628010" or "6280 10". Null for anything else, e.g. "100-80-250".
 */
function productNumberQuery(query: string) {
  const digits = compact(normalizeQuery(query))
  return /^\d+$/.test(digits) ? digits : null
}

export type SuggestGroups = {
  products: ProductSuggestion[]
  applications: Application[]
  documents: Document[]
  parts: PartHit[]
}

const noSuggestions = (): SuggestGroups => ({
  products: [],
  applications: [],
  documents: [],
  parts: [],
})

/**
 * Suggestions while typing, in the groups the scope searches. Products:
 * product ranges and configured products (mixed, in rank order; for a product
 * number, every matching model, `perGroup` + 2), applications
 * and documents, `perGroup` each. Part numbers: spare parts. Documents:
 * documents. Empty under `minSuggestLength` characters.
 */
export function suggestGroups(
  query: string,
  scope: SearchScope = 'products',
  perGroup = 4,
): SuggestGroups {
  const groups = noSuggestions()
  if (normalizeQuery(query).length < minSuggestLength) return groups
  const { results } = search(query)
  const many = perGroup + 2

  if (scope === 'parts') {
    groups.parts = searchGroups(query).parts.slice(0, many)
    return groups
  }
  if (scope === 'documents') {
    groups.documents = searchGroups(query).documents.slice(0, many)
    return groups
  }

  // Typing a product number lists each matching model, not just its product range.
  const number = productNumberQuery(query)
  const seen = new Set<string>()
  for (const result of results) {
    if (result.kind === 'variant') {
      groups.products.push({ kind: 'variant', variant: result.variant, product: result.product })
    } else if (result.kind === 'model' && number && result.model.productNumber.includes(number)) {
      groups.products.push({ kind: 'model', model: result.model, product: result.product })
    } else if (
      (result.kind === 'product' || result.kind === 'model') &&
      !seen.has(result.product.id)
    ) {
      seen.add(result.product.id)
      groups.products.push({ kind: 'product', product: result.product })
    }
  }
  const all = searchGroups(query)
  return {
    ...groups,
    products: groups.products.slice(0, number ? many : perGroup),
    applications: all.applications.slice(0, perGroup),
    documents: all.documents.slice(0, perGroup),
  }
}

/**
 * Where each word of the query appears in `text`, as sorted, merged
 * [start, end) ranges. Case- and accent-insensitive.
 */
export function matchRanges(text: string, query: string): [number, number][] {
  // Fold character by character, so positions in the folded text map back to `text`.
  let folded = ''
  const origin: number[] = []
  for (let i = 0; i < text.length; i++) {
    for (const c of fold(text[i])) {
      folded += c
      origin.push(i)
    }
  }
  origin.push(text.length)
  // The same without spaces, for tokens typed without them ("XFP100" in "XFP 100C").
  const kept = [...folded].map((c, i) => ({ c, i })).filter(({ c }) => !/\s/.test(c))
  const squeezed = kept.map(({ c }) => c).join('')

  const ranges: [number, number][] = []
  for (const token of tokensOf(query)) {
    if (folded.includes(token)) {
      for (let at = folded.indexOf(token); at !== -1; at = folded.indexOf(token, at + 1)) {
        ranges.push([origin[at], origin[at + token.length]])
      }
      continue
    }
    for (let at = squeezed.indexOf(token); at !== -1; at = squeezed.indexOf(token, at + 1)) {
      ranges.push([origin[kept[at].i], origin[kept[at + token.length - 1].i + 1]])
    }
  }
  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1])

  const merged: [number, number][] = []
  for (const range of ranges) {
    const last = merged.at(-1)
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1])
    else merged.push([...range])
  }
  return merged
}
