import { getHydraulic, hydraulics, sealOptions } from '../data/hydraulics'
import { getLiquid } from '../data/liquids'
import { configuredPage } from '../data/configuredPages'
import { variantPage } from '../data/variantPages'
import { tenderDefaults } from '../data/tenderTexts'
import type {
  DutyPoint,
  LiquidId,
  ProductModel,
  Project,
  ProjectItem,
  PumpVariant,
  ResultArticle,
  SizingResult,
  TenderSubject,
} from '../types'
import { toAvailability } from './articles'
import { getProduct, modelsFor } from './catalog'
import { groupThousands } from './format'
import { bepFlowAt, headAt } from './pumpCurves'
import { evaluateVariant, variantCurve } from './sizing'
import { sizedSubject } from './tenderSubjects'
import { maxFlowRatio } from './variantCurves'
import { getVariant } from './variants'

/*
 * Configured pumps from the sizing variant generator, on their own product
 * page: /products/<product>/config/<slug>. Nothing is stored: the slug spells
 * out the whole configuration and the page rebuilds the variant from it.
 */

/**
 * "a25-200-150-400-t390-4p-c1-sd-f": hydraulic code, connection size (suction,
 * discharge, nominal impeller), impeller trim, poles, material, seal, coupling.
 */
export function configuredSlug(variant: PumpVariant) {
  const hydraulic = getHydraulic(variant.hydraulicId)!
  const { suction, discharge } = hydraulic.connection
  return [
    hydraulic.code,
    suction,
    discharge,
    hydraulic.nominalImpeller,
    `t${variant.impeller}`,
    `${variant.poles}p`,
    variant.material,
    variant.seal,
    variant.coupling,
  ]
    .join('-')
    .toLowerCase()
}

const slugPattern =
  /^([a-z]\d+)-(\d+)-(\d+)-(\d+)-t(\d+)-([246])p-([a-z]\d)-([a-z]{2})-([a-z]{1,2})$/

/**
 * The variant a slug describes, or undefined when it doesn't exist (unknown
 * hydraulic, connection size that doesn't match it, or an option or trim the
 * hydraulic isn't sold with). A generator id ("ahlstar-a25-4p-c1-sd-f-t390")
 * is accepted too.
 */
export function configuredVariant(productId: string, slug: string): PumpVariant | undefined {
  const match = slugPattern.exec(slug.toLowerCase())
  if (!match) {
    const variant = getVariant(slug)
    return variant?.productId === productId ? variant : undefined
  }
  const [, code, suction, discharge, nominal, trim, poles, material, seal, coupling] = match
  const hydraulic = hydraulics.find(
    (h) =>
      h.productId === productId &&
      h.code.toLowerCase() === code &&
      h.connection.suction === Number(suction) &&
      h.connection.discharge === Number(discharge) &&
      h.nominalImpeller === Number(nominal),
  )
  if (!hydraulic) return undefined
  return getVariant(`${hydraulic.id}-${poles}p-${material}-${seal}-${coupling}-t${trim}`)
}

/** Where the page was opened from: a project item, or a sizing's duty point. */
export type ConfiguredContext = { project: string; item: string } | { duty: DutyPoint } | undefined

/** The configured product page; a project item or duty point travels in the query. */
export function configuredPath(variant: PumpVariant, context?: ConfiguredContext) {
  const params = new URLSearchParams()
  if (context && 'project' in context) {
    params.set('project', context.project)
    params.set('item', context.item)
  } else if (context) {
    const { flow, head, liquid, temperature, frequency } = context.duty
    params.set('q', String(flow))
    params.set('h', String(head))
    if (liquid !== 'water') params.set('liquid', liquid)
    if (temperature !== 20) params.set('temp', String(temperature))
    if (frequency !== 50) params.set('hz', String(frequency))
  }
  const query = params.toString()
  return `/products/${variant.productId}/config/${configuredSlug(variant)}${query ? `?${query}` : ''}`
}

/** A duty point from ?q=&h= (with optional liquid, temp, hz), as the sizing pages link it. */
export function dutyFromParams(params: URLSearchParams): DutyPoint | undefined {
  const flow = Number(params.get('q'))
  const head = Number(params.get('h'))
  if (!(flow > 0) || !(head > 0)) return undefined
  const liquid = params.get('liquid') ?? 'water'
  const temperature = Number(params.get('temp') ?? 20)
  return {
    flow,
    head,
    liquid: (['water', 'seawater', 'raw-solids', 'glycol', 'light-oil'].includes(liquid)
      ? liquid
      : 'water') as LiquidId,
    temperature: Number.isFinite(temperature) ? temperature : 20,
    frequency: params.get('hz') === '60' ? 60 : 50,
  }
}

