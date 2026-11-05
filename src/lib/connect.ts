import { conditionLimits } from '../config/demo'
import { channels } from '../data/assetPages'
import { assetById, assets, conditionFindings } from '../data/assets'
import { alertHistory, ranges, type RangeId } from '../data/connect'
import type { Asset, ConditionChannel, ConditionPoint, User } from '../types'
import { assetAlert, readingTime } from './assetList'
import { conditionEnd, conditionSeries, findCrossing } from './conditionData'
import { formatClock, formatDay, formatDayMonth } from './format'

/* Sulzer Connect: health scores, alerts, run status and run hours, all from lib/conditionData.ts. */

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

/** The assets a persona sees: their own, or every customer's for a partner. */
export function assetsFor(user: User) {
  return assets.filter((asset) => !user.customerId || asset.customerId === user.customerId)
}

/** The latest sample while running: idle samples have no meaningful vibration. */
export function latestRunning(series: ConditionPoint[]) {
  return series.findLast((point) => point.running) ?? series[series.length - 1]
}

/** Penalty for vibration (mm/s), steeper in each ISO zone: A 0–10, B 10–20, C 20–35, D 35 and up. */
function vibrationPenalty(value: number) {
  const [ab, bc, cd] = conditionLimits.vibration.zones
  if (value <= ab) return (value / ab) * 10
  if (value <= bc) return 10 + ((value - ab) / (bc - ab)) * 10
  if (value <= cd) return 20 + ((value - bc) / (cd - bc)) * 15
  return 35 + (value - cd) * 10
}

/** Penalty for a temperature: nothing until 20 °C below the warning limit. */
function temperaturePenalty(channel: 'bearingTemperature' | 'motorTemperature', value: number) {
  const { warning, alarm } = conditionLimits[channel]
  if (value < warning - 20) return 0
  if (value < warning) return ((value - (warning - 20)) / 20) * 10
  if (value < alarm) return 10 + ((value - warning) / (alarm - warning)) * 20
  return 30 + (value - alarm) * 3
}

/**
 * Health score 0–100 from the latest running sample, rounded as shown on screen
 * (vibration to 0.1 mm/s, temperatures to 1 °C). RW-02 at 7.4 mm/s scores 62.
 * `at` scores an earlier moment, e.g. a week ago. Null when the asset isn't connected.
 */
export function healthScore(asset: Asset, at = conditionEnd): number | null {
  const series = conditionSeries(asset.id)?.filter((p) => p.time <= at)
  if (!series?.length) return null
  const point = latestRunning(series)
  const penalty =
    vibrationPenalty(Math.round(point.vibration * 10) / 10) +
    temperaturePenalty('bearingTemperature', Math.round(point.bearingTemperature)) +
    temperaturePenalty('motorTemperature', Math.round(point.motorTemperature))
  return Math.max(0, Math.min(100, Math.round(100 - penalty)))
}

export const healthBand = (score: number) => (score >= 80 ? 'good' : score >= 60 ? 'fair' : 'poor')

export type AlertSeverity = 'alarm' | 'warning' | 'info'

export type ConnectAlert = {
  id: string
  assetId: string
  severity: AlertSeverity
  title: string
  time: number
  /** Still above its limit: can be acknowledged. */
  active: boolean
  /** How it cleared, for alerts in the history. */
  resolved?: string
}

const limitText = (channel: ConditionChannel, value: number) => `${value} ${channels[channel].unit}`

const exceeded = (channel: ConditionChannel, level: 'warning' | 'alarm', limit: number) =>
  `${channels[channel].label} exceeded ${level} limit ${limitText(channel, limit)}`

/**
 * Alerts for one asset, newest first: the active one from its condition, the
 * steps that led up to it (warning before alarm, vibration entering zone C),
 * and the resolved ones from the history.
 */
