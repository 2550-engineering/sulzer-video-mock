import { getLiquid } from '../data/liquids'
import type { LiquidId, OperatingPoint, ResultArticle } from '../types'
import { bepFlowAt, efficiencyAt, headAt, npshrAt } from './pumpCurves'
import { maxFlowRatio } from './variantCurves'

/*
 * Datasheet curves of a variant or model on the Curves tab: head, pump and
 * total efficiency, P1, P2 and NPSH over flow, for the settings chosen
 * (liquid, speed, impeller diameter, one pump or two in parallel). Built on
 * the same curve model as sizing; illustrative, not Sulzer test data.
 */

export type CurveSettings = {
  liquidId: LiquidId
  /** °C; shown in the chart note. */
  temperature: number
  layout: 'single' | 'parallel'
  /** % of rated speed. */
  speedPct: number
  /** mm. */
  impeller: number
}

export type CurvePoint = {
  /** m³/h, total for the layout. */
  flow: number
  head: number
  /** %. */
  etaPump: number
  etaTotal: number
  /** kW, total for the layout. */
  p1: number
  p2: number
  /** m, per pump. */
  npsh: number
}

/** Motor efficiency by rating: about IE3 (0.86 at 3 kW, 0.91 at 22 kW, 0.95 at 200 kW). */
const motorEfficiency = (kW: number) => Math.min(0.96, 0.84 + 0.05 * Math.log10(Math.max(1, kW)))

export const defaultCurveSettings = (article: ResultArticle): CurveSettings => ({
  liquidId: 'water',
  temperature: 20,
  layout: 'single',
  speedPct: 100,
  impeller: article.impellerDiameter,
})

export function performance(article: ResultArticle, settings: CurveSettings) {
  const { curve, scale: baseScale, trimRatio: baseTrim } = article.curve
  const speed = settings.speedPct / 100
  const trim = settings.impeller / article.impellerDiameter
  const scale = baseScale * speed * trim
  const speedRatio = article.speedRatio * speed
  const trimRatio = Math.min(1, baseTrim * trim)
  const pumps = settings.layout === 'parallel' ? 2 : 1
  const liquid = getLiquid(settings.liquidId)
  const etaMotor = motorEfficiency(article.power)

  /** The end of each curve, total flow. */
  const maxFlow = bepFlowAt(curve, scale) * maxFlowRatio * pumps
  /** Power curves start a little right of zero flow, where efficiency is 0. */
  const minPowerFlow = maxFlow * 0.04

  function at(flow: number): CurvePoint {
    const q = flow / pumps
    const head = Math.max(0, headAt(curve, scale, q))
    const etaPump = efficiencyAt(curve, scale, trimRatio, q) * liquid.efficiencyFactor
    const p2 =
      etaPump > 0.5
        ? (pumps * liquid.density * 9.81 * (q / 3600) * head) / (etaPump / 100) / 1000
        : 0
    return {
      flow,
      head,
      etaPump,
      etaTotal: etaPump * etaMotor,
      p2,
      p1: p2 / etaMotor,
      npsh: npshrAt(curve, speedRatio, q),
    }
  }

  /**
   * Where the pump curve meets a friction system curve through the duty point
   * (H = Hd·(Q/Qd)²), and that system curve.
   */
  function operatingPoint(duty: OperatingPoint) {
    const systemK = duty.head / duty.flow ** 2
    const flow = Math.sqrt((scale ** 2 * curve.shutOffHead) / (curve.k / pumps ** 2 + systemK))
    return { point: at(flow), systemHead: (q: number) => systemK * q ** 2 }
  }

  return {
    at,
    maxFlow,
    minPowerFlow,
    operatingPoint,
    liquid,
    shutOffHead: scale ** 2 * curve.shutOffHead,
  }
}
