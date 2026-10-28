import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { productPage } from '../../data/catalogPages'
import type { Service } from '../../types'

/** White card: large line icon, title, text and "Learn more". The whole card links to the service. */
export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon
  return (
    <Link
      to={service.to}
      className="group flex h-full flex-col rounded-lg border border-border bg-white p-7 transition-[border-color,box-shadow] duration-200 hover:border-primary-border hover:shadow-card"
    >
      <Icon aria-hidden className="size-11 text-primary" strokeWidth={1.25} />
      <h3 className="mt-5 text-xl font-bold tracking-tight text-navy-900 transition-colors group-hover:text-primary">
        {service.name}
      </h3>
      <p className="mt-2 mb-6 text-[15px] leading-relaxed text-text-muted">{service.summary}</p>
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
        {productPage.services.learnMore}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
