import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { bom, sparePartsPage } from '../../data/eshop'
import type { Price } from '../../lib/pricing'
import { fitsLabel } from '../../lib/spareParts'
import type { SparePart } from '../../types'
import { SmartImage } from '../SmartImage'
import { LeadTime } from './LeadTime'
import { PartPrice } from './PartPrice'
import { QuantityStepper } from './QuantityStepper'

const copy = sparePartsPage.part

type PartSearchResultProps = {
  part: SparePart
  price: Price | null
  /** The product's parts list with this part selected on the drawing. */
  drawingTo: string
  onAdd: (quantity: number) => void
}

/** A part found by number or name: what it fits, lead time, price and Add to cart. */
export function PartSearchResult({ part, price, drawingTo, onAdd }: PartSearchResultProps) {
  const [quantity, setQuantity] = useState(1)
  return (
    <article className="flex flex-wrap items-center gap-x-6 gap-y-4 px-6 py-5">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-surface-muted">
        <SmartImage src={part.image.src} alt={part.image.alt} fit="contain" />
      </div>
      <div className="min-w-64 flex-1">
        <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">{part.group}</p>
        <h3 className="mt-0.5 font-semibold text-navy-900">{part.name}</h3>
        <p className="mt-0.5 text-sm text-text-muted tabular-nums">
          {part.partNumber}
          {part.position !== undefined && ` · pos. ${part.position}`} · {copy.fits}{' '}
          {fitsLabel(part)}
        </p>
        <Link
          to={drawingTo}
          className="mt-1.5 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {copy.showOnDrawing}
        </Link>
      </div>
      <div className="w-40 text-sm">
        <LeadTime availability={part.availability} />
      </div>
      {price && (
        <div className="flex items-center gap-5">
          <div className="w-28">
            <PartPrice price={price} />
          </div>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            label={`${bom.quantity}, ${part.name}`}
          />
          <button
            type="button"
            onClick={() => {
              onAdd(quantity)
              setQuantity(1)
            }}
            aria-label={bom.addPart(part.name)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover"
          >
            <ShoppingCart className="size-[18px]" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </article>
  )
}
