import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { searchPage as copy } from '../../data/catalogPages'
import { useSearchSuggest } from '../../hooks/useSearchSuggest'
import { SearchSuggestions } from './SearchSuggestions'

type ResultsSearchFormProps = {
  initialQuery: string
  onSearch: (query: string) => void
}

/** Search field at the top of /products, with suggestions. Remount (via `key`) to reset it to a new query. */
export function ResultsSearchForm({ initialQuery, onSearch }: ResultsSearchFormProps) {
  const [term, setTerm] = useState(initialQuery)
  const { inputProps, panelProps } = useSearchSuggest(term)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(term)
  }

  return (
    <div className="relative w-full max-w-3xl">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex h-16 items-center rounded-lg border border-border-strong bg-white p-2 transition-[border-color,box-shadow] focus-within:border-primary focus-within:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)]"
      >
        <Search className="ml-3 size-5 shrink-0 text-text-subtle" aria-hidden />
        <input
          {...inputProps}
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          aria-label={copy.searchLabel}
          placeholder={copy.searchLabel}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-lg text-text placeholder:text-text-subtle focus-visible:outline-none"
        />
        <button
          type="submit"
          className="flex h-12 items-center rounded-md bg-primary px-7 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {copy.searchButtonLabel}
        </button>
      </form>
      <SearchSuggestions {...panelProps} className="inset-x-0 top-[calc(100%+8px)]" />
    </div>
  )
}
