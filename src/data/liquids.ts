import type { LiquidId } from '../types'

/*
 * Pumped liquids offered in sizing. Densities are textbook values at 20 °C; the
 * efficiency factor is a simple viscosity/solids correction. Placeholder, see
 * docs/content-to-confirm.md.
 */

export type Liquid = {
  id: LiquidId
  label: string
  /** kg/m³. */
  density: number
  /** Kinematic viscosity, mm²/s. */
  viscosity: number
  /** Multiplies pump efficiency. */
  efficiencyFactor: number
  /** Allowed liquid temperature, °C. */
  minTemperature: number
  maxTemperature: number
}

export const liquids: Liquid[] = [
  {
    id: 'water',
    label: 'Water',
    density: 998,
    viscosity: 1.0,
    efficiencyFactor: 1,
    minTemperature: 0,
    maxTemperature: 120,
  },
  {
    id: 'seawater',
    label: 'Sea water',
    density: 1025,
    viscosity: 1.05,
    efficiencyFactor: 1,
    minTemperature: 0,
    maxTemperature: 50,
  },
  {
    id: 'raw-solids',
    label: 'Raw water with solids',
    density: 1050,
    viscosity: 1.2,
    efficiencyFactor: 0.96,
    minTemperature: 0,
    maxTemperature: 40,
  },
  {
    id: 'glycol',
    label: 'Glycol mix',
    density: 1040,
    viscosity: 2.5,
    efficiencyFactor: 0.97,
    minTemperature: -20,
    maxTemperature: 90,
  },
  {
    id: 'light-oil',
    label: 'Light oil',
    density: 850,
    viscosity: 8,
    efficiencyFactor: 0.94,
    minTemperature: -10,
    maxTemperature: 120,
  },
]

export const getLiquid = (id: LiquidId) => liquids.find((liquid) => liquid.id === id) ?? liquids[0]
