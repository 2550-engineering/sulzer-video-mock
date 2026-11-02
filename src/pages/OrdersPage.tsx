import { Search, SearchX } from 'lucide-react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AssetSummaryStrip, type SummaryTile } from '../components/assets/AssetSummaryStrip'
import { OrdersTable } from '../components/selfservice/OrdersTable'
import { SelfServicePageHeader } from '../components/selfservice/SelfServicePageHeader'
import { demoClock } from '../config/demo'
import { signedOutRedirect } from '../data/myPages'
import { ordersPage as copy } from '../data/selfServicePages'
import { useUrlParams } from '../hooks/useUrlParams'
import { daysBetween } from '../lib/format'
import { isInTransit, isOpenOrder, ordersFor } from '../lib/selfService'
import { useSelfService } from '../selfService/useSelfService'
import type { Order } from '../types'

const filters = {
  open: isOpenOrder,
  transit: isInTransit,
  delivered: (order: Order) =>
    order.status === 'Delivered' && daysBetween(order.expectedDelivery, demoClock.today) <= 90,
} satisfies Record<string, (order: Order) => boolean>

type Filter = keyof typeof filters

const isFilter = (value: string | null): value is Filter =>
  value !== null && Object.hasOwn(filters, value)

function matches(order: Order, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [order.id, order.poNumber, ...order.lines.flatMap((l) => [l.partNumber, l.description])]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

/**
 * Orders: /self-service/orders. Signed-in only. Summary tiles (each a filter),
 * search, and the orders table, newest first. Orders placed at checkout appear
 * on top. Partners see the orders they placed for their customers.
 */
export function OrdersPage() {
  const { user } = useAuth()
  const { orders } = useSelfService()
  const [params, update] = useUrlParams()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const partner = user.kind === 'partner'
  const all = ordersFor(user, orders).sort((a, b) => b.placedAt.localeCompare(a.placedAt))
  const status = params.get('status')
  const filter = isFilter(status) ? status : null
  const query = params.get('q') ?? ''
  const shown = all.filter((order) => (!filter || filters[filter](order)) && matches(order, query))

  const select = (value: Filter | null) =>
    update((next) => {
      next.delete('q')
      if (value && value !== filter) next.set('status', value)
      else next.delete('status')
    })

  const tile = (id: Filter, tone: SummaryTile['tone']): SummaryTile => ({
    id,
    value: all.filter(filters[id]).length,
    ...copy.summary[id],
    tone,
    active: filter === id,
    onSelect: () => select(id),
  })

  const tiles: SummaryTile[] = [
    {
      id: 'all',
      value: all.length,
      ...copy.summary.all,
      tone: 'neutral',
      active: !filter && !query,
      onSelect: () => select(null),
    },
    tile('open', 'neutral'),
    tile('transit', 'info'),
    tile('delivered', 'neutral'),
  ]

  return (
    <div className="bg-surface-muted">
      <title>{`${copy.title} | mySulzer | Sulzer`}</title>
      <SelfServicePageHeader
        breadcrumb={[...copy.breadcrumb, { label: copy.title }]}
        eyebrow={user.company}
        title={copy.title}
        description={partner ? copy.partnerDescription : copy.description}
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
            <p className="mt-1 text-text-muted">{copy.noResults.text}</p>
            <button
              type="button"
              onClick={() => select(null)}
              className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {copy.noResults.action}
            </button>
          </div>
        ) : (
          <OrdersTable orders={shown} showCustomer={partner} />
        )}
      </div>
    </div>
  )
}
