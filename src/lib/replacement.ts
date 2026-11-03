import { replacementDemo, sizingDemo } from '../config/demo'
import { assets } from '../data/assets'
import { getLiquid } from '../data/liquids'
import { measuredDuties, type ReplacementMode } from '../data/replacement'
import type { Asset, DutyPoint, ProductModel, SizingResult } from '../types'
import { getModel } from './catalog'
import { efficiencyAt, headAt, type CurveModel } from './modelSpecs'
import { sizableProductIds, sizePumps } from './sizing'

/*
 * Replacement finder. Pure functions: the existing pump's energy use is estimated
 * from its curve (or a typical efficiency for other brands), the suggestions come
 * from the sizing engine at the same duty point, so "Size this pump" ranks them the
 * same way. Assumptions are in config/demo.ts (`replacementDemo`, `sizingDemo`).
 */

const gravity = 9.81

/** How the existing pump runs at its duty point. */
export type PumpOperation = {
  duty: DutyPoint
  dutySource: 'measured' | 'rated' | 'entered'
  /** Head the pump makes at the duty flow, m. Above the duty head when throttled. */
  pumpHead: number
  /** Duty flow / rated flow, when the model is known. */
  bepRatio?: number
  /** Pump efficiency at the duty point, after wear, %. */
  efficiency: number
  motorEfficiency: number
  /** Electrical input power, kW. */
  p1: number
}

export type ExistingPump = {
  kind: 'asset' | 'type' | 'other'
  /** e.g. "AHLSTAR 150-125-315", or the manufacturer and model typed in. */
  name: string
  asset?: Asset
  model?: ProductModel
  connection?: { suction?: number; discharge: number }
  /** Missing for installed units without model data: those go to an expert. */
  operation?: PumpOperation
  /** The Sulzer product to size the replacement in, or null when there is no online suggestion. */
  productId: string | null
}

export type ReplacementOption = {
  result: SizingResult
  /** Same suction and discharge size as the existing pump. */
  fits: boolean
  /** Rank 1 in sizing. */
  lowestCost: boolean
  /** kW less electrical input. */
  powerSaved: number
  kwhPerYear: number
  /** In `market.currency`. */
  savingPerYear: number
  /** % less energy. */
  savingShare: number
  /** Years, or null when there is no saving. */
  paybackYears: number | null
}

const round = (value: number, decimals = 1) => Number(value.toFixed(decimals))

/** Electrical input power at a duty flow and pump head, kW. */
function inputPower(duty: DutyPoint, pumpHead: number, efficiency: number, motorEff: number) {
  const hydraulic =
    (getLiquid(duty.liquid).density * gravity * (duty.flow / 3600) * pumpHead) / 1000
  return hydraulic / (efficiency / 100) / (motorEff / 100)
}

/** The rated point of a model as a duty point. */
export const ratedDuty = (model: ProductModel): DutyPoint => ({
  flow: model.flow,
  head: model.head,
  liquid: 'water',
  temperature: 20,
  frequency: model.frequency,
})

function operationOf(
  model: ProductModel,
  duty: DutyPoint,
  dutySource: PumpOperation['dutySource'],
  runHours = 0,
): PumpOperation {
  const { wearPerTenThousandHours, maxWear, existingMotorEfficiency } = replacementDemo
  const wear = Math.min(maxWear, (runHours / 10000) * wearPerTenThousandHours)
  const pumpHead = Math.max(duty.head, headAt(model, duty.flow))
  const efficiency = round(Math.max(20, efficiencyAt(model, duty.flow) - wear))
  return {
    duty,
    dutySource,
    pumpHead: round(pumpHead),
    bepRatio: round(duty.flow / model.flow, 2),
    efficiency,
    motorEfficiency: existingMotorEfficiency,
    p1: round(inputPower(duty, pumpHead, efficiency, existingMotorEfficiency), 2),
  }
}

