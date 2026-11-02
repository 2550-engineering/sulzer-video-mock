import { searchPage as copy } from '../../data/catalogPages'
import type { ResultSort } from '../../hooks/useResultsParams'
import {
  facetsFor,
  filterProducts,
  hasFilters,
  type FacetId,
  type FilterSelection,
} from '../../lib/productFilters'
import type { Product } from '../../types'
import { ProductListItem } from '../product/ProductListItem'
import { FilterColumn } from './FilterColumn'
import { NoFilterMatches } from './NoFilterMatches'
import { SortSelect } from './SortSelect'

type ProductResultsProps = {
  /** Every matching product, in relevance order. */
  products: Product[]
  selection: FilterSelection
  sort: ResultSort
  onToggleFilter: (facet: FacetId, value: string) => void
  onResetFilters: () => void
  onSort: (sort: ResultSort) => void
}

/** Products tab: filter column, count and sort, then product rows. */
export function ProductResults({
  products,
  selection,
  sort,
  onToggleFilter,
  onResetFilters,
  onSort,
}: ProductResultsProps) {
  const filtered = filterProducts(products, selection)
  const shown =
    sort === 'name' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'en')) : filtered
  const filtersOn = hasFilters(selection)

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <FilterColumn
        facets={facetsFor(products, selection)}
        onToggle={(id, value) => onToggleFilter(id as FacetId, value)}
        onReset={filtersOn ? onResetFilters : undefined}
      />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-semibold text-navy-900" aria-live="polite">
            {copy.productCount(shown.length, products.length)}
          </p>
          <SortSelect value={sort} onChange={onSort} options={['relevance', 'name']} />
        </div>

        {shown.length > 0 ? (
          <ul className="mt-5 space-y-4">
            {shown.map((product) => (
              <li key={product.id} className="animate-fade-in">
                <ProductListItem product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <NoFilterMatches onReset={onResetFilters} />
        )}
      </div>
    </div>
  )
}
