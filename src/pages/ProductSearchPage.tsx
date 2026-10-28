import { useSearchParams } from 'react-router'
import { PanelHero } from '../components/PanelHero'
import { ProductListItem } from '../components/product/ProductListItem'
import { ProductSearchForm } from '../components/product/ProductSearchForm'
import { productSearchPage as copy } from '../data/catalogPages'
import { products } from '../data/products'
import { searchProducts } from '../lib/catalog'

/** Product Center: /products?q=<query>. Lists matching products, or all of them. */
export function ProductSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const results = query ? searchProducts(query) : products
  const noMatches = query !== '' && results.length === 0

  function search(term: string) {
    setSearchParams(term ? { q: term } : {})
  }

  return (
    <>
      <title>{query ? `“${query}” | ${copy.title} | Sulzer` : `${copy.title} | Sulzer`}</title>

      <PanelHero
        image={copy.heroImage}
        breadcrumb={[{ label: copy.title }]}
        title={copy.title}
        text={copy.subtitle}
      >
        <ProductSearchForm key={query} initialQuery={query} onSearch={search} />
      </PanelHero>

      <section key={query} className="site-container min-h-[480px] animate-fade-in py-16">
        <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-heading">
          {noMatches
            ? copy.noResultsTitle(query)
            : query
              ? copy.resultsTitle(results.length, query)
              : copy.allProductsTitle}
        </h2>
        {noMatches && <p className="mt-3 text-lg text-text-muted">{copy.noResultsText}</p>}

        <ul className="mt-8 space-y-4">
          {(noMatches ? products : results).map((product) => (
            <li key={product.id}>
              <ProductListItem product={product} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
