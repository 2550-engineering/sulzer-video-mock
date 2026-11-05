import { Search, SearchX } from 'lucide-react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AssetSummaryStrip, type SummaryTile } from '../components/assets/AssetSummaryStrip'
import { CustomerAccountRow } from '../components/partner/CustomerAccountRow'
import { SelfServicePageHeader } from '../components/selfservice/SelfServicePageHeader'
import { signedOutRedirect } from '../data/myPages'
import { customersPage as copy } from '../data/partner'
import { useUrlParams } from '../hooks/useUrlParams'
import { customerSummaries, type CustomerSummary } from '../lib/partner'
import { useSelfService } from '../selfService/useSelfService'

type Filter = (typeof copy.filters)[number]

const filters: Record<Filter, (s: CustomerSummary) => boolean> = {
  connected: (s) => s.connected > 0,
  attention: (s) => s.needsAttention > 0,
  requests: (s) => s.openRequests > 0,
}

const isFilter = (value: string | null): value is Filter =>
  value !== null && Object.hasOwn(filters, value)

const columns =
  'grid-cols-[minmax(24rem,2.4fr)_4rem_8.5rem_minmax(10rem,1fr)_6.5rem_minmax(11rem,1fr)_1rem]'

/**
 * My customers: /partner/customers. Partners only. Summary tiles (each a filter, in the
 * URL so My Pages can link to ?status=attention), search, and the customer accounts,
 * those that need attention first.
 */
export function PartnerCustomersPage() {
  const { user } = useAuth()
  const { requests } = useSelfService()
  const [params, update] = useUrlParams()
  if (!user) return <Navigate to={signedOutRedirect} replace />
  if (user.kind !== 'partner') return <Navigate to="/my-pages" replace />

  const all = customerSummaries(requests)
  const status = params.get('status')
  const filter = isFilter(status) ? status : null
  const query = params.get('q') ?? ''
  const q = query.trim().toLowerCase()
  const shown = all
    .filter((s) => !filter || filters[filter](s))
    .filter(
      ({ customer }) =>
        !q ||
        [customer.name, customer.city, customer.customerNumber, customer.industry].some((text) =>
          text.toLowerCase().includes(q),
        ),
    )

  const sum = (pick: (s: CustomerSummary) => number) => all.reduce((n, s) => n + pick(s), 0)
  const select = (value: Filter | null) =>
    update((next) =>
      value && value !== filter ? next.set('status', value) : next.delete('status'),
    )
  const tile = (id: Filter, value: number, tone: SummaryTile['tone']) => ({
    id,
    value,
    tone,
    active: filter === id,
    onSelect: () => select(id),
  })
  const requestCount = sum((s) => s.openRequests)
  const attentionCount = all.filter(filters.attention).length

  const tiles: SummaryTile[] = [
    {
      id: 'all',
      value: all.length,
      ...copy.summary.customers,
      detail: copy.summary.customers.detail(
        sum((s) => s.sites),
        sum((s) => s.total),
      ),
      tone: 'neutral',
      active: !filter,
      onSelect: () => select(null),
    },
    {
      ...tile('connected', all.filter(filters.connected).length, 'info'),
      ...copy.summary.connected,
    },
    {
      ...tile('attention', attentionCount, 'warning'),
      ...copy.summary.attention,
      label: copy.summary.attention.label(attentionCount),
    },
    {
      ...tile('requests', requestCount, 'info'),
      ...copy.summary.requests,
      label: copy.summary.requests.label(requestCount),
    },
  ]

  return (
    <div className="bg-surface-muted">
      <title>{`${copy.title} | mySulzer | Sulzer`}</title>
      <SelfServicePageHeader
        breadcrumb={[...copy.breadcrumb, { label: copy.title }]}
        eyebrow={user.company}
        title={copy.title}
        description={copy.description}
      />

      <div className="site-container pt-10 pb-24">
        <AssetSummaryStrip
          label={copy.summary.label}
          tiles={tiles}
          columns="sm:grid-cols-2 xl:grid-cols-4"
        />

        <div className="mt-8 mb-4 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="relative w-full max-w-sm">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-subtle"
            />
            <input
              type="search"
              value={query}
              onChange={(e) =>
                update((next) =>
                  e.target.value ? next.set('q', e.target.value) : next.delete('q'),
                )
              }
              placeholder={copy.search}
              aria-label={copy.search}
              className="h-11 w-full rounded-pill border border-border-strong bg-white pr-4 pl-10 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
            />
          </div>
          <p className="text-sm font-semibold text-navy-900 tabular-nums" aria-live="polite">
            {copy.count(shown.length, all.length)}
          </p>
        </div>

        {shown.length === 0 ? (
          <div className="flex animate-fade-in flex-col items-center rounded-lg border border-border bg-white px-8 py-16 text-center">
            <SearchX aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-semibold text-navy-900">{copy.noResults.title}</p>
            <button
              type="button"
              onClick={() =>
                update((next) => {
                  next.delete('status')
                  next.delete('q')
                })
              }
              className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {copy.noResults.action}
            </button>
          </div>
        ) : (
          <div className="animate-fade-in overflow-x-auto rounded-lg border border-border bg-white">
            <div className="min-w-[68rem] max-md:min-w-0">
              <div
                aria-hidden
                className={`grid gap-x-6 border-b border-border bg-surface-sunken px-6 py-3 text-sm font-semibold text-navy-900 max-md:hidden ${columns}`}
              >
                <span>{copy.columns.customer}</span>
                <span>{copy.columns.sites}</span>
                <span>{copy.columns.assets}</span>
                <span>{copy.columns.alerts}</span>
                <span>{copy.columns.requests}</span>
                <span>{copy.columns.manager}</span>
                <span />
              </div>
              <ul className="divide-y divide-border">
                {shown.map((summary) => (
                  <CustomerAccountRow
                    key={summary.customer.id}
                    summary={summary}
                    columns={columns}
                    userName={user.name}
                  />
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
