import type { Badge, StatusTone } from '../../types'

const tones: Record<StatusTone, string> = {
  neutral: 'bg-surface-sunken text-text-muted',
  info: 'bg-primary-tint-strong text-primary',
  warning: 'bg-warning-tint text-warning-strong',
}

/** Count or status pill at the end of a My Pages link. */
export function LinkBadge({ badge: { label, tone = 'neutral' } }: { badge: Badge }) {
  return (
    <span
      className={`rounded-pill px-2.5 py-0.5 text-xs font-semibold tabular-nums ${tones[tone]}`}
    >
      {label}
    </span>
  )
}