export function alertsForAsset(asset: Asset): ConnectAlert[] {
  const series = conditionSeries(asset.id)
  const list: ConnectAlert[] = []
  const alert = assetAlert(asset)
  if (series && alert && alert.since !== null) {
    list.push({
      id: `${asset.id}-${alert.level}`,
      assetId: asset.id,
      severity: alert.level,
      title: exceeded(alert.channel, alert.level, alert.limit),
      time: alert.since,
      active: true,
    })
    if (alert.level === 'alarm') {
      const warning = conditionLimits[alert.channel].warning
      const since = findCrossing(series, alert.channel, warning)
      if (since !== null) {
        list.push({
          id: `${asset.id}-warning`,
          assetId: asset.id,
          severity: 'warning',
          title: exceeded(alert.channel, 'warning', warning),
          time: since,
          active: false,
          resolved: 'Escalated to alarm',
        })
      }
    }
    if (conditionFindings[asset.id]?.channel === 'vibration') {
      const zoneC = conditionLimits.vibration.zones[1]
      const since = findCrossing(series, 'vibration', zoneC)
      if (since !== null) {
        list.push({
          id: `${asset.id}-zone-c`,
          assetId: asset.id,
          severity: 'info',
          title: `Vibration trend rising: entered zone C (${limitText('vibration', zoneC)})`,
          time: since,
          active: false,
          resolved: 'Escalated to warning',
        })
      }
    }
  }
  for (const past of alertHistory) {
    if (past.assetId !== asset.id) continue
    list.push({ ...past, time: Date.parse(`${past.time}:00Z`), active: false })
  }
  return list.sort((a, b) => b.time - a.time)
}

/** Every alert across these assets, newest first. */
export function alertsFor(list: Asset[]) {
  return list.flatMap(alertsForAsset).sort((a, b) => b.time - a.time)
}

export const alertAsset = (alert: ConnectAlert) => assetById(alert.assetId)!

/** The samples in a time range, oldest first. */
export function inRange(series: ConditionPoint[], range: RangeId) {
  const hours = ranges.find((r) => r.value === range)!.hours
  return series.slice(-hours)
}

export type RunSegment = { from: number; to: number; running: boolean }

/** Consecutive samples with the same run state, merged. Each sample covers one hour. */
export function runSegments(points: ConditionPoint[]): RunSegment[] {
  const segments: RunSegment[] = []
  for (const point of points) {
    const last = segments[segments.length - 1]
    if (last && last.running === point.running) last.to = point.time + HOUR
    else segments.push({ from: point.time, to: point.time + HOUR, running: point.running })
  }
  return segments
}

export function runStats(points: ConditionPoint[]) {
  const running = points.filter((point) => point.running).length
  const starts = points.filter((point, i) => i > 0 && point.running && !points[i - 1].running)
  return {
    hours: running,
    percent: Math.round((running / Math.max(points.length, 1)) * 100),
    starts: starts.length,
  }
}

/** Run hours per calendar day for the last `days` days (today up to the last sample), oldest first. */
export function runHoursByDay(list: Asset[], days = 7) {
  const lastDay = Math.floor(conditionEnd / DAY) * DAY
  const buckets = Array.from({ length: days }, (_, i) => ({
    day: lastDay - (days - 1 - i) * DAY,
    hours: 0,
  }))
  for (const asset of list) {
    for (const point of conditionSeries(asset.id) ?? []) {
      if (!point.running) continue
      const bucket = buckets.find((b) => point.time >= b.day && point.time < b.day + DAY)
      if (bucket) bucket.hours += 1
    }
  }
  return buckets
}

/** Tick marks for a time axis: every 4 hours, every day, or every 5 days. */
export function timeTicks(start: number, end: number, range: RangeId) {
  const step = range === '24h' ? 4 * HOUR : range === '7d' ? DAY : 5 * DAY
  const first = Math.ceil(start / step) * step
  const ticks: number[] = []
  for (let t = first; t <= end; t += step) ticks.push(t)
  return ticks
}

/** "Nice" axis steps: about five gridlines between min and max. */
export function niceTicks(min: number, max: number) {
  const raw = (max - min) / 5
  const power = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw) ?? raw
  const ticks: number[] = []
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step)
    ticks.push(Number(v.toFixed(6)))
  return ticks
}

/** Tick label for a time axis: "04:00", "Thu 22" or "3 Oct". */
export function timeTickLabel(time: number, range: RangeId) {
  if (range === '24h') return formatClock(time)
  if (range === '7d') return formatDay(time).replace(/ \w+$/, '')
  return formatDayMonth(time)
}

export const weekAgo = conditionEnd - 7 * DAY

/** "Today 03:12", or "27 Oct, 21:00" for earlier days. */
export const alertTime = (time: number) => readingTime(time).replace(/^today/, 'Today')
