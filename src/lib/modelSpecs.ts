import { market } from '../config/demo'
import { productPage } from '../data/catalogPages'
import type { ModelAvailability, ProductModel } from '../types'

/*
 * Derived figures and formatting for the Models tab. Everything is computed
 * from the model data, so the same model always draws the same curve and
 * lists the same dimensions. Curves and dimensions are illustrative: see
 * docs/content-to-confirm.md.
 */

const copy = productPage.models

/* ── Performance curve ─────────────────────────────────────────────────────── */

/** Shut-off head as a share of rated head; a typical value for this pump type. */
const shutOffRatio = 1.25

/** Head at `flow`: a parabola through shut-off head and the rated point. */
export function headAt(model: ProductModel, flow: number) {
  const shutOff = model.head * shutOffRatio
  return shutOff - (shutOff - model.head) * (flow / model.flow) ** 2
}

/** Efficiency at `flow`, peaking at the rated point. */
export function efficiencyAt(model: ProductModel, flow: number) {
  const x = flow / model.flow
  return Math.max(0, model.efficiency * (2 * x - x * x))
}

/** The curve is drawn from zero to this multiple of rated flow. */
export const curveFlowRange = 1.4

/** Round axis maximum and step: 5 ticks or fewer at 1, 2, 2.5 or 5 × 10ⁿ. */
export function niceAxis(max: number) {
  const rough = max / 5
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rough)!
  return { max: Math.ceil(max / step) * step, step }
}

/* ── Dimensions ────────────────────────────────────────────────────────────── */

const round10 = (mm: number) => Math.round(mm / 10) * 10

/** Main dimensions, estimated from impeller size and motor power. Values in mm, weight in kg. */
export function modelDimensions(model: ProductModel) {
  const motorLength = 250 + 95 * model.power ** 0.55
  return [
    ...(model.connection.suction
      ? [{ label: copy.dimensions.suction, value: `DN ${model.connection.suction}` }]
      : []),
    { label: copy.dimensions.discharge, value: `DN ${model.connection.discharge}` },
    { label: copy.dimensions.impeller, value: `${model.impeller} mm` },
    { label: copy.dimensions.length, value: `${round10(2.4 * model.impeller + motorLength)} mm` },
    { label: copy.dimensions.width, value: `${round10(1.6 * model.impeller + 120)} mm` },
    { label: copy.dimensions.height, value: `${round10(1.9 * model.impeller + 80)} mm` },
    { label: copy.dimensions.weight, value: `${model.weight} kg` },
  ]
}

/* ── Filters ───────────────────────────────────────────────────────────────── */

export type ModelFilters = {
  frequency: 50 | 60
  /** A `powerBuckets` value, or '' for all. */
  power: string
  /** Discharge DN as a string, or '' for all. */
  connection: string
}

export const powerBuckets = [
  { value: 'up-to-7.5', label: 'Up to 7.5 kW', above: 0, upTo: 7.5 },
  { value: '7.5-30', label: '7.5–30 kW', above: 7.5, upTo: 30 },
  { value: '30-110', label: '30–110 kW', above: 30, upTo: 110 },
  { value: 'above-110', label: 'Above 110 kW', above: 110, upTo: Infinity },
]

const inBucket = (model: ProductModel, value: string) => {
  const bucket = powerBuckets.find((b) => b.value === value)
  return !bucket || (model.power > bucket.above && model.power <= bucket.upTo)
}

export function filterModels(models: ProductModel[], filters: ModelFilters) {
  return models.filter(
    (model) =>
      model.frequency === filters.frequency &&
      inBucket(model, filters.power) &&
      (!filters.connection || String(model.connection.discharge) === filters.connection),
  )
}

/** Filter options that have models at the selected frequency. */
export function modelFilterOptions(models: ProductModel[], frequency: 50 | 60) {
  const atFrequency = models.filter((model) => model.frequency === frequency)
  return {
    frequencies: ([50, 60] as const).filter((hz) => models.some((m) => m.frequency === hz)),
    power: powerBuckets.filter((bucket) => atFrequency.some((m) => inBucket(m, bucket.value))),
    connection: [...new Set(atFrequency.map((m) => m.connection.discharge))]
      .sort((a, b) => a - b)
      .map((dn) => ({ value: String(dn), label: `DN ${dn}` })),
  }
}

/* ── Sorting ───────────────────────────────────────────────────────────────── */

export type ModelSortKey =
  'name' | 'productNumber' | 'flow' | 'head' | 'power' | 'speed' | 'listPrice' | 'availability'

export type ModelSort = { key: ModelSortKey; direction: 'asc' | 'desc' }

const availabilityOrder: ModelAvailability[] = ['In stock', 'Fast delivery', 'Made to order']

const sortValue = (model: ProductModel, key: ModelSortKey): number | string =>
  key === 'availability' ? availabilityOrder.indexOf(model.availability) : model[key]

/** Sorted copy; `null` keeps the data order (smallest size first). Ties keep data order too. */
export function sortModels(models: ProductModel[], sort: ModelSort | null) {
  if (!sort) return models
  const sign = sort.direction === 'asc' ? 1 : -1
  return [...models].sort((a, b) => {
    const x = sortValue(a, sort.key)
    const y = sortValue(b, sort.key)
    const order =
      typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x).localeCompare(String(y), 'en', { numeric: true })
    return sign * order
  })
}

/* ── Formatting ────────────────────────────────────────────────────────────── */

const priceFormat = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: market.currency,
  maximumFractionDigits: 0,
})

export const formatPrice = (amount: number) => priceFormat.format(amount)

/** "In stock" in green; anything with a lead time in amber, showing the lead time. */
export function availabilityLabel(model: ProductModel) {
  return model.availability === 'In stock'
    ? { label: copy.inStock, tone: 'success' as const }
    : { label: model.leadTime, tone: 'warning' as const }
}

/** Curve and swatch colours for compared models, in selection order. */
export const compareColors = [
  'var(--sz-color-primary)',
  'var(--sz-color-accent-cyan)',
  'var(--sz-color-warning)',
]
