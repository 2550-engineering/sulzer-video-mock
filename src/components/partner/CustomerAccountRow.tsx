import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { customersPage as copy, partnerCustomerPath } from '../../data/partner'
import type { CustomerSummary } from '../../lib/partner'
import { Avatar } from '../Avatar'
import { CustomerLogo } from '../CustomerLogo'

type CustomerAccountRowProps = {
  summary: CustomerSummary
  /** Grid template shared with the header row. */
  columns: string
  /** The signed-in partner, shown as "You" when they manage the account. */
  userName: string
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')

/**
 * One customer account: wordmark, name, sites, assets, open alerts, open requests and
 * the partner's account manager. The whole row opens the customer page.
 */
export function CustomerAccountRow({ summary, columns, userName }: CustomerAccountRowProps) {
  const { customer, account, sites, total, connected, alarms, warnings, openRequests } = summary
  const attention = alarms + warnings > 0
  const manager = account.accountManager

  return (
    <li
      className={`group relative grid items-center gap-x-6 px-6 py-5 transition-colors duration-150 hover:bg-surface-subtle ${columns} ${
        attention ? 'bg-warning-tint/40' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-5">
        <span className="flex h-14 w-44 shrink-0 items-center justify-center rounded-md border border-border bg-white px-3">
          <CustomerLogo customerId={customer.id} className="h-8 max-w-full" />
        </span>
        <div className="min-w-0">
          <Link
            to={partnerCustomerPath(customer.id)}
            aria-label={copy.open(customer.name)}
            className="font-bold text-navy-900 transition-colors group-hover:text-primary after:absolute after:inset-0"
          >
            {customer.name}
          </Link>
          <p className="mt-0.5 truncate text-sm text-text-muted">
            {customer.city} · {customer.industry}
          </p>
        </div>
      </div>

      <p className="text-[15px] font-semibold text-navy-900 tabular-nums">{sites}</p>

      <div>
        <p className="text-[15px] font-semibold text-navy-900 tabular-nums">{total}</p>
        <p className="mt-0.5 text-sm whitespace-nowrap text-text-muted">
          {connected > 0 ? copy.connected(connected) : copy.notConnected}
        </p>
      </div>

      <div>
        {attention ? (
          <span className="inline-flex items-center gap-2 rounded-pill bg-warning-tint px-3 py-1 text-sm font-semibold whitespace-nowrap text-warning-strong">
            <span aria-hidden className="size-2 rounded-full bg-warning" />
            {copy.alerts(alarms, warnings)}
          </span>
        ) : (
          <span className="text-sm text-text-muted">{copy.noAlerts}</span>
        )}
      </div>

      <p
        className={`text-[15px] tabular-nums ${openRequests ? 'font-semibold text-primary' : 'text-text-muted'}`}
      >
        {openRequests || copy.noAlerts}
      </p>

      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar initials={initials(manager)} />
        <span className="truncate text-[15px] text-navy-900">{manager}</span>
        {manager === userName && (
          <span className="rounded-sm bg-primary-tint px-1.5 py-0.5 text-xs font-semibold text-primary">
            {copy.you}
          </span>
        )}
      </div>

      <ChevronRight className="size-4 text-text-subtle transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
    </li>
  )
}
