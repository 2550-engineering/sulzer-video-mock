import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  page: number
  pageCount: number
  onChange: (page: number) => void
  labels: { label: string; previous: string; next: string; page: (n: number) => string }
}

/** "Previous page 1 2 Next page". Renders nothing for a single page. */
export function Pagination({ page, pageCount, onChange, labels }: PaginationProps) {
  if (pageCount <= 1) return null
  const step =
    'inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-semibold transition-colors'
  return (
    <nav aria-label={labels.label} className="flex items-center justify-between gap-4">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${step} text-primary hover:bg-primary-tint disabled:cursor-not-allowed disabled:text-text-subtle disabled:hover:bg-transparent`}
      >
        <ChevronLeft className="size-4" />
        {labels.previous}
      </button>
      <ol className="flex gap-1">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <button
              type="button"
              aria-label={labels.page(n)}
              aria-current={n === page ? 'page' : undefined}
              onClick={() => onChange(n)}
              className={`flex size-10 items-center justify-center rounded-md text-sm font-semibold tabular-nums transition-colors ${
                n === page ? 'bg-primary text-white' : 'text-navy-900 hover:bg-primary-tint'
              }`}
            >
              {n}
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className={`${step} text-primary hover:bg-primary-tint disabled:cursor-not-allowed disabled:text-text-subtle disabled:hover:bg-transparent`}
      >
        {labels.next}
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
