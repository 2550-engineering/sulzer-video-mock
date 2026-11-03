import { CircleCheck, Pencil } from 'lucide-react'
import type { ReactNode } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import { formatPrice } from '../../lib/modelSpecs'
import type { Project } from '../../types'
import { ProjectStatusChip } from './ProjectStatusChip'

const copy = myProjectsPage.panel

const heading = 'text-xs font-semibold tracking-[0.08em] text-text-muted uppercase'

const detailRows = (rows: [string, ReactNode][]) => (
  <dl className="divide-y divide-border text-sm">
    {rows.map(([label, value]) => (
      <div key={label} className="flex justify-between gap-4 py-2.5">
        <dt className="shrink-0 text-text-muted">{label}</dt>
        <dd className="text-right font-semibold break-words text-navy-900">{value}</dd>
      </div>
    ))}
  </dl>
)

/** Project details tab, read mode: description, project, client, consultant and key requirements. */
export function ProjectInfo({ project, onEdit }: { project: Project; onEdit: () => void }) {
  const requirements = project.requirements ?? []
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className={heading}>{copy.description}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="-mt-1 inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
        >
          <Pencil className="size-3.5" />
          {copy.edit}
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text">
        {project.description || <span className="text-text-muted">{copy.noDescription}</span>}
      </p>

      <h3 className={`${heading} mt-6`}>{copy.requirements}</h3>
      {requirements.length > 0 ? (
        <ul className="mt-2 space-y-2 text-sm text-text">
          {requirements.map((requirement) => (
            <li key={requirement} className="flex gap-2">
              <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
              {requirement}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-text-muted">{copy.noRequirements}</p>
      )}

      <h3 className={`${heading} mt-6`}>{copy.project}</h3>
      {detailRows([
        [copy.refNo, project.refNo],
        [copy.projectId, project.projectNumber],
        [copy.status, <ProjectStatusChip key="status" status={project.status} />],
        [copy.deadline, project.deadline || copy.noDeadline],
        [copy.budget, project.budget ? formatPrice(project.budget) : copy.notSet],
        [copy.created, project.created],
        [copy.createdBy, project.createdBy],
        [copy.lastModified, project.lastModified],
        [copy.lastModifiedBy, project.lastModifiedBy],
      ])}

      <h3 className={`${heading} mt-6`}>{copy.client}</h3>
      {detailRows([
        [copy.company, project.client.company || copy.notSet],
        [copy.contact, project.client.contact || copy.notSet],
        [copy.address, project.client.address || copy.notSet],
        [copy.site, project.client.site || copy.notSet],
        [copy.email, project.client.email || copy.notSet],
      ])}

      <h3 className={`${heading} mt-6`}>{copy.consultant}</h3>
      {detailRows([[copy.consultantFirm, project.consultantFirm || copy.notSet]])}
    </>
  )
}
