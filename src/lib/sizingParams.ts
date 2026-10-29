import { sizingDemo } from '../config/demo'
import { liquids } from '../data/liquids'
import { numberDefaults, optionalSections, sizingParamIds } from '../data/sizingParameters'
import type { DutyPoint, LiquidId } from '../types'
import type { LifeCycleSettings } from './sizing'
import { sizingSelection } from './sizingFilters'

/*
 * The sizing input in the URL. /sizing writes every form row, unit and
 * optional parameter as a query param; "Start sizing" carries them all to
 * /sizing/results, and "Edit parameters" or "Open sizing" brings them back.
 * Missing or unreadable values fall back to the defaults, so a bare
 * /sizing/results shows the demo result.
 */

/** Every param that belongs to a sizing (form rows, units, optional parameters). */
export const allSizingParamIds = [
  ...new Set([...sizingParamIds, ...optionalSections.flatMap((s) => s.fields.map((f) => f.id))]),
]

/** Link to a sizing saved in a project ("Open sizing"): kept while re-sizing, not stored in it. */
export const sizingLinkIds = ['project', 'sizing']

/** The params that change the calculation itself; filters don't re-run "Sizing …". */
const calculationIds = [
  'product',
  'q',
  'h',
  'liquid',
  'temp',
  'hz',
  'margin',
  'impsize',
  'hours',
  'eprice',
]

const number = (value: string | null, fallback: number) => {
  const parsed = value === null || value.trim() === '' ? NaN : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function readSizingInput(params: URLSearchParams) {
  const liquid = params.get('liquid')
  const duty: DutyPoint = {
    flow: number(params.get('q'), numberDefaults.q),
    head: number(params.get('h'), numberDefaults.h),
    liquid: liquids.some((l) => l.id === liquid) ? (liquid as LiquidId) : 'water',
    temperature: number(params.get('temp'), numberDefaults.temp),
    frequency: params.get('hz') === '60' ? 60 : 50,
  }
  const settings: LifeCycleSettings = {
    electricityPrice: number(params.get('eprice'), sizingDemo.electricityPrice),
    operatingHours: number(params.get('hours'), sizingDemo.operatingHours),
    lifeCycleYears: sizingDemo.lifeCycleYears,
  }
  return {
    productId: params.get('product') ?? sizingDemo.productId,
    duty,
    margin: params.get('margin') ?? 'curve',
    impellerSize: params.get('impsize') ?? 'optimised',
    maxFrequency: number(params.get('maxfreq'), numberDefaults.maxfreq),
    settings,
    selection: sizingSelection(params),
  }
}

/** Only the sizing params of `params`, as "?…" (or ""). */
export function sizingQuery(
  params: URLSearchParams,
  ids: string[] = [...allSizingParamIds, ...sizingLinkIds],
) {
  const kept = new URLSearchParams()
  for (const [key, value] of params) if (ids.includes(key)) kept.append(key, value)
  const query = kept.toString()
  return query ? `?${query}` : ''
}

/** A key that changes only when the calculation does (not when filters change). */
export const calculationKey = (params: URLSearchParams) => sizingQuery(params, calculationIds)

/** Every sizing param with its values, for storing a sizing (e.g. in a project). */
export function sizingParamEntries(params: URLSearchParams): [string, string][] {
  return [...params].filter(([key]) => allSizingParamIds.includes(key))
}
