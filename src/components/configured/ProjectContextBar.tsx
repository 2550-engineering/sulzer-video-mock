import { ArrowLeft, CircleCheck, FolderOpen } from 'lucide-react'
import { Link } from 'react-router'
import { configuredPage } from '../../data/configuredPages'
import type { Project, ProjectItem } from '../../types'

const copy = configuredPage.context

type ProjectContextBarProps = {
  project: Project
  item: ProjectItem
}

/**
 * Slim bar under the breadcrumb when the page was opened from a project:
 * "From project: <name> · Position <tag> · Alternative A – selected", and
 * "Back to project".
 */
export function ProjectContextBar({ project, item }: ProjectContextBarProps) {
  return (
    <div className="mt-4 flex animate-fade-in flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-md border border-primary/20 bg-primary-tint px-4 py-2.5 text-sm">
      <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-navy-900">
        <FolderOpen aria-hidden className="size-4 shrink-0 text-primary" />
        <span className="text-text-muted">{copy.from}</span>
        <span className="font-semibold">{project.name}</span>
        <span aria-hidden className="text-text-subtle">
          ·
        </span>
        <span>{copy.position(item.customerPosition)}</span>
        {item.alternative && (
          <>
            <span aria-hidden className="text-text-subtle">
              ·
            </span>
            <span
              className={`inline-flex items-center gap-1 ${item.preferred ? 'font-semibold text-success-strong' : ''}`}
            >
              {item.preferred && <CircleCheck aria-hidden className="size-3.5" />}
              {copy.alternative(item.alternative, item.preferred === true)}
            </span>
          </>
        )}
      </p>
      <Link
        to={`/my-projects/${project.id}#products`}
        className="inline-flex items-center gap-1.5 font-semibold whitespace-nowrap text-primary underline-offset-4 hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {copy.back}
      </Link>
    </div>
  )
}
