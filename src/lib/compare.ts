import { sizingComparePage as copy } from '../data/sizingPages'
import type { ModelAvailability, PumpVariant, SizingResult } from '../types'
import { groupThousands } from './format'
import { formatPrice } from './modelSpecs'
import { evaluateVariant, type LifeCycleSettings } from './sizing'
import { getVariant } from './variants'
import type { DutyPoint } from '../types'

/* The comparison of two or three sized pumps on /sizing/compare. */

/** At most this many pumps side by side. */
export const maxCompared = 3

/**
 * The compared pumps at the duty point, in the order of `ids`. Ids that no
 * longer exist, or pumps that can't reach the duty point, are left out.
 */
export function comparedResults(ids: string[], duty: DutyPoint, settings: LifeCycleSettings) {
  return ids.slice(0, maxCompared).flatMap((id): SizingResult[] => {
    const variant = getVariant(id)
    const result = variant && evaluateVariant(variant, duty, settings)
    return result ? [{ ...result, rank: 0 }] : []
  })
}

/**
 * Weight of the pump unit (pump, motor and base frame), estimated from the
 * impeller size and motor power. Illustrative, not Sulzer data.
 */
export function unitWeight(variant: PumpVariant) {
  const pump = 0.0045 * variant.nominalImpeller ** 1.9
  const motor = 8 * variant.motorPower ** 0.85
  return Math.round(((pump + motor) * 1.15) / 5) * 5
}

const leadOrder: Record<ModelAvailability, number> = {
  'In stock': 0,
  'Fast delivery': 1,
  'Made to order': 2,
}

/** "lower" or "higher" is better; "none" marks no best (speed, materials). */
type Better = 'lower' | 'higher' | 'none'

export type CompareRow = {
  id: string
  label: string
  values: string[]
  /** Indexes of the best value(s); empty when there is no best. */
  best: number[]
  /** True when not every value is the same. */
  differs: boolean
}

function row(
  id: string,
  label: string,
  results: SizingResult[],
  show: (r: SizingResult) => string,
  better: Better = 'none',
  value?: (r: SizingResult) => number,
): CompareRow {
  const values = results.map(show)
  const differs = new Set(values).size > 1
  let best: number[] = []
  if (better !== 'none' && value && differs) {
    const numbers = results.map(value)
    const target = better === 'lower' ? Math.min(...numbers) : Math.max(...numbers)
    best = numbers.flatMap((n, i) => (n === target ? [i] : []))
  }
  return { id, label, values, best, differs }
}

/** The aligned rows of the comparison; prices and lead times only for signed-in users. */
export function compareRows(
  results: SizingResult[],
  signedIn: boolean,
  years: number,
): CompareRow[] {
  const r = copy.rows
  const kg = (res: SizingResult) => unitWeight(res.variant)
  return [
    row(
      'efficiency',
      r.efficiency,
      results,
      (x) => `${x.efficiency} %`,
      'higher',
      (x) => x.efficiency,
    ),
    row(
      'p2',
      r.p2,
      results,
      (x) => `${x.p2.toFixed(1)} kW`,
      'lower',
      (x) => x.p2,
    ),
    row(
      'npshr',
      r.npshr,
      results,
      (x) => `${x.npshr} m`,
      'lower',
      (x) => x.npshr,
    ),
    row('speed', r.speed, results, (x) => `${groupThousands(x.variant.speed)} rpm`),
    row('impeller', r.impeller, results, (x) => `${x.variant.impeller} mm`),
    row('housing', r.housing, results, (x) => x.variant.housingMaterial),
    row('impellerMaterial', r.impellerMaterial, results, (x) => x.variant.impellerMaterial),
    row('seal', r.seal, results, (x) => copy.seals[x.variant.seal]),
    row('weight', r.weight, results, (x) => `${groupThousands(kg(x))} kg`, 'lower', kg),
    ...(signedIn
      ? [
          row(
            'price',
            r.price,
            results,
            (x) => formatPrice(x.purchasePrice),
            'lower',
            (x) => x.purchasePrice,
          ),
          row(
            'leadTime',
            r.leadTime,
            results,
            (x) => x.variant.leadTime,
            'lower',
            (x) => leadOrder[x.variant.availability],
          ),
        ]
      : []),
    row(
      'energy',
      r.energy,
      results,
      (x) => `${groupThousands(x.energyCostPerYear)} EUR`,
      'lower',
      (x) => x.energyCostPerYear,
    ),
    row(
      'lcc',
      r.lcc(years),
      results,
      (x) => `${groupThousands(x.lifeCycleCost)} EUR`,
      'lower',
      (x) => x.lifeCycleCost,
    ),
  ]
}

/** "A", "B", "C" by column. */
export const alternativeLetter = (index: number) => String.fromCharCode(65 + index)
