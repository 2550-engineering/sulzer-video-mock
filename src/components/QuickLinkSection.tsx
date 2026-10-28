import { Link } from 'react-router'
import type { IconLink } from '../types'

type QuickLinkSectionProps = {
  title: string
  links: IconLink[]
  onNavigate: () => void
}

/** Titled grid of icon tiles, used in the Quick links panel. */
export function QuickLinkSection({ title, links, onNavigate }: QuickLinkSectionProps) {
  return (
    <section>
      <h2 className="text-base font-semibold text-navy-900">{title}</h2>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {links.map(({ label, to, icon: Icon }) => (
          <li key={label}>
            <Link
              to={to}
              onClick={onNavigate}
              className="group flex h-full flex-col items-center gap-3 rounded-md px-2 pt-5 pb-4 text-center transition-colors hover:bg-surface-muted"
            >
              <Icon className="size-8 text-primary" strokeWidth={1.5} />
              <span className="text-[13px] leading-tight font-medium text-text transition-colors group-hover:text-primary">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
