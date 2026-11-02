import type {
  DutyPoint,
  HydraulicCurve,
  OperatingPoint,
  ProductModel,
  ProductVariant,
} from '../types'
import { getModel } from './catalog'
import { marginRanges } from '../data/sizingParameters'
import {
  bepFlowAt,
  efficiencyAt,
  headAt,
  npshrAt,
  operatingPoint,
  type CurveSeries,
} from './pumpCurves'

/*
 * Curves for configured catalogue products (XFP). Each model's rated point is
 * its best-efficiency point at full impeller and its own speed; shut-off head
 * is 1.25 × rated head, like the Models tab curves. A variant scales that by
 * speed and impeller diameter with the affinity laws. Illustrative, not
 * Sulzer test data.
 */

/** Water at 20 °C, kg/m³. */
const density = 998

/** Flow at the end of a drawn curve, × best-efficiency flow (as on the Models tab). */
export const maxFlowRatio = 1.4

/** A model's curve: rated point = best-efficiency point, shut-off head 1.25 × rated head. */
export function modelCurve(model: ProductModel): HydraulicCurve {
  return {
    shutOffHead: model.head * 1.25,
    k: (model.head * 0.25) / model.flow ** 2,
    bepFlow: model.flow,
    bepEfficiency: model.efficiency,
    npshrAtBep: 1.2 + 0.5 * model.flow ** 0.35,
  }
}

function articleCurve(variant: ProductVariant) {
  const model = getModel(variant.modelId)!
  const curve = modelCurve(model)
  const speedRatio = variant.speed / model.speed
  const trimRatio = variant.impeller.diameter / model.impeller
  return { curve, speedRatio, trimRatio, scale: speedRatio * trimRatio }
}

/** The variant's best-efficiency point, rounded: the default operating point. */
export function ratedPoint(variant: ProductVariant): OperatingPoint {
  const { curve, scale } = articleCurve(variant)
  const flow = bepFlowAt(curve, scale)
  return { flow: Math.round(flow), head: Math.round(headAt(curve, scale, flow) * 10) / 10 }
}

/** The rated point as a duty point (water, 20 °C), e.g. for adding the variant to a project. */
export function ratedDutyPoint(variant: ProductVariant): DutyPoint {
  return { ...ratedPoint(variant), liquid: 'water', temperature: 20, frequency: variant.frequency }
}

/**
 * The variant running against a friction system curve through `duty`: the
 * curve to draw and the figures at the operating point.
 */
export function variantPerformance(variant: ProductVariant, duty: OperatingPoint) {
  const { curve, speedRatio, trimRatio, scale } = articleCurve(variant)
  const point = operatingPoint(curve, scale, duty)
  // A larger impeller than the model's is not a trim; no efficiency penalty either way above 1.
  const trim = Math.min(1, trimRatio)
  const efficiency = efficiencyAt(curve, scale, trim, point.flow)
  const p2 = (density * 9.81 * (point.flow / 3600) * point.head) / (efficiency / 100) / 1000
  const bepRatio = point.flow / bepFlowAt(curve, scale)
  const series: CurveSeries = {
    id: variant.id,
    name: variant.code,
    curve,
    scale,
    trimRatio: trim,
    operatingPoint: point,
  }
  return {
    series,
    point,
    efficiency,
    p2,
    npshr: npshrAt(curve, speedRatio, point.flow),
    bepRatio,
    inRange: bepRatio >= marginRanges.range.min && bepRatio <= marginRanges.range.max,
    overload: p2 > variant.power,
  }
}
