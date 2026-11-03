import { Package } from 'lucide-react'
import { productIdOf } from '../../lib/cartArticles'
import { getDrawing, getProduct } from '../../lib/catalog'
import type { CartItem } from '../../types'
import { SmartImage } from '../SmartImage'
import { PartThumbnail } from '../spareparts/PartThumbnail'

/** Picture of a cart line: the part cut from its drawing, a kit box, or the pump photo. */
export function CartLineImage({ item, size = 'size-14' }: { item: CartItem; size?: string }) {
  if (item.kind === 'part' && item.drawing) {
    const hotspot = getDrawing(item.drawing.id)?.hotspots.find(
      (h) => h.id === item.drawing!.hotspot,
    )
    if (hotspot) return <PartThumbnail hotspot={hotspot} className={size} />
  }
  if (item.kind === 'product') {
    const productId = productIdOf(item.variantId)
    const image = productId && getProduct(productId)?.images[0]
    if (image) {
      return (
        <span
          className={`relative shrink-0 overflow-hidden rounded-md border border-border bg-white ${size}`}
        >
          <SmartImage src={image.src} alt="" fit="contain" />
        </span>
      )
    }
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md border border-border bg-primary-tint text-primary ${size}`}
    >
      <Package aria-hidden className="size-1/2" strokeWidth={1.5} />
    </span>
  )
}
