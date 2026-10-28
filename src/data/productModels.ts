import { productSeries } from '../config/demo'
import type { ProductModel } from '../types'

/* Models (sizes) per product, as listed on the product page Models tab. */

const ah = productSeries.ahlstar
const xfp = productSeries.xfp

export const productModels: ProductModel[] = [
  {
    id: 'ahlstar-100-80-250',
    productId: 'ahlstar',
    name: `${ah} 100-80-250`,
    flow: 120,
    head: 18,
    power: 11,
    speed: 1460,
    impeller: 250,
  },
  {
    id: 'ahlstar-150-125-315',
    productId: 'ahlstar',
    name: `${ah} 150-125-315`,
    flow: 320,
    head: 32,
    power: 37,
    speed: 1480,
    impeller: 315,
  },
  {
    id: 'ahlstar-200-150-400',
    productId: 'ahlstar',
    name: `${ah} 200-150-400`,
    flow: 560,
    head: 48,
    power: 110,
    speed: 1485,
    impeller: 400,
  },
  {
    id: 'xfp-100-c',
    productId: 'xfp',
    name: `${xfp} 100C`,
    flow: 90,
    head: 14,
    power: 7.5,
    speed: 1450,
    impeller: 245,
  },
  {
    id: 'xfp-150-e',
    productId: 'xfp',
    name: `${xfp} 150E`,
    flow: 240,
    head: 22,
    power: 22,
    speed: 1470,
    impeller: 330,
  },
]
