import { Download } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import { getVariant } from '../../lib/variants'
import type { Project } from '../../types'
import { FileTypeIcon } from '../product/FileTypeIcon'
import { ProjectStatusChip } from './ProjectStatusChip'

const copy = myProjectsPage.panel
type Tab = keyof typeof copy.tabs

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

const detailRows = (rows: [string, ReactNode][]) => (
  <dl className="divide-y divide-border text-sm">
    {rows.map(([label, value]) => (
      <div key={label} className="flex justify-between gap-4 py-2.5">
        <dt className="text-text-muted">{label}</dt>
        <dd className="text-right font-semibold text-navy-900">{value}</dd>
      </div>
    ))}
  </dl>
)

/** Right column: tabs Project details, Members and Documents. */
export function ProjectDetailsPanel({
  project,
  onDownload,
}: {
  project: Project
  onDownload: (title: string) => void
}) {
  const ids = useId()
  const [tab, setTab] = useState<Tab>('details')
  const dataSheets = [...new Set(project.items.map((item) => item.variantId))].map((id) => ({
    title: copy.dataSheet(getVariant(id)?.name ?? id),
    format: 'PDF',
    size: '1.1 MB',
  }))
  const curves = project.sizings
    .filter((sizing) => sizing.includeCurves)
    .map((sizing) => ({ title: copy.curves(sizing.name), format: 'PDF', size: '0.8 MB' }))

  return (
    <aside className="self-start rounded-lg border border-border bg-white">
      <div role="tablist" className="flex border-b border-border px-2">
        {(Object.keys(copy.tabs) as Tab[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`${ids}-${id}-tab`}
            aria-selected={tab === id}
            aria-controls={`${ids}-panel`}
            onClick={() => setTab(id)}
            className={`relative px-3 py-3.5 text-sm font-semibold transition-colors ${
              tab === id ? 'text-navy-900' : 'text-text-muted hover:text-navy-900'
            }`}
          >
            {copy.tabs[id]}
            {tab === id && (
              <span
                aria-hidden
                className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-sm bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <div
        key={tab}
        id={`${ids}-panel`}
        role="tabpanel"
        aria-labelledby={`${ids}-${tab}-tab`}
        className="animate-fade-in px-5 py-4"
      >
        {tab === 'details' && (
          <>
            <h3 className="text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
              {copy.project}
            </h3>
            {detailRows([
              [copy.refNo, project.refNo],
              [copy.projectId, project.projectNumber],
              [copy.status, <ProjectStatusChip key="status" status={project.status} />],
              [copy.deadline, project.deadline ?? copy.noDeadline],
              [copy.created, project.created],
              [copy.createdBy, project.createdBy],
              [copy.lastModified, project.lastModified],
              [copy.lastModifiedBy, project.lastModifiedBy],
            ])}
            <h3 className="mt-6 text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
              {copy.client}
            </h3>
            {detailRows([
              [copy.company, project.client.company],
              [copy.contact, project.client.contact],
              [copy.site, project.client.site || copy.notSet],
              [copy.email, project.client.email],
            ])}
          </>
        )}

        {tab === 'members' && (
          <ul className="divide-y divide-border">
            {project.members.map((member) => (
              <li key={member.name} className="flex items-center gap-3 py-3">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white"
                >
                  {initials(member.name)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-navy-900">{member.name}</span>
                  <span className="block text-xs text-text-muted">{member.role}</span>
                </span>
              </li>
            ))}
          </ul>
        )}

        {tab === 'documents' && (
          <ul className="divide-y divide-border">
            {[...copy.projectDocuments, ...curves, ...dataSheets].map((doc) => (
              <li key={doc.title} className="flex items-center gap-3 py-3">
                <FileTypeIcon format={doc.format} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-navy-900">{doc.title}</span>
                  <span className="block text-xs text-text-muted">
                    {doc.format} · {doc.size}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onDownload(doc.title)}
                  aria-label={doc.title}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-tint"
                >
                  <Download className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
