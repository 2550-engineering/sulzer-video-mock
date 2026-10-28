import { searchSuggestions as copy } from '../../data/catalogPages'
import type { SuggestOption } from '../../hooks/useSearchSuggest'
import { SuggestionGroup } from './SuggestionGroup'
import { SuggestionRow } from './SuggestionRow'

type SearchSuggestionsProps = {
  id: string
  open: boolean
  options: SuggestOption[]
  /** The (debounced) text the suggestions were made for. */
  query: string
  activeIndex: number
  optionId: (index: number) => string
  onHighlight: (index: number) => void
  onPick: (index: number) => void
  /** Positioning, e.g. "inset-x-0 top-[calc(100%+8px)]". The panel is absolute, so it never moves the page. */
  className?: string
}

const groupOrder = ['product', 'application', 'document'] as const

/** Grouped search suggestions under a search field. Use with `useSearchSuggest`. */
export function SearchSuggestions({
  id,
  open,
  options,
  query,
  activeIndex,
  optionId,
  onHighlight,
  onPick,
  className = '',
}: SearchSuggestionsProps) {
  const indexed = options.map((option, index) => ({ option, index }))
  const groups = groupOrder
    .map((kind) => ({ kind, rows: indexed.filter(({ option }) => option.kind === kind) }))
    .filter((group) => group.rows.length > 0)
  const footer = indexed.at(-1)!

  const row = ({ option, index }: (typeof indexed)[number]) => (
    <SuggestionRow
      key={optionId(index)}
      id={optionId(index)}
      option={option}
      active={index === activeIndex}
      query={query}
      onHighlight={() => onHighlight(index)}
      onPick={() => onPick(index)}
    />
  )

  return (
    <div
      id={id}
      role="listbox"
      aria-label={copy.label}
      inert={!open}
      // Keeps focus in the field while a row is clicked.
      onMouseDown={(event) => event.preventDefault()}
      className={`absolute z-30 overflow-hidden rounded-lg bg-white text-left shadow-[0_24px_60px_-20px_rgba(12,28,46,0.45)] ring-1 ring-navy-900/10 duration-150 ease-sz ${
        open
          ? 'visible translate-y-0 opacity-100 transition-[opacity,translate]'
          : 'invisible -translate-y-1 opacity-0 transition-[opacity,translate,visibility]'
      } ${className}`}
    >
      {groups.length > 0 ? (
        // Side by side from tablet width; products take a third when they share the row.
        <div className="divide-y divide-border md:flex md:divide-x md:divide-y-0">
          {groups.map((group) => (
            <SuggestionGroup
              key={group.kind}
              title={copy.groups[group.kind]}
              className={
                group.kind === 'product' && groups.length > 1
                  ? 'md:w-1/3 md:shrink-0'
                  : 'min-w-0 md:flex-1'
              }
            >
              {group.rows.map(row)}
            </SuggestionGroup>
          ))}
        </div>
      ) : (
        <p className="px-5 py-4 text-[15px] text-text-muted">{copy.noMatches(query.trim())}</p>
      )}
      {row(footer)}
    </div>
  )
}
