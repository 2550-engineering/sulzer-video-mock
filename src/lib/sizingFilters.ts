import { applications } from '../data/applications'
import { hydraulics } from '../data/hydraulics'
import { getLiquid } from '../data/liquids'
import { parameterDefs, type ParameterOption } from '../data/sizingParameters'
import { products } from '../data/products'
import type { PumpConfiguration, SizingResult } from '../types'
import { productsForApplication } from './catalog'
import { applyFilters, filterGroups, type FilterDef, type FilterSelection } from './filters'

/*
 * Every filterable sizing parameter as a filter over configurations. The /sizing
 * form counts "hits" with these; the results page narrows its matches with the
 * same ids, so a selection made on one page carries over to the other.
 */

const labelsOf = (id: string) => {
  const def = parameterDefs.find((d) => d.id === id)
  return def && 'options' in def ? def.options : undefined
}
const labelFrom = (options: ParameterOption[] | undefined) => (value: string) =>
  options?.find((o) => o.value === value)?.label ?? value
const ordered = (options: ParameterOption[] | undefined) => options?.map((o) => o.value)
const labelOf = (id: string) => parameterDefs.find((d) => d.id === id)?.label ?? id

/** Every application a product suits, including the areas above them. */
const suitableApplications = new Map(
  products.map((product) => [
    product.id,
    applications
      .filter((app) => app.parentId !== null && productsForApplication(app).includes(product))
      .map((app) => app.id),
  ]),
)

/** Filter definitions, keyed by the form's parameter ids (and URL params). */
const def = (
  id: string,
  value: FilterDef<PumpConfiguration>['value'],
  extra: Partial<FilterDef<PumpConfiguration>> = {},
): FilterDef<PumpConfiguration> => ({
  id,
  label: labelOf(id),
  value,
  optionLabel: labelFrom(labelsOf(id)),
  options: ordered(labelsOf(id)),
  ...extra,
})

const hydraulicOrder = hydraulics.map((h) => h.size)

export const configurationFilterDefs: FilterDef<PumpConfiguration>[] = [
  def('liquid', (c) => c.liquids),
  def('voltage', (c) => c.mainsVoltages),
  def('vsd', (c) => c.variableSpeed),
  def('enclosure', (c) => c.enclosures),
  def('size', (c) => hydraulics.find((h) => h.id === c.hydraulicId)!.size, {
    optionLabel: (size) => {
      const hydraulic = hydraulics.find((h) => h.size === size)!
      const series = products.find((p) => p.id === hydraulic.productId)?.name ?? ''
      return `${series} ${hydraulic.code} · ${size}`
    },
    options: hydraulicOrder,
  }),
  def('code', (c) => c.code),
  def('material', (c) => c.material),
  def('impmat', (c) => c.impellerMaterial),
  def('impeller', (c) => c.impellerTypes),
  def('housing', (c) => c.housingMaterial),
  def('grade', (c) => c.housingGrade),
  def('seal', (c) => c.seal),
  def('inlet', (c) => String(c.connection.suction), { optionLabel: (dn) => `DN ${dn}` }),
  def('outlet', (c) => String(c.connection.discharge), { optionLabel: (dn) => `DN ${dn}` }),
  def('coupling', (c) => c.coupling),
  def('poles', (c) => String(c.poles)),
  def('kw', (c) => String(c.motorPower), { optionLabel: (kw) => `${kw} kW` }),
  def('u', (c) => c.motorVoltage),
  def('menc', (c) => c.motorEnclosure),
  def('motorno', (c) => c.motorNumber),
  def('supply', (c) => c.motorSupply),
  def('nominal', (c) => String(c.nominalImpeller), { optionLabel: (mm) => `${mm} mm` }),
  def('application', (c) => suitableApplications.get(c.productId) ?? [], {
    optionLabel: (id) => applications.find((a) => a.id === id)?.name ?? id,
    options: applications.filter((a) => a.parentId !== null).map((a) => a.id),
  }),
]

