import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { LinkCard } from '../types'

/** Wide support card: icon on the left, title, text and an arrow link. */
export function SupportCard({ card }: { card: LinkCard }) {
  const { title, text, linkLabel, to, icon: Icon } = card
  return (
    <Link
      to={to}
      className="group flex items-start gap-7 rounded-lg border border-border bg-surface p-9 transition-[border-color,box-shadow] duration-200 hover:border-primary-border hover:shadow-card"
    >
      <Icon className="size-10 shrink-0 text-primary" strokeWidth={1.5} />
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-heading">{title}</h3>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-text-muted">{text}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
