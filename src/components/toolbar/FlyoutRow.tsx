import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

type FlyoutRowProps = {
  to: string
  title: string
  /** Line under the title. */
  meta?: ReactNode
  /** Product image, file icon or status dot on the left. */
  leading?: ReactNode
  /** Small button on the right, e.g. remove. Without it, a chevron. */
  trailing?: ReactNode
  onNavigate: () => void
}

/** A link row in a personal toolbar panel. */
export function FlyoutRow({ to, title, meta, leading, trailing, onNavigate }: FlyoutRowProps) {
  return (
    <li className="group flex items-center gap-2 rounded-md transition-colors hover:bg-primary-tint">
      <Link
        to={to}
        onClick={onNavigate}
        className="flex min-w-0 flex-1 items-center gap-4 rounded-md px-3 py-3"
      >
        {leading}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-navy-900 group-hover:text-primary">
            {title}
          </span>
          {meta && <span className="mt-0.5 block truncate text-sm text-text-muted">{meta}</span>}
        </span>
        {!trailing && (
          <ChevronRight className="size-4 shrink-0 text-text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        )}
      </Link>
      {trailing && <span className="pr-2">{trailing}</span>}
    </li>
  )
}
