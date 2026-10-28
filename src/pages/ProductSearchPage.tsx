import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { DocumentList } from '../components/product/DocumentList'
import { ApplicationResults } from '../components/search/ApplicationResults'
import { EmptyTab } from '../components/search/EmptyTab'
import { NoResults } from '../components/search/NoResults'
import { ProductResults } from '../components/search/ProductResults'
import { ResultsSearchForm } from '../components/search/ResultsSearchForm'
import { SearchBand } from '../components/search/SearchBand'
import { TabBar } from '../components/TabBar'
import { TabPanel } from '../components/TabPanel'
import { searchPage as copy } from '../data/catalogPages'
import { products } from '../data/products'
import { resultTabs, useResultsParams, type ResultTab } from '../hooks/useResultsParams'
import { scrollToTabBar } from '../lib/scrollToTabBar'
import { normalizeQuery, searchGroups, searchPath } from '../lib/search'

/**
 * /products: search results with Products, Applications and Documents tabs
 * (?q=…), or every product (Products A–Z) without a query.
 */
export function ProductSearchPage() {
  const navigate = useNavigate()
  const anchorRef = useRef<HTMLDivElement>(null)
  const params = useResultsParams()
  const { query } = params

  const groups = query ? searchGroups(query) : { products, applications: [], documents: [] }
  const counts: Record<ResultTab, number> = {
    products: groups.products.length,
    applications: groups.applications.length,
    documents: groups.documents.length,
  }
  const total = counts.products + counts.applications + counts.documents
  // Without ?tab, open the first tab that has results.
  const tab = params.tab ?? resultTabs.find((t) => counts[t] > 0) ?? 'products'

  // Show "AHLSTAR" rather than "ahlstar" when the query is a product name.
  const term =
    products.find((product) => normalizeQuery(product.name) === normalizeQuery(query))?.name ??
    query

  function selectTab(id: string) {
    params.setTab(id as ResultTab)
    scrollToTabBar(anchorRef.current)
  }

  // A new search is a new history entry and starts without filters.
  const search = (value: string) => navigate(searchPath(value))

  const productResults = (
    <ProductResults
      products={groups.products}
      selection={params.selection}
      sort={params.sort}
      onToggleFilter={params.toggleFilter}
      onResetFilters={params.resetFilters}
      onSort={params.setSort}
    />
  )

  const emptyTab = (kind: ResultTab) => (
    <EmptyTab
      message={copy.emptyTab(copy.tabs[kind].toLowerCase(), term)}
      alternatives={resultTabs
        .filter((t) => t !== kind && counts[t] > 0)
        .map((t) => ({ id: t, label: copy.tabLabel(copy.tabs[t], counts[t]) }))}
      onSelect={selectTab}
    />
  )

  return (
    <>
      <title>
        {query ? `‘${term}’ – ${copy.searchCrumb} | Sulzer` : `${copy.allTitle} | Sulzer`}
      </title>

      <SearchBand
        breadcrumb={[...copy.breadcrumb, { label: query ? copy.searchCrumb : copy.allCrumb }]}
        title={query ? copy.resultsTitle(total, term) : copy.allTitle}
        text={query ? undefined : copy.allText(products.length)}
      >
        <ResultsSearchForm key={query} initialQuery={query} onSearch={search} />
      </SearchBand>

      {!query ? (
        <section className="bg-surface-muted">
          <div className="site-container min-h-[480px] py-12">{productResults}</div>
        </section>
      ) : total === 0 ? (
        <NoResults />
      ) : (
        <>
          <TabBar
            tabs={resultTabs.map((t) => ({
              id: t,
              label: copy.tabLabel(copy.tabs[t], counts[t]),
            }))}
            active={tab}
            onSelect={selectTab}
            anchorRef={anchorRef}
            idPrefix="search"
          />
          <div className="bg-surface-muted">
            <TabPanel idPrefix="search" tabId={tab}>
              {tab === 'products' && (counts.products > 0 ? productResults : emptyTab('products'))}
              {tab === 'applications' &&
                (counts.applications > 0 ? (
                  <ApplicationResults applications={groups.applications} />
                ) : (
                  emptyTab('applications')
                ))}
              {tab === 'documents' &&
                (counts.documents > 0 ? (
                  <DocumentList documents={groups.documents} showProducts />
                ) : (
                  emptyTab('documents')
                ))}
            </TabPanel>
          </div>
        </>
      )}
    </>
  )
}
