import { productSeries } from '../../config/demo'
import type { ProductModel } from '../../types'

/* XFP sizes. Submersible, so there is only a discharge connection. Figures are invented. */

export const xfpModels: ProductModel[] = [
  {
    id: 'xfp-100-c',
    productId: 'xfp',
    name: `${productSeries.xfp} 100C`,
    productNumber: '24140101',
    frequency: 50,
    flow: 90,
    head: 14,
    power: 7.5,
    speed: 1450,
    impeller: 245,
    connection: { discharge: 100 },
    casingMaterial: 'Grey cast iron',
    shaftSeal: 'Double mechanical seal',
    maxPressure: 6,
    efficiency: 74,
    weight: 210,
    listPrice: 7900,
    availability: 'Fast delivery',
    leadTime: '2 weeks',
  },
  {
    id: 'xfp-150-e',
    productId: 'xfp',
    name: `${productSeries.xfp} 150E`,
    productNumber: '24150205',
    frequency: 50,
    flow: 240,
    head: 22,
    power: 22,
    speed: 1470,
    impeller: 330,
    connection: { discharge: 150 },
    casingMaterial: 'Grey cast iron',
    shaftSeal: 'Double mechanical seal',
    maxPressure: 6,
    efficiency: 79,
    weight: 480,
    listPrice: 16400,
    availability: 'Made to order',
    leadTime: '8–10 weeks',
  },
]
