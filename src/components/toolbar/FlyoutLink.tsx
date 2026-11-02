import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

type FlyoutLinkProps = {
  to: string
  label: string
  /** Filled blue button; otherwise outlined. */
  primary?: boolean
  onNavigate: () => void
}

/** Full-width button in a personal toolbar panel, e.g. "View all saved items". */
export function FlyoutLink({ to, label, primary = false, onNavigate }: FlyoutLinkProps) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={`group flex h-11 w-full items-center justify-center gap-2 rounded-pill px-6 text-sm font-semibold transition-colors ${
        primary
          ? 'bg-primary text-white shadow-raised hover:bg-primary-hover'
          : 'border border-border-strong text-navy-900 hover:border-primary hover:text-primary'
      }`}
    >
      {label}
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  )
}
