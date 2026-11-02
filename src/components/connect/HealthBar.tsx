import { healthBand } from '../../lib/connect'

const fills = {
  good: 'bg-success-on-dark',
  fair: 'bg-warning-on-dark',
  poor: 'bg-danger-on-dark',
}

/** Health score as a number and a short bar, for table rows. */
export function HealthBar({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="w-7 text-right font-semibold text-white tabular-nums">{score}</span>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
        <span
          className={`block h-full origin-left animate-bar rounded-full ${fills[healthBand(score)]}`}
          style={{ width: `${score}%` }}
        />
      </span>
    </span>
  )
}
