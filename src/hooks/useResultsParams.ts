import { emptySelection, facetIds, type FacetId } from '../lib/productFilters'
import { useUrlParams } from './useUrlParams'

export const resultTabs = ['products', 'applications', 'documents'] as const
export type ResultTab = (typeof resultTabs)[number]
export type ResultSort = 'relevance' | 'name'

/**
 * State of the /products results page, read from and written to the URL
 * (?q, ?tab, ?sort and one repeatable param per filter group), so reload and
 * Back restore it. Changes replace the history entry, like tab switches.
 */
export function useResultsParams() {
  const [params, update] = useUrlParams()
  const query = params.get('q')?.trim() ?? ''

  const requestedTab = params.get('tab')
  const tab = resultTabs.find((t) => t === requestedTab)

  // Without a query there is nothing to rank, so the list is alphabetical.
  const defaultSort: ResultSort = query ? 'relevance' : 'name'
  const requestedSort = params.get('sort')
  const sort: ResultSort =
    requestedSort === 'relevance' || requestedSort === 'name' ? requestedSort : defaultSort

  const selection = emptySelection()
  for (const id of facetIds) selection[id] = params.getAll(id)

  return {
    query,
    /** Undefined when the URL names none; the page then picks the first tab with results. */
    tab,
    sort,
    selection,
    setTab: (id: ResultTab) => update((next) => next.set('tab', id)),
    setSort: (value: ResultSort) =>
      update((next) => (value === defaultSort ? next.delete('sort') : next.set('sort', value))),
    toggleFilter: (id: FacetId, value: string) =>
      update((next) => {
        const values = next.getAll(id)
        next.delete(id)
        const updated = values.includes(value)
          ? values.filter((v) => v !== value)
          : [...values, value]
        for (const v of updated) next.append(id, v)
      }),
    resetFilters: () => update((next) => facetIds.forEach((id) => next.delete(id))),
  }
}
