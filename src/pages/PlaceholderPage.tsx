import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Breadcrumb } from '../components/Breadcrumb'
import { ComingSoonPanel } from '../components/ComingSoonPanel'
import { getParentTrail } from '../config/placeholderRoutes'
import type { PlaceholderRoute } from '../types'

/** "Coming soon" page for routes whose real page isn't built yet. */
export function PlaceholderPage({ route }: { route: PlaceholderRoute }) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim()

  return (
    <>
      <title>{`${route.title} | Sulzer`}</title>

      <div className="site-container py-5">
        <Breadcrumb items={[...getParentTrail(route), { label: route.title }]} />
      </div>

      <section className="border-y border-border bg-surface-muted">
        <div className="site-container py-14">
          <h1 className="text-[2.75rem] leading-tight font-bold tracking-tight text-navy-900">
            {route.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-text-muted">{route.description}</p>
          {query && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 text-sm text-text-muted">
              <Search className="size-4 text-primary" />
              Results for <span className="font-semibold text-navy-900">“{query}”</span>
            </p>
          )}
        </div>
      </section>

      <section className="site-container py-16">
        <ComingSoonPanel eyebrow="Coming soon" title="We're building something new here">
          This part of the Sulzer website is getting a faster, simpler experience. In the meantime,
          our specialists are happy to help you with anything you need.
        </ComingSoonPanel>
      </section>
    </>
  )
}
