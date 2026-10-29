import {
  couplingOptions,
  hydraulics,
  materialOptions,
  referenceSpeed,
  sealOptions,
  trimStep,
} from '../data/hydraulics'
import { motorFor } from '../data/motors'
import type { Hydraulic, LiquidId, Poles, PumpConfiguration, PumpVariant } from '../types'
import { getProduct } from './catalog'

/*
 * The configurator's catalogue. A configuration is a hydraulic × poles ×
 * material × seal × coupling, with the motor and the options it supports;
 * these are the "hits". A variant is a configuration with a trimmed impeller.
 * Everything is derived from data/hydraulics.ts by fixed rules, with no
 * randomness. The naming scheme, numbers and rules are invented: see
 * docs/content-to-confirm.md.
 */

/** Motor rating: at least this much above shaft power at full impeller, BEP. */
const motorSizing = 1.25
/** IE4 motors: efficiency gain over the IE3 table, and price factor. */
const ie4 = { efficiencyGain: 0.8, priceFactor: 1.25 }
const sixPolePriceFactor = 1.3

const roundTo10 = (eur: number) => Math.round(eur / 10) * 10

/** Trim diameters from impellerMin to impellerMax in `trimStep` mm steps, always including the max. */
export function trimsFor(hydraulic: Hydraulic) {
  const trims: number[] = []
  for (let d = hydraulic.impellerMin; d < hydraulic.impellerMax; d += trimStep) trims.push(d)
  return [...trims, hydraulic.impellerMax]
}

function motorDetails(power: number, poles: Poles) {
  return {
    motorVoltage: power <= 3 ? '230/400 V' : '400/690 V',
    motorEnclosure:
      power <= 1.5
        ? 'IC410 (non-ventilated)'
        : power >= 110
          ? 'IC416 (forced ventilation)'
          : 'IC411 (fan-cooled)',
    motorNumber: `MT-${poles}${String(Math.round(power * 10)).padStart(4, '0')}`,
    mainsVoltages: ['3x400', ...(power > 3 ? ['3x690'] : []), ...(power <= 90 ? ['3x460'] : [])],
    enclosures: ['IP55', ...(power >= 11 ? ['IP56'] : []), ...(power <= 30 ? ['IP65'] : [])],
    variableSpeed: ['no', 'external', ...(power <= 22 ? ['integrated'] : [])],
    motorSupply: ['sulzer', ...(power >= 11 ? ['customer'] : [])],
  }
}

