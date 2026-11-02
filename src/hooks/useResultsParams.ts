import type { FilterSelection as VariantSelection } from '../lib/filters'
import { emptySelection, facetIds } from '../lib/productFilters'
import { resultTabs, type ResultTab } from '../lib/search'
import { articleFilterIds } from '../lib/articleFilters'
import { useUrlParams } from './useUrlParams'

/** Product rows sort by relevance or name; variant and model lists also by P2, flow, head or price. */
export const resultSorts = ['relevance', 'name', 'power', 'flow', 'head', 'price'] as const
export type ResultSort = (typeof resultSorts)[number]

/** Every filter param on the page: product range filters and variant filters. */
const filterIds: string[] = [...facetIds, ...articleFilterIds]

/**
 * State of the /products results page, read from and written to the URL
 * (?q, ?tab, ?sort, ?page and one repeatable param per filter group), so
 * reload and Back restore it. Changes replace the history entry, like tab
 * switches. Filtering or sorting goes back to page 1.
 */
export function useResultsParams() {
  const [params, update] = useUrlParams()
  const query = params.get('q')?.trim() ?? ''

  const requestedTab = params.get('tab')
  const tab = resultTabs.find((t) => t === requestedTab)

  // Without a query there is nothing to rank, so the list is alphabetical.
  const defaultSort: ResultSort = query ? 'relevance' : 'name'
  const requestedSort = params.get('sort')
  const sort: ResultSort = resultSorts.find((s) => s === requestedSort) ?? defaultSort
  const page = Math.max(1, Math.floor(Number(params.get('page')) || 1))

  const selection = emptySelection()
  for (const id of facetIds) selection[id] = params.getAll(id)
  const variantSelection: VariantSelection = {}
  for (const id of articleFilterIds) variantSelection[id] = params.getAll(id)

  return {
    query,
    /** Undefined when the URL names none; the page then picks one. */
    tab,
    sort,
    /** Page of the variant list, from 1. */
    page,
    /** Product range filters. */
    selection,
    /** Variant and model filters. */
    variantSelection,
    setTab: (id: ResultTab) => update((next) => next.set('tab', id)),
    setSort: (value: ResultSort) =>
      update((next) => {
        next.delete('page')
        if (value === defaultSort) next.delete('sort')
        else next.set('sort', value)
      }),
    setPage: (value: number) =>
      update((next) => (value <= 1 ? next.delete('page') : next.set('page', String(value)))),
    toggleFilter: (id: string, value: string) =>
      update((next) => {
        next.delete('page')
        const values = next.getAll(id)
        next.delete(id)
        const updated = values.includes(value)
          ? values.filter((v) => v !== value)
          : [...values, value]
        for (const v of updated) next.append(id, v)
      }),
    resetFilters: () =>
      update((next) => {
        next.delete('page')
        filterIds.forEach((id) => next.delete(id))
      }),
  }
}
