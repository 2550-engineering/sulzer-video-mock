import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { DocumentList } from '../components/product/DocumentList'
import { AllResults } from '../components/search/AllResults'
import { ApplicationResults } from '../components/search/ApplicationResults'
import { EmptyTab } from '../components/search/EmptyTab'
import { NoResults } from '../components/search/NoResults'
import { ProductResults } from '../components/search/ProductResults'
import { ResultsSearchForm } from '../components/search/ResultsSearchForm'
import { SearchBand } from '../components/search/SearchBand'
import { SupportResults } from '../components/search/SupportResults'
import { ArticleResults } from '../components/search/ArticleResults'
import { TabBar } from '../components/TabBar'
import { TabPanel } from '../components/TabPanel'
import { searchPage as copy } from '../data/catalogPages'
import { products } from '../data/products'
import { useResultsParams } from '../hooks/useResultsParams'
import { scrollToTabBar } from '../lib/scrollToTabBar'
import {
  normalizeQuery,
  resultTabs,
  searchGroups,
  searchPath,
  searchArticles,
  type ResultTab,
  type SearchGroups,
} from '../lib/search'

const noHits: Omit<SearchGroups, 'products'> = {
  variants: [],
  parts: [],
  documents: [],
  services: [],
  knowledge: [],
  applications: [],
}

/**
 * /products: search results (?q=…) with All, Products, Documentation, Support &
 * learn and Pages tabs, or every product (Products A–Z) without a query. When
 * the search is about a product with many sizes ("XFP", "AHLSTAR", a model
 * code or product number), the Products tab lists every variant or model,
 * with its own filter list, sorting and pages.
 */
export function ProductSearchPage() {
  const navigate = useNavigate()
  const anchorRef = useRef<HTMLDivElement>(null)
  const params = useResultsParams()
  const { query } = params

  const groups: SearchGroups = query ? searchGroups(query) : { ...noHits, products }
  // Products with many sizes list every variant or model instead of one row.
  const articles = query ? searchArticles(query) : null
  const counts: Record<Exclude<ResultTab, 'all'>, number> = {
    products: articles ? articles.length : groups.products.length,
    documentation: groups.documents.length,
    support: groups.services.length + groups.knowledge.length,
    pages: groups.applications.length,
  }
  const total =
    counts.products + groups.parts.length + counts.documentation + counts.support + counts.pages
  const countOf = (t: ResultTab) => (t === 'all' ? total : counts[t])
  // Without ?tab: Products when there are products, else All.
  const tab = params.tab ?? (counts.products > 0 ? 'products' : 'all')

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

  const productResults = articles ? (
    <ArticleResults
      articles={articles}
      query={query}
      selection={params.variantSelection}
      sort={params.sort}
      page={params.page}
      onToggleFilter={params.toggleFilter}
      onResetFilters={params.resetFilters}
      onSort={params.setSort}
      onPage={(page) => {
        params.setPage(page)
        scrollToTabBar(anchorRef.current)
      }}
    />
  ) : (
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
        .filter((t) => t !== kind && countOf(t) > 0)
        .map((t) => ({ id: t, label: copy.tabLabel(copy.tabs[t], countOf(t)) }))}
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
              label: copy.tabLabel(copy.tabs[t], countOf(t)),
            }))}
            active={tab}
            onSelect={selectTab}
            anchorRef={anchorRef}
            idPrefix="search"
          />
          <div className="bg-surface-muted">
            <TabPanel idPrefix="search" tabId={tab}>
              {tab === 'all' && (
                <AllResults
                  groups={groups}
                  query={query}
                  articles={articles}
                  onSelectTab={selectTab}
                />
              )}
              {tab === 'products' && (counts.products > 0 ? productResults : emptyTab('products'))}
              {tab === 'documentation' &&
                (counts.documentation > 0 ? (
                  <DocumentList documents={groups.documents} showProducts />
                ) : (
                  emptyTab('documentation')
                ))}
              {tab === 'support' &&
                (counts.support > 0 ? (
                  <SupportResults services={groups.services} knowledge={groups.knowledge} />
                ) : (
                  emptyTab('support')
                ))}
              {tab === 'pages' &&
                (counts.pages > 0 ? (
                  <ApplicationResults applications={groups.applications} />
                ) : (
                  emptyTab('pages')
                ))}
            </TabPanel>
          </div>
        </>
      )}
    </>
  )
}