/** The project and item the page was opened from, when both exist. */
export function projectContext(projects: Project[], params: URLSearchParams) {
  const project = projects.find((p) => p.id === params.get('project'))
  const item = project?.items.find((i) => i.id === params.get('item'))
  return project && item ? { project, item } : undefined
}

/** The variant's best-efficiency point at 50 Hz, water at 20 °C: its rated duty. */
export function ratedDuty(variant: PumpVariant): DutyPoint {
  const { curve, scale } = variantCurve(variant, 50)
  const flow = bepFlowAt(curve, scale)
  return {
    flow: Math.round(flow),
    head: Math.round(headAt(curve, scale, flow) * 10) / 10,
    liquid: 'water',
    temperature: 20,
    frequency: 50,
  }
}

/** Anything between shut-off and the end of the curve; the page shows where the pump runs. */
const anyRange = { min: 0, max: maxFlowRatio }

/** The variant at a duty point (the rated one by default): flow, head, efficiency, P2, NPSHr … */
export function configuredResult(variant: PumpVariant, duty?: DutyPoint) {
  return (
    (duty && evaluateVariant(variant, duty, undefined, anyRange)) ??
    evaluateVariant(variant, ratedDuty(variant), undefined, anyRange)
  )
}

/**
 * The variant as a configured product page article, so the Curves tab and
 * price box work on it like on a model page. `rated` is the duty point, so
 * "Show duty point" marks it.
 */
export function configuredArticle(
  variant: PumpVariant,
  duty: DutyPoint,
  result: Omit<SizingResult, 'rank'> | undefined,
): ResultArticle {
  const product = getProduct(variant.productId)
  const { curve, scale, trimRatio, speedRatio } = variantCurve(variant, duty.frequency)
  const point = result?.operatingPoint ?? { flow: duty.flow, head: duty.head }
  return {
    id: variant.id,
    kind: 'variant',
    productId: variant.productId,
    code: variant.name,
    productNumber: variant.productNumber ?? configuredPage.onRequest,
    category: product?.category ?? '',
    modelId: baseModel(variant)?.id ?? '',
    supply: duty.frequency === 60 ? '3×460 V, 60 Hz' : '3×400 V, 50 Hz',
    applicationIds: product?.applications ?? [],
    frequency: duty.frequency,
    phase: 3,
    power: variant.motorPower,
    speed: Math.round(variant.speed * (duty.frequency === 60 ? 1.2 : 1)),
    housing: `${variant.housingMaterial} ${variant.housingGrade}`,
    inlet: variant.connection.suction,
    outlet: variant.connection.discharge,
    maxFlow: Math.round(bepFlowAt(curve, scale) * maxFlowRatio),
    maxHead: Math.round(headAt(curve, scale, 0) * 10) / 10,
    exApproved: false,
    impellerType: 'Closed',
    impellerDiameter: variant.impeller,
    ipClass: 'IP55',
    listPrice: variant.pumpPrice + variant.motorPrice,
    availability: toAvailability(variant.availability, variant.leadTime),
    to: configuredPath(variant),
    curve: { id: variant.id, name: variant.name, curve, scale, trimRatio, operatingPoint: point },
    speedRatio,
    rated: { flow: duty.flow, head: duty.head },
  }
}

/**
 * The catalogue model with the variant's hydraulic (same connection size and
 * impeller pattern) at 50 Hz, for its parts list, CAD and drawings; else the
 * nearest size.
 */
export function baseModel(variant: PumpVariant): ProductModel | undefined {
  const hydraulic = getHydraulic(variant.hydraulicId)!
  const models = modelsFor(variant.productId).filter((m) => !m.discontinued && m.frequency === 50)
  const exact = models.find((m) => m.id === `${variant.productId}-${hydraulic.size}`)
  if (exact) return exact
  const distance = (m: ProductModel) =>
    Math.abs(m.connection.discharge - hydraulic.connection.discharge) +
    Math.abs(m.impeller - hydraulic.nominalImpeller)
  return [...models].sort((a, b) => distance(a) - distance(b))[0]
}

