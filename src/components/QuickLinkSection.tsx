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
              className="group flex h-full flex-col items-center gap-2.5 rounded-md px-2 pt-4 pb-3.5 text-center transition-colors hover:bg-surface-muted"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon className="size-[22px]" strokeWidth={1.75} />
              </span>
              <span className="text-[13px] leading-tight font-medium text-text">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
