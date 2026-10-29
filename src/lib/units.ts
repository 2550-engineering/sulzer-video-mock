/*
 * Display units for sizing inputs. The URL and the engine always use m³/h and
 * m; these only convert what the user sees and types. Pressure units convert
 * head with the liquid's density.
 */

export type FlowUnit = 'm3h' | 'ls' | 'm3s'
export type HeadUnit = 'm' | 'bar' | 'kpa'

const gravity = 9.81
/** Display units per m³/h. */
const flowFactor: Record<FlowUnit, number> = { m3h: 1, ls: 1 / 3.6, m3s: 1 / 3600 }

export const isFlowUnit = (unit: string | null): unit is FlowUnit =>
  unit === 'm3h' || unit === 'ls' || unit === 'm3s'
export const isHeadUnit = (unit: string | null): unit is HeadUnit =>
  unit === 'm' || unit === 'bar' || unit === 'kpa'

export const flowToDisplay = (m3h: number, unit: FlowUnit) => m3h * flowFactor[unit]
export const flowFromDisplay = (value: number, unit: FlowUnit) => value / flowFactor[unit]

/** Display units per m of head, for a liquid of `density` kg/m³. */
const headFactor = (unit: HeadUnit, density: number) =>
  unit === 'm' ? 1 : unit === 'bar' ? (density * gravity) / 1e5 : (density * gravity) / 1000

export const headToDisplay = (m: number, unit: HeadUnit, density: number) =>
  m * headFactor(unit, density)
export const headFromDisplay = (value: number, unit: HeadUnit, density: number) =>
  value / headFactor(unit, density)

/** Up to 3 significant figures below 10, one decimal above: 0.0417, 4.41, 83.3, 300. */
export function formatInput(value: number) {
  if (value === 0) return '0'
  if (Math.abs(value) < 10) return String(Number(value.toPrecision(3)))
  return String(Math.round(value * 10) / 10)
}

/** Rounds to 2 significant figures, e.g. a chart click at 312.6 → 310, 47.3 → 47. */
export function roundSignificant(value: number, figures = 2) {
  if (value <= 0) return value
  const magnitude = 10 ** (Math.floor(Math.log10(value)) - figures + 1)
  return Number((Math.round(value / magnitude) * magnitude).toPrecision(figures))
}
