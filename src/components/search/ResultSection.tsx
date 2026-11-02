import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { searchPage as copy } from '../../data/catalogPages'

type ResultSectionProps = {
  title: string
  count: number
  /** Opens the section's own tab; left out when the section has no tab. */
  onShowAll?: () => void
  children: ReactNode
}

/** One section of the All tab: title with count, the first few hits, "Show all n". */
export function ResultSection({ title, count, onShowAll, children }: ResultSectionProps) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 border-b border-border-strong pb-2">
        <h2 className="text-lg font-bold tracking-tight text-navy-900">
          {title} <span className="font-semibold text-text-subtle tabular-nums">({count})</span>
        </h2>
        {onShowAll && (
          <button
            type="button"
            onClick={onShowAll}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {copy.all.showAll(count)}
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
