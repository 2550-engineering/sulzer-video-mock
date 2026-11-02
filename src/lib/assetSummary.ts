import { demoClock } from '../config/demo'
import type { Asset } from '../types'

const DAY = 24 * 60 * 60 * 1000

/** "Service due" means the next service falls within this many days of the demo's today. */
export const serviceDueWithinDays = 30

/** True when the next service is due within `serviceDueWithinDays` of demoClock.today (or overdue). */
export function isServiceDue(asset: Asset) {
  const daysLeft = (Date.parse(asset.nextServiceDue) - Date.parse(demoClock.today)) / DAY
  return daysLeft <= serviceDueWithinDays
}

export const needsAttention = (asset: Asset) => asset.status !== 'ok'

/** Headline counts for the My assets card and the /assets summary strip. */
export function summarizeAssets(assets: Asset[]) {
  return {
    total: assets.length,
    sites: new Set(assets.map((asset) => asset.siteId)).size,
    connected: assets.filter((asset) => asset.connected).length,
    alarms: assets.filter((asset) => asset.status === 'alarm').length,
    warnings: assets.filter((asset) => asset.status === 'warning').length,
    needsAttention: assets.filter(needsAttention).length,
    serviceDue: assets.filter(isServiceDue).length,
  }
}
