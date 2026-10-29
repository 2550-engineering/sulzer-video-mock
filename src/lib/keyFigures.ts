import { sizingResultsPage } from '../data/sizingPages'
import type { SizingResult } from '../types'
import { groupThousands } from './format'

const copy = sizingResultsPage.keyFigures

/** Labelled key figures of a result at the duty point. `compact`: the short set for tooltips. */
export function keyFigureRows(result: SizingResult, compact = false): [string, string][] {
  const { operatingPoint: op, variant } = result
  return [
    [copy.operatingPoint, `${groupThousands(op.flow, 1)} m³/h · ${op.head} m`],
    [copy.efficiency, `${result.efficiency} %`],
    [copy.p2, `${result.p2.toFixed(1)} kW`],
    [copy.motor, `${result.motorPower} kW · ${variant.motorClass} · ${result.motorEfficiency} %`],
    [copy.npshr, `${result.npshr} m`],
    ...(compact
      ? []
      : ([
          [copy.p1, `${result.p1.toFixed(1)} kW`],
          [copy.bepRatio, result.bepRatio.toFixed(2)],
          [copy.impeller, `${variant.impeller} mm`],
          [copy.speed, `${groupThousands(variant.speed)} rpm`],
          [copy.purchase, `${groupThousands(result.purchasePrice)} EUR`],
          [copy.energy, `${groupThousands(result.energyCostPerYear)} EUR`],
          [copy.maintenance, `${groupThousands(result.maintenanceCostPerYear)} EUR`],
        ] as [string, string][])),
    [copy.lcc, `${groupThousands(result.lifeCycleCost)} EUR`],
  ]
}
