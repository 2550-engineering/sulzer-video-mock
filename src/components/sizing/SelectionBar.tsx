import { FolderPlus, Save, Scale, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { sizingResultsPage } from '../../data/sizingPages'

const copy = sizingResultsPage.selectionBar

type SelectionBarProps = {
  count: number
  /** Opens the compare page; `canCompare` when 2–3 rows are ticked. */
  onCompare: () => void
  canCompare: boolean
  onAddToProject: () => void
  /** "Save as project", or "Update project" when re-sizing a saved sizing. */
  saveLabel: string
  onSave: () => void
  onClear: () => void
}

/** Sticky bar at the bottom while result rows are ticked: "<n> selected · Compare (n) · Add to project · Save as project". */
export function SelectionBar({
  count,
  onCompare,
  canCompare,
  onAddToProject,
  saveLabel,
  onSave,
  onClear,
}: SelectionBarProps) {
  const open = count > 0
  return createPortal(
    <div
      inert={!open}
      data-bottom-bar={open ? 'open' : 'closed'}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 shadow-[0_-12px_32px_-16px_rgba(12,28,46,0.25)] backdrop-blur-sm transition-transform duration-250 ease-sz ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Right padding keeps the buttons clear of the chat button. */}
      <div className="site-container flex flex-wrap items-center gap-x-5 gap-y-3 py-3.5 max-md:gap-y-2 max-md:pb-[calc(0.875rem+env(safe-area-inset-bottom))] lg:pr-24">
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
        <div className="ml-auto flex items-center gap-3 max-md:ml-0 max-md:grid max-md:w-full max-md:grid-cols-3 max-md:gap-2">
          <button
            type="button"
            onClick={onCompare}
            aria-disabled={!canCompare || undefined}
            title={canCompare ? undefined : copy.compareHint}
            className={`inline-flex h-10 items-center gap-2 rounded-pill border px-5 text-sm font-semibold transition-colors max-md:justify-center max-md:px-2 max-md:text-[13px] ${
              canCompare
                ? 'border-primary text-primary hover:bg-primary-tint'
                : 'cursor-not-allowed border-border-strong text-text-subtle'
            }`}
          >
            <Scale className="size-4 max-md:hidden" />
            {copy.compare(count)}
          </button>
          <button
            type="button"
            onClick={onAddToProject}
            className="inline-flex h-10 items-center gap-2 rounded-pill border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint max-md:justify-center max-md:px-2 max-md:text-[13px]"
          >
            <FolderPlus className="size-4 max-md:hidden" />
            {copy.addToProject}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover max-md:justify-center max-md:px-2 max-md:text-[13px]"
          >
            <Save className="size-4 max-md:hidden" />
            {saveLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
