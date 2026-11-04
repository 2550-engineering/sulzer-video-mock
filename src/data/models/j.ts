import { productSeries } from '../../config/demo'
import type { CasingMaterial, ModelAvailability, ProductModel } from '../../types'

/*
 * J dewatering pump sizes. Submersible, so there is only a discharge
 * connection. "HH" sizes are the high-head versions. Max. pressure follows
 * from the shut-off head. Every figure and price is invented: see
 * docs/content-to-confirm.md.
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
  discharge: number,
  impeller: number,
  material: CasingMaterial,
  solidsSize: number,
  maxSubmergence: number,
  weight: number,
  listPrice: number,
  availability: ModelAvailability,
]

const alu: CasingMaterial = 'Aluminium alloy'
const ductile: CasingMaterial = 'Ductile iron'

// prettier-ignore
const rows: Row[] = [
  // size       Hz  product no.  flow  head  kW    rpm   eff% DN   imp  material  mm  m    kg   price  availability
  ['5',         50, '28410005',   14,    8,  0.9, 2850, 42,  50,  85, alu,       6, 20,  21,  1450, 'In stock'],
  ['12',        50, '28410012',   30,   14,    3, 2870, 50,  80, 110, alu,       8, 20,  37,  2380, 'In stock'],
  ['22',        50, '28410022',   60,   18,  5.5, 2880, 56,  80, 125, alu,       8, 25,  58,  3950, 'In stock'],
  ['33 HH',     50, '28410033',   30,   40,  7.5, 2900, 52,  50, 185, alu,       6, 30,  72,  5150, 'Fast delivery'],
  ['55',        50, '28410055',  110,   22,   11, 2920, 60, 100, 140, ductile,  10, 30, 128,  7400, 'Fast delivery'],
  ['85',        50, '28410085',  160,   30,   22, 2940, 63, 100, 160, ductile,  10, 40, 210, 11900, 'Fast delivery'],
  ['105 HH',    50, '28410105',   90,   60,   30, 2950, 60,  80, 220, ductile,   8, 50, 245, 14300, 'Made to order'],
  ['205',       50, '28410205',  280,   38,   45, 1470, 67, 150, 355, ductile,  12, 50, 420, 22600, 'Made to order'],
  ['405',       50, '28410405',  430,   32,   55, 1475, 70, 150, 330, ductile,  12, 50, 560, 29800, 'Made to order'],
  ['604 HH',    50, '28410604',  160,   88,   60, 2960, 68, 100, 270, ductile,   8, 50, 610, 36500, 'Made to order'],
  ['12',        60, '28416012',   34,   18,  3.7, 3460, 51,  80, 110, alu,       8, 20,  38,  2590, 'Fast delivery'],
  ['22',        60, '28416022',   70,   22,  7.5, 3480, 57,  80, 125, alu,       8, 25,  60,  4280, 'Fast delivery'],
  ['85',        60, '28416085',  190,   40,   37, 3530, 64, 100, 160, ductile,  10, 40, 215, 13400, 'Made to order'],
  ['205',       60, '28416205',  330,   50,   75, 1770, 68, 150, 355, ductile,  12, 50, 440, 25900, 'Made to order'],
]

const leadTimes: Record<ModelAvailability, string> = {
  'In stock': '3 working days',
  'Fast delivery': '2 weeks',
  'Made to order': '6–8 weeks',
}

/** Shut-off head (1.25 × rated, as on the curves) in bar, rounded up. */
const pressureFor = (head: number) => Math.ceil((head * 1.25) / 10)

export const jModels: ProductModel[] = rows.map(
  ([
    size,
    frequency,
    productNumber,
    flow,
    head,
    power,
    speed,
    efficiency,
    discharge,
    impeller,
    material,
    solidsSize,
    maxSubmergence,
    weight,
    listPrice,
    availability,
  ]) => ({
    id: `j-${size.toLowerCase().replace(' ', '-')}${frequency === 60 ? '-60hz' : ''}`,
    productId: 'j-dewatering',
    name: `${productSeries.j} ${size}`,
    productNumber,
    frequency,
    flow,
    head,
    power,
    speed,
    impeller,
    connection: { discharge },
    casingMaterial: material,
    shaftSeal: 'Double mechanical seal',
    maxPressure: pressureFor(head),
    efficiency,
    weight,
    impellerMaterial: 'High-chrome iron',
    solidsSize,
    maxSubmergence,
    listPrice,
    availability,
    leadTime: leadTimes[availability],
  }),
)
