import type { ReactNode } from 'react'
import { eshopPages } from '../../data/eshopPages'
import { cartTotals, deliveryWindow } from '../../lib/cart'
import { formatDate } from '../../lib/dates'
import { formatPartPrice } from '../../lib/modelSpecs'
import type { CartItem } from '../../types'

const copy = eshopPages.summary

type OrderSummaryProps = {
  items: CartItem[]
  /** Buttons and fields under the totals. */
  children?: ReactNode
}

/** Subtotal, freight, VAT and total, and the delivery window from the lead times. */
export function OrderSummary({ items, children }: OrderSummaryProps) {
  const totals = cartTotals(items)
  const dates = deliveryWindow(items)
  const row = 'flex justify-between gap-4 py-1.5'
  return (
    <aside className="rounded-lg border border-border bg-white px-6 py-5 lg:sticky lg:top-[calc(var(--sz-header-height)+1.5rem)]">
      <h2 className="text-lg font-bold tracking-tight text-navy-900">{copy.title}</h2>
      <dl className="mt-3 text-[15px]">
        <div className={row}>
          <dt className="text-text-muted">{copy.subtotal}</dt>
          <dd className="tabular-nums">{formatPartPrice(totals.subtotal)}</dd>
        </div>
        <div className={row}>
          <dt className="text-text-muted">{copy.freight}</dt>
          <dd className="tabular-nums">
            {totals.freight === 0 ? copy.freeFreight : formatPartPrice(totals.freight)}
          </dd>
        </div>
        <div className={row}>
          <dt className="text-text-muted">{copy.vat}</dt>
          <dd className="tabular-nums">{formatPartPrice(totals.vat)}</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-border pt-3">
          <dt className="font-semibold text-navy-900">{copy.total}</dt>
          <dd className="text-2xl font-bold tracking-tight text-navy-900 tabular-nums">
            {formatPartPrice(totals.total)}
          </dd>
        </div>
      </dl>
      {totals.freight > 0 && <p className="mt-1 text-xs text-text-subtle">{copy.freeFrom}</p>}

      <div className="mt-5 rounded-md bg-surface-subtle px-4 py-3">
        <p className="text-sm font-semibold text-navy-900">{copy.delivery}</p>
        <p className="mt-0.5 text-[15px] text-navy-900 tabular-nums">
          {dates.earliest === dates.latest
            ? formatDate(dates.latest)
            : copy.between(formatDate(dates.earliest), formatDate(dates.latest))}
        </p>
        <p className="mt-1 text-xs text-text-muted">{copy.deliveryNote}</p>
      </div>

      {children && <div className="mt-5">{children}</div>}
    </aside>
  )
}
