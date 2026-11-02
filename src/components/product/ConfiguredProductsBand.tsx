import { ArrowRight, Boxes } from 'lucide-react'
import { Link } from 'react-router'
import { productPage } from '../../data/catalogPages'
import { variantPath } from '../../lib/catalog'
import type { Product, ProductVariant } from '../../types'

const copy = productPage.configured

type ConfiguredProductsBandProps = {
  product: Product
  /** The configured product to feature (the demo pump). */
  featured: ProductVariant
  count: number
}

/** Under the product header: a clear way into the configured product pages. */
export function ConfiguredProductsBand({ product, featured, count }: ConfiguredProductsBandProps) {
  return (
    <section className="border-t border-border bg-primary-tint">
      <div className="site-container flex flex-wrap items-center gap-x-8 gap-y-4 py-6">
        <Boxes aria-hidden className="size-9 shrink-0 text-primary" strokeWidth={1.5} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
            {copy.eyebrow}
          </p>
          <p className="mt-0.5 text-lg font-bold tracking-tight text-navy-900">
            {copy.title(product.name)}
          </p>
          <p className="text-[15px] text-text">{copy.text}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            to={`${variantPath(featured)}#spare-parts`}
            className="group inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            {copy.demo(featured.code)}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            to={`${variantPath(featured)}#variants`}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {copy.all(count)}
          </Link>
        </div>
      </div>
    </section>
  )
}
