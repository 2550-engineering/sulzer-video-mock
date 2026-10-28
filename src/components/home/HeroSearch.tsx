import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { hero } from '../../data/home'
import { ScopeSelect } from './ScopeSelect'

/** Scoped search box in the home hero. Submits to the scope's page with `?q=`. */
export function HeroSearch() {
  const navigate = useNavigate()
  const [scope, setScope] = useState(hero.searchScopes[0])
  const [term, setTerm] = useState('')

  function search(value: string) {
    const q = value.trim()
    navigate(q ? `${scope.to}?q=${encodeURIComponent(q)}` : scope.to)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    search(term)
  }

  return (
    <div className="w-full max-w-3xl">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex h-16 items-center rounded-lg bg-white p-2 shadow-[0_20px_50px_-20px_rgba(12,28,46,0.4)] ring-1 ring-border transition-shadow focus-within:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong),0_20px_50px_-20px_rgba(12,28,46,0.4)]"
      >
        <ScopeSelect options={hero.searchScopes} value={scope} onChange={setScope} />
        <input
          type="text"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          aria-label={hero.searchLabel}
          placeholder={hero.searchLabel}
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

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="mr-1 font-medium text-text">{hero.popularLabel}</span>
        {hero.popularSearches.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => search(suggestion)}
            className="rounded-pill border border-border-strong bg-white/85 px-3.5 py-1.5 font-medium text-navy-900 backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
