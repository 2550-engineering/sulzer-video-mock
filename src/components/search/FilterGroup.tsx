import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { searchPage as copy } from '../../data/catalogPages'
import type { FilterGroup as FilterGroupData } from '../../types'

type FilterGroupProps = {
  facet: FilterGroupData
  onToggle: (value: string) => void
  /** "(11)" after the label instead of a right-aligned count. */
  bracketCounts?: boolean
}

/** Options shown before "Show more". */
const visibleOptions = 5

/**
 * Collapsible group of checkboxes with counts, in the filter column. Options
 * that would show nothing are greyed out and can't be ticked (unless already ticked).
 */
export function FilterGroup({ facet, onToggle, bracketCounts = false }: FilterGroupProps) {
  const panelId = useId()
  const [open, setOpen] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const hidden = facet.options.length - visibleOptions
  // Selected options always stay visible.
  const options =
    showAll || hidden <= 0
      ? facet.options
      : facet.options.filter((option, i) => i < visibleOptions || option.selected)

  return (
    <div className="border-t border-border py-4">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between py-1 text-[15px] font-semibold text-navy-900 transition-colors hover:text-primary"
        >
          {facet.label}
          <ChevronDown
            className={`size-4 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>

      {/* Animates height with a grid row from 0fr to 1fr. */}
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-sz ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-1 pt-2">
            {options.map((option) => {
              const empty = option.count === 0 && !option.selected
              return (
                <li key={option.value}>
                  <label
                    className={`flex items-center gap-3 rounded-sm py-1.5 text-[15px] transition-[color,opacity] duration-200 ${
                      empty
                        ? 'cursor-not-allowed text-text-muted opacity-50'
                        : 'cursor-pointer text-text hover:text-primary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={option.selected}
                      disabled={empty}
                      onChange={() => onToggle(option.value)}
                      className="size-[18px] shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
                    />
                    {bracketCounts ? (
                      <span className="min-w-0 flex-1">
                        {option.label}{' '}
                        <span className="text-text-subtle tabular-nums">({option.count})</span>
                      </span>
                    ) : (
                      <>
                        <span className="min-w-0 flex-1">{option.label}</span>
                        <span className="text-sm text-text-subtle tabular-nums">
                          {option.count}
                        </span>
                      </>
                    )}
                  </label>
                </li>
              )
            })}
          </ul>
          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setShowAll((s) => !s)}
              className="mt-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {showAll ? copy.filters.showLess : copy.filters.showMore(hidden)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
