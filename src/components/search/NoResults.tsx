import { ArrowRight, SearchX } from 'lucide-react'
import { Link } from 'react-router'
import { popularSearches } from '../../config/navigation'
import { searchPage as copy } from '../../data/catalogPages'
import { searchPath } from '../../lib/search'

/** The whole search found nothing: tips, suggested searches and a way to browse everything. */
export function NoResults() {
  return (
    <section className="bg-surface-muted">
      <div className="site-container flex min-h-[480px] animate-fade-in flex-col items-center py-20 text-center">
        <SearchX aria-hidden className="size-12 text-text-subtle" strokeWidth={1.5} />
        <h2 className="mt-5 text-[1.75rem] font-bold tracking-tight text-brand">
          {copy.noResults.title}
        </h2>
        <p className="mt-3 max-w-xl text-lg text-text-muted">{copy.noResults.text}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {popularSearches.map((suggestion) => (
            <Link
              key={suggestion}
              to={searchPath(suggestion)}
              className="rounded-pill border border-border bg-white px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary-border hover:bg-primary-tint hover:text-primary"
            >
              {suggestion}
            </Link>
          ))}
        </div>
        <Link
          to="/products"
          className="group mt-10 inline-flex items-center gap-2 font-semibold text-primary"
        >
          {copy.noResults.browseAll}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
