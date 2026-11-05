import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb'

type EshopHeaderProps = {
  breadcrumb: BreadcrumbItem[]
  title: string
  /** e.g. the item count, after the title. */
  children?: ReactNode
}

/** Breadcrumb and title of the cart, checkout and confirmation pages. */
export function EshopHeader({ breadcrumb, title, children }: EshopHeaderProps) {
  return (
    <section className="border-b border-border bg-white">
      <div className="site-container py-5">
        <Breadcrumb items={breadcrumb} />
      </div>
      <div className="site-container flex flex-wrap items-baseline gap-x-4 gap-y-1 pb-8">
        <h1 className="text-[2.5rem] leading-tight font-bold tracking-tight text-navy-900 max-md:text-[2rem]">
          {title}
        </h1>
        {children}
      </div>
    </section>
  )
}
