import type { GuideAvailability } from '../../types'

const tones = {
  'In stock': {
    chip: 'border-success/30 bg-success-tint text-success-strong',
    dot: 'bg-success',
  },
  '2–3 week lead time': {
    chip: 'border-warning/30 bg-warning-tint text-warning-strong',
    dot: 'bg-warning',
  },
  'Contact distributor': {
    chip: 'border-border-strong bg-surface-sunken text-text-muted',
    dot: 'bg-text-subtle',
  },
} satisfies Record<GuideAvailability, { chip: string; dot: string }>

/** Availability of a Sulzer replacement: green, amber or grey dot. */
export function GuideAvailabilityChip({
  availability,
  size = 'md',
}: {
  availability: GuideAvailability
  /** `sm` for the phone comparison table. */
  size?: 'sm' | 'md'
}) {
  const tone = tones[availability]
  return (
    <span
      className={`inline-flex items-center rounded-sm border leading-none font-semibold whitespace-nowrap ${tone.chip} ${
        size === 'sm' ? 'gap-1.5 px-2 py-1 text-[11px]' : 'gap-2 px-2.5 py-1.5 text-xs'
      }`}
    >
      <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${tone.dot}`} />
      {availability}
    </span>
  )
}
