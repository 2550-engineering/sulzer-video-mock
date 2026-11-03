import { conditionPage, type RangeId } from '../../data/connect'
import { runSegments, runStats, timeTickLabel, timeTicks } from '../../lib/connect'
import { formatClock, formatDay } from '../../lib/format'
import type { ConditionPoint } from '../../types'

const copy = conditionPage.run
const HOUR = 60 * 60 * 1000

/** Running and stopped periods across the time range, as one bar, with the share running and the starts. */
export function RunTimeline({ points, range }: { points: ConditionPoint[]; range: RangeId }) {
  const start = points[0].time
  const end = points[points.length - 1].time + HOUR
  const share = (time: number) => ((time - start) / (end - start)) * 100
  const stats = runStats(points)
  const when = (time: number) => `${formatDay(time)} ${formatClock(time)}`

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-text-on-dark">{copy.summary(stats.percent, stats.starts)}</p>
        <ul className="flex gap-4 text-xs text-text-on-dark-muted">
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-sm bg-primary-on-dark" />
            {copy.running}
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-sm bg-white/15" />
            {copy.stopped}
          </li>
        </ul>
      </div>
      <div
        key={range}
        className="relative mt-3 h-7 origin-left animate-bar overflow-hidden rounded-sm bg-white/[0.06]"
      >
        {runSegments(points)
          .filter((segment) => segment.running)
          .map((segment) => (
            <span
              key={segment.from}
              title={`${copy.running}: ${when(segment.from)} – ${when(segment.to)}`}
              className="absolute inset-y-0 bg-primary-on-dark/85 transition-colors hover:bg-primary-on-dark"
              style={{
                left: `${share(segment.from)}%`,
                width: `${share(segment.to) - share(segment.from)}%`,
              }}
            />
          ))}
      </div>
      <div className="relative mt-2 h-4 text-[11px] text-text-on-dark-muted">
        {timeTicks(start, end, range).map((tick) => (
          <span
            key={tick}
            className="absolute -translate-x-1/2 tabular-nums"
            style={{ left: `${share(tick)}%` }}
          >
            {timeTickLabel(tick, range)}
          </span>
        ))}
      </div>
    </div>
  )
}
