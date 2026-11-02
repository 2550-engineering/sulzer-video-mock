import { conditionLimits, demoClock } from '../config/demo'
import { assetListPage, assetPage, channels, statusLabels } from '../data/assetPages'
import { assetLocation, conditionFindings, siteById, sites } from '../data/assets'
import type {
  Asset,
  AssetStatus,
  ConditionChannel,
  ConditionFinding,
  ConditionPoint,
} from '../types'
import { isServiceDue } from './assetSummary'
import { getProduct } from './catalog'
import { conditionChannels, conditionSeries, findCrossing } from './conditionData'
import { formatClock } from './format'
import type { FilterDef } from './filters'

/* Filters, search, sort and readings for the asset list ("/assets"). */

const copy = assetListPage.filters

export const statusOrder: AssetStatus[] = ['alarm', 'warning', 'ok']

/** Filter groups, in the order of the filter column. Their ids are the URL params. */
export const assetFilters: FilterDef<Asset>[] = [
  {
    id: 'status',
    label: copy.status,
    value: (asset) => asset.status,
    options: statusOrder,
    optionLabel: (value) => statusLabels[value as AssetStatus],
  },
  {
    id: 'site',
    label: copy.site,
    value: (asset) => asset.siteId,
    options: sites.map((site) => site.id),
    optionLabel: (id) => siteById(id)?.name ?? id,
  },
  {
    id: 'product',
    label: copy.product,
    value: (asset) => asset.productId,
    optionLabel: (id) => getProduct(id)?.name ?? id,
  },
  {
    id: 'connected',
    label: copy.connected,
    value: (asset) => (asset.connected ? 'yes' : 'no'),
    options: ['yes', 'no'],
    optionLabel: (value) => (value === 'yes' ? copy.connectedYes : copy.connectedNo),
  },
  {
    id: 'service',
    label: copy.service,
    value: (asset) => (isServiceDue(asset) ? 'due' : 'later'),
    options: ['due'],
    optionLabel: () => copy.serviceDue,
  },
]

/** "RW-02", "rw02" and "AH-1918-04512" all match: case, spaces and dashes are ignored. */
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '')

export function matchesQuery(asset: Asset, query: string) {
  const q = normalize(query)
  return (
    !q || [asset.tag, asset.serialNumber, asset.name].some((text) => normalize(text).includes(q))
  )
}

export type AssetSort = keyof typeof assetListPage.sort.options

/** Alarms, then warnings, then service due, then the rest in data order. */
const attentionRank = (asset: Asset) =>
  asset.status === 'alarm' ? 0 : asset.status === 'warning' ? 1 : isServiceDue(asset) ? 2 : 3

export function sortAssets(assets: Asset[], sort: AssetSort) {
  const sorted = [...assets]
  if (sort === 'attention') sorted.sort((a, b) => attentionRank(a) - attentionRank(b))
  if (sort === 'tag') sorted.sort((a, b) => a.tag.localeCompare(b.tag, 'en', { numeric: true }))
  if (sort === 'service') sorted.sort((a, b) => a.nextServiceDue.localeCompare(b.nextServiceDue))
  return sorted
}

/** Status of one reading against `conditionLimits`. */
export function channelStatus(channel: ConditionChannel, value: number): AssetStatus {
  const limits = conditionLimits[channel]
  if (value >= limits.alarm) return 'alarm'
  if (value >= limits.warning) return 'warning'
  return 'ok'
}

export type AssetReading = {
  /** The latest sample taken while the pump ran: idle samples show no vibration. */
  point: ConditionPoint
  /** Whether it runs in the latest sample. */
  running: boolean
  /** The temperature worth showing: the motor when it is the hotter problem, else the bearing. */
  temperature: 'bearingTemperature' | 'motorTemperature'
}

/** Latest reading for a connected asset; null when it isn't connected. */
export function latestReading(asset: Asset): AssetReading | null {
  const series = conditionSeries(asset.id)
  if (!series) return null
  const last = series[series.length - 1]
  const point = series.findLast((p) => p.running) ?? last
  const motorWorse =
    statusOrder.indexOf(channelStatus('motorTemperature', point.motorTemperature)) <
    statusOrder.indexOf(channelStatus('bearingTemperature', point.bearingTemperature))
  return {
    point,
    running: last.running,
    temperature: motorWorse ? 'motorTemperature' : 'bearingTemperature',
  }
}

export type AssetAlert = {
  channel: ConditionChannel
  level: Exclude<AssetStatus, 'ok'>
  /** When the channel crossed the limit. */
  since: number | null
  value: number
  limit: number
  finding?: ConditionFinding
}

/** The alert behind a warning or alarm: which channel, since when, and Sulzer Connect's finding. */
export function assetAlert(asset: Asset): AssetAlert | null {
  const series = conditionSeries(asset.id)
  if (asset.status === 'ok' || !series) return null
  const level = asset.status
  const finding = conditionFindings[asset.id]
  const last = series.findLast((p) => p.running) ?? series[series.length - 1]
  const channel =
    finding?.channel ??
    conditionChannels.find((c) => channelStatus(c, last[c]) === level) ??
    'vibration'
  const limit = conditionLimits[channel][level]
  return {
    channel,
    level,
    since: findCrossing(series, channel, limit),
    value: last[channel],
    limit,
    finding,
  }
}

/** "today 03:12", or "27 Oct, 21:00" for earlier days. */
export function readingTime(time: number) {
  const day = new Date(time).toISOString().slice(0, 10)
  if (day === demoClock.today) return assetPage.today(formatClock(time))
  return `${new Date(time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}, ${formatClock(time)}`
}

/**
 * Starting values for "Request service" on one asset: its site, a message
 * that quotes the active alert (so the service team sees what Sulzer Connect
 * saw), and a fitting service type.
 */
export function serviceRequestPrefill(asset: Asset) {
  const alert = assetAlert(asset)
  const unit = `${asset.tag}, serial no. ${asset.serialNumber}`
  const message = alert
    ? `${unit}: ${assetPage.alert.title(channels[alert.channel].label, alert.level).toLowerCase()}${
        alert.since !== null ? ` ${assetPage.alert.since(readingTime(alert.since))}` : ''
      }.${alert.finding ? ` ${alert.finding.title}.` : ''}`
    : `${unit}.`
  return {
    site: assetLocation(asset),
    message,
    services: alert ? assetPage.requestServices.alert : assetPage.requestServices.routine,
  }
}
