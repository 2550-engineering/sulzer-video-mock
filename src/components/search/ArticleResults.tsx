import { useAuth } from '../../auth/useAuth'
import { searchPage as copy } from '../../data/catalogPages'
import type { ResultSort } from '../../hooks/useResultsParams'
import { articleFilterDefs } from '../../lib/articleFilters'
import { sortArticles, type ArticleSort } from '../../lib/articles'
import { getProduct } from '../../lib/catalog'
import { applyFilters, filterGroups, type FilterSelection } from '../../lib/filters'
import type { ResultArticle } from '../../types'
import { Pagination } from '../Pagination'
import { ArticleResultCard } from './ArticleResultCard'
import { FilterColumn } from './FilterColumn'
import { NoFilterMatches } from './NoFilterMatches'
import { SortSelect } from './SortSelect'

type ArticleResultsProps = {
  /** Every matching variant or model, in relevance order. */
  articles: ResultArticle[]
  query: string
  selection: FilterSelection
  sort: ResultSort
  page: number
  onToggleFilter: (id: string, value: string) => void
  onResetFilters: () => void
  onSort: (sort: ResultSort) => void
  onPage: (page: number) => void
}

const articleSorts: ArticleSort[] = ['relevance', 'power', 'flow', 'head', 'price']

/**
 * Products tab for products with many sizes: "Filter list" with counts and
 * Reset, "<n> variants of <product>", sort, and variant cards 10 per page.
 */
export function ArticleResults({
  articles,
  query,
  selection,
  sort,
  page,
  onToggleFilter,
  onResetFilters,
  onSort,
  onPage,
}: ArticleResultsProps) {
  const { user } = useAuth()
  // Price only sorts for signed-in users, who can see it.
  const sorts = articleSorts.filter((s) => s !== 'price' || user)
  const activeSort = sorts.find((s) => s === sort) ?? 'relevance'
  const filtered = sortArticles(applyFilters(articles, articleFilterDefs, selection), activeSort)
  const filtersOn = Object.values(selection).some((values) => values.length > 0)

  const perPage = copy.variants.perPage
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage))
  const current = Math.min(page, pageCount)
  const shown = filtered.slice((current - 1) * perPage, current * perPage)

  const productIds = [...new Set(articles.map((a) => a.productId))]
  const productName = productIds.length === 1 ? (getProduct(productIds[0])?.name ?? null) : null

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <FilterColumn
        title={copy.variants.filterTitle}
        facets={filterGroups(articles, articleFilterDefs, selection)}
        onToggle={onToggleFilter}
        onReset={filtersOn ? onResetFilters : undefined}
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div aria-live="polite">
            <h2 className="text-xl font-bold tracking-tight text-navy-900">
              {copy.variants.heading(filtered.length, articles.length, productName)}
            </h2>
            {pageCount > 1 && (
              <p className="text-sm text-text-muted">
                {copy.variants.range(
                  (current - 1) * perPage + 1,
                  Math.min(current * perPage, filtered.length),
                  filtered.length,
                )}
              </p>
            )}
          </div>
          <SortSelect value={activeSort} onChange={onSort} options={sorts} />
        </div>

        {shown.length > 0 ? (
          <>
            <ul className="mt-5 space-y-4">
              {shown.map((article) => (
                <li key={article.id} className="animate-fade-in">
                  <ArticleResultCard article={article} query={query} />
                </li>
              ))}
            </ul>
            {pageCount > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={current}
                  pageCount={pageCount}
                  onChange={onPage}
                  labels={copy.variants.pagination}
                />
              </div>
            )}
          </>
        ) : (
          <NoFilterMatches onReset={onResetFilters} />
        )}
      </div>
    </div>
  )
}
