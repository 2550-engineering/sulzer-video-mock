import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { customers } from '../../data/assets'
import { orderPath, orderStatus, ordersPage as copy } from '../../data/selfServicePages'
import { formatDate } from '../../lib/format'
import { formatMoney, orderSteps, orderTotals } from '../../lib/selfService'
import type { SalesOrder } from '../../types'
import { StatusPill } from './StatusPill'

const head = 'border-b border-border bg-surface-sunken px-5 py-3 text-left font-semibold'
const cell = 'border-b border-border px-5 py-4 align-top group-last:border-b-0'

type OrdersTableProps = {
  orders: SalesOrder[]
  showCustomer: boolean
}

/** Orders: number and PO, date, items, status with a progress bar, delivery and total. Rows open the order. */
export function OrdersTable({ orders, showCustomer }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[56rem] border-separate border-spacing-0 text-[15px]">
        <thead className="text-sm text-navy-900">
          <tr>
            <th scope="col" className={head}>
              {copy.table.order}
            </th>
            <th scope="col" className={head}>
              {copy.table.placed}
            </th>
            <th scope="col" className={head}>
              {copy.table.items}
            </th>
            {showCustomer && (
              <th scope="col" className={head}>
                {copy.table.customer}
              </th>
            )}
            <th scope="col" className={head}>
              {copy.table.status}
            </th>
            <th scope="col" className={head}>
              {copy.table.delivery}
            </th>
            <th scope="col" className={`${head} text-right`}>
              {copy.table.total}
            </th>
            <th scope="col" className={`${head} w-10`}>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const [first, ...rest] = order.lines
            const step = orderSteps.indexOf(order.status)
            const delivered = order.status === 'Delivered'
            return (
              <tr
                key={order.id}
                className="group relative animate-fade-in transition-colors hover:bg-surface-subtle"
              >
                <td className={cell}>
                  <Link
                    to={orderPath(order.id)}
                    className="font-bold text-navy-900 tabular-nums transition-colors group-hover:text-primary after:absolute after:inset-0"
                  >
                    {order.id}
                  </Link>
                  <p className="mt-0.5 text-sm text-text-muted">{order.poNumber}</p>
                </td>
                <td className={`${cell} whitespace-nowrap tabular-nums`}>
                  {formatDate(order.placedAt.slice(0, 10))}
                </td>
                <td className={`${cell} max-w-72`}>
                  <p className="truncate">
                    {first.quantity} × {first.description}
                  </p>
                  {rest.length > 0 && (
                    <p className="mt-0.5 text-sm text-text-muted">{copy.more(rest.length)}</p>
                  )}
                </td>
                {showCustomer && (
                  <td className={cell}>{customers.find((c) => c.id === order.customerId)?.name}</td>
                )}
                <td className={cell}>
                  <StatusPill {...orderStatus[order.status]} />
                  <span aria-hidden className="mt-2.5 flex w-28 gap-1">
                    {orderSteps.map((s, i) => (
                      <span
                        key={s}
                        className={`h-1 flex-1 rounded-pill ${i <= step ? (delivered ? 'bg-success' : 'bg-primary') : 'bg-border'}`}
                      />
                    ))}
                  </span>
                </td>
                <td className={`${cell} whitespace-nowrap`}>
                  <span className={delivered ? 'text-text-muted' : 'font-semibold text-navy-900'}>
                    {delivered
                      ? copy.delivered(formatDate(order.expectedDelivery))
                      : copy.expected(formatDate(order.expectedDelivery))}
                  </span>
                </td>
                <td
                  className={`${cell} text-right font-semibold whitespace-nowrap text-navy-900 tabular-nums`}
                >
                  {formatMoney(orderTotals(order).total)}
                </td>
                <td className={`${cell} text-text-subtle`}>
                  <ChevronRight className="size-5 transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
