import { ChevronRight, History } from 'lucide-react'
import { Link } from 'react-router'
import { recentActivity } from '../../data/myPages'

/** Slim list of the latest changes to the user's quotations, projects, orders and courses. */
export function RecentActivity() {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <h2 className="flex items-center gap-2.5 border-b border-border px-7 py-4 text-base font-bold tracking-tight text-heading">
        <History className="size-[18px] text-primary" strokeWidth={2} />
        {recentActivity.title}
      </h2>
      <ul className="divide-y divide-border">
        {recentActivity.items.map(({ subject, text, time, to, icon: Icon }) => (
          <li key={subject}>
            <Link
              to={to}
              className="group flex items-center gap-4 px-7 py-3.5 transition-colors hover:bg-surface-subtle"
            >
              <Icon className="size-5 shrink-0 text-primary" strokeWidth={1.5} />
              <p className="min-w-0 flex-1 truncate text-[15px] text-text-muted">
                <span className="font-semibold text-navy-900 transition-colors group-hover:text-primary">
                  {subject}
                </span>{' '}
                {text}
              </p>
              <span className="shrink-0 text-sm text-text-subtle tabular-nums">{time}</span>
              <ChevronRight className="size-4 shrink-0 text-text-subtle transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
