import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { LinkCard } from '../../types'

/** Compact link card: icon, title, one line and a link label. */
export function ShortcutCard({ card }: { card: LinkCard }) {
  const { title, text, linkLabel, to, icon: Icon } = card
  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-lg border border-border bg-white px-6 py-6 transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:border-primary-border hover:shadow-raised"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        <Icon className="size-[22px]" strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-navy-900">{title}</h3>
      <p className="mt-1 text-[15px] leading-relaxed text-text-muted">{text}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary">
        {linkLabel}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
