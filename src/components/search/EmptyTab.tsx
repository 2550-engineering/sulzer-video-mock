import { SearchX } from 'lucide-react'
import { searchPage as copy } from '../../data/catalogPages'

type EmptyTabProps = {
  message: string
  /** Other tabs that do have results. */
  alternatives: { id: string; label: string }[]
  onSelect: (id: string) => void
}

/** A result tab with nothing on it, pointing to the tabs that have results. */
export function EmptyTab({ message, alternatives, onSelect }: EmptyTabProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
      <SearchX aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
      <p className="mt-4 text-lg font-semibold text-navy-900">{message}</p>
      {alternatives.length > 0 && (
        <>
          <p className="mt-2 text-text-muted">{copy.emptyTabHint}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {alternatives.map((alternative) => (
              <button
                key={alternative.id}
                type="button"
                onClick={() => onSelect(alternative.id)}
                className="inline-flex h-10 items-center rounded-pill border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {alternative.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
