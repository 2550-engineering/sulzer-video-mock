import { FileChartColumn, Share2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { myProjectsPage } from '../../data/projectPages'
import type { Project, ProjectStatus } from '../../types'
import { EditableProjectName } from './EditableProjectName'
import { ProjectStatusMenu } from './ProjectStatusMenu'

const copy = myProjectsPage.header

type ProjectHeaderProps = {
  project: Project
  onRename: (name: string) => void
  onStatus: (status: ProjectStatus) => void
  onShare: () => void
  /** The toolbar icons, top right under Share and Project report. */
  icons: ReactNode
  /** The action buttons along the bottom. */
  children: ReactNode
  /** Under the facts, e.g. the customer a partner runs the project for. */
  badge?: ReactNode
}

/**
 * Project header card: name (edit in place), status menu, client, site,
 * deadline and project ID; Share and Project report, the toolbar icons and the
 * action buttons.
 */
export function ProjectHeader({
  project,
  onRename,
  onStatus,
  onShare,
  icons,
  children,
  badge,
}: ProjectHeaderProps) {
  const facts = [
    [copy.client, project.client.company || copy.notSet],
    [copy.site, project.client.site || copy.notSet],
    [copy.deadline, project.deadline ?? copy.notSet],
    [copy.projectId, project.projectNumber],
  ]

  return (
    <div className="rounded-lg border border-border bg-white px-6 py-5 max-md:px-4">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <EditableProjectName key={project.name} name={project.name} onRename={onRename} />
            <ProjectStatusMenu status={project.status} onChange={onStatus} />
          </div>
          <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {facts.map(([label, value]) => (
              <div key={label} className="flex gap-1.5 max-md:min-w-0 max-md:flex-wrap">
                <dt className="text-text-muted">{label}</dt>
                <dd className="font-semibold text-navy-900 tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          {badge}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 max-md:w-full max-md:flex-row max-md:flex-wrap max-md:items-center max-md:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-10 items-center gap-2 rounded-pill border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
            >
              <Share2 className="size-4" />
              {copy.share}
            </button>
            <Link
              to={`/my-projects/${project.id}/report`}
              className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <FileChartColumn className="size-4" />
              {copy.report}
            </Link>
          </div>
          <div className="flex items-center">{icons}</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 max-md:grid max-md:grid-cols-2 max-md:[&>*]:h-auto max-md:[&>*]:min-h-11 max-md:[&>*]:justify-center max-md:[&>*]:px-3 max-md:[&>*]:py-2 max-md:[&>*]:text-center">
        {children}
      </div>
    </div>
  )
}
