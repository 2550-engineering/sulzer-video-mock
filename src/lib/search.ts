import { applications } from '../data/applications'
import { documents } from '../data/documents'
import { productModels } from '../data/productModels'
import { products } from '../data/products'
import { services } from '../data/services'
import type { Application, Document, Product, SearchKind, SearchResult } from '../types'
import { getApplication, getProduct } from './catalog'

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
const kindOrder: SearchKind[] = ['product', 'model', 'document', 'service', 'application']

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
    model: 0,
    document: 0,
    service: 0,
    application: 0,
  }
  for (const result of results) counts[result.kind]++
  return { results, counts }
}

/**
 * The results page for a query: /products?q=<normalised query>, optionally
 * opening a result tab (?tab=applications). Without a query: Products A–Z.
 */
export function searchPath(query: string, tab?: 'products' | 'applications' | 'documents') {
  const q = normalizeQuery(query)
  if (!q) return '/products'
  return `/products?q=${encodeURIComponent(q)}${tab && tab !== 'products' ? `&tab=${tab}` : ''}`
}

export type SearchGroups = {
  products: Product[]
  applications: Application[]
  documents: Document[]
}

/**
 * Search results for the results page tabs, in search order. A product found
 * through one of its models (a size or article number) counts as a product hit.
 */
export function searchGroups(query: string): SearchGroups {
  const products = new Set<Product>()
  const groups: SearchGroups = { products: [], applications: [], documents: [] }
  for (const result of search(query).results) {
    if (result.kind === 'product' || result.kind === 'model') products.add(result.product)
    if (result.kind === 'application') groups.applications.push(result.application)
    if (result.kind === 'document') groups.documents.push(result.document)
  }
  return { ...groups, products: [...products] }
}

/** Suggestions start at this many characters. */
export const minSuggestLength = 2

/**
 * Suggestions while typing: the first `perGroup` products, applications and
 * documents of `searchGroups`. Empty under `minSuggestLength` characters.
 */
export function suggestGroups(query: string, perGroup = 4): SearchGroups {
  if (normalizeQuery(query).length < minSuggestLength) {
    return { products: [], applications: [], documents: [] }
  }
  const groups = searchGroups(query)
  return {
    products: groups.products.slice(0, perGroup),
    applications: groups.applications.slice(0, perGroup),
    documents: groups.documents.slice(0, perGroup),
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

  const ranges: [number, number][] = []
  for (const token of tokensOf(query)) {
    for (let at = folded.indexOf(token); at !== -1; at = folded.indexOf(token, at + 1)) {
      ranges.push([origin[at], origin[at + token.length]])
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
