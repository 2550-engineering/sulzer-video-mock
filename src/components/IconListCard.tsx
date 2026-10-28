import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import type { IconItem } from '../types'
import { IconItemContent } from './IconItemContent'

type IconListCardProps = {
  title: string
  items: IconItem[]
}

/** White card with a title bar and a list of icon items. Items with `to` become links. */
export function IconListCard({ title, items }: IconListCardProps) {
  return (
    <div className="h-full rounded-lg border border-border bg-surface shadow-card">
      <h3 className="border-b border-border px-8 py-5 text-xl font-bold tracking-tight text-heading">
        {title}
      </h3>
      <ul className="space-y-1 px-5 py-5">
        {items.map((item) => (
          <li key={item.label}>
            {item.to ? (
              <Link
                to={item.to}
                className="group flex items-center gap-4 rounded-md px-3 py-3 transition-colors hover:bg-surface-muted"
              >
                <IconItemContent item={item} />
                <ChevronRight className="ml-auto size-4 shrink-0 text-text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ) : (
              <div className="flex items-center gap-4 px-3 py-3">
                <IconItemContent item={item} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
