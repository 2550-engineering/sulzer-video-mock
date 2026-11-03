import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import { useDismiss } from '../../hooks/useDismiss'
import { projectStatuses } from '../../lib/projects'
import type { ProjectStatus } from '../../types'
import { ProjectStatusChip } from './ProjectStatusChip'

const copy = myProjectsPage.header

type ProjectStatusMenuProps = {
  status: ProjectStatus
  onChange: (status: ProjectStatus) => void
}

/** The status chip as a menu button: pick another stage of the project lifecycle. */
export function ProjectStatusMenu({ status, onChange }: ProjectStatusMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${copy.status}: ${status}`}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 rounded-sm transition-opacity hover:opacity-80"
      >
        <ProjectStatusChip status={status} />
        <ChevronDown
          aria-hidden
          className={`size-4 text-text-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul
          role="menu"
          aria-label={copy.status}
          className="absolute top-full left-0 z-30 mt-2 w-56 animate-fade-in rounded-md border border-border bg-white py-1.5 shadow-raised"
        >
          {projectStatuses.map((option) => (
            <li key={option} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={option === status}
                onClick={() => {
                  setOpen(false)
                  if (option !== status) onChange(option)
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-surface-subtle"
              >
                <ProjectStatusChip status={option} />
                {option === status && <Check aria-hidden className="size-4 text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
