import type { AssetReadout } from '../../types'

const statusDot = {
  ok: 'bg-success ring-success-tint',
  warning: 'bg-warning ring-warning-tint',
} as const

/** Floating "live" reading card on the Sulzer Connect promo image. */
export function ConnectReadout({
  readout,
  className = '',
}: {
  readout: AssetReadout
  className?: string
}) {
  const { label, value, status, trend } = readout
  // Scale the trend to fill the sparkline box, with a little headroom top and bottom.
  const min = trend ? Math.min(...trend) : 0
  const range = trend ? Math.max(...trend) - min || 1 : 1
  const points = trend
    ?.map((v, i) => `${(i / (trend.length - 1)) * 100},${90 - ((v - min) / range) * 80}`)
    .join(' ')

  return (
    <div className={`w-64 rounded-md bg-white p-4 text-text shadow-card ${className}`}>
      <p className="flex items-center gap-2 text-xs font-medium text-text-muted">
        <span aria-hidden className={`size-2 rounded-full ring-4 ${statusDot[status]}`} />
        {label}
      </p>
      <p className="mt-1.5 text-lg font-bold tracking-tight text-navy-900">{value}</p>
      {points && (
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="mt-3 h-10 w-full"
        >
          <polyline
            points={points}
            fill="none"
            className="stroke-primary"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </div>
  )
}
