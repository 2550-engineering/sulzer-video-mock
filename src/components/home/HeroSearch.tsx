import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { searchScopes } from '../../data/catalogPages'
import { hero } from '../../data/home'
import { useSearchSuggest } from '../../hooks/useSearchSuggest'
import { scopePath } from '../../lib/search'
import { ScopeSelect } from '../search/ScopeSelect'
import { SearchSuggestions } from '../search/SearchSuggestions'

/** Scoped search box in the home hero ("Find a Sulzer product"), with suggestions for the scope. */
export function HeroSearch() {
  const navigate = useNavigate()
  const [scope, setScope] = useState<(typeof searchScopes)[number]>(searchScopes[0])
  const [term, setTerm] = useState('')
  const { inputProps, panelProps } = useSearchSuggest(term, scope.id)
  const placeholder = ('placeholder' in scope && scope.placeholder) || hero.searchLabel

  function search(value: string) {
    navigate(scopePath(value, scope.id))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    search(term)
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Wraps only the form, so the suggestions open right under the field and over the chips. */}
      <div className="relative">
        <form
          role="search"
          onSubmit={handleSubmit}
          className="flex h-16 items-center rounded-lg bg-white p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] transition-shadow focus-within:shadow-[0_0_0_4px_rgba(110,168,240,0.45),0_24px_60px_-20px_rgba(0,0,0,0.55)]"
        >
          <ScopeSelect options={searchScopes} value={scope} onChange={setScope} />
          <input
            {...inputProps}
            type="text"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            aria-label={placeholder}
            placeholder={placeholder}
            className="h-full min-w-0 flex-1 bg-transparent px-5 text-lg text-text placeholder:text-text-subtle focus-visible:outline-none"
          />
          <button
            type="submit"
            className="flex h-12 items-center gap-2 rounded-md bg-primary px-6 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Search className="size-[18px]" strokeWidth={2.25} />
            {hero.searchButtonLabel}
          </button>
        </form>
        <SearchSuggestions {...panelProps} className="inset-x-0 top-[calc(100%+10px)]" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="mr-1 text-text-on-dark-muted">{hero.popularLabel}</span>
        {hero.popularSearches.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => search(suggestion)}
            className="rounded-pill border border-white/20 bg-white/10 px-3.5 py-1.5 font-medium text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/20"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