const sizable = (productId: string) => (sizableProductIds.includes(productId) ? productId : null)

/** An installed unit by its serial number (any customer), ignoring case and spaces. */
export function assetBySerial(serial: string) {
  const wanted = serial.replaceAll(' ', '').toUpperCase()
  return wanted ? assets.find((asset) => asset.serialNumber.toUpperCase() === wanted) : undefined
}

export function existingFromAsset(asset: Asset): ExistingPump {
  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const measured = measuredDuties[asset.id]
  return {
    kind: 'asset',
    name: model?.name ?? asset.name,
    asset,
    model,
    connection: model?.connection,
    operation:
      model &&
      operationOf(
        model,
        measured ?? ratedDuty(model),
        measured ? 'measured' : 'rated',
        asset.runHours,
      ),
    productId: sizable(asset.productId),
  }
}

export function existingFromModel(model: ProductModel, duty: DutyPoint): ExistingPump {
  return {
    kind: 'type',
    name: model.name,
    model,
    connection: model.connection,
    operation: operationOf(model, duty, 'entered'),
    productId: sizable(model.productId),
  }
}

export function existingFromOtherBrand(
  manufacturer: string,
  modelName: string,
  duty: DutyPoint,
): ExistingPump {
  const { otherBrandEfficiency, existingMotorEfficiency } = replacementDemo
  return {
    kind: 'other',
    name: [manufacturer, modelName].filter(Boolean).join(' '),
    operation: {
      duty,
      dutySource: 'entered',
      pumpHead: duty.head,
      efficiency: otherBrandEfficiency,
      motorEfficiency: existingMotorEfficiency,
      p1: round(inputPower(duty, duty.head, otherBrandEfficiency, existingMotorEfficiency), 2),
    },
    productId: sizingDemo.productId,
  }
}

/** Energy per year at the sizing running hours, kWh. */
export const energyPerYear = (p1: number) => p1 * sizingDemo.operatingHours

function option(existing: PumpOperation, result: SizingResult, fits: boolean): ReplacementOption {
  const powerSaved = existing.p1 - result.p1
  const kwhPerYear = energyPerYear(powerSaved)
  const savingPerYear = kwhPerYear * sizingDemo.electricityPrice
  return {
    result,
    fits,
    lowestCost: result.rank === 1,
    powerSaved: round(powerSaved, 2),
    kwhPerYear: Math.round(kwhPerYear),
    savingPerYear: Math.round(savingPerYear),
    savingShare: Math.round((powerSaved / existing.p1) * 100),
    paybackYears: savingPerYear > 0 ? round(result.purchasePrice / savingPerYear) : null,
  }
}

/**
 * Up to two suggestions: the best-ranked pump with the same connection sizes (a drop-in
 * on the same foundation and pipework), then the lowest life cycle cost, if different.
 */
export function replacementOptions(existing: ExistingPump): ReplacementOption[] {
  const { operation, productId, connection } = existing
  if (!operation || !productId) return []
  const { all } = sizePumps(operation.duty, productId)
  const sameSize = (result: SizingResult) =>
    connection !== undefined &&
    result.variant.connection.suction === connection.suction &&
    result.variant.connection.discharge === connection.discharge
  const dropIn = all.find(sameSize)
  const picks = [dropIn, all[0]].filter(
    (result, i, list): result is SizingResult => result !== undefined && list.indexOf(result) === i,
  )
  return picks.map((result) => option(operation, result, sameSize(result)))
}

/** The suggested pump as a curve through its operating point, for PerformanceCurve. */
export const optionCurve = ({ result }: ReplacementOption): CurveModel => ({
  id: result.variant.id,
  name: result.variant.name,
  flow: result.operatingPoint.flow,
  head: result.operatingPoint.head,
  efficiency: result.efficiency,
})