function configurationsFor(hydraulic: Hydraulic): PumpConfiguration[] {
  const series = getProduct(hydraulic.productId)?.name ?? hydraulic.productId.toUpperCase()
  const { curve } = hydraulic
  const configurations: PumpConfiguration[] = []

  for (const poles of [2, 4, 6] as const) {
    const speed = hydraulic.speeds[poles]
    if (!speed) continue
    // Shaft power at full impeller and BEP, water, to size the motor.
    const s = speed / referenceSpeed
    const bepHead = curve.shutOffHead / 1.25
    const shaftPower =
      (998 * 9.81 * ((curve.bepFlow * s) / 3600) * bepHead * s ** 2) /
      (curve.bepEfficiency / 100) /
      1000
    const motor = motorFor(shaftPower * motorSizing)
    if (!motor) continue
    const motorPrice = roundTo10(
      motor.price * ie4.priceFactor * (poles === 6 ? sixPolePriceFactor : 1),
    )

    for (const material of materialOptions.filter((m) => hydraulic.materials.includes(m.code))) {
      for (const seal of sealOptions) {
        for (const coupling of couplingOptions.filter((c) =>
          hydraulic.couplings.includes(c.code),
        )) {
          const semiOpen = hydraulic.nominalImpeller <= 315 && material.code !== 'D3'
          const liquids: LiquidId[] = [
            'water',
            'glycol',
            ...(material.code !== 'C1' ? (['seawater'] as const) : []),
            ...(semiOpen ? (['raw-solids'] as const) : []),
            ...(seal.code === 'DD' && material.code !== 'D3' ? (['light-oil'] as const) : []),
          ]
          const code = `${material.code}-${seal.code}-${poles}P-${coupling.code}`
          configurations.push({
            id: [hydraulic.id, `${poles}p`, material.code, seal.code, coupling.code]
              .join('-')
              .toLowerCase(),
            hydraulicId: hydraulic.id,
            productId: hydraulic.productId,
            productName: `${series} ${hydraulic.code} · ${hydraulic.size}`,
            code,
            poles,
            speed,
            connection: hydraulic.connection,
            nominalImpeller: hydraulic.nominalImpeller,
            material: material.code,
            impellerMaterial: material.impeller,
            housingMaterial: material.housing,
            housingGrade: material.grade,
            seal: seal.code,
            coupling: coupling.code,
            motorPower: motor.power,
            motorEfficiency: Math.min(
              97,
              Math.round((motor.efficiency + ie4.efficiencyGain) * 10) / 10,
            ),
            motorPrice,
            motorClass: 'IE4',
            ...motorDetails(motor.power, poles),
            impellerTypes: ['closed', ...(semiOpen ? ['semi-open'] : [])],
            liquids,
            temperature: seal.temperature,
            pumpPrice: roundTo10(
              hydraulic.basePrice * material.priceFactor * seal.priceFactor * coupling.priceFactor,
            ),
          })
        }
      }
    }
  }
  return configurations
}

/** Every configuration of every hydraulic, built once, in a fixed order. */
export const configurations: PumpConfiguration[] = hydraulics.flatMap(configurationsFor)

const configurationById = new Map(configurations.map((c) => [c.id, c]))

export const configurationsForProduct = (productId: string) =>
  configurations.filter((c) => c.productId === productId)

/**
 * The variant of a configuration with its impeller trimmed to `trim` mm.
 * Standard variants (cast iron, single seal, coupling without spacer) have a
 * fixed 8-digit number: 63, the hydraulic's position, poles, trim.
 */
export function variantFor(configuration: PumpConfiguration, trim: number): PumpVariant {
  const hydraulic = hydraulics.find((h) => h.id === configuration.hydraulicId)!
  const index = hydraulics.indexOf(hydraulic)
  const standard =
    configuration.material === 'C1' && configuration.seal === 'SD' && configuration.coupling === 'F'
  const productNumber = standard
    ? `63${String(index + 1).padStart(2, '0')}${configuration.poles}${trim}`
    : null
  const series = configuration.productName.split(' ')[0]
  return {
    ...configuration,
    id: `${configuration.id}-t${trim}`,
    configurationId: configuration.id,
    name: `${series} ${hydraulic.code}-${hydraulic.connection.suction}-${hydraulic.nominalImpeller}/${trim} ${configuration.code}`,
    impeller: trim,
    productNumber,
    availability: productNumber ? 'Fast delivery' : 'Made to order',
    leadTime: productNumber ? '2 weeks' : '10–12 weeks',
  }
}

/** Rebuilds a variant from its id ("<configuration id>-t<trim>"), e.g. for project items. */
export function getVariant(id: string) {
  const match = /^(.*)-t(\d+)$/.exec(id)
  const configuration = match && configurationById.get(match[1])
  if (!configuration) return undefined
  const trim = Number(match[2])
  const hydraulic = hydraulics.find((h) => h.id === configuration.hydraulicId)!
  return trimsFor(hydraulic).includes(trim) ? variantFor(configuration, trim) : undefined
}

/** How many orderable variants (configurations × trims) a product has. */
export const variantCount = (productId: string) =>
  configurationsForProduct(productId).reduce(
    (sum, c) => sum + trimsFor(hydraulics.find((h) => h.id === c.hydraulicId)!).length,
    0,
  )
