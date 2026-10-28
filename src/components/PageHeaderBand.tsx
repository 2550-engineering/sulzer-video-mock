import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'

type PageHeaderBandProps = {
  breadcrumb: BreadcrumbItem[]
  title: string
  description: string
  /** Extra line under the description, e.g. a search or context chip. */
  children?: ReactNode
}

/** Breadcrumb, then a light grey band with the page title and description. */
export function PageHeaderBand({ breadcrumb, title, description, children }: PageHeaderBandProps) {
  return (
    <>
      <div className="site-container py-5">
        <Breadcrumb items={breadcrumb} />
      </div>

      <section className="border-y border-border bg-surface-muted">
        <div className="site-container py-14">
          <h1 className="text-[2.75rem] leading-tight font-bold tracking-tight text-navy-900">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-text-muted">{description}</p>
          {children}
        </div>
      </section>
    </>
  )
}
