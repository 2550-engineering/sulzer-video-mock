import { useId } from 'react'
import type { AssetStatus } from '../../types'

const strokes: Record<AssetStatus, string> = {
  ok: 'var(--sz-color-primary)',
  warning: 'var(--sz-color-warning)',
  alarm: 'var(--sz-color-danger)',
}

type SparklineProps = {
  values: number[]
  status: AssetStatus
  /** Dashed limit lines, e.g. warning and alarm. Kept in view. */
  limits?: { value: number; status: Exclude<AssetStatus, 'ok'> }[]
  className?: string
}

/** Small trend line with a soft fill, stretched to its box. Decorative: the values are shown next to it. */
export function Sparkline({ values, status, limits = [], className = '' }: SparklineProps) {
  // Plain characters only, so it works inside url(#…).
  const gradientId = `spark${useId().replace(/[^\w-]/g, '')}`
  const all = [...values, ...limits.map((limit) => limit.value)]
  const min = Math.min(0, ...all)
  const max = Math.max(...all) * 1.08 || 1
  const x = (i: number) => (i / Math.max(values.length - 1, 1)) * 100
  const y = (value: number) => 40 - ((value - min) / (max - min)) * 38
  const line = values.map((value, i) => `${x(i).toFixed(2)},${y(value).toFixed(2)}`).join(' ')

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={`block w-full overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokes[status]} stopOpacity="0.18" />
          <stop offset="100%" stopColor={strokes[status]} stopOpacity="0" />
        </linearGradient>
      </defs>
      {limits.map((limit) => (
        <line
          key={limit.status}
          x1="0"
          x2="100"
          y1={y(limit.value)}
          y2={y(limit.value)}
          stroke={strokes[limit.status]}
          strokeOpacity="0.7"
          strokeWidth="1"
          strokeDasharray="4 3"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <polygon points={`0,40 ${line} 100,40`} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={strokes[status]}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
