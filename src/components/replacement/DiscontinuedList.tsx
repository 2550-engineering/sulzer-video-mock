import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { replacementPage as copy } from '../../data/replacementPage'
import { discontinuedVariants } from '../../lib/replacement'

/** Quick picks: every discontinued product that has a replacement. */
export function DiscontinuedList() {
  const variants = discontinuedVariants()
  return (
    <section>
      <h2 className="text-lg font-bold tracking-tight text-navy-900">{copy.pick.title}</h2>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {variants.map((variant) => (
          <li key={variant.id}>
            <Link
              to={`/products/replacement?from=${variant.id}`}
              className="group flex items-center gap-4 rounded-md border border-border bg-white px-5 py-4 transition-colors hover:border-primary"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy-900">{variant.code}</span>
                <span className="block text-sm text-text-muted tabular-nums">
                  {copy.productNumber(variant.productNumber)}
                  {variant.discontinued &&
                    ` · ${copy.pick.discontinued(variant.discontinued.year)}`}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
