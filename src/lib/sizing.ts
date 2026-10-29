import { sizingDemo } from '../config/demo'
import { getHydraulic, hydraulics, referenceSpeed, sealOptions } from '../data/hydraulics'
import { getLiquid } from '../data/liquids'
import { marginRanges } from '../data/sizingParameters'
import type { DutyPoint, PumpConfiguration, PumpVariant, SizingResult } from '../types'
import { getProduct } from './catalog'
import type { FilterSelection } from './filters'
import { specNumber } from './productFilters'
import { bepFlowAt, efficiencyAt, headAt, npshrAt, operatingPoint } from './pumpCurves'
import { matchingConfigurations } from './sizingFilters'
import { configurationsForProduct, trimsFor, variantFor } from './variants'

/*
 * Sizing engine. Pure functions: the same input always gives the same results
 * in the same order. Constants below are invented, typical values: see
 * docs/content-to-confirm.md.
 */

export type LifeCycleSettings = {
  /** EUR per kWh. */
  electricityPrice: number
  /** Hours per year. */
  operatingHours: number
  /** Years. */
  lifeCycleYears: number
}

const defaultSettings: LifeCycleSettings = sizingDemo

/** Products that have hydraulic data, so they can be sized. */
export const sizableProductIds = [...new Set(hydraulics.map((h) => h.productId))]

const gravity = 9.81
/** The fitted motor must be rated at least this much above shaft power. */
const motorMargin = 1.1
/** Yearly maintenance: this share of the purchase price, plus the seal's service cost. */
const maintenanceShare = 0.015
/** The recommended operating range drawn on curves ("Within the allowed operating range"). */
export const operatingRange = marginRanges.range

