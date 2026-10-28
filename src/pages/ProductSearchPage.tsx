import { useSearchParams } from 'react-router'
import { Breadcrumb } from '../components/Breadcrumb'
import { GradientBackdrop } from '../components/GradientBackdrop'
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

      <section className="relative isolate overflow-hidden bg-navy-900">
        <GradientBackdrop tone="deep" />
        <div className="relative site-container pt-6 pb-16">
          <Breadcrumb tone="dark" items={[{ label: copy.title }]} />
          <h1 className="mt-12 text-[3.5rem] leading-[1.05] font-bold tracking-tight text-white">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-text-on-dark">{copy.subtitle}</p>
          <div className="mt-10">
            <ProductSearchForm key={query} initialQuery={query} onSearch={search} />
          </div>
        </div>
      </section>

      <section key={query} className="site-container min-h-[480px] animate-fade-in py-16">
        <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">
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