export const sizingFilterIds = configurationFilterDefs.map((d) => d.id)

/** Rows with a default (liquid, variable speed, application) filter by it until changed. */
const defaults = Object.fromEntries(
  parameterDefs.flatMap((d) =>
    d.kind === 'select' && d.filter && d.default ? [[d.id, d.default]] : [],
  ),
)

/** The filter selection in the URL, with the defaults filled in. */
export function sizingSelection(params: URLSearchParams): FilterSelection {
  return Object.fromEntries(
    sizingFilterIds.map((id) => {
      const values = params.getAll(id).filter((v) => v !== '')
      return [id, values.length ? values : defaults[id] ? [defaults[id]] : []]
    }),
  )
}

/** Configurations the liquid temperature allows: the seal's and the liquid's range. */
export function fitsTemperature(c: PumpConfiguration, temperature: number, liquidId: string) {
  const liquid = getLiquid(liquidId as PumpConfiguration['liquids'][number])
  return (
    temperature >= Math.max(c.temperature.min, liquid.minTemperature) &&
    temperature <= Math.min(c.temperature.max, liquid.maxTemperature)
  )
}

/** Configurations matching the selection and temperature: the "Number of hits". */
export function matchingConfigurations(
  all: PumpConfiguration[],
  selection: FilterSelection,
  temperature: number,
) {
  const liquid = selection.liquid?.[0] ?? 'water'
  return applyFilters(all, configurationFilterDefs, selection).filter((c) =>
    fitsTemperature(c, temperature, liquid),
  )
}

/** Each filter group with options and hit counts, given the other selections and the temperature. */
export function configurationGroups(
  all: PumpConfiguration[],
  selection: FilterSelection,
  temperature: number,
) {
  const liquid = selection.liquid?.[0] ?? 'water'
  const usable = all.filter((c) => fitsTemperature(c, temperature, liquid))
  return filterGroups(usable, configurationFilterDefs, selection)
}

/* ── Results page ──────────────────────────────────────────────────────────── */

/** Groups shown in the results page's filter list (the inputs stay on /sizing). */
const resultGroupIds = sizingFilterIds.filter(
  (id) => !['liquid', 'application', 'vsd', 'voltage', 'enclosure'].includes(id),
)

export const resultFilterDefs: FilterDef<SizingResult>[] = configurationFilterDefs
  .filter((d) => resultGroupIds.includes(d.id))
  .map((d) => ({ ...d, value: (r: SizingResult) => d.value(r.variant) }))

/** Filter groups for the results page, counted over every result that meets the duty point. */
export const sizingFilterGroups = (results: SizingResult[], selection: FilterSelection) =>
  filterGroups(results, resultFilterDefs, selection)

export type SizingSortKey = 'lcc' | 'efficiency' | 'p2' | 'npshr' | 'price' | 'lead'
export type SizingSort = { key: SizingSortKey; direction: 'asc' | 'desc' }

export const defaultSizingSort: SizingSort = { key: 'lcc', direction: 'asc' }

/** Which way a column sorts first: efficiency best-first, everything else lowest-first. */
export const firstDirection = (key: SizingSortKey): SizingSort['direction'] =>
  key === 'efficiency' ? 'desc' : 'asc'

const leadOrder = ['In stock', 'Fast delivery', 'Made to order']

const sortValue: Record<SizingSortKey, (r: SizingResult) => number> = {
  lcc: (r) => r.lifeCycleCost,
  efficiency: (r) => r.efficiency,
  p2: (r) => r.p2,
  npshr: (r) => r.npshr,
  price: (r) => r.purchasePrice,
  lead: (r) => leadOrder.indexOf(r.variant.availability),
}

/** Sorted copy. Ties keep rank order, so the result is always the same. */
export function sortSizingResults(results: SizingResult[], sort: SizingSort) {
  const sign = sort.direction === 'asc' ? 1 : -1
  return [...results].sort(
    (a, b) => sign * (sortValue[sort.key](a) - sortValue[sort.key](b)) || a.rank - b.rank,
  )
}