const round = (value: number, decimals: number) => {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

/** Speed ratio to the curve's reference speed, and trim ratio to the full impeller. */
function ratios(variant: PumpVariant, frequency: 50 | 60) {
  const hydraulic = getHydraulic(variant.hydraulicId)!
  const speedRatio = (variant.speed * (frequency === 60 ? 1.2 : 1)) / referenceSpeed
  const trimRatio = variant.impeller / hydraulic.impellerMax
  return { hydraulic, speedRatio, trimRatio, scale: speedRatio * trimRatio }
}

/** The variant's curve and its scaling at a frequency, for charts. */
export function variantCurve(variant: PumpVariant, frequency: 50 | 60) {
  const { hydraulic, ...rest } = ratios(variant, frequency)
  return { curve: hydraulic.curve, ...rest }
}

/**
 * The variant at the duty point: operating point, efficiency, power, NPSHr and
 * life cycle cost. Undefined when it can't reach the duty head, runs outside
 * the operating range, or its motor is too small.
 */
export function evaluateVariant(
  variant: PumpVariant,
  duty: DutyPoint,
  settings: LifeCycleSettings = defaultSettings,
  range = marginRanges.curve,
): Omit<SizingResult, 'rank'> | undefined {
  const { hydraulic, speedRatio, trimRatio, scale } = ratios(variant, duty.frequency)
  const { curve } = hydraulic
  if (headAt(curve, scale, duty.flow) < duty.head) return undefined

  const point = operatingPoint(curve, scale, duty)
  const bepRatio = point.flow / bepFlowAt(curve, scale)
  if (bepRatio < range.min || bepRatio > range.max) return undefined

  const liquid = getLiquid(duty.liquid)
  const efficiency = efficiencyAt(curve, scale, trimRatio, point.flow) * liquid.efficiencyFactor
  if (efficiency <= 0) return undefined
  const p2 =
    (liquid.density * gravity * (point.flow / 3600) * point.head) / (efficiency / 100) / 1000
  if (variant.motorPower < p2 * motorMargin) return undefined
  const p1 = p2 / (variant.motorEfficiency / 100)

  const purchasePrice = variant.pumpPrice + variant.motorPrice
  const sealService = sealOptions.find((seal) => seal.code === variant.seal)!.maintenancePerYear
  const energyCostPerYear = p1 * settings.operatingHours * settings.electricityPrice
  const maintenanceCostPerYear = purchasePrice * maintenanceShare + sealService

  return {
    variant,
    operatingPoint: { flow: round(point.flow, 1), head: round(point.head, 1) },
    efficiency: round(efficiency, 1),
    p2: round(p2, 2),
    motorPower: variant.motorPower,
    motorEfficiency: variant.motorEfficiency,
    p1: round(p1, 2),
    npshr: round(npshrAt(curve, speedRatio, point.flow), 1),
    bepRatio: round(bepRatio, 2),
    purchasePrice,
    energyCostPerYear: Math.round(energyCostPerYear),
    maintenanceCostPerYear: Math.round(maintenanceCostPerYear),
    lifeCycleCost: Math.round(
      purchasePrice + settings.lifeCycleYears * (energyCostPerYear + maintenanceCostPerYear),
    ),
  }
}

/** Allowed liquid temperature: the narrower of the liquid's and the product's range, °C. */
export function temperatureRange(productId: string, liquidId: DutyPoint['liquid']) {
  const liquid = getLiquid(liquidId)
  const spec = getProduct(productId)?.keySpecs?.liquidTemp
  return {
    min: Math.max(
      liquid.minTemperature,
      spec ? (specNumber(spec, 'first') ?? -Infinity) : -Infinity,
    ),
    max: Math.min(liquid.maxTemperature, spec ? (specNumber(spec, 'last') ?? Infinity) : Infinity),
  }
}

/** Trims a configuration may use for an "Impeller size" choice. */
function allowedTrims(configuration: PumpConfiguration, impellerSize: string) {
  const hydraulic = getHydraulic(configuration.hydraulicId)!
  const trims = trimsFor(hydraulic)
  if (impellerSize === 'max') return [hydraulic.impellerMax]
  if (impellerSize === 'fixed')
    return trims.filter((d) => d % 10 === 0 || d === hydraulic.impellerMax)
  return trims
}

export type SizingOptions = {
  /** Parameter selection from the form; narrows the configurations before sizing. */
  selection?: FilterSelection
  /** "Flow rate margin": curve, range or bep. */
  margin?: string
  /** "Impeller size": optimised, max or fixed. */
  impellerSize?: string
  settings?: LifeCycleSettings
  maxResults?: number
}

export type SizingResponse = {
  /** Best matches by life cycle cost, at most `maxResults`, ranked 1… */
  results: SizingResult[]
  /** Every configuration that meets the duty point, ranked; the results page counts its filters over these. */
  all: SizingResult[]
  /** How many configurations meet the duty point. */
  candidates: number
  /** Set when the input can't be sized. */
  issue?: 'temperature' | 'invalid'
}

/**
 * Configurations of a product that meet the duty point, best life cycle cost
 * first. Each uses the smallest allowed impeller trim that reaches the duty
 * head. Ties go to the variant closest to its best-efficiency point, then to
 * the variant id.
 */
export function sizePumps(
  duty: DutyPoint,
  productId: string = sizingDemo.productId,
  options: SizingOptions = {},
): SizingResponse {
  const {
    selection = { liquid: [duty.liquid] },
    margin = 'curve',
    impellerSize = 'optimised',
    settings = defaultSettings,
    maxResults = sizingDemo.maxResults,
  } = options
  const empty = { results: [], all: [], candidates: 0 }
  if (!(duty.flow > 0) || !(duty.head > 0)) return { ...empty, issue: 'invalid' }
  const range = temperatureRange(productId, duty.liquid)
  if (duty.temperature < range.min || duty.temperature > range.max) {
    return { ...empty, issue: 'temperature' }
  }

  const operating = marginRanges[margin] ?? marginRanges.curve
  const pool = matchingConfigurations(
    configurationsForProduct(productId),
    { ...selection, liquid: [duty.liquid] },
    duty.temperature,
  )

  const sized: Omit<SizingResult, 'rank'>[] = []
  for (const configuration of pool) {
    const hydraulic = getHydraulic(configuration.hydraulicId)!
    const speedRatio = (configuration.speed * (duty.frequency === 60 ? 1.2 : 1)) / referenceSpeed
    const { shutOffHead, k } = hydraulic.curve
    // Impeller diameter that just reaches the duty head (affinity laws), then the next allowed trim up.
    const needed =
      hydraulic.impellerMax *
      Math.sqrt((duty.head + k * duty.flow ** 2) / (speedRatio ** 2 * shutOffHead))
    const trim = allowedTrims(configuration, impellerSize).find((d) => d >= needed)
    if (trim === undefined) continue
    const result = evaluateVariant(variantFor(configuration, trim), duty, settings, operating)
    if (result) sized.push(result)
  }

  const all = sized
    .sort(
      (a, b) =>
        a.lifeCycleCost - b.lifeCycleCost ||
        Math.abs(1 - a.bepRatio) - Math.abs(1 - b.bepRatio) ||
        a.variant.id.localeCompare(b.variant.id),
    )
    .map((result, i) => ({ ...result, rank: i + 1 }))

  return { results: all.slice(0, maxResults), all, candidates: all.length }
}
