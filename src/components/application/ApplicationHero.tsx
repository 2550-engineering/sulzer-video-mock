import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { Application, NavItem } from '../../types'
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb'
import { ImageSlot } from '../ImageSlot'

type ApplicationHeroProps = {
  application: Application
  breadcrumb: BreadcrumbItem[]
  /** Primary button, e.g. "Size application". */
  action?: NavItem
}

/** Full-width image hero with breadcrumb, title, intro and an optional primary button. */
export function ApplicationHero({ application, breadcrumb, action }: ApplicationHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <ImageSlot image={application.heroImage} />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-navy-900/95 via-navy-900/70 to-navy-900/5"
      />

      <div className="relative site-container flex min-h-[520px] flex-col pt-6">
        <Breadcrumb tone="dark" items={breadcrumb} />

        <div key={application.id} className="my-auto max-w-2xl animate-fade-in py-14">
          <h1 className="text-[3.5rem] leading-[1.05] font-bold tracking-tight text-white">
            {application.name}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-text-on-dark">{application.intro}</p>
          {action && (
            <Link
              to={action.to}
              className="group mt-10 inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
            >
              {action.label}
              <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
