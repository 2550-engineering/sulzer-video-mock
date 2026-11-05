import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AssetSummaryStrip, type SummaryTile } from '../components/assets/AssetSummaryStrip'
import { QuotationsTable } from '../components/selfservice/QuotationsTable'
import { SelfServicePageHeader } from '../components/selfservice/SelfServicePageHeader'
import { signedOutRedirect } from '../data/myPages'
import { quotationsPage as copy } from '../data/selfServicePages'
import { useUrlParams } from '../hooks/useUrlParams'
import { quotationsFor } from '../lib/selfService'
import { useSelfService } from '../selfService/useSelfService'
import type { SalesQuotation } from '../types'

const filters = {
  open: (q: SalesQuotation) =>
    q.status === 'Sent' || q.status === 'Requested' || q.status === 'Draft',
  accepted: (q: SalesQuotation) => q.status === 'Accepted',
  expired: (q: SalesQuotation) => q.status === 'Expired',
} satisfies Record<string, (q: SalesQuotation) => boolean>

type Filter = keyof typeof filters

const isFilter = (value: string | null): value is Filter =>
  value !== null && Object.hasOwn(filters, value)

/**
 * Quotations: /self-service/quotations. Signed-in only. Summary tiles (each a
 * filter) and the quotations, most recently updated first. End users see Sulzer's
 * quotations; partners see the ones they sent their customers.
 */
export function QuotationsPage() {
  const { user } = useAuth()
  const [params, update] = useUrlParams()
  const { quotations } = useSelfService()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const partner = user.kind === 'partner'
  const all = quotationsFor(user, quotations).sort((a, b) =>
    b.updated.at.localeCompare(a.updated.at),
  )
  const status = params.get('status')
  const filter = isFilter(status) ? status : null
  const shown = filter ? all.filter(filters[filter]) : all

  const select = (value: Filter | null) =>
    update((next) =>
      value && value !== filter ? next.set('status', value) : next.delete('status'),
    )

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
      active: !filter,
      onSelect: () => select(null),
    },
    tile('open', 'info'),
    tile('accepted', 'neutral'),
    tile('expired', 'neutral'),
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
        <div className="mt-8">
          <QuotationsTable quotations={shown} showCustomer={partner} />
        </div>
      </div>
    </div>
  )
}
