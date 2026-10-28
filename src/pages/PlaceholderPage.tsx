import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { ComingSoonPanel } from '../components/ComingSoonPanel'
import { ContextChip } from '../components/ContextChip'
import { PageHeaderBand } from '../components/PageHeaderBand'
import { getParentTrail } from '../config/placeholderRoutes'
import type { PlaceholderRoute } from '../types'

/** "Coming soon" page for routes whose real page isn't built yet. */
export function PlaceholderPage({ route }: { route: PlaceholderRoute }) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim()

  return (
    <>
      <title>{`${route.title} | Sulzer`}</title>

      <PageHeaderBand
        breadcrumb={[...getParentTrail(route), { label: route.title }]}
        title={route.title}
        description={route.description}
      >
        {query && (
          <ContextChip icon={Search}>
            Results for <span className="font-semibold text-navy-900">“{query}”</span>
          </ContextChip>
        )}
      </PageHeaderBand>

      <section className="site-container py-16">
        <ComingSoonPanel eyebrow="Coming soon" title="We're building something new here">
          This part of the Sulzer website is getting a faster, simpler experience. In the meantime,
          our specialists are happy to help you with anything you need.
        </ComingSoonPanel>
      </section>
    </>
  )
}
