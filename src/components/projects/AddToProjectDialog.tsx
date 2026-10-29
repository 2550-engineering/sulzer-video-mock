import { FolderPlus, LogIn } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useAuth } from '../../auth/useAuth'
import { addToProjectDialog as copy } from '../../data/projectPages'
import { useProjects } from '../../projects/useProjects'
import { useToast } from '../../toast/useToast'
import type { DutyPoint, SizingResult } from '../../types'
import { Modal } from '../Modal'
import { ProjectStatusChip } from './ProjectStatusChip'

const newProject = 'new'

type AddToProjectDialogProps = {
  open: boolean
  results: SizingResult[]
  duty: DutyPoint
  onClose: () => void
}

/**
 * "Add to project": signed out, a sign-in step first (the fake sign-in, then
 * it continues in place); signed in, choose an active project or create one,
 * then Save. Confirms with a toast that opens the project with the new rows
 * highlighted. Remount (via `key`) for each opening to start fresh.
 */
export function AddToProjectDialog({ open, results, duty, onClose }: AddToProjectDialogProps) {
  const ids = useId()
  const { user, signIn } = useAuth()
  const { projects, addItems, createProject } = useProjects()
  const showToast = useToast()

  // Active = not yet quoted. Most recently modified first, so "Riverside intake" leads.
  const active = projects
    .filter((project) => project.status !== 'Quoted')
    .sort((a, b) => b.modifiedOrder - a.modifiedOrder)
  const [choice, setChoice] = useState(active[0]?.id ?? newProject)
  const [name, setName] = useState('')

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const newName = name.trim() || copy.newProjectDefault
    const entries = results.map((result) => ({ variantId: result.variant.id, dutyPoint: duty }))
    const { projectId, itemIds } =
      choice === newProject
        ? createProject(newName, entries)
        : { projectId: choice, itemIds: addItems(choice, entries) }
    const projectName =
      choice === newProject ? newName : (projects.find((p) => p.id === choice)?.name ?? '')
    showToast({
      message: copy.added(results.length, projectName),
      action: { label: copy.open, to: `/my-projects/${projectId}?added=${itemIds.join(',')}` },
    })
    onClose()
  }

  const option = (checked: boolean) =>
    `flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-[border-color,background-color] duration-150 ${
      checked ? 'border-primary bg-primary-tint' : 'border-border hover:border-primary-border'
    }`

  return (
    <Modal
      open={open}
      title={copy.title(results.length)}
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
        <form onSubmit={save} className="px-7 py-6">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-navy-900">{copy.choose}</legend>
            <div className="space-y-2">
              {active.map((project) => (
                <label key={project.id} className={option(choice === project.id)}>
                  <input
                    type="radio"
                    name={`${ids}-project`}
                    checked={choice === project.id}
                    onChange={() => setChoice(project.id)}
                    className="size-4 accent-primary"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy-900">{project.name}</span>
                    <span className="block text-xs text-text-muted">
                      {project.refNo} ·{' '}
                      {copy.products(project.items.reduce((n, item) => n + item.quantity, 0))}
                    </span>
                  </span>
                  <ProjectStatusChip status={project.status} />
                </label>
              ))}
              <label className={option(choice === newProject)}>
                <input
                  type="radio"
                  name={`${ids}-project`}
                  checked={choice === newProject}
                  onChange={() => setChoice(newProject)}
                  className="size-4 accent-primary"
                />
                <span className="font-semibold text-navy-900">{copy.newProject}</span>
              </label>
            </div>
          </fieldset>

          {choice === newProject && (
            <div className="mt-4 animate-fade-in">
              <label
                htmlFor={`${ids}-name`}
                className="mb-1.5 block text-sm font-semibold text-navy-900"
              >
                {copy.newProjectName}
              </label>
              <input
                id={`${ids}-name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.newProjectPlaceholder}
                className="h-11 w-full rounded-md border border-border-strong bg-white px-3.5 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
              />
            </div>
          )}

          <div className="mt-7 flex justify-end gap-3">
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
