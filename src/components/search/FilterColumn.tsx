import { searchPage as copy } from '../../data/catalogPages'
import type { Facet, FacetId } from '../../lib/productFilters'
import { FilterGroup } from './FilterGroup'

type FilterColumnProps = {
  facets: Facet[]
  onToggle: (facet: FacetId, value: string) => void
  /** Shows "Reset" when given. */
  onReset?: () => void
}

/** White filter panel beside the product results. Groups without options are left out. */
export function FilterColumn({ facets, onToggle, onReset }: FilterColumnProps) {
  return (
    <aside className="self-start rounded-lg border border-border bg-white px-6 pt-5 pb-2">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-bold tracking-tight text-navy-900">{copy.filters.title}</h2>
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
          />
        ))}
    </aside>
  )
}
