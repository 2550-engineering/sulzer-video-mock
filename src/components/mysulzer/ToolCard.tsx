import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { LinkCard, PlaceholderTone } from '../../types'
import { GradientBackdrop } from '../GradientBackdrop'

/** "Try it" card: gradient header with a large icon, then title, text and link. */
export function ToolCard({ card, tone }: { card: LinkCard; tone: PlaceholderTone }) {
  const { title, text, linkLabel, to, icon: Icon } = card
  return (
    <Link
      to={to}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-1 hover:border-primary-border hover:shadow-raised"
    >
      <div className="relative flex h-44 items-center justify-center">
        <GradientBackdrop tone={tone} />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors duration-200 group-hover:bg-primary">
          <Icon className="size-9" strokeWidth={1.5} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-[1.375rem] font-bold tracking-tight text-brand">{title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{text}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
