import { healthNames } from '../../data/connect'
import { healthBand } from '../../lib/connect'

const colors = {
  good: 'var(--sz-color-success-on-dark)',
  fair: 'var(--sz-color-warning-on-dark)',
  poor: 'var(--sz-color-danger-on-dark)',
}

/** Arc from the bottom left round to the bottom right: 240° of a circle. */
const sweep = 240
const cx = 110
const cy = 110
const r = 86

function point(share: number, radius: number) {
  const angle = ((-90 - sweep / 2 + share * sweep) * Math.PI) / 180
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
}

function arc(from: number, to: number, radius: number) {
  const [x1, y1] = point(from, radius)
  const [x2, y2] = point(to, radius)
  const large = (to - from) * sweep > 180 ? 1 : 0
  return `M${x1.toFixed(2)},${y1.toFixed(2)} A${radius},${radius} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`
}

/** Bands on the outer ring: poor below 60, fair to 80, good above. */
const bands = [
  { from: 0, to: 0.6, band: 'poor' },
  { from: 0.6, to: 0.8, band: 'fair' },
  { from: 0.8, to: 1, band: 'good' },
] as const

type HealthGaugeProps = {
  score: number
  /** Change since a week ago, in points. */
  change?: number
  changeLabel?: string
}

/** 0–100 health score as a 240° gauge that fills on load, with the band (Good, Fair, Poor) under it. */
export function HealthGauge({ score, change, changeLabel }: HealthGaugeProps) {
  const band = healthBand(score)
  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <svg viewBox="0 0 220 196" className="block w-full" aria-hidden>
        {bands.map((b) => (
          <path
            key={b.band}
            d={arc(b.from + 0.004, b.to - 0.004, r + 14)}
            fill="none"
            stroke={colors[b.band]}
            strokeOpacity={0.45}
            strokeWidth={3}
          />
        ))}
        <path
          d={arc(0, 1, r)}
          fill="none"
          stroke="white"
          strokeOpacity={0.08}
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d={arc(0, 1, r)}
          fill="none"
          stroke={colors[band]}
          strokeWidth={14}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${score / 100} 1`}
          className="animate-draw [animation-duration:1100ms]"
        />
      </svg>
      <div className="absolute inset-x-0 top-[30%] flex flex-col items-center">
        <p className="text-[3.5rem] leading-none font-bold tracking-tight text-white tabular-nums">
          {score}
          <span className="ml-1 text-lg font-semibold text-text-on-dark-muted">/100</span>
        </p>
        <p
          className="mt-2 rounded-pill px-3 py-0.5 text-xs font-bold tracking-wide uppercase"
          style={{
            color: colors[band],
            background: `color-mix(in srgb, ${colors[band]} 16%, transparent)`,
          }}
        >
          {healthNames[band]}
        </p>
        {change !== undefined && changeLabel && (
          <p className="mt-3 text-sm text-text-on-dark-muted tabular-nums">
            <span
              className={
                change < 0
                  ? 'font-semibold text-danger-on-dark'
                  : 'font-semibold text-success-on-dark'
              }
            >
              {change > 0 ? '+' : change < 0 ? '−' : '±'}
              {Math.abs(change)}
            </span>{' '}
            {changeLabel}
          </p>
        )}
      </div>
    </div>
  )
}
