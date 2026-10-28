import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { LinkCard } from '../../types'

/** Large "Find what you need" card: icon, title, one line and an arrow link. */
export function FinderCard({ card }: { card: LinkCard }) {
  const { title, text, linkLabel, to, icon: Icon } = card
  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-lg border border-border bg-surface p-8 transition-[border-color,box-shadow] duration-200 hover:border-primary-border hover:shadow-card"
    >
      <Icon className="size-10 text-primary" strokeWidth={1.5} />
      <h3 className="mt-6 text-[1.375rem] font-bold tracking-tight text-heading">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{text}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-primary">
        {linkLabel}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
