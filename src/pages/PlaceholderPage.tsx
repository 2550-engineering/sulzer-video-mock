import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { NoticePanel } from '../components/NoticePanel'
import { ContextChip } from '../components/ContextChip'
import { PageHeaderBand } from '../components/PageHeaderBand'
import { demoNotice } from '../config/demo'
import { getParentTrail } from '../config/placeholderRoutes'
import type { PlaceholderRoute } from '../types'

/** Live demo notice for routes that are not part of the demo. */
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
        <NoticePanel title={demoNotice.title} image={route.image}>
          {demoNotice.text}
        </NoticePanel>
      </section>
    </>
  )
}
