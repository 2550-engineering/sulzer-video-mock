/*
 * Standard IEC motor ratings for sizing, with IE3 full-load efficiency and an
 * invented list price. Sizing fits IE4 motors: a fixed efficiency step above
 * these at a higher price (lib/variants.ts). Typical values, not Sulzer data:
 * see docs/content-to-confirm.md.
 */

export type Motor = {
  /** kW. */
  power: number
  /** %. */
  efficiency: number
  /** EUR. */
  price: number
}

// prettier-ignore
const rows: [power: number, efficiency: number, price: number][] = [
  [0.75, 82.5,   310], [1.1, 84.1,   340], [1.5, 85.3,   380], [2.2, 86.7,   440],
  [3,    87.7,   520], [4,   88.6,   610], [5.5, 89.6,   760], [7.5, 90.4,   920],
  [11,   91.4,  1250], [15,  92.1,  1580], [18.5, 92.6, 1890], [22,  93.0,  2180],
  [30,   93.6,  2850], [37,  93.9,  3420], [45,  94.2,  4100], [55,  94.6,  4900],
  [75,   95.0,  6500], [90,  95.2,  7800], [110, 95.4,  9400], [132, 95.6, 11200],
  [160,  95.8, 13500], [200, 96.0, 16800], [250, 96.0, 20900], [315, 96.0, 26300],
]

export const motors: Motor[] = rows.map(([power, efficiency, price]) => ({
  power,
  efficiency,
  price,
}))

/** The smallest standard motor of at least `power` kW, or undefined above the largest. */
export const motorFor = (power: number) => motors.find((motor) => motor.power >= power)
