import { FolderKanban } from 'lucide-react'
import { personalToolbar } from '../../data/personal'
import { useProjects } from '../../projects/useProjects'
import { ProjectStatusChip } from '../projects/ProjectStatusChip'
import { FlyoutLink } from './FlyoutLink'
import { FlyoutRow } from './FlyoutRow'

const copy = personalToolbar.projects

/** The user's projects, most recently changed first. */
export function ProjectsFlyout({ onNavigate }: { onNavigate: () => void }) {
  const { projects } = useProjects()
  const sorted = [...projects].sort((a, b) => b.modifiedOrder - a.modifiedOrder)

  return (
    <>
      <ul className="-mx-3 space-y-1">
        {sorted.map((project) => (
          <FlyoutRow
            key={project.id}
            to={`/my-projects/${project.id}`}
            title={project.name}
            meta={
              <span className="flex items-center gap-2">
                <ProjectStatusChip status={project.status} />
                <span className="truncate">
                  {copy.items(project.items.length)} · {copy.modified(project.lastModified)}
                </span>
              </span>
            }
            leading={
              <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
                <FolderKanban aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
            }
            onNavigate={onNavigate}
          />
        ))}
      </ul>
      <div className="mt-8">
        <FlyoutLink to={copy.to} label={copy.viewAll} onNavigate={onNavigate} />
      </div>
    </>
  )
}
