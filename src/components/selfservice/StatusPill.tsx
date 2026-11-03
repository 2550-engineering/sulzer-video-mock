import type { PillTone } from '../../data/selfServicePages'

const tones: Record<PillTone, string> = {
  neutral: 'bg-surface-sunken text-navy-700',
  info: 'bg-primary-tint text-primary',
  progress: 'bg-primary text-white',
  success: 'bg-success-tint text-success-strong',
  warning: 'bg-warning-tint text-warning-strong',
}

/** A request, order or quotation status as a small pill. */
export function StatusPill({ label, tone }: { label: string; tone: PillTone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${tones[tone]}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
