import { productSeries } from '../../config/demo'
import type { CasingMaterial, ModelAvailability, ProductModel, ShaftSeal } from '../../types'

/*
 * AHLSTAR sizes on the Models tab. The size code is suction DN - discharge DN -
 * impeller diameter (e.g. 100-80-250), so name, id, connection and impeller all
 * come from it. Every figure and price is invented: see docs/content-to-confirm.md.
 */

type Row = [
  size: string,
  frequency: 50 | 60,
  productNumber: string,
  flow: number,
  head: number,
  power: number,
  speed: number,
  efficiency: number,
  material: CasingMaterial,
  seal: ShaftSeal,
  weight: number,
  listPrice: number,
  availability: ModelAvailability,
]

const iron: CasingMaterial = 'Grey cast iron'
const ductile: CasingMaterial = 'Ductile iron'
const duplex: CasingMaterial = 'Duplex stainless steel'
const packing: ShaftSeal = 'Packing'
const single: ShaftSeal = 'Single mechanical seal'
const double: ShaftSeal = 'Double mechanical seal'

// prettier-ignore
const rows: Row[] = [
  // size          Hz  product no.  flow  head  kW   rpm   eff% material seal    kg    price    availability
  ['40-25-160',    50, '62801016',   12,   32,   3,  2900, 55, iron,    single,   95,   3850, 'Fast delivery'],
  ['50-32-200',    50, '62801024',   25,   50, 7.5,  2900, 60, iron,    single,  150,   5420, 'Fast delivery'],
  ['65-40-250',    50, '62801032',   50,   80,  22,  2910, 68, duplex,  double,  310,  14900, 'Made to order'],
  ['80-50-200',    50, '62801040',   50,   12,   3,  1450, 70, iron,    packing, 120,   4600, 'In stock'],
  ['80-65-160',    50, '62801059',  100,   32,  15,  2930, 75, iron,    single,  240,   8750, 'Fast delivery'],
  ['100-80-250',   50, '62801067',  120,   18,  11,  1460, 78, iron,    single,  330,   9980, 'In stock'],
  ['125-100-315',  50, '62801075',  220,   30,  30,  1475, 80, ductile, double,  590,  19800, 'Made to order'],
  ['150-125-315',  50, '62801083',  320,   32,  37,  1480, 82, iron,    single,  760,  24600, 'Fast delivery'],
  ['200-150-400',  50, '62801091',  560,   48, 110,  1485, 83, ductile, double, 1650,  52300, 'Made to order'],
  ['250-200-500',  50, '62801105',  950,   72, 250,  1485, 85, ductile, packing, 3400, 118000, 'Made to order'],
  ['50-32-200',    60, '62806014',   30,   72,  11,  3500, 60, iron,    single,  190,   6950, 'Fast delivery'],
  ['80-65-160',    60, '62806022',  120,   46,  22,  3530, 76, iron,    single,  290,  12400, 'Made to order'],
  ['100-80-250',   60, '62806030',  145,   26, 18.5, 1760, 79, duplex,  double,  430,  17900, 'Made to order'],
  ['150-125-315',  60, '62806049',  385,   46,  75,  1780, 83, ductile, single, 1100,  41800, 'Made to order'],
]

const leadTimes: Record<ModelAvailability, string> = {
  'In stock': '3 working days',
  // Matches the "Fast delivery programme" promo on the AHLSTAR Explore tab.
  'Fast delivery': '2 weeks',
  'Made to order': '10–12 weeks',
}

/** Duplex and ductile iron casings are rated higher than grey cast iron. */
const maxPressure: Record<CasingMaterial, number> = {
  'Grey cast iron': 16,
  'Ductile iron': 25,
  'Duplex stainless steel': 25,
}

export const ahlstarModels: ProductModel[] = rows.map(
  ([
    size,
    frequency,
    productNumber,
    flow,
    head,
    power,
    speed,
    efficiency,
    material,
    seal,
    weight,
    listPrice,
    availability,
  ]) => {
    const [suction, discharge, impeller] = size.split('-').map(Number)
    return {
      // 50 Hz ids have no suffix, so the Phase 1 ids (ahlstar-100-80-250 …) still work.
      id: `ahlstar-${size}${frequency === 60 ? '-60hz' : ''}`,
      productId: 'ahlstar',
      name: `${productSeries.ahlstar} ${size}`,
      productNumber,
      frequency,
      flow,
      head,
      power,
      speed,
      impeller,
      connection: { suction, discharge },
      casingMaterial: material,
      shaftSeal: seal,
      maxPressure: maxPressure[material],
      efficiency,
      weight,
      listPrice,
      availability,
      leadTime: leadTimes[availability],
    }
  },
)
