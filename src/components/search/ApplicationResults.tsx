import type { Application } from '../../types'
import { ApplicationCard } from '../application/ApplicationCard'

/** Applications tab: image cards that open the application pages. */
export function ApplicationResults({ applications }: { applications: Application[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {applications.map((application) => (
        <li key={application.id}>
          <ApplicationCard application={application} />
        </li>
      ))}
    </ul>
  )
}
