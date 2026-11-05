import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AlertRow } from '../components/connect/AlertRow'
import { ConnectPageHeader } from '../components/connect/ConnectPageHeader'
import { ConnectPanel } from '../components/connect/ConnectPanel'
import { FleetStatusDonut } from '../components/connect/FleetStatusDonut'
import { RunHoursChart } from '../components/connect/RunHoursChart'
import { SiteStatusList } from '../components/connect/SiteStatusList'
import { useConnect } from '../connect/useConnect'
import { connectApp, dashboardPage as copy } from '../data/connect'
import { healthScore, runHoursByDay } from '../lib/connect'
import { groupThousands } from '../lib/format'

const linkClass =
  'group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-on-dark transition-colors hover:text-white'

/** Fleet at a glance: /connect/dashboard. Status donut, active alerts, sites and run hours this week. */
export function ConnectDashboardPage() {
  const { user } = useAuth()
  const { assets, alerts, acknowledgedBy, acknowledge } = useConnect()
  const connected = assets.filter((asset) => asset.connected)
  const counts = {
    ok: connected.filter((a) => a.status === 'ok').length,
    warning: connected.filter((a) => a.status === 'warning').length,
    alarm: connected.filter((a) => a.status === 'alarm').length,
  }
  const scores = connected.map((asset) => healthScore(asset) ?? 0)
  const average = Math.round(scores.reduce((sum, s) => sum + s, 0) / Math.max(scores.length, 1))
  const active = alerts.filter((alert) => alert.active)
  const week = runHoursByDay(connected)
  const weekTotal = week.reduce((sum, d) => sum + d.hours, 0)

  return (
    <div className="mx-auto max-w-[1680px] px-10 pt-8 pb-16 max-xl:px-6 max-md:px-4 max-md:pt-6">
      <title>{`${copy.title} – ${connectApp.name}`}</title>

      <ConnectPageHeader
        title={copy.greeting(user!.firstName)}
        subtitle={`${copy.title} · ${user!.company} · ${connectApp.synced}`}
        actions={
          <dl className="flex gap-8 text-right max-md:gap-6 max-md:text-left">
            <div>
              <dt className="text-xs text-text-on-dark-muted">{copy.status.connected}</dt>
              <dd className="text-2xl font-bold text-white tabular-nums">
                {connected.length}
                <span className="text-base font-medium text-text-on-dark-muted">
                  /{assets.length}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text-on-dark-muted">{copy.status.average}</dt>
              <dd className="text-2xl font-bold text-white tabular-nums">{average}</dd>
            </div>
          </dl>
        }
      />

      <div className="mt-8 grid gap-6 max-md:mt-6 max-md:grid-cols-1 max-md:gap-4 md:max-xl:grid-flow-row-dense md:max-xl:grid-cols-2 xl:grid-cols-3">
        <ConnectPanel title={copy.status.title}>
          <FleetStatusDonut
            counts={counts}
            centerValue={String(connected.length)}
            centerLabel={copy.status.connected}
          />
        </ConnectPanel>

        <ConnectPanel
          title={copy.alerts.title}
          actions={
            <Link to="/connect/alerts" className={linkClass}>
              {copy.alerts.viewAll}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
          flush
          className="md:max-xl:col-span-2 xl:col-span-2"
        >
          {active.length > 0 ? (
            <ul className="mt-3 divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {active.map((alert) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  acknowledgedBy={acknowledgedBy[alert.id]}
                  onAcknowledge={() => acknowledge(alert.id)}
                />
              ))}
            </ul>
          ) : (
            <p className="px-6 py-8 text-text-on-dark-muted">{copy.alerts.none}</p>
          )}
        </ConnectPanel>

        <ConnectPanel title={copy.sites.title} flush>
          <div className="mt-3 border-t border-white/[0.07]">
            <SiteStatusList assets={connected} />
          </div>
        </ConnectPanel>

        <ConnectPanel
          title={copy.runHours.title}
          subtitle={copy.runHours.subtitle}
          actions={
            <p className="text-sm font-semibold text-white tabular-nums">
              {copy.runHours.total(groupThousands(weekTotal))}
            </p>
          }
          className="md:max-xl:col-span-2 xl:col-span-2"
        >
          <RunHoursChart days={week} />
        </ConnectPanel>
      </div>
    </div>
  )
}
