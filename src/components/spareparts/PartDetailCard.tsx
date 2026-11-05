import { Check, Copy, LogIn, ShoppingCart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import { useCart } from '../../cart/useCart'
import { sparePartsTab } from '../../data/sparePartsPage'
import { kitLabel } from '../../lib/bom'
import { formatPartPrice } from '../../lib/modelSpecs'
import type { DrawingHotspot, ServiceKit, SparePart } from '../../types'
import { PartThumbnail } from './PartThumbnail'
import { StockIndicator } from '../variant/StockIndicator'
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
 * The selected part, in one column under the drawing: picture, position and
 * name; part number (with copy), material, quantity and sets; then price,
 * status and lead time (signed in, else a sign-in link), quantity and Add to
 * cart. Remount (via `key`) per part.
 */
export function PartDetailCard({
  part,
  hotspot,
  kits,
  onSelectKit,
  ownerId,
  drawingId,
}: PartDetailCardProps) {
  const { user, signIn } = useAuth()
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
    <div className="animate-fade-in space-y-4">
      {/* Room on the right for the close button of the surrounding card. */}
      <div className="flex items-center gap-3 pr-8">
        {hotspot && <PartThumbnail hotspot={hotspot} className="size-16 shrink-0" />}
        <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-pill bg-primary px-1.5 text-[11px] font-bold text-white tabular-nums">
          {part.position}
        </span>
        <h3
          className="line-clamp-2 min-w-0 leading-snug font-bold tracking-tight text-navy-900"
          title={part.name}
        >
          {part.name}
        </h3>
      </div>

      <dl className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-3 gap-y-3 text-sm">
        <dt className="self-center text-text-muted">{copy.partNumber}</dt>
        <dd className="flex items-center gap-2 font-semibold whitespace-nowrap text-navy-900 tabular-nums">
          {part.partNumber}
          <button
            type="button"
            onClick={copyNumber}
            aria-label={copied ? copy.copied : copy.copy}
            title={copied ? copy.copied : copy.copy}
            className="-my-1 flex size-7 shrink-0 items-center justify-center rounded-sm text-primary transition-colors hover:bg-primary-tint"
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

      <div className="border-t border-border pt-4">
        {user ? (
          <div className="animate-fade-in">
            <p className="text-xs font-semibold text-text-muted">{copy.price}</p>
            <p className="text-2xl leading-tight font-bold tracking-tight text-navy-900 tabular-nums">
              {formatPartPrice(part.listPrice)}
            </p>
            <p className="text-xs text-text-muted">{copy.each}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-sm">
              <span className="font-semibold whitespace-nowrap text-navy-900">
                <StockIndicator status={part.availability.status} />
              </span>
              <span className="text-text-muted">· {part.availability.leadTime}</span>
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signIn()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <LogIn className="size-4" />
            {copy.signIn}
          </button>
        )}
        <div className="mt-4 flex items-center gap-3">
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
            className="inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-pill bg-primary px-4 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-primary-hover"
          >
            <ShoppingCart className="size-4" />
            {copy.addToCart}
          </button>
        </div>
      </div>
    </div>
  )
}
