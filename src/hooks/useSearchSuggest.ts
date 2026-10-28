import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { applicationPath, getProduct, productPath } from '../lib/catalog'
import { minSuggestLength, normalizeQuery, searchPath, suggestGroups } from '../lib/search'
import type { Application, Document, Product } from '../types'
import { useDebouncedValue } from './useDebouncedValue'

/** Wait after the last keystroke before suggestions update. */
const debounceMs = 120

/** One row in the suggestion panel, in keyboard order. `all` is the "See all results" footer. */
export type SuggestOption = { to: string } & (
  | { kind: 'product'; product: Product }
  | { kind: 'application'; application: Application }
  | { kind: 'document'; document: Document; products: Product[] }
  | { kind: 'all' }
)

/**
 * Combobox behaviour for a search field: debounced grouped suggestions, arrow
 * keys, Enter on the highlighted row, Esc to close. Spread `inputProps` on the
 * input and pass `panelProps` to <SearchSuggestions>. Enter with no row
 * highlighted is left to the form's own submit.
 */
export function useSearchSuggest(term: string, onNavigate?: () => void) {
  const navigate = useNavigate()
  const listboxId = useId()
  const query = useDebouncedValue(term, debounceMs)
  const [focused, setFocused] = useState(false)
  // Esc closes the panel for the current text; typing reopens it.
  const [closedFor, setClosedFor] = useState<string | null>(null)
  // The highlight belongs to the suggestions it was made on, so new suggestions start unhighlighted.
  const [active, setActive] = useState({ query: '', index: -1 })

  const options = useMemo<SuggestOption[]>(() => {
    const groups = suggestGroups(query)
    return [
      ...groups.products.map((product) => ({
        kind: 'product' as const,
        product,
        to: product.viewTo ?? productPath(product),
      })),
      ...groups.applications.map((application) => ({
        kind: 'application' as const,
        application,
        to: applicationPath(application),
      })),
      ...groups.documents.map((document) => {
        const products = document.productIds.map(getProduct).filter((p) => p !== undefined)
        return {
          kind: 'document' as const,
          document,
          products,
          to: products[0] ? `${productPath(products[0])}#documentation` : searchPath(query),
        }
      }),
      { kind: 'all' as const, to: searchPath(query) },
    ]
  }, [query])

  const long = (text: string) => normalizeQuery(text).length >= minSuggestLength
  const open = focused && long(term) && long(query) && closedFor !== term
  const activeIndex = open && active.query === query ? active.index : -1
  const optionId = (index: number) => `${listboxId}-${index}`

  function highlight(index: number) {
    setActive({ query, index })
  }

  function pick(index: number) {
    navigate(options[index].to)
    setClosedFor(term)
    onNavigate?.()
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open) return
    const last = options.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        // Past the last row the highlight returns to the field.
        highlight(activeIndex >= last ? -1 : activeIndex + 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        highlight(activeIndex < 0 ? last : activeIndex - 1)
        break
      case 'Enter':
        if (activeIndex < 0) return
        event.preventDefault()
        pick(activeIndex)
        break
      case 'Escape':
        // Only close the suggestions; a second Esc reaches the header and closes the search panel.
        event.preventDefault()
        event.stopPropagation()
        setClosedFor(term)
        break
    }
  }

  return {
    inputProps: {
      role: 'combobox',
      'aria-expanded': open,
      'aria-controls': listboxId,
      'aria-autocomplete': 'list' as const,
      'aria-activedescendant': activeIndex >= 0 ? optionId(activeIndex) : undefined,
      autoComplete: 'off',
      onKeyDown,
      onFocus: () => {
        setFocused(true)
        setClosedFor(null)
      },
      onBlur: () => setFocused(false),
    },
    panelProps: {
      id: listboxId,
      open,
      options,
      query,
      activeIndex,
      optionId,
      onHighlight: highlight,
      onPick: pick,
    },
  }
}
