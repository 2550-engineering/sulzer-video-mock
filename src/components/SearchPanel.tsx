import { Search } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { popoverClasses } from '../lib/popover'
import { popularSearches } from '../config/navigation'

type SearchPanelProps = {
  open: boolean
  onClose: () => void
}

/** Full-width search bar that drops down from the header's search icon. */
export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [term, setTerm] = useState('')

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function search(value: string) {
    const q = value.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
    onClose()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    search(term)
  }

  return (
    <div
      id="site-search"
      inert={!open}
      className={`absolute inset-x-0 top-full z-10 border-t border-border bg-white shadow-card ${popoverClasses(open)}`}
    >
      <form role="search" onSubmit={handleSubmit} className="site-container py-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-text-subtle"
              aria-hidden
            />
            <input
              ref={inputRef}
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              aria-label="Search"
              placeholder="Search products, applications, part numbers…"
              className="h-14 w-full rounded-md border border-border-strong bg-white pr-4 pl-14 text-lg text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-14 rounded-md bg-primary px-9 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Search
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="mr-2 text-text-muted">Popular searches</span>
          {popularSearches.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => search(suggestion)}
              className="rounded-pill border border-border bg-surface-muted px-3.5 py-1.5 font-medium text-text transition-colors hover:border-primary-border hover:bg-primary-tint hover:text-primary"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}
