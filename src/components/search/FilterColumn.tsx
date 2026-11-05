import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { searchPage as copy } from '../../data/catalogPages'
import type { FilterGroup as FilterGroupData } from '../../types'
import { FilterGroup } from './FilterGroup'

type FilterColumnProps = {
  facets: FilterGroupData[]
  onToggle: (groupId: string, value: string) => void
  /** Defaults to "Filter". */
  title?: string
  /** "(11)" after each option label, as in the sizing filter list. */
  bracketCounts?: boolean
  /** Shows "Reset" when given. */
  onReset?: () => void
}

/** White filter panel beside a result list. Groups without options are left out. */
export function FilterColumn({
  facets,
  onToggle,
  onReset,
  title = copy.filters.title,
  bracketCounts = false,
}: FilterColumnProps) {
  // Below 1024 px the groups fold away until "Show filters" is pressed.
  const [open, setOpen] = useState(false)
  const active = facets.reduce(
    (sum, facet) => sum + facet.options.filter((option) => option.selected).length,
    0,
  )
  return (
    <aside
      className={`self-start rounded-lg border border-border bg-white px-6 pt-5 pb-2 max-md:px-4 ${
        open ? '' : 'max-lg:pb-0 max-lg:[&>*:not(:first-child)]:hidden'
      }`}
    >
      <div className="flex items-center justify-between pb-4 max-lg:flex-wrap max-lg:gap-x-4 max-lg:gap-y-2">
        <h2 className="text-lg font-bold tracking-tight text-navy-900">{title}</h2>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="ml-auto inline-flex h-9 items-center gap-1.5 text-sm font-semibold text-primary lg:hidden"
        >
          {open ? copy.filters.hide : copy.filters.show(active)}
          <ChevronDown
            aria-hidden
            className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {copy.filters.reset}
          </button>
        )}
      </div>
      {facets
        .filter((facet) => facet.options.length > 0)
        .map((facet) => (
          <FilterGroup
            key={facet.id}
            facet={facet}
            onToggle={(value) => onToggle(facet.id, value)}
            bracketCounts={bracketCounts}
          />
        ))}
    </aside>
  )
}
