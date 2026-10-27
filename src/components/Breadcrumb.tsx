import { ChevronRight, House } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router'

export type BreadcrumbItem = {
  label: string
  /** Omit for the current page (last item). */
  to?: string
}

/** Home icon › level › level. Home is always prepended. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted">
        <li className="flex">
          <Link
            to="/"
            aria-label="Home"
            className="-m-1 rounded-sm p-1 text-text-muted transition-colors hover:text-primary"
          >
            <House className="size-4" strokeWidth={1.75} />
          </Link>
        </li>
        {items.map((item) => (
          <Fragment key={item.label}>
            <li aria-hidden className="flex text-text-subtle">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              {item.to ? (
                <Link to={item.to} className="transition-colors hover:text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-text">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
