import { conditionLimits } from '../../config/demo'
import { assetPage, channels } from '../../data/assetPages'
import { channelStatus } from '../../lib/assetList'
import { statusTones } from '../../lib/statusTones'
import type { ConditionChannel, ConditionPoint } from '../../types'
import { AssetStatusDot } from './AssetStatusDot'
import { Sparkline } from './Sparkline'

const copy = assetPage.overview

type ReadingCardProps = {
  channel: ConditionChannel
  /** The latest running sample. */
  latest: ConditionPoint
  /** Recent hourly samples for the sparkline, oldest first. */
  trend: ConditionPoint[]
}

/** One channel: latest value against its warning limit, with a sparkline of the last week. */
export function ReadingCard({ channel, latest, trend }: ReadingCardProps) {
  const { label, unit, decimals } = channels[channel]
  const value = latest[channel]
  const status = channelStatus(channel, value)
  const warning = conditionLimits[channel].warning

  return (
    <div
      className={`flex h-full flex-col rounded-lg border bg-white p-5 ${
        status === 'ok'
          ? 'border-border'
          : 'border-warning/40 shadow-[0_0_0_3px_var(--sz-color-warning-tint)]'
      }`}
    >
      <p className="flex items-center justify-between gap-3 text-sm font-semibold text-navy-900">
        {label}
        <AssetStatusDot status={status} />
      </p>
      <p
        className={`mt-3 text-[2rem] leading-none font-bold tracking-tight tabular-nums ${statusTones[status].text}`}
      >
        {value.toFixed(decimals)}
        <span className="ml-1.5 text-base font-semibold text-text-muted">{unit}</span>
      </p>
      <p className="mt-1.5 text-xs text-text-muted tabular-nums">
        {copy.limit(`${warning} ${unit}`)}
      </p>
      <div className="mt-auto pt-4">
        <Sparkline
          values={trend.map((point) => point[channel])}
          status={status}
          limits={[{ value: warning, status: 'warning' }]}
          className="h-12"
        />
        <p className="mt-1.5 text-[11px] font-medium tracking-wide text-text-subtle uppercase">
          {copy.trendLabel}
        </p>
      </div>
    </div>
  )
}
