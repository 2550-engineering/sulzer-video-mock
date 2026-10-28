import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import type { TabComingSoonCopy } from '../types'

/** Compact "on its way" card for a tab whose content isn't built yet. */
export function TabComingSoon({ copy }: { copy: TabComingSoonCopy }) {
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-6 rounded-lg border border-border bg-surface-muted px-10 py-12">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
        <Sparkles className="size-6" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold tracking-tight text-navy-900">{copy.title}</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">{copy.text}</p>
      </div>
      <Link
        to="/contact"
        className="group inline-flex h-11 items-center gap-2 rounded-pill border border-border-strong bg-white px-6 text-sm font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
      >
        Contact us
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
