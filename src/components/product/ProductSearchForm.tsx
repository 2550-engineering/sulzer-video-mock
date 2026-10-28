import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { productSearchPage as copy } from '../../data/catalogPages'

type ProductSearchFormProps = {
  initialQuery: string
  onSearch: (query: string) => void
}

/** Large search box on the Product Center hero. Remount (via `key`) to reset it to a new query. */
export function ProductSearchForm({ initialQuery, onSearch }: ProductSearchFormProps) {
  const [term, setTerm] = useState(initialQuery)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(term.trim())
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex h-16 w-full max-w-3xl items-center rounded-lg bg-white p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] transition-shadow focus-within:shadow-[0_0_0_4px_rgba(110,168,240,0.45),0_24px_60px_-20px_rgba(0,0,0,0.55)]"
    >
      <Search className="ml-4 size-5 shrink-0 text-text-subtle" aria-hidden />
      <input
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
  )
}
