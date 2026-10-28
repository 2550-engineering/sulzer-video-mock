import { applicationPage as copy } from '../../data/catalogPages'
import { childApplications } from '../../lib/catalog'
import type { Application } from '../../types'
import type { BreadcrumbItem } from '../Breadcrumb'
import { ApplicationCategoryCard } from './ApplicationCategoryCard'
import { ApplicationPanelHero } from './ApplicationPanelHero'

type ApplicationOverviewProps = {
  root: Application
  breadcrumb: BreadcrumbItem[]
}

/** /applications: hero, then every application area as a card with its sub-applications. */
export function ApplicationOverview({ root, breadcrumb }: ApplicationOverviewProps) {
  return (
    <>
      <ApplicationPanelHero
        image={root.heroImage}
        breadcrumb={breadcrumb}
        title={root.name}
        text={root.summary}
        panelSide="right"
      />

      <section className="bg-surface-sunken py-16 lg:py-20">
        <div className="site-container">
          <h2 className="text-[1.75rem] leading-tight font-bold tracking-tight text-brand">
            {copy.overview.title}
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {childApplications(root).map((category) => (
              <li key={category.id}>
                <ApplicationCategoryCard category={category} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
