import { Link } from 'react-router'
import { assetById } from '../../data/assets'
import { orderPage } from '../../data/selfServicePages'
import { formatMoney, netPrice, orderTotals } from '../../lib/selfService'
import type { Order } from '../../types'

const copy = orderPage.lines

const head = 'border-b border-border bg-surface-sunken px-4 py-3 text-left font-semibold'
const cell = 'border-b border-border px-4 py-3.5 align-top'

/** The order's lines with unit and line prices (net of the order discount), then the totals. */
export function OrderLinesTable({ order }: { order: Order }) {
  const totals = orderTotals(order)
  const discounted = order.discount > 0
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-white">
      <h2 className="px-6 pt-5 pb-4 text-lg font-bold text-navy-900">
        {copy.title} <span className="font-normal text-text-muted">({totals.items})</span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-[15px]">
          <thead className="text-sm text-navy-900">
            <tr>
              <th scope="col" className={`${head} pl-6`}>
                {copy.position}
              </th>
              <th scope="col" className={head}>
                {copy.partNumber}
              </th>
              <th scope="col" className={head}>
                {copy.description}
              </th>
              <th scope="col" className={`${head} text-right`}>
                {copy.quantity}
              </th>
              <th scope="col" className={`${head} text-right`}>
                {copy.unitPrice}
              </th>
              <th scope="col" className={`${head} pr-6 text-right`}>
                {copy.amount}
              </th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line) => {
              const asset = line.assetId ? assetById(line.assetId) : undefined
              const unit = netPrice(line.listPrice, order.discount)
              return (
                <tr key={line.position}>
                  <td className={`${cell} pl-6 text-text-muted tabular-nums`}>{line.position}</td>
                  <td className={`${cell} font-medium text-navy-900 tabular-nums`}>
                    {line.partNumber}
                  </td>
                  <td className={cell}>
                    {line.description}
                    {asset && (
                      <p className="mt-0.5 text-sm text-text-muted">
                        {copy.forAsset}{' '}
                        <Link
                          to={`/assets/${asset.id}`}
                          className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                        >
                          {asset.tag}
                        </Link>
                      </p>
                    )}
                  </td>
                  <td className={`${cell} text-right tabular-nums`}>{line.quantity}</td>
                  <td className={`${cell} text-right whitespace-nowrap tabular-nums`}>
                    {formatMoney(unit)}
                    {discounted && (
                      <p className="text-sm text-text-subtle line-through">
                        {formatMoney(line.listPrice)}
                      </p>
                    )}
                  </td>
                  <td
                    className={`${cell} pr-6 text-right font-semibold whitespace-nowrap text-navy-900 tabular-nums`}
                  >
                    {formatMoney(unit * line.quantity)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <dl className="ml-auto max-w-sm space-y-2 px-6 py-5 text-[15px]">
        {discounted && (
          <>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">{copy.subtotal}</dt>
              <dd className="tabular-nums">{formatMoney(totals.list)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">
                {copy.discount(order.discount, order.channel === 'partner')}
              </dt>
              <dd className="text-success-strong tabular-nums">−{formatMoney(totals.discount)}</dd>
            </div>
          </>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">{copy.shipping}</dt>
          <dd className="tabular-nums">
            {totals.shipping ? formatMoney(totals.shipping) : copy.freeShipping}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-3 text-lg font-bold text-navy-900">
          <dt>{copy.total}</dt>
          <dd className="tabular-nums">{formatMoney(totals.total)}</dd>
        </div>
      </dl>
    </section>
  )
}
