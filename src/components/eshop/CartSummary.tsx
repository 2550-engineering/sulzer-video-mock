import type { ReactNode } from 'react'
import { cartCopy as copy } from '../../data/eshop'
import type { cartTotals } from '../../lib/pricing'
import { formatMoney } from '../../lib/selfService'

type CartSummaryProps = {
  totals: ReturnType<typeof cartTotals>
  /** Null before a delivery option is chosen: "At checkout". */
  shipping: number | null
  /** Buttons under the total. */
  children?: ReactNode
  /** Above the totals, e.g. the lines at checkout. */
  before?: ReactNode
}

const row = 'flex items-baseline justify-between gap-6'

/** Subtotal, partner discount, shipping and total, in a white card. */
export function CartSummary({ totals, shipping, children, before }: CartSummaryProps) {
  return (
    <section
      aria-labelledby="cart-summary-title"
      className="rounded-lg border border-border bg-white px-6 py-6 shadow-card"
    >
      <h2 id="cart-summary-title" className="text-xl font-bold tracking-tight text-navy-900">
        {copy.summary.title}
      </h2>
      {before}
      <dl className="mt-5 space-y-2.5 text-[15px] tabular-nums">
        {totals.discount > 0 && (
          <>
            <div className={row}>
              <dt className="text-text-muted">{copy.summary.list}</dt>
              <dd className="text-text-muted">{formatMoney(totals.list)}</dd>
            </div>
            <div className={row}>
              <dt className="text-success-strong">
                {copy.summary.discount(totals.discountPercent)}
              </dt>
              <dd className="font-semibold text-success-strong">−{formatMoney(totals.discount)}</dd>
            </div>
          </>
        )}
        <div className={row}>
          <dt className="text-text-muted">{copy.summary.subtotal}</dt>
          <dd className="text-navy-900">{formatMoney(totals.net)}</dd>
        </div>
        <div className={row}>
          <dt className="text-text-muted">{copy.summary.shipping}</dt>
          <dd className="text-navy-900">
            {shipping === null
              ? copy.summary.shippingLater
              : shipping === 0
                ? copy.summary.free
                : formatMoney(shipping)}
          </dd>
        </div>
        <div className={`${row} mt-4 border-t border-border pt-4`}>
          <dt className="font-semibold text-navy-900">{copy.summary.total}</dt>
          <dd className="text-2xl font-bold tracking-tight text-navy-900">
            {formatMoney(totals.net + (shipping ?? 0))}
          </dd>
        </div>
      </dl>
      <p className="mt-1 text-right text-xs text-text-muted">{copy.summary.vat}</p>
      {children && <div className="mt-6 flex flex-col gap-2.5">{children}</div>}
    </section>
  )
}
