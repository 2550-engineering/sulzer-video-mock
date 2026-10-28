import { childApplications } from '../../lib/catalog'
import type { Application } from '../../types'
import type { BreadcrumbItem } from '../Breadcrumb'
import { ApplicationCard } from './ApplicationCard'
import { ApplicationPanelHero } from './ApplicationPanelHero'

type ApplicationAreaProps = {
  area: Application
  breadcrumb: BreadcrumbItem[]
}

/** /applications/:areaSlug: hero, then a card per application in the area. */
export function ApplicationArea({ area, breadcrumb }: ApplicationAreaProps) {
  return (
    <>
      <ApplicationPanelHero
        image={area.heroImage}
        breadcrumb={breadcrumb}
        title={area.name}
        text={area.summary}
        panelSide="right"
      />

      <section className="bg-surface py-16 lg:py-20">
        <ul className="site-container grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {childApplications(area).map((application) => (
            <li key={application.id}>
              <ApplicationCard application={application} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
