import { Check, Copy, ShoppingCart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '../../cart/useCart'
import { sparePartsTab } from '../../data/sparePartsPage'
import { kitLabel } from '../../lib/bom'
import type { DrawingHotspot, ServiceKit, SparePart } from '../../types'
import { PartThumbnail } from './PartThumbnail'
import { PriceLines } from './PriceLines'
import { QuantityStepper } from './QuantityStepper'

const copy = sparePartsTab.detail

type PartDetailCardProps = {
  part: SparePart
  hotspot: DrawingHotspot | undefined
  /** Recommended sets the part is in. */
  kits: ServiceKit[]
  onSelectKit: (kitId: string) => void
  /** The variant or model whose parts list this is, for the cart. */
  ownerId: string
  drawingId: string
}

/**
 * The selected part: thumbnail from the drawing, position, name, part number
 * (with copy), material, quantity and sets; price and lead time when signed
 * in; quantity and Add to cart. Remount (via `key`) per part.
 */
export function PartDetailCard({
  part,
  hotspot,
  kits,
  onSelectKit,
  ownerId,
  drawingId,
}: PartDetailCardProps) {
  const cart = useCart()
  const [quantity, setQuantity] = useState(part.quantity)
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  function copyNumber() {
    navigator.clipboard?.writeText(part.partNumber).catch(() => {})
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="grid animate-fade-in gap-x-6 gap-y-5 sm:grid-cols-[6rem_minmax(0,1fr)_13rem]">
      {hotspot && <PartThumbnail hotspot={hotspot} />}

      <div className="min-w-0">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white tabular-nums">
            {part.position}
          </span>
          <h3 className="pt-0.5 text-lg leading-snug font-bold tracking-tight text-navy-900">
            {part.name}
          </h3>
        </div>
        <dl className="mt-3 grid grid-cols-[8.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm">
          <dt className="text-text-muted">{copy.partNumber}</dt>
          <dd className="flex items-center gap-1.5 font-semibold text-navy-900 tabular-nums">
            {part.partNumber}
            <button
              type="button"
              onClick={copyNumber}
              aria-label={copied ? copy.copied : copy.copy}
              title={copied ? copy.copied : copy.copy}
              className="flex size-7 items-center justify-center rounded-sm text-primary transition-colors hover:bg-primary-tint"
            >
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
            </button>
            <span aria-live="polite" className="text-xs font-normal text-success">
              {copied ? copy.copied : ''}
            </span>
          </dd>
          <dt className="text-text-muted">{copy.material}</dt>
          <dd className="text-navy-900">{part.material}</dd>
          <dt className="text-text-muted">{copy.quantity}</dt>
          <dd className="text-navy-900 tabular-nums">{sparePartsTab.pieces(part.quantity)}</dd>
          <dt className="text-text-muted">{copy.partOf}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {kits.length > 0 ? (
              kits.map((kit) => (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => onSelectKit(kit.id)}
                  className="rounded-pill border border-primary-border bg-primary-tint px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors hover:border-primary"
                >
                  {kitLabel(kit)}
                </button>
              ))
            ) : (
              <span className="text-text-muted">{copy.notInKit}</span>
            )}
          </dd>
        </dl>
      </div>

      <div className="flex flex-col gap-4 sm:border-l sm:border-border sm:pl-6">
        <PriceLines price={part.listPrice} unit={copy.each} availability={part.availability} />
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <QuantityStepper value={quantity} onChange={setQuantity} label={copy.order} />
          <button
            type="button"
            onClick={() =>
              cart.add(
                {
                  kind: 'part',
                  refId: part.id,
                  partNumber: part.partNumber,
                  name: part.name,
                  position: part.position,
                  variantId: ownerId,
                  drawing: { id: drawingId, hotspot: part.hotspot },
                  unitPrice: part.listPrice,
                  availability: part.availability,
                },
                quantity,
              )
            }
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-pill bg-primary px-4 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-primary-hover"
          >
            <ShoppingCart className="size-4" />
            {copy.addToCart}
          </button>
        </div>
      </div>
    </div>
  )
}
