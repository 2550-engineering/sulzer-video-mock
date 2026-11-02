import { conditionLimits, demoClock } from '../config/demo'
import { assetById } from '../data/assets'
import type { Asset, AssetStatus, ConditionChannel, ConditionPoint } from '../types'

/*
 * Sulzer Connect condition data: 30 days of hourly samples per connected asset.
 * Deterministic: every value comes from a random generator seeded with the asset id,
 * so each recording shows the same curves. Times are wall-clock Date.UTC values
 * (format with timeZone 'UTC').
 */

const HOUR = 60 * 60 * 1000

export const conditionHours = 30 * 24

/** Last sample: the last full hour before the last sync, today (08:00). */
export const conditionEnd = Date.parse(
  `${demoClock.today}T${demoClock.lastSync.slice(0, 2)}:00:00Z`,
)
export const conditionStart = conditionEnd - (conditionHours - 1) * HOUR

/** Story: RW-02's bearing vibration crosses the warning limit overnight, today at 03:12. */
export const rw02WarningAt = Date.parse(`${demoClock.today}T03:12:00Z`)

export const conditionChannels: ConditionChannel[] = [
  'vibration',
  'bearingTemperature',
  'motorTemperature',
]

/** How a pump runs: duty pumps run round the clock, lift pumps cycle with the inflow. */
type Duty = 'continuous' | 'cycling' | 'standby' | 'batch'

type Profile = {
  duty: Duty
  /** mm/s while running. Seeded when not set. */
  vibrationBase?: number
  /** Index of the first sample from which the pump runs non-stop. */
  runningFrom?: number
}

const profiles: Record<string, Partial<Profile>> = {
  'rw-03': { duty: 'standby' },
  'bw-01': { duty: 'batch' },
  // Story: bearing wear, see bearingWear().
  'rw-02': { vibrationBase: 2.6 },
  // Story: high level at the station, the pump has run non-stop since last night and overheats.
  'p-211': { runningFrom: conditionHours - 14 },
  // Ends running at 2.1 mm/s, as on the home page Sulzer Connect promo.
  'p-104': { vibrationBase: 2, runningFrom: conditionHours - 3 },
}

function profileFor(asset: Asset): Profile {
  return { duty: asset.productId === 'xfp' ? 'cycling' : 'continuous', ...profiles[asset.id] }
}

