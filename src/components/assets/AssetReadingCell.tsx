import { Unplug } from 'lucide-react'
import { assetListPage as copy, channels } from '../../data/assetPages'
import { channelStatus, latestReading } from '../../lib/assetList'
import { formatClock } from '../../lib/format'
import { statusTones } from '../../lib/statusTones'
import type { Asset, ConditionChannel } from '../../types'

/** "7.4 mm/s · 61 °C" and whether the pump is running, or "Not connected". */
export function AssetReadingCell({ asset }: { asset: Asset }) {
  const reading = latestReading(asset)
  if (!reading) {
    return (
      <p className="flex items-center gap-1.5 text-sm text-text-subtle">
        <Unplug className="size-4" strokeWidth={1.75} />
        {copy.notConnected}
      </p>
    )
  }

  const { point, running, temperature } = reading
  const value = (channel: ConditionChannel) => {
    const { unit, decimals } = channels[channel]
    const status = channelStatus(channel, point[channel])
    return (
      <span className={status === 'ok' ? 'text-navy-900' : `font-bold ${statusTones[status].text}`}>
        {point[channel].toFixed(decimals)} {unit}
      </span>
    )
  }

  return (
    <div className="text-sm tabular-nums">
      <p className="font-semibold">
        {value('vibration')}
        <span className="mx-1.5 text-text-subtle">·</span>
        {value(temperature)}
      </p>
      <p className="mt-0.5 text-xs text-text-muted">
        {running ? copy.running(formatClock(point.time)) : copy.stopped(formatClock(point.time))}
      </p>
    </div>
  )
}
