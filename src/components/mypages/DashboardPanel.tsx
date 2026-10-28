import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type DashboardPanelProps = {
  title: string
  subtitle: string
  icon: LucideIcon
  /** Small yellow pill after the title, e.g. "New". */
  badge?: string
  children: ReactNode
}

/** White My Pages card: icon, title and subtitle header, then whatever body it's given. */
export function DashboardPanel({
  title,
  subtitle,
  icon: Icon,
  badge,
  children,
}: DashboardPanelProps) {
  return (
    <section className="flex h-full flex-col rounded-lg border border-border bg-surface shadow-card">
      <header className="flex items-start gap-4 border-b border-border px-7 py-6">
        <Icon className="mt-0.5 size-8 shrink-0 text-primary" strokeWidth={1.5} />
        <div className="min-w-0">
          <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-heading">
            {title}
            {badge && (
              <span className="rounded-pill bg-accent-yellow px-2 py-0.5 text-[11px] font-bold tracking-wider text-navy-900 uppercase">
                {badge}
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-[15px] text-text-muted">{subtitle}</p>
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  )
}
