import { MousePointerClick } from 'lucide-react'
import { sparePartsTab } from '../../data/sparePartsPage'

/** Detail area before anything is selected. */
export function EmptySelection() {
  return (
    <div className="flex h-full flex-col items-center justify-center py-6 text-center">
      <MousePointerClick aria-hidden className="size-9 text-primary" strokeWidth={1.5} />
      <p className="mt-3 font-semibold text-navy-900">{sparePartsTab.detail.empty}</p>
      <p className="mt-1 max-w-sm text-sm text-text-muted">{sparePartsTab.detail.emptyText}</p>
    </div>
  )
}
