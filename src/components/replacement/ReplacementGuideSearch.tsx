import { Check, Search } from 'lucide-react'
import { useId, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { replacementGuidePage } from '../../data/replacementGuidePage'
import { suggestReplacements, type GuideSuggestion } from '../../lib/replacementGuide'
import { SuggestionGroup } from '../search/SuggestionGroup'
import { GuideSuggestionRow } from './GuideSuggestionRow'

const copy = replacementGuidePage.search

/** Characters typed before suggestions open, as in suggestReplacements. */
const minLength = 2

export type GuideSearchStatus = { kind: 'found' | 'error'; text: string }

type ReplacementGuideSearchProps = {
  /** Text the field opens with. Remount (via `key`) to show a new search. */
  initial: string
  /** The green "Matched …" or red "No catalog match" line under the sample chips. */
  status?: GuideSearchStatus
  /** "Find replacement", Enter without a highlighted row, or a sample chip. */
  onSearch: (query: string) => void
  /** A suggestion clicked or chosen with Enter. */
  onPick: (suggestion: GuideSuggestion) => void
}

/**
 * Part / RSK number search of the replacement guide: a combobox with suggestions
 * grouped by brand (arrow keys, Enter, Esc, click outside), the "Find replacement"
 * button, sample chips and the result line.
 */
export function ReplacementGuideSearch({
  initial,
  status,
  onSearch,
  onPick,
}: ReplacementGuideSearchProps) {
  const id = useId()
  const listboxId = `${id}-listbox`
  const [value, setValue] = useState(initial)
  const [focused, setFocused] = useState(false)
  // Esc, a pick or a search closes the list for the current text; typing reopens it.
  const [closedFor, setClosedFor] = useState<string | null>(initial)
  // The highlight belongs to the text it was made for, so new suggestions start unhighlighted.
  const [active, setActive] = useState({ query: '', index: -1 })

  const suggestions = useMemo(() => suggestReplacements(value), [value])
  const open = focused && value.trim().length >= minLength && closedFor !== value
  const activeIndex = open && active.query === value ? active.index : -1
  const optionId = (index: number) => `${listboxId}-${index}`
  const groups = [...new Set(suggestions.map((s) => s.group))].map((group) => ({
    group,
    rows: suggestions
      .map((suggestion, index) => ({ suggestion, index }))
      .filter(({ suggestion }) => suggestion.group === group),
  }))

  const highlight = (index: number) => setActive({ query: value, index })

  function pick(suggestion: GuideSuggestion) {
    setValue(suggestion.label)
    setClosedFor(suggestion.label)
    onPick(suggestion)
  }

  function search(query: string) {
    setValue(query)
    setClosedFor(query)
    onSearch(query.trim())
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (value.trim()) search(value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const last = suggestions.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) {
          setClosedFor(null)
          if (last >= 0) setActive({ query: value, index: 0 })
          break
        }
        // Past the last row the highlight returns to the field.
        highlight(activeIndex >= last ? -1 : activeIndex + 1)
        break
      case 'ArrowUp':
        if (!open) return
        event.preventDefault()
        highlight(activeIndex < 0 ? last : activeIndex - 1)
        break
      case 'Enter':
        if (activeIndex < 0) return
        event.preventDefault()
        pick(suggestions[activeIndex])
        break
      case 'Escape':
        if (!open) return
        event.preventDefault()
        setClosedFor(value)
        break
    }
  }

  return (
    <div>
      <form role="search" onSubmit={handleSubmit}>
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">
          {copy.label}
        </label>
        <div className="flex gap-3 max-sm:flex-col">
          <div className="relative min-w-0 flex-1">
            <div className="flex h-14 items-center rounded-md border border-border-strong bg-white transition-[border-color,box-shadow] focus-within:border-primary focus-within:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)]">
              <Search aria-hidden className="ml-4 size-5 shrink-0 text-text-subtle" />
              <input
                id={id}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value)
                  setClosedFor(null)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={copy.placeholder}
                role="combobox"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
                autoComplete="off"
                spellCheck={false}
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-[17px] text-text tabular-nums placeholder:text-text-subtle focus-visible:outline-none"
              />
            </div>

            <div
              id={listboxId}
              role="listbox"
              aria-label={copy.suggestions}
              inert={!open}
              // Keeps focus in the field while a row is clicked.
              onMouseDown={(event) => event.preventDefault()}
              className={`absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-[min(28rem,60vh)] overflow-y-auto rounded-lg bg-white text-left shadow-[0_24px_60px_-20px_rgba(12,28,46,0.45)] ring-1 ring-navy-900/10 duration-150 ease-sz ${
                open
                  ? 'visible translate-y-0 opacity-100 transition-[opacity,translate]'
                  : 'invisible -translate-y-1 opacity-0 transition-[opacity,translate,visibility]'
              }`}
            >
              {groups.length > 0 ? (
                <div className="divide-y divide-border">
                  {groups.map(({ group, rows }) => (
                    <SuggestionGroup key={group} title={group}>
                      {rows.map(({ suggestion, index }) => (
                        <GuideSuggestionRow
                          key={optionId(index)}
                          id={optionId(index)}
                          suggestion={suggestion}
                          active={index === activeIndex}
                          query={value}
                          onHighlight={() => highlight(index)}
                          onPick={() => pick(suggestion)}
                        />
                      ))}
                    </SuggestionGroup>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-4 text-[15px] text-text-muted">
                  {copy.noMatches(value.trim())}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="h-14 shrink-0 rounded-md bg-primary px-7 font-semibold text-white shadow-raised transition-colors duration-150 hover:bg-primary-hover"
          >
            {copy.button}
          </button>
        </div>
      </form>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[13px] text-text-subtle">{copy.examplesLabel}</span>
        {copy.examples.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => search(example.query)}
            className="rounded-pill border border-primary-border bg-primary-tint px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors duration-150 hover:border-primary hover:bg-primary-tint-strong"
          >
            {example.label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {status && (
          <p
            key={status.text}
            className={`mt-3 flex animate-fade-in items-center gap-2.5 text-sm font-semibold ${
              status.kind === 'found' ? 'text-success-strong' : 'text-danger'
            }`}
          >
            {status.kind === 'found' && (
              <span
                aria-hidden
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-white"
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            )}
            <span className="whitespace-pre-wrap">{status.text}</span>
          </p>
        )}
      </div>
    </div>
  )
}
