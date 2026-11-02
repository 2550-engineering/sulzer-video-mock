import { conditionLimits } from '../../config/demo'
import { assetPage, channels } from '../../data/assetPages'
import { channelStatus } from '../../lib/assetList'
import { statusTones } from '../../lib/statusTones'
import type { ConditionChannel, ConditionPoint } from '../../types'
import { AssetStatusChip } from './AssetStatusChip'
import { Sparkline } from './Sparkline'

const copy = assetPage.condition

const dayLabel = (time: number) =>
  new Date(time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

type ConditionChannelCardProps = {
  channel: ConditionChannel
  /** 30 days of hourly samples, oldest first. */
  series: ConditionPoint[]
}

/** One channel over 30 days: the latest value and status, a trend with its limits, and min / avg / max while running. */
export function ConditionChannelCard({ channel, series }: ConditionChannelCardProps) {
  const { label, unit, decimals } = channels[channel]
  const limits = conditionLimits[channel]
  const running = series.filter((point) => point.running).map((point) => point[channel])
  const now = running.at(-1) ?? series[series.length - 1][channel]
  const status = channelStatus(channel, now)
  const average = running.reduce((sum, value) => sum + value, 0) / Math.max(running.length, 1)
  const format = (value: number) => value.toFixed(decimals)

  const stats = [
    { label: copy.stats.min, value: Math.min(...running) },
    { label: copy.stats.avg, value: average },
    { label: copy.stats.max, value: Math.max(...running) },
  ]

  return (
    <section className="grid items-center gap-x-10 gap-y-5 rounded-lg border border-border bg-white px-6 py-5 lg:grid-cols-[13rem_minmax(0,1fr)_15rem]">
      <div>
        <h3 className="font-semibold text-navy-900">{label}</h3>
        <p
          className={`mt-2 text-[2rem] leading-none font-bold tracking-tight tabular-nums ${statusTones[status].text}`}
        >
          {format(now)}
          <span className="ml-1.5 text-base font-semibold text-text-muted">{unit}</span>
        </p>
        <div className="mt-3">
          <AssetStatusChip status={status} />
        </div>
      </div>

      <div>
        <Sparkline
          values={series.map((point) => point[channel])}
          status={status}
          limits={[
            { value: limits.warning, status: 'warning' },
            ...(status === 'alarm' ? [{ value: limits.alarm, status: 'alarm' as const }] : []),
          ]}
          className="h-24"
        />
        <div className="mt-2 flex justify-between text-xs text-text-subtle tabular-nums">
          <span>{dayLabel(series[0].time)}</span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="w-4 border-t border-dashed border-warning" />
            {copy.warning} {limits.warning} {unit}
          </span>
          <span>{dayLabel(series[series.length - 1].time)}</span>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-4 border-border lg:border-l lg:pl-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
              {stat.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-navy-900 tabular-nums">
              {format(stat.value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
