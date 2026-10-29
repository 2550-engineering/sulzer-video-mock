import { FolderOpen, SlidersHorizontal } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useAuth } from '../../auth/useAuth'
import { sizingParametersPage } from '../../data/sizingPages'
import { readParameterSets } from '../../lib/parameterSets'
import { useProjects } from '../../projects/useProjects'
import { Modal } from '../Modal'

const copy = sizingParametersPage.loadSet

type LoadParametersDialogProps = {
  open: boolean
  onClose: () => void
  /** Load a parameter set, or (with `link`) a sizing saved in a project, to update it later. */
  onLoad: (
    name: string,
    params: [string, string][],
    link?: { projectId: string; sizingId: string },
  ) => void
}

/**
 * "Load parameters": the saved parameter sets, and the sizings saved in the
 * user's projects. Remount (via `key`) per opening to re-read the saved sets.
 */
export function LoadParametersDialog({ open, onClose, onLoad }: LoadParametersDialogProps) {
  const { user } = useAuth()
  const { projects } = useProjects()
  const [sets] = useState(readParameterSets)
  const sizings = projects.flatMap((project) =>
    project.sizings
      .filter((sizing) => sizing.params.length > 0)
      .map((sizing) => ({ project, sizing })),
  )

  const row = (key: string, icon: ReactNode, title: string, detail: string, load: () => void) => (
    <li key={key} className="flex items-center gap-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-navy-900">{title}</span>
        <span className="block text-xs text-text-muted">{detail}</span>
      </span>
      <button
        type="button"
        onClick={load}
        className="inline-flex h-8 items-center rounded-pill border border-primary px-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
      >
        {copy.load}
      </button>
    </li>
  )

  const heading = 'text-xs font-semibold tracking-[0.08em] text-text-muted uppercase'

  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-xl"
    >
      <div className="px-7 py-6">
        <h3 className={heading}>{copy.saved}</h3>
        {sets.length > 0 ? (
          <ul className="mt-1 divide-y divide-border">
            {sets.map((set) =>
              row(
                set.id,
                <SlidersHorizontal className="size-4" />,
                set.name,
                copy.savedOn(set.saved),
                () => onLoad(set.name, set.params),
              ),
            )}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-text-muted">{copy.noneSaved}</p>
        )}

        <h3 className={`${heading} mt-7`}>{copy.projects}</h3>
        {!user ? (
          <p className="mt-2 text-sm text-text-muted">{copy.signInForProjects}</p>
        ) : sizings.length > 0 ? (
          <ul className="mt-1 divide-y divide-border">
            {sizings.map(({ project, sizing }) =>
              row(
                sizing.id,
                <FolderOpen className="size-4" />,
                sizing.name,
                copy.inProject(project.name, sizing.created),
                () =>
                  onLoad(sizing.name, sizing.params, {
                    projectId: project.id,
                    sizingId: sizing.id,
                  }),
              ),
            )}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-text-muted">{copy.noneInProjects}</p>
        )}
      </div>
    </Modal>
  )
}
