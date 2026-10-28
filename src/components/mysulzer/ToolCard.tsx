import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { LinkCard } from '../../types'
import { BrandArt } from '../BrandArt'

/** "Try it" card: brand-art header with a large icon, then title, text and link. */
export function ToolCard({ card }: { card: LinkCard }) {
  const { title, text, linkLabel, to, icon: Icon } = card
  return (
    <Link
      to={to}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,box-shadow] duration-200 hover:border-primary-border hover:shadow-card"
    >
      <div className="relative flex h-44 items-center justify-center">
        <BrandArt seed={title} />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-white text-primary shadow-card transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
          <Icon className="size-9" strokeWidth={1.5} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-[1.375rem] font-bold tracking-tight text-heading">{title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{text}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
