import type { ProductModel } from '../../types'

/**
 * Tiny Q-H performance curve for a models row: a falling pump curve with the
 * rated duty point. Shape is derived from the model, so every row differs a little.
 */
export function CurveThumbnail({ model }: { model: ProductModel }) {
  // Steeper curves for high-head, low-flow sizes.
  const steepness = Math.min(1, Math.max(0.35, model.head / Math.sqrt(model.flow) / 4))
  const shutoff = 8
  const end = 8 + 24 * steepness
  const duty = { x: 34, y: shutoff + (end - shutoff) * 0.55 }

  return (
    <svg viewBox="0 0 56 40" className="h-10 w-14" aria-hidden>
      <rect x="0.5" y="0.5" width="55" height="39" rx="2" fill="white" stroke="#cfd8e1" />
      <path d="M6 34 H52 M6 34 V5" stroke="#cfd8e1" strokeWidth="1" />
      <path
        d={`M6 ${shutoff} Q 30 ${shutoff - 1}, 50 ${end}`}
        fill="none"
        stroke="#1d59af"
        strokeWidth="1.5"
      />
      <path d="M6 30 Q 28 12, 50 22" fill="none" stroke="#fab900" strokeWidth="1" />
      <circle cx={duty.x} cy={duty.y} r="2" fill="#c8000a" />
    </svg>
  )
}
