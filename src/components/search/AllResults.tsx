import { searchPage as copy } from '../../data/catalogPages'
import type { ResultTab, SearchGroups } from '../../lib/search'
import type { ResultArticle } from '../../types'
import { ProductListItem } from '../product/ProductListItem'
import { DocumentList } from '../product/DocumentList'
import { ApplicationResults } from './ApplicationResults'
import { PartResultRow } from './PartResultRow'
import { ResultSection } from './ResultSection'
import { SupportResults } from './SupportResults'
import { ArticleResultCard } from './ArticleResultCard'

type AllResultsProps = {
  groups: SearchGroups
  query: string
  /** Variants or models the Products tab lists instead of product rows, if any. */
  articles: ResultArticle[] | null
  onSelectTab: (tab: ResultTab) => void
}

/** All tab: the first few hits of every kind, each section linking to its tab. */
export function AllResults({ groups, query, articles, onSelectTab }: AllResultsProps) {
  const n = copy.all.preview
  const titles = copy.all.sections
  const support = [...groups.services, ...groups.knowledge]
  const productCount = articles ? articles.length : groups.products.length

  return (
    <div className="space-y-12">
      {productCount > 0 && (
        <ResultSection
          title={titles.products}
          count={productCount}
          onShowAll={() => onSelectTab('products')}
        >
          <ul className="space-y-4">
            {articles
              ? articles.slice(0, n).map((article) => (
                  <li key={article.id}>
                    <ArticleResultCard article={article} query={query} />
                  </li>
                ))
              : groups.products.slice(0, n).map((product) => (
                  <li key={product.id}>
                    <ProductListItem product={product} />
                  </li>
                ))}
          </ul>
        </ResultSection>
      )}

      {groups.parts.length > 0 && (
        <ResultSection title={titles.parts} count={groups.parts.length}>
          <ul className="space-y-3">
            {groups.parts.slice(0, copy.all.partsPreview).map((hit) => (
              <li key={hit.part.id}>
                <PartResultRow hit={hit} query={query} />
              </li>
            ))}
          </ul>
        </ResultSection>
      )}

      {groups.documents.length > 0 && (
        <ResultSection
          title={titles.documentation}
          count={groups.documents.length}
          onShowAll={() => onSelectTab('documentation')}
        >
          <DocumentList documents={groups.documents.slice(0, n)} showProducts />
        </ResultSection>
      )}

      {support.length > 0 && (
        <ResultSection
          title={titles.support}
          count={support.length}
          onShowAll={() => onSelectTab('support')}
        >
          <SupportResults
            services={groups.services.slice(0, n)}
            knowledge={groups.knowledge.slice(0, Math.max(0, n - groups.services.length))}
          />
        </ResultSection>
      )}

      {groups.applications.length > 0 && (
        <ResultSection
          title={titles.pages}
          count={groups.applications.length}
          onShowAll={() => onSelectTab('pages')}
        >
          <ApplicationResults applications={groups.applications.slice(0, n)} />
        </ResultSection>
      )}
    </div>
  )
}
