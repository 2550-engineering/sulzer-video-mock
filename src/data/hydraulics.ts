import type {
  CouplingCode,
  Hydraulic,
  HydraulicCurve,
  MaterialCode,
  Poles,
  SealCode,
} from '../types'

/*
 * AHLSTAR hydraulic sizes for sizing: 28 sizes, sold with 2, 4 and/or 6 poles,
 * giving 56 overlapping coverage areas on the range chart (about 2–800 m³/h,
 * 2–180 m). Every number is invented: each curve is derived from the impeller
 * diameter and the discharge size with typical end-suction pump coefficients,
 * not from Sulzer data. See docs/content-to-confirm.md.
 */

/** Curves are given at this speed (4 poles, 50 Hz). */
export const referenceSpeed = 1475

/** Rated speeds at 50 Hz. 60 Hz runs 1.2 × faster. */
export const ratedSpeeds: Record<Poles, number> = { 2: 2950, 4: 1475, 6: 980 }

const shutOffRatio = 1.25
/** BEP head coefficient: H = ψ · u² / 2g at the impeller tip. */
const headCoefficient = 0.9
/** Flow velocity in the discharge nozzle at BEP, 4 poles, m/s. */
const nozzleVelocity = 2.4

/** Rounds to a step and drops float noise (57.400000000000006 → 57.4). */
const round = (value: number, step: number) =>
  Number((Math.round(value / step) * step).toFixed(step < 1 ? 1 : 0))

function curveFor(impellerMax: number, discharge: number): HydraulicCurve {
  const tipSpeed = (Math.PI * impellerMax * referenceSpeed) / 1000 / 60
  const bepHead = round((headCoefficient * tipSpeed ** 2) / (2 * 9.81), 0.1)
  const nozzleArea = (Math.PI * (discharge / 1000) ** 2) / 4
  const bepFlow = round(nozzleVelocity * nozzleArea * 3600 * (impellerMax / 250) ** 0.6, 0.1)
  const shutOffHead = bepHead * shutOffRatio
  return {
    shutOffHead,
    k: (shutOffHead - bepHead) / bepFlow ** 2,
    bepFlow,
    bepEfficiency: round(Math.min(86, 48 + 14 * Math.log10(bepFlow)), 0.1),
    npshrAtBep: round(1.2 + 0.5 * bepFlow ** 0.35, 0.1),
  }
}

// prettier-ignore
const sizes: [size: string, poles: Poles[]][] = [
  ['50-32-125', [4]],    ['50-32-160', [2, 4]],    ['50-32-200', [2, 4]],    ['50-32-250', [2, 4]],
  ['65-40-160', [2, 4]],    ['65-40-200', [2, 4]],    ['65-40-250', [2, 4]],    ['65-40-315', [2, 4]],
  ['80-50-160', [2, 4]],    ['80-50-200', [2, 4]],    ['80-50-250', [2, 4]],    ['80-50-315', [2, 4, 6]],
  ['100-65-200', [2, 4]],   ['100-65-250', [2, 4]],   ['100-65-315', [2, 4, 6]],   ['125-80-250', [2, 4]],
  ['125-80-315', [2, 4, 6]], ['125-80-400', [4, 6]],  ['125-100-250', [2, 4, 6]],  ['125-100-315', [2, 4, 6]],
  ['125-100-400', [4, 6]],  ['150-125-315', [4, 6]],  ['150-125-400', [4, 6]],  ['200-150-315', [4, 6]],
  ['200-150-400', [4, 6]],  ['250-200-400', [4, 6]],  ['250-200-500', [4, 6]],  ['300-250-500', [4, 6]],
]

export const hydraulics: Hydraulic[] = sizes.map(([size, poles], index) => {
  const [suction, discharge, nominalImpeller] = size.split('-').map(Number)
  const impellerMax = round(nominalImpeller * 1.05, 5)
  const code = `A${String(index + 1).padStart(2, '0')}`
  return {
    id: `ahlstar-${code.toLowerCase()}`,
    productId: 'ahlstar',
    code,
    size,
    connection: { suction, discharge },
    nominalImpeller,
    impellerMax,
    impellerMin: round(nominalImpeller * 0.78, 5),
    curve: curveFor(impellerMax, discharge),
    speeds: Object.fromEntries(poles.map((p) => [p, ratedSpeeds[p]])),
    // The largest sizes come in cast iron only; super duplex stops below 400 mm impellers.
    materials:
      discharge >= 200 ? ['C1'] : nominalImpeller >= 400 ? ['C1', 'S2'] : ['C1', 'S2', 'D3'],
    // Small sizes sit on a short frame (no spacer); the largest always have a spacer
    // coupling, so the rotating unit pulls out without moving the motor.
    couplings: nominalImpeller <= 160 ? ['F'] : discharge >= 200 ? ['FS'] : ['F', 'FS'],
    basePrice: round(2200 * (nominalImpeller / 200) ** 1.2 * (discharge / 32) ** 0.55, 100),
  }
})

export const getHydraulic = (id: string) => hydraulics.find((h) => h.id === id)

/** Material codes: impeller and pump housing. Factors scale the pump price. */
export const materialOptions: {
  code: MaterialCode
  label: string
  impeller: string
  housing: string
  grade: string
  priceFactor: number
}[] = [
  {
    code: 'C1',
    label: 'Cast iron',
    impeller: 'Cast iron',
    housing: 'Cast iron',
    grade: 'EN-GJL-250',
    priceFactor: 1,
  },
  {
    code: 'S2',
    label: 'Duplex impeller, stainless housing',
    impeller: 'Duplex stainless',
    housing: 'Stainless steel',
    grade: 'EN 1.4408',
    priceFactor: 1.55,
  },
  {
    code: 'D3',
    label: 'Super duplex impeller, duplex housing',
    impeller: 'Super duplex',
    housing: 'Duplex',
    grade: 'EN 1.4517',
    priceFactor: 2.1,
  },
]

export const sealOptions: {
  code: SealCode
  label: string
  /** "Mechanical seal" read-only field. */
  arrangement: string
  priceFactor: number
  /** Seal service per year, EUR. */
  maintenancePerYear: number
  /** Liquid temperature the seal is rated for, °C. */
  temperature: { min: number; max: number }
}[] = [
  {
    code: 'SD',
    label: 'Single mechanical seal',
    arrangement: 'Single',
    priceFactor: 1,
    maintenancePerYear: 280,
    temperature: { min: -20, max: 120 },
  },
  {
    code: 'DD',
    label: 'Double mechanical seal',
    arrangement: 'Double',
    priceFactor: 1.22,
    maintenancePerYear: 460,
    temperature: { min: -40, max: 180 },
  },
]

export const couplingOptions: { code: CouplingCode; label: string; priceFactor: number }[] = [
  { code: 'F', label: 'Flexible without spacer', priceFactor: 1 },
  { code: 'FS', label: 'Flexible with spacer', priceFactor: 1.06 },
]

/** Impeller trims are offered in steps of this many mm, from impellerMin to impellerMax. */
export const trimStep = 5
