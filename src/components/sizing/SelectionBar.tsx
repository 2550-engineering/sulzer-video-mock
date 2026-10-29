import { FolderPlus, Save, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { sizingResultsPage } from '../../data/sizingPages'

const copy = sizingResultsPage.selectionBar

type SelectionBarProps = {
  count: number
  onAddToProject: () => void
  /** "Save as project", or "Update project" when re-sizing a saved sizing. */
  saveLabel: string
  onSave: () => void
  onClear: () => void
}

/** Sticky bar at the bottom while result rows are ticked: "<n> selected · Add to project · Save as project". */
export function SelectionBar({
  count,
  onAddToProject,
  saveLabel,
  onSave,
  onClear,
}: SelectionBarProps) {
  const open = count > 0
  return createPortal(
    <div
      inert={!open}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 shadow-[0_-12px_32px_-16px_rgba(12,28,46,0.25)] backdrop-blur-sm transition-transform duration-250 ease-sz ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Right padding keeps the buttons clear of the chat button. */}
      <div className="site-container flex flex-wrap items-center gap-x-5 gap-y-3 py-3.5 lg:pr-24">
        <p className="text-sm font-semibold text-navy-900 tabular-nums" aria-live="polite">
          {copy.selected(count)}
        </p>
        <button
          type="button"
          onClick={onClear}
          aria-label={copy.clear}
          className="flex size-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-muted hover:text-navy-900"
        >
          <X className="size-4" />
        </button>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onAddToProject}
            className="inline-flex h-10 items-center gap-2 rounded-pill border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
          >
            <FolderPlus className="size-4" />
            {copy.addToProject}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            <Save className="size-4" />
            {saveLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
