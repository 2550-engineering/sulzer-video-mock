import type { PlaceholderTone } from '../types'

// Branded gradients used until the real image file is supplied.
const tones: Record<PlaceholderTone, string> = {
  ocean:
    'radial-gradient(90% 80% at 80% 15%, rgba(77, 166, 214, 0.55), transparent 60%), radial-gradient(70% 60% at 10% 95%, rgba(29, 89, 175, 0.6), transparent 70%), linear-gradient(160deg, #1b4f86 0%, #11325a 50%, #0c1c2e 100%)',
  deep: 'radial-gradient(80% 70% at 75% 20%, rgba(29, 89, 175, 0.6), transparent 65%), linear-gradient(150deg, #17305a 0%, #0f2240 55%, #0a1626 100%)',
  steel:
    'radial-gradient(80% 70% at 70% 15%, rgba(159, 179, 199, 0.45), transparent 60%), linear-gradient(150deg, #4a5d72 0%, #2c4565 50%, #15253c 100%)',
  slate:
    'radial-gradient(80% 70% at 25% 15%, rgba(110, 168, 240, 0.35), transparent 60%), linear-gradient(150deg, #3a5372 0%, #21344f 55%, #0f1d31 100%)',
}

type GradientBackdropProps = {
  tone: PlaceholderTone
  label?: string
  className?: string
}

/** Fills its (positioned) parent with a branded navy/blue gradient and soft flow lines. */
export function GradientBackdrop({ tone, label, className = '' }: GradientBackdropProps) {
  return (
    <div
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: tones[tone] }}
    >
      {/* Soft flow lines so the placeholder reads as texture, not an empty box. */}
      <svg
        aria-hidden
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full opacity-[0.14]"
        fill="none"
        stroke="white"
      >
        <path d="M0 140 C 80 110, 160 170, 240 130 S 360 90, 400 110" strokeWidth="1" />
        <path d="M0 155 C 90 125, 170 185, 250 145 S 360 105, 400 125" strokeWidth="0.75" />
        <path d="M0 170 C 100 140, 180 200, 260 160 S 360 120, 400 140" strokeWidth="0.5" />
      </svg>
    </div>
  )
}
