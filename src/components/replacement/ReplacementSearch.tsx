import { Search } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { replacementPage as copy } from '../../data/replacementPage'

type ReplacementSearchProps = {
  initial: string
  onSearch: (query: string) => void
}

/** "Product number of your old pump" field. Remount (via `key`) to show a new query. */
export function ReplacementSearch({ initial, onSearch }: ReplacementSearchProps) {
  const id = useId()
  const [value, setValue] = useState(initial)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="mt-7 max-w-2xl">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy-900">
        {copy.search.label}
      </label>
      <div className="flex h-14 items-center rounded-lg border border-border-strong bg-white p-1.5 transition-[border-color,box-shadow] focus-within:border-primary focus-within:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)]">
        <Search aria-hidden className="ml-3 size-5 shrink-0 text-text-subtle" />
        <input
          id={id}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={copy.search.placeholder}
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-lg text-text tabular-nums placeholder:text-text-subtle focus-visible:outline-none"
        />
        <button
          type="submit"
          className="h-full rounded-md bg-primary px-6 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {copy.search.button}
        </button>
      </div>
    </form>
  )
}
