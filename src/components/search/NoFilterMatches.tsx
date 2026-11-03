import { SlidersHorizontal } from 'lucide-react'
import { searchPage as copy } from '../../data/catalogPages'

/** Empty result list after filtering, with "Reset filters". */
export function NoFilterMatches({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-5 flex flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
      <SlidersHorizontal aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
      <p className="mt-4 text-lg font-semibold text-navy-900">{copy.noFilterMatches.title}</p>
      <p className="mt-2 text-text-muted">{copy.noFilterMatches.text}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        {copy.noFilterMatches.action}
      </button>
    </div>
  )
}
