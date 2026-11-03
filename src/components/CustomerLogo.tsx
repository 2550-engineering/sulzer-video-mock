import { partnerAccounts } from '../data/partner'
import type { CustomerLogoSpec } from '../types'

type CustomerLogoProps = {
  customerId: string
  /** The full wordmark, or the mark alone in a square (for small tiles). */
  variant?: 'wordmark' | 'mark'
  className?: string
}

/** The mark, drawn in a 36 × 36 box from (0, 2). */
function Mark({ spec }: { spec: CustomerLogoSpec }) {
  const { mark, color, accent } = spec
  switch (mark) {
    case 'wave':
      return (
        <>
          <circle cx="18" cy="20" r="17" fill={color} />
          <path
            d="M6 18c3-2.4 5.8-2.4 8.6 0s5.8 2.4 8.6 0 5.8-2.4 8.6 0M6 25c3-2.4 5.8-2.4 8.6 0s5.8 2.4 8.6 0 5.8-2.4 8.6 0"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </>
      )
    case 'sheets':
      return (
        <>
          <rect x="3" y="9" width="22" height="28" rx="2" fill={accent} />
          <rect x="11" y="3" width="22" height="28" rx="2" fill={color} />
          <path
            d="M16 11h12M16 16h12M16 21h8"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )
    case 'leaf':
      return (
        <>
          <path d="M4 36C4 17 16 5 34 3c0 19-11 32-30 33Z" fill={color} />
          <path
            d="M7 33 28 10M15 25h8M19 20v-7"
            fill="none"
            stroke={accent}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </>
      )
    case 'flame':
      return (
        <>
          <path
            d="M18 2c3 7 13 12 13 23a13 13 0 0 1-26 0c0-6 3-10 7-13 0 4 2 7 4 8 0-7 1-13 2-18Z"
            fill={color}
          />
          <path d="M18 18c3 4 6 6 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11Z" fill={accent} />
        </>
      )
  }
}

/**
 * A customer's wordmark: a simple mark and the name in two lines. Made for the
 * demo; the customers are fictional and these are not real companies' logos.
 */
export function CustomerLogo({
  customerId,
  variant = 'wordmark',
  className = 'h-9',
}: CustomerLogoProps) {
  const spec = partnerAccounts[customerId]?.logo
  if (!spec) return null
  const label = `${spec.name} ${spec.tagline}`

  if (variant === 'mark') {
    return (
      <svg viewBox="0 0 38 40" role="img" aria-label={label} className={`w-auto ${className}`}>
        <g transform="translate(1 0)">
          <Mark spec={spec} />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 196 40" role="img" aria-label={label} className={`w-auto ${className}`}>
      <Mark spec={spec} />
      <text
        x="44"
        y="19"
        fill={spec.color}
        style={{ font: '700 16px/1 var(--sz-font-sans, sans-serif)', letterSpacing: '0.1em' }}
      >
        {spec.name}
      </text>
      <text
        x="44"
        y="35"
        fill={spec.accent}
        style={{ font: '600 11px/1 var(--sz-font-sans, sans-serif)', letterSpacing: '0.26em' }}
      >
        {spec.tagline}
      </text>
    </svg>
  )
}
