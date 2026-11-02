import { statusNames } from '../../data/connect'
import type { AssetStatus } from '../../types'

const colors: Record<AssetStatus, string> = {
  ok: 'var(--sz-color-success-on-dark)',
  warning: 'var(--sz-color-warning-on-dark)',
  alarm: 'var(--sz-color-danger-on-dark)',
}

const order: AssetStatus[] = ['ok', 'warning', 'alarm']
const r = 70
const circumference = 2 * Math.PI * r

type FleetStatusDonutProps = {
  counts: Record<AssetStatus, number>
  centerValue: string
  centerLabel: string
}

/** Connected assets by status as a donut that draws in, with a legend. */
export function FleetStatusDonut({ counts, centerValue, centerLabel }: FleetStatusDonutProps) {
  const total = order.reduce((sum, status) => sum + counts[status], 0)
  // A small gap between segments; each starts where the ones before it end.
  const gap = 2.5
  const lengths = order.map((status) => (total ? (counts[status] / total) * circumference : 0))
  const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((sum, l) => sum + l, 0))

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
      <div className="relative size-44 shrink-0">
        <svg viewBox="0 0 180 180" className="size-full -rotate-90" aria-hidden>
          <circle
            cx={90}
            cy={90}
            r={r}
            fill="none"
            stroke="white"
            strokeOpacity={0.07}
            strokeWidth={18}
          />
          {order.map((status, i) => {
            const length = lengths[i]
            if (!length) return null
            const dash = Math.max(length - gap, 2)
            return (
              <circle
                key={status}
                cx={90}
                cy={90}
                r={r}
                fill="none"
                stroke={colors[status]}
                strokeWidth={18}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-starts[i]}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'backwards' }}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tracking-tight text-white tabular-nums">
            {centerValue}
          </span>
          <span className="mt-0.5 text-xs text-text-on-dark-muted">{centerLabel}</span>
        </div>
      </div>
      <ul className="min-w-40 flex-1 space-y-3">
        {order.map((status) => (
          <li key={status} className="flex items-center gap-3 text-sm">
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ background: colors[status] }}
            />
            <span className="text-text-on-dark">{statusNames[status]}</span>
            <span className="ml-auto text-lg font-bold text-white tabular-nums">
              {counts[status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
