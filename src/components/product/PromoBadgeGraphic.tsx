import { useId } from 'react'
import type { PromoBadge } from '../../types'

const size = 240
const center = size / 2
/** Radius of the circle the ring text runs along. */
const textRadius = 93

/**
 * Round seal in Sulzer colours: the ring text runs twice around a blue band,
 * with the value and caption in a blue-to-cyan centre.
 */
export function PromoBadgeGraphic({ badge }: { badge: PromoBadge }) {
  const id = useId()
  const ringPath = `${id}-ring`
  const fill = `${id}-fill`
  const ringText = `${badge.ring} • ${badge.ring} • `.toUpperCase()

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${badge.ring}: ${badge.value} ${badge.caption}`}
      className="size-full drop-shadow-[0_18px_30px_rgba(0,61,165,0.25)]"
    >
      <defs>
        <linearGradient id={fill} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--sz-color-primary)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--sz-color-accent-cyan)' }} />
        </linearGradient>
        {/* Full circle starting at the left, clockwise, so the text reads upright over the top. */}
        <path
          id={ringPath}
          d={`M ${center - textRadius},${center} a ${textRadius},${textRadius} 0 1,1 ${2 * textRadius},0 a ${textRadius},${textRadius} 0 1,1 ${-2 * textRadius},0`}
        />
      </defs>

      <circle cx={center} cy={center} r={118} className="fill-brand" />
      <circle cx={center} cy={center} r={80} fill={`url(#${fill})`} />
      <circle
        cx={center}
        cy={center}
        r={72}
        fill="none"
        className="stroke-white/40"
        strokeWidth={1}
        strokeDasharray="2 4"
      />

      <text className="fill-white text-[13px] font-bold tracking-[0.12em]">
        <textPath href={`#${ringPath}`} textLength={2 * Math.PI * textRadius - 4}>
          {ringText}
        </textPath>
      </text>

      <text
        x={center}
        y={center + 4}
        textAnchor="middle"
        className="fill-white text-[34px] font-bold tracking-tight"
      >
        {badge.value}
      </text>
      <text
        x={center}
        y={center + 28}
        textAnchor="middle"
        className="fill-white/85 text-[13px] font-semibold tracking-[0.08em] uppercase"
      >
        {badge.caption}
      </text>
      <circle cx={center} cy={center - 34} r={4} className="fill-accent-yellow" />
    </svg>
  )
}
