import { Check, Wrench } from 'lucide-react'
import { replacementGuidePage } from '../../data/replacementGuidePage'
import type { GuideFit } from '../../types'

const copy = replacementGuidePage.fit

const tones = {
  'drop-in': {
    box: 'border-success/30 bg-success-tint',
    icon: 'bg-success',
    label: 'text-success-strong',
    Icon: Check,
  },
  adapter: {
    box: 'border-warning/30 bg-warning-tint',
    icon: 'bg-warning',
    label: 'text-warning-strong',
    Icon: Wrench,
  },
} satisfies Record<GuideFit, unknown>

/** "Drop-in fit" or "Fits with adapter kit", with what that means on site. */
export function GuideFitBadge({ fit }: { fit: GuideFit }) {
  const tone = tones[fit]
  return (
    <div className={`flex items-center gap-4 rounded-lg border px-5 py-4 ${tone.box}`}>
      <span
        aria-hidden
        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-white ${tone.icon}`}
      >
        <tone.Icon className="size-4" strokeWidth={2.75} />
      </span>
      <div>
        <p className={`text-[15px] font-bold ${tone.label}`}>{copy[fit].label}</p>
        <p className="text-sm text-text">{copy[fit].text}</p>
      </div>
    </div>
  )
}
