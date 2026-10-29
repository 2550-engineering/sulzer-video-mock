import { FolderPlus, LogIn } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useAuth } from '../../auth/useAuth'
import { sizingResultsPage } from '../../data/sizingPages'
import type { SizingDraft } from '../../projects/ProjectsContext'
import { useProjects } from '../../projects/useProjects'
import { useToast } from '../../toast/useToast'
import { Modal } from '../Modal'
import { ProjectStatusChip } from '../projects/ProjectStatusChip'

const copy = sizingResultsPage.saveDialog

type SaveSizingDialogProps = {
  open: boolean
  /** The sizing to save; name, curves and params follow the dialog's choices. */
  sizing: Omit<SizingDraft, 'name' | 'includeCurves'>
  /** True when no row is ticked and the best match is saved. */
  bestMatchOnly: boolean
  defaultName: string
  onClose: () => void
}

const field =
  'w-full rounded-md border border-border-strong bg-white px-3.5 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none'

/**
 * "Save as project": a new project (default) or an existing active one, what
 * to include, and Save. Signed out, a sign-in step comes first. Confirms with
 * "Project saved" and "Open project". Remount (via `key`) per opening.
 */
export function SaveSizingDialog({
  open,
  sizing,
  bestMatchOnly,
  defaultName,
  onClose,
}: SaveSizingDialogProps) {
  const ids = useId()
  const { user, signIn } = useAuth()
  const { projects, saveSizing } = useProjects()
  const showToast = useToast()
  const active = projects
    .filter((p) => p.status !== 'Quoted')
    .sort((a, b) => b.modifiedOrder - a.modifiedOrder)

  const [target, setTarget] = useState<'new' | 'existing'>('new')
  const [projectId, setProjectId] = useState(active[0]?.id ?? '')
  const [name, setName] = useState(defaultName)
  const [site, setSite] = useState('')
  const [note, setNote] = useState('')
  const [includeParams, setIncludeParams] = useState(true)
  const [includeProducts, setIncludeProducts] = useState(true)
  const [includeCurves, setIncludeCurves] = useState(true)

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const projectName = name.trim() || defaultName
    const result = saveSizing(
      target === 'new'
        ? { kind: 'new', name: projectName, site: site.trim(), note: note.trim() }
        : { kind: 'existing', projectId },
      {
        ...sizing,
        name: projectName,
        params: includeParams ? sizing.params : [],
        includeCurves,
      },
      includeProducts,
    )
    showToast({
      message: copy.saved,
      action: {
        label: copy.open,
        to: `/my-projects/${result.projectId}${result.itemIds.length ? `?added=${result.itemIds.join(',')}` : ''}`,
      },
    })
    onClose()
  }

  const radio = (checked: boolean) =>
    `flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-[border-color,background-color] duration-150 ${
      checked ? 'border-primary bg-primary-tint' : 'border-border hover:border-primary-border'
    }`
  const check = (checked: boolean, onChange: (value: boolean) => void, label: string) => (
    <label className="flex cursor-pointer items-start gap-3 py-1.5 text-sm text-text">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-primary"
      />
      {label}
    </label>
  )

  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-xl"
    >
      {!user ? (
        <div className="flex flex-col items-center px-8 py-10 text-center">
          <FolderPlus aria-hidden className="size-10 text-primary" strokeWidth={1.5} />
          <p className="mt-4 text-lg font-bold text-navy-900">{copy.signIn.title}</p>
          <p className="mt-2 max-w-sm text-text-muted">{copy.signIn.text}</p>
          <button
            type="button"
            onClick={signIn}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <LogIn className="size-4" />
            {copy.signIn.action}
          </button>
        </div>
      ) : (
        <form onSubmit={save} className="space-y-6 px-7 py-6">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-navy-900">{copy.target}</legend>
            <div className="space-y-2">
              <label className={radio(target === 'new')}>
                <input
                  type="radio"
                  name={`${ids}-target`}
                  checked={target === 'new'}
                  onChange={() => setTarget('new')}
                  className="size-4 accent-primary"
                />
                <span className="font-semibold text-navy-900">{copy.newProject}</span>
              </label>
              {target === 'new' && (
                <div className="animate-fade-in space-y-3 pt-1 pl-7">
                  <div>
                    <label
                      htmlFor={`${ids}-name`}
                      className="mb-1 block text-sm font-semibold text-navy-900"
                    >
                      {copy.name}
                    </label>
                    <input
                      id={`${ids}-name`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${field} h-10`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`${ids}-site`}
                      className="mb-1 block text-sm font-semibold text-navy-900"
                    >
                      {copy.site}
                    </label>
                    <input
                      id={`${ids}-site`}
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      placeholder={copy.sitePlaceholder}
                      className={`${field} h-10`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`${ids}-note`}
                      className="mb-1 block text-sm font-semibold text-navy-900"
                    >
                      {copy.note}
                    </label>
                    <textarea
                      id={`${ids}-note`}
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className={`${field} resize-none py-2`}
                    />
                  </div>
                </div>
              )}
              <label className={radio(target === 'existing')}>
                <input
                  type="radio"
                  name={`${ids}-target`}
                  checked={target === 'existing'}
                  onChange={() => setTarget('existing')}
                  disabled={active.length === 0}
                  className="size-4 accent-primary"
                />
                <span className="font-semibold text-navy-900">{copy.existingProject}</span>
              </label>
              {target === 'existing' && (
                <div className="animate-fade-in space-y-1.5 pt-1 pl-7">
                  {active.map((project) => (
                    <label key={project.id} className={radio(projectId === project.id)}>
                      <input
                        type="radio"
                        name={`${ids}-project`}
                        checked={projectId === project.id}
                        onChange={() => setProjectId(project.id)}
                        className="size-4 accent-primary"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-navy-900">
                          {project.name}
                        </span>
                        <span className="block text-xs text-text-muted">
                          {project.refNo} ·{' '}
                          {copy.products(project.items.reduce((n, i) => n + i.quantity, 0))}
                        </span>
                      </span>
                      <ProjectStatusChip status={project.status} />
                    </label>
                  ))}
                </div>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1 text-sm font-semibold text-navy-900">{copy.include}</legend>
            {check(includeParams, setIncludeParams, copy.includeParams)}
            {check(
              includeProducts,
              setIncludeProducts,
              copy.includeProducts(sizing.variantIds.length, bestMatchOnly),
            )}
            {check(includeCurves, setIncludeCurves, copy.includeCurves)}
          </fieldset>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center rounded-pill px-5 text-sm font-semibold text-navy-900 transition-colors hover:bg-surface-muted"
            >
              {copy.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-pill bg-primary px-7 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
            >
              {copy.save}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
