import { useParams } from 'react-router'
import { ApplicationArea } from '../components/application/ApplicationArea'
import { ApplicationDetail } from '../components/application/ApplicationDetail'
import { ApplicationOverview } from '../components/application/ApplicationOverview'
import { rootApplicationId } from '../data/applications'
import { applicationPage as copy } from '../data/catalogPages'
import { applicationPath, applicationTrail, findApplication } from '../lib/catalog'
import { NotFoundPage } from './NotFoundPage'

/**
 * Application finder: /applications (overview), /applications/:areaSlug (area)
 * and /applications/:areaSlug/:appSlug (application with tabs).
 */
export function ApplicationPage() {
  const { areaSlug, appSlug } = useParams()
  const application = findApplication([areaSlug, appSlug].filter((slug) => slug !== undefined))
  if (!application) return <NotFoundPage />

  const trail = applicationTrail(application)
  const breadcrumb = [
    copy.breadcrumbParent,
    ...trail.map((app, i) => ({
      label: app.name,
      to: i < trail.length - 1 ? applicationPath(app) : undefined,
    })),
  ]

  return (
    <>
      <title>{`${application.name} | Sulzer`}</title>
      {application.id === rootApplicationId ? (
        <ApplicationOverview root={application} breadcrumb={breadcrumb} />
      ) : application.children.length > 0 ? (
        <ApplicationArea key={application.id} area={application} breadcrumb={breadcrumb} />
      ) : (
        <ApplicationDetail key={application.id} application={application} breadcrumb={breadcrumb} />
      )}
    </>
  )
}