/** FNV-1a: a 32-bit seed from a string. */
function hash(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32: small seeded generator, values in [0, 1). */
function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Chance a cycling lift pump runs in a given hour: low at night, peaks in the morning. */
const cyclingLoad = [
  0.3, 0.25, 0.25, 0.25, 0.3, 0.4, 0.65, 0.8, 0.75, 0.6, 0.55, 0.55, 0.55, 0.5, 0.5, 0.5, 0.55, 0.6,
  0.65, 0.65, 0.6, 0.5, 0.45, 0.35,
]

const round = (value: number, decimals: number) => Number(value.toFixed(decimals))

function generate(asset: Asset): ConditionPoint[] {
  const random = seeded(hash(asset.id))
  /** Roughly normal noise with standard deviation `sd`. */
  const noise = (sd: number) => (random() + random() + random() - 1.5) * 2 * sd

  const profile = profileFor(asset)
  const vibrationBase = profile.vibrationBase ?? 1.4 + random() * 1.6
  const bearingRise = 30 + random() * 10
  const motorRise = 50 + random() * 12
  // One planned 4-hour stop for continuous pumps, well before the last two days.
  const stopAt = 24 + Math.floor(random() * 24 * 16)

  const isRunning = (i: number, hour: number) => {
    if (profile.runningFrom !== undefined && i >= profile.runningFrom) return true
    switch (profile.duty) {
      case 'continuous':
        return i < stopAt || i >= stopAt + 4
      case 'standby':
        // Weekly test run, two hours.
        return Math.floor(i / 24) % 7 === 3 && (hour === 10 || hour === 11)
      case 'batch':
        // Filter backwash twice a day.
        return hour === 2 || hour === 14
      case 'cycling':
        return random() < cyclingLoad[hour]
    }
  }

  const points: ConditionPoint[] = []
  let bearing = 0
  let motor = 0
  for (let i = 0; i < conditionHours; i++) {
    const time = conditionStart + i * HOUR
    const hour = new Date(time).getUTCHours()
    const running = isRunning(i, hour)
    // Water temperature: a small daily swing, cooling slowly through the autumn.
    const ambient = 12 + 2 * Math.sin(((hour - 9) / 24) * 2 * Math.PI) - (3 * i) / conditionHours
    const vibration = running
      ? vibrationBase * (1 + 0.04 * Math.sin((hour / 24) * 2 * Math.PI)) + noise(0.12)
      : 0.05 + random() * 0.1
    // Temperatures follow their target with a thermal lag.
    const bearingTarget = ambient + (running ? bearingRise : 4) + noise(0.6)
    const motorTarget = ambient + (running ? motorRise : 4) + noise(0.8)
    bearing = i === 0 ? bearingTarget : bearing + (bearingTarget - bearing) * 0.45
    motor = i === 0 ? motorTarget : motor + (motorTarget - motor) * 0.45
    points.push({
      time,
      vibration: Math.max(0.05, vibration),
      bearingTemperature: bearing,
      motorTemperature: motor,
      running,
    })
  }

  if (asset.id === 'rw-02') bearingWear(points, vibrationBase, random)
  if (asset.id === 'p-211') motorOverheat(points)
  if (asset.id === 'p-104') points[points.length - 1].vibration = 2.1

  return points.map((point) => ({
    ...point,
    vibration: round(point.vibration, 2),
    bearingTemperature: round(point.bearingTemperature, 1),
    motorTemperature: round(point.motorTemperature, 1),
  }))
}

/**
 * RW-02: vibration rises for nine days and crosses the warning limit at exactly
 * `rw02WarningAt` (interpolated between 03:00 and 04:00), ending around 7.4 mm/s.
 * The bearing runs a few degrees warmer as it wears.
 */
function bearingWear(points: ConditionPoint[], base: number, random: () => number) {
  const { warning } = conditionLimits.vibration
  const onset = rw02WarningAt - 9 * 24 * HOUR
  const before = rw02WarningAt - 12 * 60 * 1000
  const after = before + HOUR
  for (const point of points) {
    const progress = Math.max(0, (point.time - onset) / (rw02WarningAt - onset))
    point.bearingTemperature += 9 * Math.min(progress, 1.1)
    if (!point.running || progress === 0) continue
    const trend = base + (warning - base) * progress ** 3
    const value = trend + (random() - 0.5) * 0.24 * (1 - 0.6 * Math.min(progress, 1))
    if (point.time === before) point.vibration = warning - 0.05
    else if (point.time === after) point.vibration = warning + 0.2
    else if (point.time < before) point.vibration = Math.min(value, warning - 0.04)
    else point.vibration = Math.max(value, warning + 0.05)
  }
}

/**
 * P-211: over the last 12 hours the motor runs hotter and hotter on top of its normal
 * running temperature, ending at 118 °C, above the alarm limit.
 */
function motorOverheat(points: ConditionPoint[]) {
  const hours = 12
  const start = points.length - hours
  const excess = 118 - points[points.length - 1].motorTemperature
  for (let k = 0; k < hours; k++) {
    points[start + k].motorTemperature += excess * ((k + 1) / hours) ** 2
  }
}

const cache = new Map<string, ConditionPoint[]>()

/** Hourly condition data for a connected asset, oldest first. Null when the asset isn't connected. */
export function conditionSeries(assetId: string): ConditionPoint[] | null {
  const asset = assetById(assetId)
  if (!asset?.connected) return null
  let series = cache.get(assetId)
  if (!series) {
    series = generate(asset)
    cache.set(assetId, series)
  }
  return series
}

export function latestPoint(assetId: string): ConditionPoint | null {
  return conditionSeries(assetId)?.at(-1) ?? null
}

/** Worst status across the channels of one sample, against `conditionLimits`. */
export function conditionStatus(point: ConditionPoint): AssetStatus {
  const at = (level: 'warning' | 'alarm') =>
    conditionChannels.some((channel) => point[channel] >= conditionLimits[channel][level])
  if (at('alarm')) return 'alarm'
  if (at('warning')) return 'warning'
  return 'ok'
}

/**
 * When `channel` first rises through `limit`, linearly interpolated between the two
 * samples either side, to the millisecond. Null if it never does.
 */
export function findCrossing(
  series: ConditionPoint[],
  channel: ConditionChannel,
  limit: number,
): number | null {
  for (let i = 1; i < series.length; i++) {
    const a = series[i - 1]
    const b = series[i]
    if (a[channel] < limit && b[channel] >= limit) {
      const fraction = (limit - a[channel]) / (b[channel] - a[channel])
      return Math.round(a.time + fraction * (b.time - a.time))
    }
  }
  return null
}
