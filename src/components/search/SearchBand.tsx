import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb'

type SearchBandProps = {
  breadcrumb: BreadcrumbItem[]
  title: string
  text?: string
  /** The search form. */
  children: ReactNode
}

/** Light grey band at the top of /products: breadcrumb, heading and the search field. */
export function SearchBand({ breadcrumb, title, text, children }: SearchBandProps) {
  return (
    <section className="border-b border-border bg-surface-sunken">
      <div className="site-container pt-5 pb-12">
        <Breadcrumb items={breadcrumb} />
        <h1
          key={title}
          className="mt-10 animate-fade-in text-[2.5rem] leading-tight font-bold tracking-tight text-brand"
        >
          {title}
        </h1>
        {text && <p className="mt-3 max-w-2xl text-lg text-text-muted">{text}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
