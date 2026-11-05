import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb'

type SelfServicePageHeaderProps = {
  breadcrumb: BreadcrumbItem[]
  /** Small line above the title, e.g. the company or "Order". */
  eyebrow: string
  title: string
  /** Next to the title, e.g. a status pill. */
  badge?: ReactNode
  description?: ReactNode
  /** Right-hand side: buttons or a small card. */
  aside?: ReactNode
}

/** Breadcrumb and page header on the grey My Pages background, like My assets. */
export function SelfServicePageHeader({
  breadcrumb,
  eyebrow,
  title,
  badge,
  description,
  aside,
}: SelfServicePageHeaderProps) {
  return (
    <>
      <div className="site-container py-5">
        <Breadcrumb items={breadcrumb} />
      </div>
      <header className="site-container flex flex-wrap items-end justify-between gap-6 pt-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-muted">{eyebrow}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-[2.75rem] leading-tight font-bold tracking-tight text-brand max-md:text-[2rem]">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <div className="mt-2 max-w-3xl text-lg text-text-muted max-md:text-base">
              {description}
            </div>
          )}
        </div>
        {aside && <div className="flex flex-wrap items-center gap-3">{aside}</div>}
      </header>
    </>
  )
}
