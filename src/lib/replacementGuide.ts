import { replacementGuideDemo } from '../config/demo'
import { guideExistingPumps, guideReplacements } from '../data/replacementGuide'
import { replacementGuidePage } from '../data/replacementGuidePage'
import type { GuideExistingPump, GuideFit, GuideReplacement, ResultArticle } from '../types'
import { articleById } from './articles'
import { discontinuedArticles, findArticle, replacementInfo } from './replacement'

/*
 * Pump replacement guide. Pure functions: an installed pump is either a competitor
 * pump from the guide's catalogue (with a fixed Sulzer replacement) or a Sulzer XFP
 * variant / AHLSTAR model (with its successor, as on /products/replacement).
 */

/** What a search hit, suggestion or dropdown choice points at. */
export type GuideTarget =
  { kind: 'competitor'; brand: string; model: string } | { kind: 'sulzer'; articleId: string }

/** A brand in the "browse by brand" dropdown, with its models. */
export type GuideBrand = {
  name: string
  kind: GuideTarget['kind']
  /** `value` is the model for a competitor brand, the article id for Sulzer. */
  models: { value: string; label: string }[]
}

/** The pump the page shows, and what replaces it. */
export type GuideSelection =
  | {
      kind: 'competitor'
      pump: GuideExistingPump
      replacement: GuideReplacement
      fit: GuideFit
    }
  | {
      kind: 'sulzer'
      article: ResultArticle
      /** Missing when the article is still available. */
      successor?: ResultArticle
      fit: GuideFit
    }

/** One row in the search box's suggestion list. */
export type GuideSuggestion = {
  /** Heading the row sits under: the brand, or "Sulzer (discontinued)". */
  group: string
  /** e.g. "Flygt NP 3085 SH", or a Sulzer model code. */
  label: string
  /** Part and RSK number, or product number and year discontinued. */
  line: string
  target: GuideTarget
  /** Name of the Sulzer replacement or successor. */
  replacement: string
  fit: GuideFit
}

const copy = replacementGuidePage

/** Ignores spaces, punctuation and case: "581 30 22" = "5813022". */
const normCode = (text: string) => text.replace(/[^a-z0-9]/gi, '').toUpperCase()

const brandNames = [...new Set(guideExistingPumps.map((pump) => pump.brand))]

/** The guide's six brands in its order, then the discontinued Sulzer products. */
export function guideBrands(): GuideBrand[] {
  return [
    ...brandNames.map((name) => ({
      name,
      kind: 'competitor' as const,
      models: guideExistingPumps
        .filter((pump) => pump.brand === name)
        .map((pump) => ({ value: pump.model, label: pump.model })),
    })),
    {
      name: copy.discontinuedBrand,
      kind: 'sulzer',
      models: discontinuedArticles().map((article) => ({ value: article.id, label: article.code })),
    },
  ]
}

export const findGuidePump = (brand: string, model: string) =>
  guideExistingPumps.find((pump) => pump.brand === brand && pump.model === model)

/** A replacement by id; the first one for an unknown id, as in the guide. */
export const getGuideReplacement = (id: string) =>
  guideReplacements.find((replacement) => replacement.id === id) ?? guideReplacements[0]

export const replacementName = (replacement: GuideReplacement) =>
  `${replacement.range} ${replacement.model}`

const competitorTarget = (pump: GuideExistingPump): GuideTarget => ({
  kind: 'competitor',
  brand: pump.brand,
  model: pump.model,
})

/**
 * A typed code to the installed pump: an exact RSK number, part number or model of a
 * competitor pump, then a Sulzer product number or model code, then (4+ characters) the
 * first competitor part or RSK number that starts with it.
 */
export function searchByCode(raw: string): GuideTarget | null {
  const q = normCode(raw)
  if (!q) return null
  const exact = guideExistingPumps.find((pump) =>
    [pump.rsk, pump.partNo, pump.model].map(normCode).includes(q),
  )
  if (exact) return competitorTarget(exact)
  const article = findArticle(raw)
  if (article) return { kind: 'sulzer', articleId: article.id }
  const partial =
    q.length >= 4
      ? guideExistingPumps.find(
          (pump) => normCode(pump.partNo).startsWith(q) || normCode(pump.rsk).startsWith(q),
        )
      : undefined
  return partial ? competitorTarget(partial) : null
}

