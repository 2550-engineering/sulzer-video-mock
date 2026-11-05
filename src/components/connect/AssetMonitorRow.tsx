import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { channels } from '../../data/assetPages'
import { siteById } from '../../data/assets'
import { assetsPage as copy } from '../../data/connect'
import { channelStatus, latestReading } from '../../lib/assetList'
import { getModel, getProduct } from '../../lib/catalog'
import { healthScore } from '../../lib/connect'
import { statusTonesOnDark } from '../../lib/statusTones'
import type { Asset, ConditionChannel } from '../../types'
import { ConnectStatusDot } from './ConnectStatusDot'
import { HealthBar } from './HealthBar'

/** One connected asset in the Asset Monitor: status, name, model, latest reading, health and run status. */
type AssetMonitorRowProps = {
  asset: Asset
  showSite: boolean
  /** Grid template shared with the header row. */
  columns: string
}

export function AssetMonitorRow({ asset, showSite, columns }: AssetMonitorRowProps) {
  const reading = latestReading(asset)
  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const score = healthScore(asset)
  const value = (channel: ConditionChannel) => {
    if (!reading) return null
    const v = reading.point[channel]
    const { unit, decimals } = channels[channel]
    return (
      <span className={statusTonesOnDark[channelStatus(channel, v)].text}>
        {v.toFixed(decimals)} {unit}
      </span>
    )
  }

  return (
    <li
      className={`group relative grid items-center gap-x-5 px-6 py-3.5 text-sm transition-colors hover:bg-white/[0.04] ${columns} ${
        asset.status === 'ok' ? '' : 'bg-white/[0.025]'
      }`}
    >
      <ConnectStatusDot status={asset.status} />
      <div className="min-w-0">
        <Link
          to={`/connect/assets/${asset.id}`}
          className="font-semibold text-white transition-colors group-hover:text-primary-on-dark after:absolute after:inset-0"
        >
          {asset.tag}
        </Link>
        <p className="truncate text-[13px] text-text-on-dark-muted">
          {asset.name.replace(` ${asset.tag}`, '')}
          {showSite && ` · ${siteById(asset.siteId)?.name}`}
        </p>
      </div>
      <p className="truncate text-text-on-dark">
        {model?.name ?? getProduct(asset.productId)?.name}
      </p>
      <p className="font-medium tabular-nums">
        {value('vibration')}
        <span className="mx-1.5 text-text-on-dark-muted">·</span>
        {reading && value(reading.temperature)}
      </p>
      {score !== null && <HealthBar score={score} />}
      <p className="flex items-center gap-2 text-[13px] text-text-on-dark">
        <span
          aria-hidden
          className={`size-1.5 rounded-full ${reading?.running ? 'bg-primary-on-dark' : 'bg-white/30'}`}
        />
        {reading?.running ? copy.running : copy.stopped}
      </p>
      <ChevronRight className="size-4 text-text-on-dark-muted transition-transform group-hover:translate-x-0.5" />
    </li>
  )
}
