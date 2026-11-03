import { ArrowRight, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { AssetServiceRequestDialog } from '../components/assets/AssetServiceRequestDialog'
import { AlertTimeline } from '../components/connect/AlertTimeline'
import { ConnectPageHeader } from '../components/connect/ConnectPageHeader'
import { ConnectPanel } from '../components/connect/ConnectPanel'
import { ConnectStatusDot } from '../components/connect/ConnectStatusDot'
import { HealthGauge } from '../components/connect/HealthGauge'
import { KpiTile } from '../components/connect/KpiTile'
import { RangeToggle } from '../components/connect/RangeToggle'
import { RecommendedAction } from '../components/connect/RecommendedAction'
import { RunTimeline } from '../components/connect/RunTimeline'
import { TrendChart, type ChartLimit } from '../components/connect/TrendChart'
import { conditionLimits } from '../config/demo'
import { useConnect } from '../connect/useConnect'
import { channels } from '../data/assetPages'
import { conditionFindings, siteById } from '../data/assets'
import { connectApp, conditionPage as copy, ranges, type RangeId } from '../data/connect'
import { useUrlParams } from '../hooks/useUrlParams'
import { assetAlert, channelStatus } from '../lib/assetList'
import { getModel, getProduct } from '../lib/catalog'
import { conditionSeries } from '../lib/conditionData'
import {
  alertsForAsset,
  healthScore,
  inRange,
  latestRunning,
  runStats,
  weekAgo,
} from '../lib/connect'
import { formatClock, groupThousands } from '../lib/format'
import type { ConditionChannel, ConditionPoint } from '../types'

const color = {
  line: 'var(--sz-color-accent-cyan)',
  temperature: 'var(--sz-color-primary-on-dark)',
  good: 'var(--sz-color-success-on-dark)',
  fair: '#b9d66a',
  warning: 'var(--sz-color-warning-on-dark)',
  alarm: 'var(--sz-color-danger-on-dark)',
}

const DAY = 24 * 60 * 60 * 1000

const pageClass = 'mx-auto max-w-[1680px] px-10 pt-8 pb-16'

/** Rounded-out value axis for a temperature chart, keeping both limits in view. */
function temperatureDomain(points: ConditionPoint[], channel: ConditionChannel) {
  const values = points.map((point) => point[channel])
  const { alarm } = conditionLimits[channel]
  return {
    min: Math.max(0, Math.floor((Math.min(...values) - 10) / 10) * 10),
    max: Math.ceil((Math.max(alarm, ...values) + 10) / 10) * 10,
  }
}

function limitLines(channel: ConditionChannel): ChartLimit[] {
  const { warning, alarm } = conditionLimits[channel]
  const unit = channels[channel].unit
  return [
    { value: warning, label: `${copy.warning} ${warning} ${unit}`, color: color.warning },
    { value: alarm, label: `${copy.alarm} ${alarm} ${unit}`, color: color.alarm },
  ]
}

/**
 * Condition monitoring for one asset: /connect/assets/:id. Health score,
 * recommended action and alert timeline on the left; readings, the vibration
 * trend in its ISO zones, temperatures and run status on the right. The time
 * range is in the URL (?range=24h|7d|30d), 7 days by default.
 */
export function ConnectAssetPage() {
  const { id = '' } = useParams()
  const { assets, acknowledgedBy } = useConnect()
  const [params, update] = useUrlParams()
  const [requestOpen, setRequestOpen] = useState(false)

  const asset = assets.find((a) => a.id === id)
  const series = asset && conditionSeries(asset.id)
  const back = { label: copy.back, to: '/connect/assets' }

  if (!asset || !series) {
    return (
      <div className={pageClass}>
        <ConnectPageHeader back={back} title={asset?.name ?? id.toUpperCase()} />
        <ConnectPanel className="mt-8 max-w-xl">
          <h2 className="text-lg font-semibold text-white">{copy.notConnected.title}</h2>
          <p className="mt-1 text-text-on-dark-muted">{copy.notConnected.text}</p>
          {asset && (
            <Link
              to={`/assets/${asset.id}`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-on-dark hover:text-white"
            >
              {copy.action.viewAsset}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </ConnectPanel>
      </div>
    )
  }

  const requested = params.get('range')
  const range: RangeId = ranges.some((r) => r.value === requested) ? (requested as RangeId) : '7d'
  const points = inRange(series, range)
  const site = siteById(asset.siteId)
  const product = getProduct(asset.productId)
  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const finding = conditionFindings[asset.id]
  const alert = assetAlert(asset)

  const latest = latestRunning(series)
  // A week ago: the average while running over that day, steadier than one sample.
  const dayBefore = series.filter((p) => p.running && p.time <= weekAgo && p.time > weekAgo - DAY)
  const lastWeek = (channel: ConditionChannel) =>
    dayBefore.reduce((sum, p) => sum + p[channel], 0) / Math.max(dayBefore.length, 1)
  const score = healthScore(asset)!
  const scoreLastWeek = healthScore(asset, weekAgo)!
  const month = runStats(series)

  const kpi = (channel: ConditionChannel) => {
    const { unit, decimals, label } = channels[channel]
    const delta = latest[channel] - lastWeek(channel)
    return {
      label,
      value: latest[channel].toFixed(decimals),
      unit,
      status: channelStatus(channel, latest[channel]),
      note: copy.kpis.limit(`${conditionLimits[channel].warning} ${unit}`),
      change: {
        text: copy.kpis.change(
          `${delta >= 0 ? '+' : '−'}${Math.abs(delta).toFixed(decimals)} ${unit}`,
        ),
        worse: delta > (channel === 'vibration' ? 1 : 5),
      },
    }
  }

  const markers =
    alert?.since != null
      ? [
          {
            time: alert.since,
            label: formatClock(alert.since),
            color: alert.level === 'alarm' ? color.alarm : color.warning,
          },
        ]
      : []
  const markersFor = (channel: ConditionChannel) => (alert?.channel === channel ? markers : [])

  const [ab, bc, cd] = conditionLimits.vibration.zones
  const vibrationMax = Math.max(
    conditionLimits.vibration.alarm + 1,
    Math.ceil(Math.max(...points.map((p) => p.vibration)) * 1.15),
  )
  const [zoneA, zoneB, zoneC, zoneD] = copy.vibrationChart.zones

  return (
    <div className={pageClass}>
      <title>{`${asset.tag} – ${connectApp.name}`}</title>

      <ConnectPageHeader
        back={back}
        title={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <ConnectStatusDot status={asset.status} />
            {asset.tag}
            <span className="text-xl font-medium text-text-on-dark">
              {asset.name.replace(` ${asset.tag}`, '')}
            </span>
          </span>
        }
        subtitle={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {site && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {site.name}
              </span>
            )}
            <span>{model?.name ?? product?.name}</span>
            <span className="tabular-nums">{copy.serial(asset.serialNumber)}</span>
            <span>{connectApp.synced}</span>
          </span>
        }
        actions={
          <RangeToggle
            label={copy.range}
            value={range}
            onChange={(value) =>
              update((next) => (value === '7d' ? next.delete('range') : next.set('range', value)))
            }
          />
        }
      />

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[23rem_minmax(0,1fr)]">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          <ConnectPanel title={copy.health.title} subtitle={copy.health.caption}>
            <HealthGauge
              score={score}
              change={score - scoreLastWeek}
              changeLabel={copy.health.change}
            />
          </ConnectPanel>
          <RecommendedAction
            asset={asset}
            finding={finding}
            onRequestService={() => setRequestOpen(true)}
          />
          <ConnectPanel title={copy.timeline.title} className="md:col-span-2 xl:col-span-1">
            <AlertTimeline alerts={alertsForAsset(asset)} acknowledgedBy={acknowledgedBy} />
          </ConnectPanel>
        </div>

        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <KpiTile {...kpi('vibration')} label={copy.kpis.vibration} />
            <KpiTile {...kpi('bearingTemperature')} label={copy.kpis.bearingTemperature} />
            <KpiTile {...kpi('motorTemperature')} label={copy.kpis.motorTemperature} />
            <KpiTile
              label={copy.kpis.runHours}
              value={groupThousands(asset.runHours)}
              unit="h"
              note={copy.kpis.runHoursNote(month.hours)}
            />
          </div>

          <ConnectPanel
            title={copy.vibrationChart.title}
            subtitle={copy.vibrationChart.subtitle}
            flush
          >
            <div className="px-4 pt-3 pb-4">
              <TrendChart
                points={points}
                value={(point) => point.vibration}
                unit={channels.vibration.unit}
                decimals={2}
                range={range}
                domain={{ min: 0, max: vibrationMax }}
                color={color.line}
                bands={[
                  { from: 0, to: ab, label: zoneA, color: color.good },
                  { from: ab, to: bc, label: zoneB, color: color.fair },
                  { from: bc, to: cd, label: zoneC, color: color.warning },
                  { from: cd, to: vibrationMax, label: zoneD, color: color.alarm },
                ]}
                limits={limitLines('vibration')}
                markers={markersFor('vibration')}
                height={300}
                label={`${copy.vibrationChart.title}, ${asset.tag}`}
              />
            </div>
          </ConnectPanel>

          <div className="grid gap-6 2xl:grid-cols-2">
            {(['bearingTemperature', 'motorTemperature'] as const).map((channel) => {
              const chart = channel === 'bearingTemperature' ? copy.bearingChart : copy.motorChart
              return (
                <ConnectPanel key={channel} title={chart.title} subtitle={chart.subtitle} flush>
                  <div className="px-4 pt-3 pb-4">
                    <TrendChart
                      points={points}
                      value={(point) => point[channel]}
                      unit={channels[channel].unit}
                      decimals={1}
                      range={range}
                      domain={temperatureDomain(points, channel)}
                      color={color.temperature}
                      limits={limitLines(channel)}
                      markers={markersFor(channel)}
                      height={200}
                      label={`${chart.title}, ${asset.tag}`}
                    />
                  </div>
                </ConnectPanel>
              )
            })}
          </div>

          <ConnectPanel title={copy.run.title}>
            <RunTimeline points={points} range={range} />
          </ConnectPanel>
        </div>
      </div>

      <AssetServiceRequestDialog
        asset={asset}
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
      />
    </div>
  )
}
