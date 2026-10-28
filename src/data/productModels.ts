import { productSeries } from '../config/demo'
import type { ProductModel } from '../types'

/* Models (sizes) per product, as listed on the product page Models tab. */

const es = productSeries.mainEndSuctionPump
const swp = productSeries.submersiblePump

export const productModels: ProductModel[] = [
  {
    id: 'ses-100-80-250',
    productId: 'end-suction-pump',
    name: `${es} 100-80-250`,
    flow: 120,
    head: 18,
    power: 11,
    speed: 1460,
    impeller: 250,
  },
  {
    id: 'ses-150-125-315',
    productId: 'end-suction-pump',
    name: `${es} 150-125-315`,
    flow: 320,
    head: 32,
    power: 37,
    speed: 1480,
    impeller: 315,
  },
  {
    id: 'ses-200-150-400',
    productId: 'end-suction-pump',
    name: `${es} 200-150-400`,
    flow: 560,
    head: 48,
    power: 110,
    speed: 1485,
    impeller: 400,
  },
  {
    id: 'swp-100-c',
    productId: 'submersible-wastewater-pump',
    name: `${swp} 100C`,
    flow: 90,
    head: 14,
    power: 7.5,
    speed: 1450,
    impeller: 245,
  },
  {
    id: 'swp-150-e',
    productId: 'submersible-wastewater-pump',
    name: `${swp} 150E`,
    flow: 240,
    head: 22,
    power: 22,
    speed: 1470,
    impeller: 330,
  },
]
