import { ChevronRight, House } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router'

export type BreadcrumbItem = {
  label: string
  /** Omit for the current page (last item). */
  to?: string
}

const tones = {
  light: {
    list: 'text-text-muted',
    link: 'text-text-muted hover:text-primary',
    separator: 'text-text-subtle',
    current: 'text-text',
  },
  dark: {
    list: 'text-text-on-dark',
    link: 'text-text-on-dark hover:text-white',
    separator: 'text-text-on-dark-muted',
    current: 'text-white',
  },
} as const

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  /** `dark` for use on top of hero images. */
  tone?: keyof typeof tones
}

/** Home icon › level › level. Home is always prepended. */
export function Breadcrumb({ items, tone = 'light' }: BreadcrumbProps) {
  const t = tones[tone]
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${t.list}`}>
        <li className="flex">
          <Link
            to="/"
            aria-label="Home"
            className={`-m-1 rounded-sm p-1 transition-colors ${t.link}`}
          >
            <House className="size-4" strokeWidth={1.75} />
          </Link>
        </li>
        {items.map((item) => (
          <Fragment key={item.label}>
            <li aria-hidden className={`flex ${t.separator}`}>
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              {item.to ? (
                <Link to={item.to} className={`transition-colors hover:underline ${t.link}`}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={`font-medium ${t.current}`}>
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
