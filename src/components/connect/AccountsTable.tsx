import { ChevronDown, UserPlus, Users } from 'lucide-react'
import { Fragment, useState } from 'react'
import { customers } from '../../data/assets'
import { accountUserCounts, assetsPage as copy, needAttention } from '../../data/connect'
import { needsAttention } from '../../lib/assetSummary'
import { useToast } from '../../toast/useToast'
import type { Asset } from '../../types'
import { AssetMonitorTable } from './AssetMonitorTable'

const columns =
  'grid-cols-[2rem_minmax(14rem,1.4fr)_minmax(12rem,1.2fr)_minmax(11rem,1fr)_9rem_7rem]'

type AccountsTableProps = {
  /** Connected assets across the accounts that match the search. */
  assets: Asset[]
  /** Account ids to list. */
  accountIds: string[]
  /** Accounts open on first render. */
  defaultOpen: string[]
}

/**
 * The partner's (or service provider's) customer accounts: Name, Contact
 * person, Invite and manage users, Customer number, Actions. A row expands
 * to that account's connected assets.
 */
export function AccountsTable({ assets, accountIds, defaultOpen }: AccountsTableProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen)
  const showToast = useToast()
  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    )

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[64rem]">
        <div
          className={`grid items-center gap-x-5 border-y border-white/10 bg-white/[0.04] px-6 py-3 text-[13px] font-semibold text-text-on-dark ${columns}`}
        >
          <span />
          <span>{copy.accountColumns.name}</span>
          <span>{copy.accountColumns.contact}</span>
          <span>{copy.accountColumns.users}</span>
          <span>{copy.accountColumns.customerNumber}</span>
          <span>{copy.accountColumns.actions}</span>
        </div>
        <ul className="divide-y divide-white/[0.07]">
          {customers
            .filter((customer) => accountIds.includes(customer.id))
            .map((customer) => {
              const own = assets.filter((asset) => asset.customerId === customer.id)
              const attention = own.filter(needsAttention).length
              const users = accountUserCounts[customer.id] ?? 0
              const expanded = open.includes(customer.id)
              const invite = () => showToast({ message: copy.invited(customer.name) })
              return (
                <Fragment key={customer.id}>
                  <li
                    className={`grid items-center gap-x-5 px-6 py-4 text-sm transition-colors ${columns} ${
                      expanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-label={customer.name}
                      onClick={() => toggle(customer.id)}
                      disabled={own.length === 0}
                      className="flex size-8 items-center justify-center rounded-full text-text-on-dark transition-colors hover:bg-white/10 disabled:opacity-30"
                    >
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`}
                      />
                    </button>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{customer.name}</p>
                      <p className="mt-0.5 truncate text-[13px] text-text-on-dark-muted">
                        {own.length > 0 ? (
                          <>
                            {customer.city} · {copy.siteSummary(own.length, 0)}
                            {attention > 0 && (
                              <span className="font-semibold text-warning-on-dark">
                                {' '}
                                · {needAttention(attention)}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {customer.city} · {copy.noAssets}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-white">{customer.contact.name}</p>
                      <p className="truncate text-[13px] text-text-on-dark-muted">
                        {customer.contact.email}
                      </p>
                    </div>
                    <div>
                      {users > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            showToast({ message: copy.usersToast(customer.name, users) })
                          }
                          className="inline-flex h-9 items-center gap-2 rounded-pill border border-white/20 px-4 text-[13px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                        >
                          <Users className="size-4" />
                          {copy.manageUsers(users)}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={invite}
                          className="inline-flex h-9 items-center gap-2 rounded-pill border border-primary-on-dark/50 px-4 text-[13px] font-semibold text-primary-on-dark transition-colors hover:bg-primary-on-dark/10"
                        >
                          <UserPlus className="size-4" />
                          {copy.inviteAccount}
                        </button>
                      )}
                    </div>
                    <p className="text-text-on-dark tabular-nums">{customer.customerNumber}</p>
                    <div>
                      {own.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggle(customer.id)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-pill bg-primary px-4 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
                        >
                          {expanded ? copy.close : copy.open}
                        </button>
                      )}
                    </div>
                  </li>
                  {expanded && own.length > 0 && (
                    <li className="animate-fade-in bg-navy-900/60 py-2 pl-10">
                      <AssetMonitorTable assets={own} />
                    </li>
                  )}
                </Fragment>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
