import type { HydraulicCurve, OperatingPoint } from '../types'

/*
 * Pump curve physics shared by sizing and the charts. A curve is given at full
 * impeller and reference speed; `scale` is (speed / reference speed) ×
 * (impeller / max impeller). With the affinity laws (Q ∝ scale, H ∝ scale²)
 * the parabola H = H0 − k·Q² keeps the same k:
 *
 *   H(Q) = scale²·H0 − k·Q²
 */

/** Head at `flow`, m. */
export const headAt = (curve: HydraulicCurve, scale: number, flow: number) =>
  scale ** 2 * curve.shutOffHead - curve.k * flow ** 2

/** Best-efficiency flow at this scale, m³/h. */
export const bepFlowAt = (curve: HydraulicCurve, scale: number) => curve.bepFlow * scale

/** Efficiency points lost per 1 % of impeller trimmed (0.5 points per 5 %). */
const trimPenaltyPerPercent = 0.1

/** Pump efficiency at `flow`, %, for an impeller trimmed to `trimRatio` (impeller / max). */
export function efficiencyAt(
  curve: HydraulicCurve,
  scale: number,
  trimRatio: number,
  flow: number,
) {
  const x = flow / bepFlowAt(curve, scale)
  const peak = curve.bepEfficiency - trimPenaltyPerPercent * 100 * (1 - trimRatio)
  return Math.max(0, peak * (2 * x - x * x))
}

/** NPSHr at `flow`, m. Depends on speed only; trimming leaves the impeller eye unchanged. */
export function npshrAt(curve: HydraulicCurve, speedRatio: number, flow: number) {
  const x = flow / (curve.bepFlow * speedRatio)
  return speedRatio ** 2 * curve.npshrAtBep * (0.5 + 0.5 * x * x)
}

/**
 * Where the pump curve meets a pure-friction system curve through the duty
 * point (H_sys = H_d·(Q/Q_d)²). A pump that is slightly larger than needed
 * runs a little to the right of the duty point.
 */
export function operatingPoint(
  curve: HydraulicCurve,
  scale: number,
  duty: OperatingPoint,
): OperatingPoint {
  const systemK = duty.head / duty.flow ** 2
  const flow = Math.sqrt((scale ** 2 * curve.shutOffHead) / (curve.k + systemK))
  return { flow, head: systemK * flow ** 2 }
}

/**
 * Coverage area of a hydraulic at one speed, for the range chart: the full
 * impeller curve from 0.5 to 1.2 × BEP flow, then back along the smallest trim.
 */
export function operatingArea(curve: HydraulicCurve, speedRatio: number, minTrimRatio: number) {
  const steps = 24
  const edge = (scale: number) =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const flow = bepFlowAt(curve, scale) * (0.5 + (0.7 * i) / steps)
      return { flow, head: headAt(curve, scale, flow) }
    })
  return [...edge(speedRatio), ...edge(speedRatio * minTrimRatio).reverse()]
}