/** The existing pump's curve: its model, or (other brands) a curve through the duty point. */
export function existingCurve(existing: ExistingPump): CurveModel | undefined {
  if (existing.model) return existing.model
  const operation = existing.operation
  return (
    operation && {
      id: 'existing',
      name: existing.name,
      flow: operation.duty.flow,
      head: operation.duty.head,
      efficiency: operation.efficiency,
    }
  )
}

/** /sizing with the duty point filled in. */
export function sizingLink(productId: string, duty: DutyPoint) {
  const params = new URLSearchParams({
    product: productId,
    q: String(duty.flow),
    h: String(duty.head),
    liquid: duty.liquid,
    temp: String(duty.temperature),
    hz: String(duty.frequency),
  })
  return `/sizing?${params}`
}

/* ── URL ───────────────────────────────────────────────────────────────────── */

/**
 * The finder's input in the URL, so the asset page can link straight to a result:
 * ?serial=…, ?type=<model id>&q=&h=, or ?brand=…&model=…&q=&h=. ?by= opens a mode
 * with an empty form.
 */
export type ReplacementInput = {
  mode: ReplacementMode
  serial: string
  modelId: string
  brand: string
  brandModel: string
  /** As typed, so a half-filled form survives. */
  flow: string
  head: string
}

export function readReplacementInput(params: URLSearchParams): ReplacementInput {
  const by = params.get('by')
  const mode: ReplacementMode = params.has('serial')
    ? 'serial'
    : params.has('type')
      ? 'type'
      : params.has('brand')
        ? 'other'
        : by === 'type' || by === 'other'
          ? by
          : 'serial'
  return {
    mode,
    serial: params.get('serial') ?? '',
    modelId: params.get('type') ?? '',
    brand: params.get('brand') ?? '',
    brandModel: params.get('model') ?? '',
    flow: params.get('q') ?? '',
    head: params.get('h') ?? '',
  }
}

/** The URL query for a submitted form: only the params of its mode. */
export function replacementQuery(input: ReplacementInput) {
  const entries: [string, string][] =
    input.mode === 'serial'
      ? [['serial', input.serial.trim()]]
      : input.mode === 'type'
        ? [
            ['type', input.modelId],
            ['q', input.flow],
            ['h', input.head],
          ]
        : [
            ['brand', input.brand.trim()],
            ['model', input.brandModel.trim()],
            ['q', input.flow],
            ['h', input.head],
          ]
  return `?${new URLSearchParams(entries.filter(([, value]) => value !== ''))}`
}

const positive = (value: string) => {
  const number = Number(value)
  return value.trim() !== '' && Number.isFinite(number) && number > 0 ? number : undefined
}

/** A duty point typed in: water at 20 °C, 50 Hz. Undefined until flow and head are valid. */
function enteredDuty(flow: string, head: string, frequency: 50 | 60 = 50): DutyPoint | undefined {
  const q = positive(flow)
  const h = positive(head)
  return q && h ? { flow: q, head: h, liquid: 'water', temperature: 20, frequency } : undefined
}

/**
 * The pump the URL asks about. `notFound` when a serial number matches no unit;
 * nothing when the form isn't complete yet.
 */
export function existingFromInput(
  input: ReplacementInput,
): { existing: ExistingPump } | { notFound: string } | null {
  if (input.mode === 'serial') {
    if (!input.serial.trim()) return null
    const asset = assetBySerial(input.serial)
    return asset ? { existing: existingFromAsset(asset) } : { notFound: input.serial.trim() }
  }
  if (input.mode === 'type') {
    const model = getModel(input.modelId)
    if (!model) return null
    const duty = enteredDuty(input.flow, input.head, model.frequency) ?? ratedDuty(model)
    return { existing: existingFromModel(model, duty) }
  }
  const duty = enteredDuty(input.flow, input.head)
  return input.brand.trim() && duty
    ? { existing: existingFromOtherBrand(input.brand.trim(), input.brandModel.trim(), duty) }
    : null
}
