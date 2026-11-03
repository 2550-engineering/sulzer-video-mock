import { bom as copy } from '../../data/eshop'
import type { Price } from '../../lib/pricing'
import { formatMoney } from '../../lib/selfService'

type PartPriceProps = {
  price: Price
  align?: 'left' | 'right'
  /** Money format; cents by default. */
  format?: (amount: number) => string
  /** One small line under the net price ("List €X · −32%"), for dense tables. */
  compact?: boolean
}

/**
 * The user's unit price. With a discount (the partner), the net price, the list price
 * struck through and "Your discount 32%" under it.
 */
export function PartPrice({
  price,
  align = 'right',
  format = formatMoney,
  compact = false,
}: PartPriceProps) {
  if (compact) {
    return (
      <span className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
        <span className="font-semibold whitespace-nowrap text-navy-900 tabular-nums">
          {format(price.net)}
        </span>
        {price.discount > 0 && (
          <span className="text-xs whitespace-nowrap text-text-muted tabular-nums">
            <span className="line-through">{copy.listPrice(format(price.list))}</span>
            <span className="font-semibold text-success-strong"> · −{price.discount}%</span>
          </span>
        )}
      </span>
    )
  }
  return (
    <span className={`flex flex-col gap-0.5 ${align === 'right' ? 'items-end' : 'items-start'}`}>
      <span className="font-semibold whitespace-nowrap text-navy-900 tabular-nums">
        {format(price.net)}
      </span>
      {price.discount > 0 && (
        <>
          <span className="text-xs whitespace-nowrap text-text-muted tabular-nums line-through">
            {copy.listPrice(format(price.list))}
          </span>
          <span className="rounded-sm bg-success-tint px-1.5 py-px text-xs font-semibold whitespace-nowrap text-success-strong">
            {copy.discount(price.discount)}
          </span>
        </>
      )}
    </span>
  )
}