/** A discontinued Sulzer product needs an adapter when its successor comes with an adapter kit. */
const sulzerFit = (article: ResultArticle): GuideFit =>
  replacementInfo(article)?.adapterKit ? 'adapter' : 'drop-in'

/* ── Suggestions ───────────────────────────────────────────────────────────── */

type Candidate = { suggestion: GuideSuggestion; keys: string[] }

let candidates: Candidate[] | undefined

/** Every pump the search box can suggest, with its normalised search keys. Built once. */
function allCandidates() {
  candidates ??= [
    ...guideExistingPumps.map((pump): Candidate => {
      const replacement = getGuideReplacement(pump.replacementId)
      return {
        suggestion: {
          group: pump.brand,
          label: `${pump.brand} ${pump.model}`,
          line: copy.search.competitorLine(pump.partNo, pump.rsk),
          target: competitorTarget(pump),
          replacement: replacementName(replacement),
          fit: pump.fit,
        },
        keys: [
          pump.brand,
          pump.model,
          `${pump.brand} ${pump.model}`,
          pump.partNo,
          pump.rsk,
          replacementName(replacement),
        ].map(normCode),
      }
    }),
    ...discontinuedArticles().map((article): Candidate => {
      const successor = articleById(article.discontinued!.successorId)
      return {
        suggestion: {
          group: copy.discontinuedBrand,
          label: article.code,
          line: copy.search.sulzerLine(article.productNumber, article.discontinued!.year),
          target: { kind: 'sulzer', articleId: article.id },
          replacement: successor?.code ?? '',
          fit: sulzerFit(article),
        },
        keys: [copy.discontinuedBrand, article.code, article.productNumber, successor?.code ?? '']
          .filter(Boolean)
          .map(normCode),
      }
    }),
  ]
  return candidates
}

/** 0 exact, 1 starts with, 2 contains; undefined when no key matches. */
function rank(keys: string[], q: string) {
  if (keys.includes(q)) return 0
  if (keys.some((key) => key.startsWith(q))) return 1
  if (keys.some((key) => key.includes(q))) return 2
  return undefined
}

/**
 * Suggestions for the search box, best first: exact code matches, then codes that
 * start with the query, then codes that contain it. Rows of the same group are kept
 * together, groups in the order of their best row.
 */
export function suggestReplacements(query: string, limit = 8): GuideSuggestion[] {
  const q = normCode(query)
  if (q.length < 2) return []
  const ranked = allCandidates()
    .map(({ suggestion, keys }, index) => ({ suggestion, index, rank: rank(keys, q) }))
    .filter((hit) => hit.rank !== undefined)
    .sort((a, b) => a.rank! - b.rank! || a.index - b.index)
    .slice(0, limit)
    .map((hit) => hit.suggestion)
  const groups = [...new Set(ranked.map((suggestion) => suggestion.group))]
  return groups.flatMap((group) => ranked.filter((suggestion) => suggestion.group === group))
}

/* ── URL ───────────────────────────────────────────────────────────────────── */

const competitorSelection = (pump: GuideExistingPump): GuideSelection => ({
  kind: 'competitor',
  pump,
  replacement: getGuideReplacement(pump.replacementId),
  fit: pump.fit,
})

function sulzerSelection(article: ResultArticle): GuideSelection {
  const successorId = article.discontinued?.successorId
  return {
    kind: 'sulzer',
    article,
    successor: successorId ? articleById(successorId) : undefined,
    fit: sulzerFit(article),
  }
}

function selectionOf(target: GuideTarget): GuideSelection | undefined {
  if (target.kind === 'sulzer') {
    const article = articleById(target.articleId)
    return article && sulzerSelection(article)
  }
  const pump = findGuidePump(target.brand, target.model)
  return pump && competitorSelection(pump)
}