const kW = (value: number) => `${groupThousands(value, value % 1 ? 1 : 0)} kW`

/** Spec rows in the Specifications tab's groups, at the duty point. */
export function configuredSpecGroups(
  variant: PumpVariant,
  article: ResultArticle,
  duty: DutyPoint,
  result: Omit<SizingResult, 'rank'> | undefined,
) {
  const { groups, labels } = variantPage.specifications
  const c = configuredPage.specs
  const hydraulic = getHydraulic(variant.hydraulicId)!
  const seal = sealOptions.find((s) => s.code === variant.seal)!
  const liquid = getLiquid(duty.liquid)
  return [
    {
      title: groups.liquid,
      rows: [
        { label: c.liquid, value: liquid.label },
        { label: labels.liquidTemperature, value: `${duty.temperature} °C` },
        {
          label: c.ratedTemperature,
          value: `${variant.temperature.min} … ${variant.temperature.max} °C`,
        },
        { label: labels.maxPressure, value: variant.material === 'C1' ? '16 bar' : '25 bar' },
      ],
    },
    {
      title: groups.technical,
      rows: [
        ...(result
          ? [
              { label: c.flow, value: `${groupThousands(result.operatingPoint.flow, 1)} m³/h` },
              { label: c.head, value: `${groupThousands(result.operatingPoint.head, 1)} m` },
              { label: c.efficiency, value: `${groupThousands(result.efficiency, 1)} %` },
              { label: c.npshr, value: `${groupThousands(result.npshr, 1)} m` },
            ]
          : []),
        { label: labels.maxFlow, value: `${groupThousands(article.maxFlow)} m³/h` },
        { label: labels.maxHead, value: `${groupThousands(article.maxHead, 1)} m` },
        { label: variantPage.specifications.labels.poles, value: String(variant.poles) },
        { label: c.speed, value: `${groupThousands(article.speed)} rpm` },
        { label: labels.impellerType, value: article.impellerType },
        {
          label: labels.impellerDiameter,
          value: c.trim(variant.impeller, hydraulic.impellerMin, hydraulic.impellerMax),
        },
        { label: c.hydraulic, value: `${hydraulic.code} · ${hydraulic.size}` },
      ],
    },
    {
      title: groups.materials,
      rows: [
        { label: c.material, value: variant.material },
        { label: c.housing, value: `${variant.housingMaterial}, ${variant.housingGrade}` },
        { label: labels.impellerMaterial, value: variant.impellerMaterial },
        { label: labels.shaft, value: tenderDefaults.shaft },
        { label: labels.shaftSealType, value: `${seal.label} (${seal.code})` },
      ],
    },
    {
      title: groups.installation,
      rows: [
        { label: labels.mounting, value: c.mounting },
        { label: c.coupling, value: c.couplings[variant.coupling] },
        { label: c.suction, value: `DN ${variant.connection.suction}` },
        { label: c.discharge, value: `DN ${variant.connection.discharge}` },
        { label: c.flanges, value: c.flangeStandard },
      ],
    },
    {
      title: groups.electrical,
      rows: [
        { label: labels.ratedPower, value: kW(variant.motorPower) },
        ...(result ? [{ label: c.p2, value: kW(result.p2) }] : []),
        { label: labels.supply, value: article.supply },
        { label: labels.efficiencyClass, value: variant.motorClass },
        { label: c.motorEfficiency, value: `${variant.motorEfficiency} %` },
        { label: c.enclosure, value: variant.motorEnclosure },
        { label: c.motorNumber, value: variant.motorNumber },
      ],
    },
  ]
}

/**
 * What the tender text says: the project item (with its position and
 * quantity), a sizing's duty point, or only the rated point.
 */
export function configuredSubject(
  variant: PumpVariant,
  duty: DutyPoint,
  result: Omit<SizingResult, 'rank'> | undefined,
  options: { item?: ProjectItem; withDuty: boolean; application?: string },
): TenderSubject {
  const { item, withDuty, application } = options
  const subject = sizedSubject(variant, result, duty, application)
  return {
    ...subject,
    ...(withDuty ? {} : { duty: undefined }),
    ...(item
      ? {
          quantity: item.quantity,
          position: { number: item.position, tag: item.customerPosition },
        }
      : {}),
  }
}
