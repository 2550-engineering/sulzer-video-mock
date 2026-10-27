import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import type { DashboardCard } from '../../types'
import { DashboardPanel } from './DashboardPanel'
import { LinkBadge } from './LinkBadge'

/** My Pages card with a list of links, each with an optional count badge. */
export function LinksCard({ card: { title, subtitle, icon, links } }: { card: DashboardCard }) {
  return (
    <DashboardPanel title={title} subtitle={subtitle} icon={icon}>
      <ul className="space-y-0.5 p-4">
        {links.map(({ label, to, badge }) => (
          <li key={label}>
            <Link
              to={to}
              className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium text-primary transition-colors hover:bg-primary-tint hover:text-primary-hover"
            >
              <span className="flex-1">{label}</span>
              {badge && <LinkBadge badge={badge} />}
              <ChevronRight className="size-4 shrink-0 text-text-subtle transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </DashboardPanel>
  )
}
