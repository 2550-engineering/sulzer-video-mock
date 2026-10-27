import logoBlue from '../assets/logo/sulzer-logo-blue.svg'
import logoWhite from '../assets/logo/sulzer-logo-white.svg'

const sources = {
  blue: logoBlue,
  white: logoWhite,
} as const

type SulzerLogoProps = {
  variant?: keyof typeof sources
  className?: string
}

/** Sulzer wordmark. Use `white` on navy/dark backgrounds. Size it with a height class, e.g. `h-7`. */
export function SulzerLogo({ variant = 'blue', className = 'h-7' }: SulzerLogoProps) {
  return (
    <img
      src={sources[variant]}
      alt="Sulzer"
      width={171}
      height={28}
      className={`w-auto ${className}`}
      draggable={false}
    />
  )
}
