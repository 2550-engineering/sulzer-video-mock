import { Trash2 } from 'lucide-react'
import { assetById } from '../../data/assets'
import { cartCopy as copy } from '../../data/eshop'
import type { Price } from '../../lib/pricing'
import { formatMoney } from '../../lib/selfService'
import type { CartLine, SparePart } from '../../types'
import { SmartImage } from '../SmartImage'
import { LeadTime } from '../spareparts/LeadTime'
import { QuantityStepper } from '../spareparts/QuantityStepper'

type CartLineItemProps = {
  line: CartLine
  part: SparePart
  price: Price
  onQuantity: (quantity: number) => void
  onRemove: () => void
  /** The drawer's narrower layout. */
  compact?: boolean
}

/** One cart line: photo, part, the asset it is for, quantity and line total. */
export function CartLineItem({
  line,
  part,
  price,
  onQuantity,
  onRemove,
  compact = false,
}: CartLineItemProps) {
  const asset = line.assetId ? assetById(line.assetId) : undefined
  return (
    <div className={`flex gap-4 ${compact ? 'py-5' : 'py-6'}`}>
      <div
        className={`relative shrink-0 overflow-hidden rounded-md border border-border bg-surface-muted ${
          compact ? 'size-16' : 'size-24'
        }`}
      >
        <SmartImage src={part.image.src} alt={part.image.alt} fit="contain" />
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={compact ? '' : 'flex flex-wrap items-start justify-between gap-x-8 gap-y-3'}
        >
          <div className="min-w-0">
            <p className="font-semibold text-navy-900">{part.name}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted tabular-nums">
              {copy.partNumber(part.partNumber)}
              {asset && (
                <span className="rounded-sm bg-primary-tint px-1.5 py-0.5 text-xs font-semibold text-primary">
                  {copy.forAsset(asset.tag)}
                </span>
              )}
            </p>
            {!compact && (
              <p className="mt-2 text-sm">
                <LeadTime availability={part.availability} inline />
              </p>
            )}
          </div>
          {!compact && (
            <div className="flex items-center gap-6">
              <QuantityStepper
                value={line.quantity}
                onChange={onQuantity}
                min={0}
                label={`${copy.title}, ${part.name}`}
              />
              <div className="w-28 text-right">
                <p className="font-semibold text-navy-900 tabular-nums">
                  {formatMoney(price.net * line.quantity)}
                </p>
                <p className="text-xs text-text-muted tabular-nums">
                  {copy.each(formatMoney(price.net))}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-4 ${compact ? 'mt-3 justify-between' : 'mt-3'}`}>
          {compact && (
            <QuantityStepper
              value={line.quantity}
              onChange={onQuantity}
              min={0}
              label={`${copy.title}, ${part.name}`}
            />
          )}
          <button
            type="button"
            onClick={onRemove}
            aria-label={copy.removeLine(part.name)}
            className={`inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-danger ${
              compact ? 'sr-only order-last' : ''
            }`}
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
            {copy.remove}
          </button>
          {compact && (
            <p className="font-semibold text-navy-900 tabular-nums">
              {formatMoney(price.net * line.quantity)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
