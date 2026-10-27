import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { LinkCard } from '../../types'

/** Large "Find what you need" card: icon, title, one line and an arrow link. */
export function FinderCard({ card }: { card: LinkCard }) {
  const { title, text, linkLabel, to, icon: Icon } = card
  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-lg border border-border bg-surface p-8 shadow-card transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-1 hover:border-primary-border hover:shadow-raised"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        <Icon className="size-7" strokeWidth={1.75} />
      </span>
      <h3 className="mt-7 text-[1.375rem] font-bold tracking-tight text-brand">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{text}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-primary">
        {linkLabel}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
