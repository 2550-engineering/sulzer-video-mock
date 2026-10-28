import { ahlstarModels } from './models/ahlstar'
import { xfpModels } from './models/xfp'
import type { ProductModel } from '../types'

/* Models (sizes) per product, as listed on the product page Models tab. One file per product in ./models. */

export const productModels: ProductModel[] = [...ahlstarModels, ...xfpModels]
