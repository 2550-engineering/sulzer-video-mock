import { hydraulics, referenceSpeed } from '../data/hydraulics'
import type { Hydraulic, OperatingPoint, Poles } from '../types'
import { operatingArea } from './pumpCurves'

/*
 * Data for the range chart: each hydraulic × pole count as an area in the
 * Q–H plane (full-impeller curve from 0.5 to 1.2 × BEP flow, back along the
 * smallest trim), and which areas cover a duty point.
 */

export type RangeArea = {
  /** "<hydraulic id>-<poles>p". */
  key: string
  hydraulic: Hydraulic
  poles: Poles
  points: OperatingPoint[]
}

export const areaKey = (hydraulicId: string, poles: Poles) => `${hydraulicId}-${poles}p`

export function rangeAreas(productId: string, frequency: 50 | 60): RangeArea[] {
  const factor = frequency === 60 ? 1.2 : 1
  return hydraulics
    .filter((h) => h.productId === productId)
    .flatMap((hydraulic) =>
      ([2, 4, 6] as const).flatMap((poles) => {
        const speed = hydraulic.speeds[poles]
        if (!speed) return []
        return [
          {
            key: areaKey(hydraulic.id, poles),
            hydraulic,
            poles,
            points: operatingArea(
              hydraulic.curve,
              (speed * factor) / referenceSpeed,
              hydraulic.impellerMin / hydraulic.impellerMax,
            ),
          },
        ]
      }),
    )
}

/** Ray-casting point-in-polygon in log–log space, matching what the chart draws. */
export function covers(area: RangeArea, point: OperatingPoint) {
  const x = Math.log10(point.flow)
  const y = Math.log10(point.head)
  const pts = area.points.map((p) => [Math.log10(p.flow), Math.log10(Math.max(p.head, 1e-3))])
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]
    const [xj, yj] = pts[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
