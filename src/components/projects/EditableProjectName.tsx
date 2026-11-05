import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { myProjectsPage } from '../../data/projectPages'

const copy = myProjectsPage.header

type EditableProjectNameProps = {
  name: string
  onRename: (name: string) => void
}

/**
 * The project name as the page heading. Click it (or the pencil) to edit in
 * place; Enter or leaving the field saves, Escape cancels. An empty name keeps
 * the old one.
 */
export function EditableProjectName({ name, onRename }: EditableProjectNameProps) {
  const [draft, setDraft] = useState<string | null>(null)

  function save() {
    const next = draft?.trim()
    setDraft(null)
    if (next && next !== name) onRename(next)
  }

  if (draft !== null)
    return (
      <input
        autoFocus
        value={draft}
        aria-label={copy.nameLabel}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') setDraft(null)
        }}
        onFocus={(e) => e.target.select()}
        className="-mx-2 h-11 w-full min-w-[16rem] rounded-md border border-primary bg-white px-2 text-[1.75rem] leading-tight font-bold tracking-tight text-brand shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
      />
    )

  return (
    <h1 className="group min-w-0 max-xl:max-w-full max-xl:shrink-0">
      <button
        type="button"
        onClick={() => setDraft(name)}
        title={copy.rename}
        className="-mx-2 inline-flex max-w-full items-center gap-2 rounded-md px-2 text-left text-[1.75rem] leading-tight font-bold tracking-tight text-brand transition-colors hover:bg-surface-subtle max-xl:max-w-[calc(100%+1rem)]"
      >
        <span className="min-w-0">{name}</span>
        <Pencil
          aria-label={copy.rename}
          className="size-4 shrink-0 text-primary opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
        />
      </button>
    </h1>
  )
}
