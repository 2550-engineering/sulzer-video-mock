import { conditionLimits } from '../../config/demo'
import { channels } from '../../data/assetPages'
import { conditionFindings, customers, siteById, sites } from '../../data/assets'
import { reportsPage, statusNames } from '../../data/connect'
import { needsAttention } from '../../lib/assetSummary'
import { statusOrder } from '../../lib/assetList'
import { conditionSeries } from '../../lib/conditionData'
import { alertsFor, healthScore } from '../../lib/connect'
import { groupThousands } from '../../lib/format'
import { statusTones } from '../../lib/statusTones'
import type { Asset } from '../../types'
import { Sparkline } from '../assets/Sparkline'
import { SulzerLogo } from '../SulzerLogo'

const copy = reportsPage.report

/** First page of the monthly condition report, as a white A4-style sheet. Every figure comes from the condition data. */
export function ReportPreview({ assets }: { assets: Asset[] }) {
  const connected = assets.filter((asset) => asset.connected)
  const customer = customers.find((c) => c.id === connected[0]?.customerId)
  const samples = connected.flatMap((asset) => conditionSeries(asset.id) ?? [])
  const runHours = samples.filter((point) => point.running).length
  const alerts = alertsFor(connected).length
  const scores = connected.map((asset) => healthScore(asset) ?? 0)
  const average = Math.round(scores.reduce((s, v) => s + v, 0) / Math.max(scores.length, 1))
  const attention = connected.filter(needsAttention)
  const trendAsset = attention.find((asset) => conditionFindings[asset.id]?.channel === 'vibration')
  const trend = trendAsset && conditionSeries(trendAsset.id)

  const kpis = [
    { label: copy.kpis.monitored, value: String(connected.length) },
    { label: copy.kpis.runHours, value: `${groupThousands(runHours)} h` },
    { label: copy.kpis.alerts, value: String(alerts) },
    { label: copy.kpis.health, value: `${average}/100` },
  ]

  return (
    <article className="mx-auto w-full max-w-[860px] animate-fade-in rounded-sm bg-white px-14 py-12 text-text shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
      <header className="flex items-start justify-between gap-8 border-b-2 border-brand pb-6">
        <div>
          <SulzerLogo className="h-6" />
          <h2 className="mt-6 text-[1.75rem] leading-tight font-bold tracking-tight text-brand">
            {copy.title}
          </h2>
          <p className="mt-1 text-text-muted">{copy.period}</p>
        </div>
        <dl className="text-right text-sm">
          <dt className="text-text-muted">{copy.preparedFor}</dt>
          <dd className="font-semibold text-navy-900">{customer?.name}</dd>
          <dd className="text-text-muted">{customer?.customerNumber}</dd>
          <dd className="mt-3 text-xs text-text-subtle">{copy.generated}</dd>
        </dl>
      </header>

      <h3 className="mt-8 text-xs font-bold tracking-[0.12em] text-text-muted uppercase">
        {copy.summary}
      </h3>
      <dl className="mt-3 grid grid-cols-4 divide-x divide-border rounded-md border border-border">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="px-4 py-3">
            <dt className="text-xs text-text-muted">{kpi.label}</dt>
            <dd className="mt-1 text-xl font-bold text-navy-900 tabular-nums">{kpi.value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-8 text-xs font-bold tracking-[0.12em] text-text-muted uppercase">
        {copy.attention}
      </h3>
      <table className="mt-3 w-full text-left text-sm">
        <thead className="border-b border-border-strong text-xs text-text-muted">
          <tr>
            {Object.values(copy.columns).map((column) => (
              <th key={column} scope="col" className="py-2 pr-4 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {attention.map((asset) => {
            const finding = conditionFindings[asset.id]
            return (
              <tr key={asset.id}>
                <td className="py-2.5 pr-4 whitespace-nowrap">
                  <span className="flex items-center gap-2 font-semibold text-navy-900">
                    <span className={`size-2 rounded-full ${statusTones[asset.status].dot}`} />
                    {asset.tag}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-text-muted">{siteById(asset.siteId)?.name}</td>
                <td className="py-2.5 pr-4 text-navy-900">{finding?.title}</td>
                <td className="py-2.5 font-semibold text-navy-900">{finding?.action}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {trendAsset && trend && (
        <div className="mt-8 rounded-md border border-border px-5 py-4">
          <p className="flex justify-between text-sm">
            <span className="font-semibold text-navy-900">{copy.trend(trendAsset.tag)}</span>
            <span className="text-text-muted tabular-nums">
              {channels.vibration.label} {trend[trend.length - 1].vibration.toFixed(1)}{' '}
              {channels.vibration.unit}
            </span>
          </p>
          <Sparkline
            values={trend.map((point) => point.vibration)}
            status={trendAsset.status}
            limits={[{ value: conditionLimits.vibration.warning, status: 'warning' }]}
            className="mt-3 h-20"
          />
        </div>
      )}

      <h3 className="mt-8 text-xs font-bold tracking-[0.12em] text-text-muted uppercase">
        {copy.sites}
      </h3>
      <table className="mt-3 w-full text-left text-sm">
        <thead className="border-b border-border-strong text-xs text-text-muted">
          <tr>
            {Object.values(copy.siteColumns).map((column, i) => (
              <th
                key={column}
                scope="col"
                className={`py-2 font-semibold ${i > 0 ? 'text-right' : ''}`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sites
            .map((site) => ({ site, own: connected.filter((asset) => asset.siteId === site.id) }))
            .filter(({ own }) => own.length > 0)
            .map(({ site, own }) => {
              const hours = own.reduce(
                (sum, asset) =>
                  sum + (conditionSeries(asset.id)?.filter((p) => p.running).length ?? 0),
                0,
              )
              const worst =
                statusOrder.find((status) => own.some((asset) => asset.status === status)) ?? 'ok'
              return (
                <tr key={site.id}>
                  <td className="py-2.5 font-medium text-navy-900">{site.name}</td>
                  <td className="py-2.5 text-right tabular-nums">{own.length}</td>
                  <td className="py-2.5 text-right tabular-nums">{groupThousands(hours)} h</td>
                  <td className="py-2.5 text-right">
                    <span
                      className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${statusTones[worst].chip}`}
                    >
                      {statusNames[worst]}
                    </span>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>

      <footer className="mt-10 flex justify-between border-t border-border pt-4 text-xs text-text-subtle">
        <span>{copy.footer}</span>
        <span>{copy.page}</span>
      </footer>
    </article>
  )
}
