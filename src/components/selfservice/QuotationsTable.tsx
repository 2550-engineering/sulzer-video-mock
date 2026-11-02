import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { demoClock } from '../../config/demo'
import { customers } from '../../data/assets'
import { quotationPath, quotationStatus, quotationsPage as copy } from '../../data/selfServicePages'
import { daysBetween, formatDate, formatDateTime } from '../../lib/format'
import { formatMoney, quotationTotals } from '../../lib/selfService'
import type { Quotation } from '../../types'
import { StatusPill } from './StatusPill'

const head = 'border-b border-border bg-surface-sunken px-5 py-3 text-left font-semibold'
const cell = 'border-b border-border px-5 py-4 align-top group-last:border-b-0'

/** A quotation runs short when it expires within two weeks. */
const shortDays = 14

type QuotationsTableProps = {
  quotations: Quotation[]
  showCustomer: boolean
}

/** Quotations: number and title, dates, status, total and the latest update. Rows open the quotation. */
export function QuotationsTable({ quotations, showCustomer }: QuotationsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[60rem] border-separate border-spacing-0 text-[15px]">
        <thead className="text-sm text-navy-900">
          <tr>
            <th scope="col" className={head}>
              {copy.table.quotation}
            </th>
            {showCustomer && (
              <th scope="col" className={head}>
                {copy.table.customer}
              </th>
            )}
            <th scope="col" className={head}>
              {copy.table.issued}
            </th>
            <th scope="col" className={head}>
              {copy.table.validUntil}
            </th>
            <th scope="col" className={head}>
              {copy.table.status}
            </th>
            <th scope="col" className={`${head} text-right`}>
              {copy.table.total}
            </th>
            <th scope="col" className={head}>
              {copy.table.updated}
            </th>
            <th scope="col" className={`${head} w-10`}>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((quotation) => {
            const daysLeft =
              quotation.validUntil && quotation.status === 'Sent'
                ? daysBetween(demoClock.today, quotation.validUntil)
                : undefined
            return (
              <tr
                key={quotation.id}
                className="group relative animate-fade-in transition-colors hover:bg-surface-subtle"
              >
                <td className={cell}>
                  <Link
                    to={quotationPath(quotation.id)}
                    className="font-bold text-navy-900 tabular-nums transition-colors group-hover:text-primary after:absolute after:inset-0"
                  >
                    {quotation.id}
                  </Link>
                  <p className="mt-0.5 text-[15px] text-navy-900">{quotation.title}</p>
                  <p className="text-sm text-text-muted">{quotation.yourReference}</p>
                </td>
                {showCustomer && (
                  <td className={cell}>
                    {customers.find((c) => c.id === quotation.customerId)?.name}
                  </td>
                )}
                <td className={`${cell} whitespace-nowrap tabular-nums`}>
                  {quotation.issuedOn ? (
                    formatDate(quotation.issuedOn)
                  ) : (
                    <span className="text-text-muted">{copy.notYet}</span>
                  )}
                </td>
                <td className={`${cell} whitespace-nowrap tabular-nums`}>
                  {quotation.validUntil && formatDate(quotation.validUntil)}
                  {daysLeft !== undefined && (
                    <p
                      className={`text-sm ${daysLeft <= shortDays ? 'font-semibold text-warning-strong' : 'text-text-muted'}`}
                    >
                      {copy.daysLeft(daysLeft)}
                    </p>
                  )}
                </td>
                <td className={cell}>
                  <StatusPill {...quotationStatus[quotation.status]} />
                </td>
                <td
                  className={`${cell} text-right font-semibold whitespace-nowrap text-navy-900 tabular-nums`}
                >
                  {quotation.lines.length > 0 && formatMoney(quotationTotals(quotation).net)}
                </td>
                <td className={`${cell} max-w-64 text-sm`}>
                  <p className="font-medium text-navy-900">
                    {formatDateTime(quotation.updated.at, demoClock.today)}
                  </p>
                  <p className="text-text-muted">{quotation.updated.text}</p>
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
