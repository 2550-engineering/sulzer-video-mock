import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import type { NavItem } from '../../types'

type PersonalPageEmptyProps = {
  icon: LucideIcon
  title: string
  text: string
  action: NavItem
}

/** Empty state for My saved items and Recently viewed, with a way to start browsing. */
export function PersonalPageEmpty({ icon: Icon, title, text, action }: PersonalPageEmptyProps) {
  return (
    <div className="flex animate-fade-in flex-col items-center rounded-lg border border-border bg-surface-muted px-8 py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary-tint text-primary">
        <Icon aria-hidden className="size-7" strokeWidth={1.5} />
      </span>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-navy-900">{title}</h2>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-text-muted">{text}</p>
      <Link
        to={action.to}
        className="group mt-8 inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-7 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
      >
        {action.label}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
