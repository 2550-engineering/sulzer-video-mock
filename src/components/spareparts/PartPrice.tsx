import { bom as copy } from '../../data/eshop'
import type { Price } from '../../lib/pricing'
import { formatMoney } from '../../lib/selfService'

/** The user's unit price; with a discount, the list price struck through and the %. */
export function PartPrice({ price, align = 'right' }: { price: Price; align?: 'left' | 'right' }) {
  return (
    <span className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
      <span className="font-semibold whitespace-nowrap text-navy-900 tabular-nums">
        {formatMoney(price.net)}
      </span>
      {price.discount > 0 && (
        <span className="flex items-center gap-1.5 text-xs whitespace-nowrap text-text-muted tabular-nums">
          <span className="line-through">{copy.listPrice(formatMoney(price.list))}</span>
          <span className="rounded-sm bg-success-tint px-1 font-semibold text-success-strong">
            {copy.discount(price.discount)}
          </span>
        </span>
      )}
    </span>
  )
}