/** The URL query that opens a target: ?brand=&model= for a competitor pump, ?from= for Sulzer. */
export function guideTargetQuery(target: GuideTarget) {
  const params: Record<string, string> =
    target.kind === 'sulzer'
      ? { from: target.articleId }
      : { brand: target.brand, model: target.model }
  return `?${new URLSearchParams(params)}`
}

/**
 * The pump the URL asks for: ?brand=&model= (a Sulzer article id as the model under
 * "Sulzer (discontinued)"), or ?from= with a Sulzer article id or product number, or a
 * competitor part or RSK number. Nothing when no pump is chosen yet (no params, a brand
 * alone, an unknown model) or ?from matches nothing: the page then shows only the search.
 */
export function resolveGuideSelection(params: URLSearchParams): GuideSelection | undefined {
  const from = params.get('from')?.trim()
  if (from) {
    const target = searchByCode(from)
    return target ? selectionOf(target) : undefined
  }
  const brand = params.get('brand')
  const model = params.get('model')
  if (!brand || !model) return undefined
  if (brand === copy.discontinuedBrand) {
    const article = discontinuedArticles().find((a) => a.id === model)
    return article && sulzerSelection(article)
  }
  const pump = findGuidePump(brand, model)
  return pump && competitorSelection(pump)
}

/* ── Energy ────────────────────────────────────────────────────────────────── */

/** Rounds away floating-point noise (0.2 × 4000 = 799.999…). */
const clean = (value: number) => Math.round(value * 100) / 100

/**
 * Savings from the lower input power of the replacement: kWh a year, € a year and over
 * 10 years, and kg CO₂ avoided a year. Nothing is saved when the replacement draws more.
 */
export function energySavings(
  existingKw: number,
  replacementKw: number,
  hours: number = replacementGuideDemo.operatingHours,
  rate: number = replacementGuideDemo.electricityPrice,
) {
  const kwhPerYear = clean(Math.max(0, existingKw - replacementKw) * Math.max(0, hours))
  const costPerYear = clean(kwhPerYear * Math.max(0, rate))
  return {
    kwhPerYear,
    costPerYear,
    costTenYears: clean(costPerYear * 10),
    co2Kg: clean(kwhPerYear * replacementGuideDemo.co2PerKwh),
  }
}

/* ── Spec rows ─────────────────────────────────────────────────────────────── */

export type GuideSpecRow = { label: string; value: string }

/** The existing pump card: manufacturer, model, discharge, power, supply, max head and flow. */
export const existingSpecRows = (pump: GuideExistingPump): GuideSpecRow[] =>
  copy.specs.existing.map(([key, label]) => ({ label, value: pump[key] }))

/** The Sulzer replacement card: "Manufacturer: Sulzer", then its 15 specs. */
export const replacementSpecRows = (replacement: GuideReplacement): GuideSpecRow[] => [
  { label: copy.specs.manufacturer, value: copy.replacement.manufacturer },
  ...copy.specs.replacement.map(([key, label]) => ({ label, value: replacement[key] })),
]

/**
 * The phone comparison table: every existing-pump row beside the replacement's value
 * for the same label, then the rows only the replacement has.
 */
export function guideComparisonRows(pump: GuideExistingPump, replacement: GuideReplacement) {
  const existing = existingSpecRows(pump)
  const next = replacementSpecRows(replacement)
  const nextByLabel = new Map(next.map((row) => [row.label, row.value]))
  const shared = new Set(existing.map((row) => row.label))
  return [
    ...existing.map((row) => ({
      label: row.label,
      existing: row.value,
      replacement: nextByLabel.get(row.label) ?? '',
    })),
    ...next
      .filter((row) => !shared.has(row.label))
      .map((row) => ({ label: row.label, existing: '', replacement: row.value })),
  ]
}

/** kW in and out for the energy savings calculator, or undefined when there is nothing to save. */
export function guideSavingsPower(selection: GuideSelection) {
  if (selection.kind === 'competitor')
    return { existingKw: selection.pump.powerKw, replacementKw: selection.replacement.powerKw }
  const { article, successor } = selection
  return successor && successor.power < article.power
    ? { existingKw: article.power, replacementKw: successor.power }
    : undefined
}
