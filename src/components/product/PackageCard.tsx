import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import { productPage } from '../../data/catalogPages'
import type { ProductPackage } from '../../types'

const copy = productPage.variants

type PackageCardProps = {
  pkg: ProductPackage
  /** The package before this one, whose features this one includes. */
  previous?: ProductPackage
}

/** A package on the Variants tab. One with a badge is the featured card: ringed, with a filled button. */
export function PackageCard({ pkg, previous }: PackageCardProps) {
  const featured = pkg.badge !== undefined

  return (
    <article
      className={`relative flex h-full flex-col rounded-lg bg-white p-8 ${
        featured
          ? 'shadow-card ring-2 ring-primary'
          : 'ring-1 ring-border transition-shadow hover:shadow-card'
      }`}
    >
      {pkg.badge && (
        <span className="absolute -top-3.5 left-8 rounded-pill bg-primary px-3 py-1 text-xs font-semibold text-white">
          {pkg.badge}
        </span>
      )}
      <h3 className="text-2xl font-bold tracking-tight text-brand">{pkg.name}</h3>
      <p className="mt-1 font-semibold text-primary">{pkg.tagline}</p>
      <p className="mt-3 text-[15px] text-text-muted">{pkg.audience}</p>

      <div className="mt-6 flex-1 border-t border-border pt-6">
        {previous && (
          <p className="mb-3 text-sm font-semibold text-navy-900">
            {copy.everythingIn(previous.name)}
          </p>
        )}
        <ul className="space-y-3">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-[15px] text-text">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={copy.actionTo}
        className={`group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-pill px-6 text-sm font-semibold transition-colors ${
          featured
            ? 'bg-primary text-white shadow-raised hover:bg-primary-hover'
            : 'border border-border-strong text-navy-900 hover:border-primary hover:text-primary'
        }`}
      >
        {copy.action}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </article>
  )
}
