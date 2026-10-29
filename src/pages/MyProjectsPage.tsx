import {
  Copy,
  Download,
  FolderOpen,
  Pencil,
  Printer,
  Settings2,
  Trash2,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { Breadcrumb } from '../components/Breadcrumb'
import { IconButton } from '../components/IconButton'
import { ProjectDetailsPanel } from '../components/projects/ProjectDetailsPanel'
import { ProjectItemsTable } from '../components/projects/ProjectItemsTable'
import { ProjectList } from '../components/projects/ProjectList'
import { ProjectSizings } from '../components/projects/ProjectSizings'
import { ProjectStatusChip } from '../components/projects/ProjectStatusChip'
import { Switch } from '../components/Switch'
import { signedOutRedirect } from '../data/myPages'
import { myProjectsPage as copy } from '../data/projectPages'
import { useProjects } from '../projects/useProjects'
import { useToast } from '../toast/useToast'
import { NotFoundPage } from './NotFoundPage'

const outlined =
  'inline-flex h-10 items-center gap-2 rounded-pill border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint'

/**
 * My Projects: /my-projects (opens the most recently modified project) and
 * /my-projects/:projectId. Signed-in only. ?added=<item ids> highlights rows
 * that were just added from sizing.
 */
export function MyProjectsPage() {
  const { user } = useAuth()
  const { projectId } = useParams()
  const [searchParams] = useSearchParams()
  const { projects, updateItem, duplicateSizing, deleteSizing } = useProjects()
  const showToast = useToast()
  const [advanced, setAdvanced] = useState(false)

  if (!user) return <Navigate to={signedOutRedirect} replace />

  if (!projectId) {
    const latest = [...projects].sort((a, b) => b.modifiedOrder - a.modifiedOrder)[0]
    return latest ? <Navigate to={`/my-projects/${latest.id}`} replace /> : <NotFoundPage />
  }

  const project = projects.find((p) => p.id === projectId)
  if (!project) return <NotFoundPage />

  const added = (searchParams.get('added') ?? '').split(',').filter(Boolean)
  const productCount = project.items.reduce((n, item) => n + item.quantity, 0)
  const toast = (message: string) => showToast({ message })

  return (
    <>
      <title>{`${project.name} – ${copy.title} | Sulzer`}</title>

      <section className="bg-surface-muted">
        <div className="site-container pt-5 pb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Breadcrumb items={[...copy.breadcrumb, { label: copy.title }]} />
            {/* Visual only for now; Module 4 extends My Projects. */}
            <Switch label={copy.advanced} checked={advanced} onChange={setAdvanced} />
          </div>

          <div className="mt-6 grid items-start gap-6 xl:grid-cols-[17rem_minmax(0,1fr)_19rem]">
            <ProjectList projects={projects} currentId={project.id} />

            <div key={project.id} className="min-w-0 animate-fade-in">
              <div className="rounded-lg border border-border bg-white px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-brand">
                        {project.name}
                      </h1>
                      <ProjectStatusChip status={project.status} />
                    </div>
                    <p className="mt-1 text-sm text-text-muted tabular-nums">
                      {project.refNo} · {project.lastModified}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <IconButton
                      icon={Printer}
                      label={copy.toolbar.print}
                      onClick={() => toast(copy.toasts.print)}
                    />
                    <IconButton
                      icon={Download}
                      label={copy.toolbar.download}
                      onClick={() => toast(copy.toasts.download(project.name))}
                    />
                    <IconButton
                      icon={Pencil}
                      label={copy.toolbar.edit}
                      onClick={() => toast(copy.toasts.edit)}
                    />
                    <IconButton
                      icon={Copy}
                      label={copy.toolbar.copy}
                      onClick={() => toast(copy.toasts.copy(project.name))}
                    />
                    <IconButton
                      icon={Trash2}
                      label={copy.toolbar.delete}
                      onClick={() => toast(copy.toasts.delete)}
                    />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to={copy.actions.addProductTo}
                    className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    <FolderOpen className="size-4" />
                    {copy.actions.addProduct}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toast(copy.toasts.margins)}
                    className={outlined}
                  >
                    <Wallet className="size-4" />
                    {copy.actions.margins}
                  </button>
                  <button
                    type="button"
                    onClick={() => toast(copy.toasts.columns)}
                    className={outlined}
                  >
                    <Settings2 className="size-4" />
                    {copy.actions.columns}
                  </button>
                </div>
              </div>

              {project.sizings.length > 0 && (
                <>
                  <h2 className="mt-6 mb-3 text-lg font-bold tracking-tight text-navy-900">
                    {copy.sizings.title}{' '}
                    <span className="font-normal text-text-muted">({project.sizings.length})</span>
                  </h2>
                  <ProjectSizings
                    project={project}
                    onDuplicate={(sizingId) => {
                      duplicateSizing(project.id, sizingId)
                      toast(
                        copy.sizings.duplicated(
                          project.sizings.find((s) => s.id === sizingId)!.name,
                        ),
                      )
                    }}
                    onDelete={(sizingId) => {
                      const name = project.sizings.find((s) => s.id === sizingId)!.name
                      deleteSizing(project.id, sizingId)
                      toast(copy.sizings.deleted(name))
                    }}
                  />
                </>
              )}

              <h2 className="mt-6 mb-3 text-lg font-bold tracking-tight text-navy-900">
                {copy.items.title}{' '}
                <span className="font-normal text-text-muted">({productCount})</span>
              </h2>
              {project.items.length > 0 ? (
                <ProjectItemsTable
                  items={project.items}
                  highlightIds={added}
                  signedIn
                  sizings={project.sizings}
                  onChange={(itemId, patch) => updateItem(project.id, itemId, patch)}
                />
              ) : (
                <div className="flex flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
                  <FolderOpen aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
                  <p className="mt-4 text-lg font-semibold text-navy-900">
                    {copy.items.empty.title}
                  </p>
                  <p className="mt-1 max-w-md text-text-muted">{copy.items.empty.text}</p>
                  <div className="mt-6 flex gap-3">
                    <Link
                      to="/sizing"
                      className="inline-flex h-10 items-center rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                      {copy.items.empty.size}
                    </Link>
                    <Link to="/products" className={outlined}>
                      {copy.items.empty.find}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <ProjectDetailsPanel
              key={`panel-${project.id}`}
              project={project}
              onDownload={(title) => toast(copy.toasts.document(title))}
            />
          </div>
        </div>
      </section>
    </>
  )
}
