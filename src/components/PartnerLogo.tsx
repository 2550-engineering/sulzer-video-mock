type PartnerLogoProps = {
  className?: string
}

/**
 * Wordmark for the fictional channel partner Aqua Pumpteknik AB: a drop with a
 * wave, then the name. Made for the demo; not a real company's logo.
 */
export function PartnerLogo({ className = 'h-9' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 236 40"
      role="img"
      aria-label="Aqua Pumpteknik"
      className={`w-auto ${className}`}
    >
      <path d="M18 2C18 2 4 17.5 4 26a14 14 0 0 0 28 0C32 17.5 18 2 18 2Z" fill="#0d7c86" />
      <path
        d="M7.5 27.5c3.5-2.4 6.5-2.4 10 0s6.5 2.4 10 0"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <text
        x="42"
        y="19"
        fill="#0b3a4a"
        style={{ font: '700 17px/1 var(--sz-font-sans, sans-serif)', letterSpacing: '0.14em' }}
      >
        AQUA
      </text>
      <text
        x="42"
        y="36"
        fill="#0d7c86"
        style={{ font: '600 13px/1 var(--sz-font-sans, sans-serif)', letterSpacing: '0.2em' }}
      >
        PUMPTEKNIK
      </text>
    </svg>
  )
}
