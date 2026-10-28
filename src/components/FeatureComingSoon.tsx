import type { ReactNode } from 'react'
import type { ComingSoonContent, NavItem } from '../types'
import type { BreadcrumbItem } from './Breadcrumb'
import { ComingSoonPanel } from './ComingSoonPanel'
import { PageHeaderBand } from './PageHeaderBand'

type FeatureComingSoonProps = {
  content: ComingSoonContent
  /** Parent pages; the current page is added from `content.title`. */
  parents?: BreadcrumbItem[]
  back?: NavItem
  /** Context line under the description, e.g. what is being sized. */
  children?: ReactNode
}

/** Body of a feature page that isn't built yet: title band plus a "Coming soon" panel with what's planned. */
export function FeatureComingSoon({
  content,
  parents = [],
  back,
  children,
}: FeatureComingSoonProps) {
  return (
    <>
      <title>{`${content.title} | Sulzer`}</title>

      <PageHeaderBand
        breadcrumb={[...parents, { label: content.title }]}
        title={content.title}
        description={content.description}
      >
        {children}
      </PageHeaderBand>

      <section className="site-container py-16">
        <ComingSoonPanel
          eyebrow="Coming soon"
          title={content.panelTitle}
          features={content.features}
          back={back}
        >
          {content.panelText}
        </ComingSoonPanel>
      </section>
    </>
  )
}
