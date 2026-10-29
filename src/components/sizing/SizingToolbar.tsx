import { Bookmark, ChartSpline, Download, FolderPlus, GitCompareArrows } from 'lucide-react'
import { sizingResultsPage } from '../../data/sizingPages'
import { IconButton } from '../IconButton'

const copy = sizingResultsPage.toolbar

type SizingToolbarProps = {
  selectedCount: number
  allSelected: boolean
  onToggleAll: () => void
  onCompare: () => void
  onDownload: () => void
  onAddToProject: () => void
  onBookmark: () => void
  onShowCurves: () => void
}

/** Above the results table: select all with the count, then icon actions for the ticked rows. */
export function SizingToolbar({
  selectedCount,
  allSelected,
  onToggleAll,
  onCompare,
  onDownload,
  onAddToProject,
  onBookmark,
  onShowCurves,
}: SizingToolbarProps) {
  const none = selectedCount === 0
  const action = (icon: typeof Bookmark, label: string, onClick: () => void) => (
    <IconButton
      icon={icon}
      label={label}
      onClick={onClick}
      disabled={none}
      disabledHint={copy.needSelection}
    />
  )
  return (
    <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-border bg-white px-3 py-2">
      <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm font-semibold text-navy-900">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = selectedCount > 0 && !allSelected
          }}
          onChange={onToggleAll}
          className="size-[18px] cursor-pointer accent-primary"
        />
        <span className="sr-only">{copy.selectAll}</span>
        <span aria-live="polite" className="tabular-nums">
          {copy.selected(selectedCount)}
        </span>
      </label>
      <span aria-hidden className="mx-1 h-6 w-px bg-border" />
      {action(GitCompareArrows, copy.compare, onCompare)}
      {action(Download, copy.download, onDownload)}
      {action(FolderPlus, copy.addToProject, onAddToProject)}
      {action(Bookmark, copy.bookmark, onBookmark)}
      {action(ChartSpline, copy.showCurves, onShowCurves)}
    </div>
  )
}
