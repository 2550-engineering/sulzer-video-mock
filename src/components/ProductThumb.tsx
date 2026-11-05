import type { Product } from '../types'
import { SmartImage } from './SmartImage'

/** Product cut-out on a small light square, for lists. Decorative: the name is next to it. */
export function ProductThumb({ product }: { product: Product }) {
  return (
    <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface-muted ring-1 ring-border">
      <SmartImage src={product.images[0].src} alt="" fit="contain" className="p-1" />
    </span>
  )
}
