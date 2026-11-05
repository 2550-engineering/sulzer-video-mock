import { Link } from 'react-router'
import type { IconLink } from '../../types'

/** Quick links as a grid of icon tiles, for the mobile nav drawer. */
export function QuickLinkTiles({
  title,
  links,
  onNavigate,
}: {
  title: string
  links: IconLink[]
  onNavigate: () => void
}) {
  return (
    <section className="px-5 pt-5 pb-1">
      <h2 className="text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">{title}</h2>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {links.map(({ label, to, icon: Icon }) => (
          <li key={label}>
            <Link
              to={to}
              onClick={onNavigate}
              className="flex h-full min-h-[88px] flex-col items-center justify-center gap-2 rounded-md bg-surface-muted px-2 py-3 text-center text-[13px] leading-tight font-medium text-navy-900 transition-colors hover:bg-primary-tint hover:text-primary"
            >
              <Icon className="size-6 text-primary" strokeWidth={1.75} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
