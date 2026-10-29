import { bepFlowAt, headAt } from '../../lib/pumpCurves'
import { variantCurve } from '../../lib/sizing'
import type { DutyPoint, SizingResult } from '../../types'

const width = 88
const height = 52
const pad = 4
const samples = 24

/**
 * Tiny Q–H chart for a result row: the pump curve at its trim, the system
 * curve through the duty point (dashed) and the duty point. No axes; the row
 * gives the same information in text, so it is decorative.
 */
export function CurveThumbnail({
  result,
  duty,
}: {
  result: Pick<SizingResult, 'variant'>
  duty: DutyPoint
}) {
  const { curve, scale } = variantCurve(result.variant, duty.frequency)
  const maxFlow = Math.max(bepFlowAt(curve, scale) * 1.4, duty.flow * 1.2)
  const maxHead = headAt(curve, scale, 0) * 1.1
  const x = (q: number) => pad + (q / maxFlow) * (width - 2 * pad)
  const y = (h: number) => height - pad - (Math.max(0, h) / maxHead) * (height - 2 * pad)
  const line = (head: (q: number) => number) =>
    Array.from({ length: samples + 1 }, (_, i) => {
      const q = (i / samples) * maxFlow
      return `${i ? 'L' : 'M'}${x(q).toFixed(1)},${y(head(q)).toFixed(1)}`
    }).join(' ')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className="h-[52px] w-[88px] rounded-sm border border-border bg-white"
    >
      <path
        d={line((q) => duty.head * (q / duty.flow) ** 2)}
        fill="none"
        stroke="var(--sz-color-text-subtle)"
        strokeDasharray="2 2"
      />
      <path
        d={line((q) => headAt(curve, scale, q))}
        fill="none"
        stroke="var(--sz-color-primary)"
        strokeWidth={1.75}
      />
      <circle
        cx={x(duty.flow)}
        cy={y(duty.head)}
        r={3}
        fill="var(--sz-color-accent-yellow)"
        stroke="var(--sz-color-navy-900)"
        strokeWidth={1}
      />
    </svg>
  )
}
