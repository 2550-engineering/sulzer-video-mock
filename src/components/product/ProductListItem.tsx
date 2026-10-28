import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { productSearchPage } from '../../data/catalogPages'
import { productPath } from '../../lib/catalog'
import type { Product } from '../../types'
import { ImageSlot } from '../ImageSlot'

/** Row card: product image, family tag, name, summary and a "View" button. Links to the product page. */
export function ProductListItem({ product }: { product: Product }) {
  return (
    <Link
      to={productPath(product)}
      className="group flex items-center gap-8 rounded-lg border border-border bg-surface p-5 pr-8 transition-[border-color,box-shadow] duration-200 hover:border-primary-border hover:shadow-card"
    >
      <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-surface-muted">
        <div className="absolute inset-2">
          <ImageSlot image={product.images[0]} fit="contain" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-sm bg-surface-sunken px-2 py-0.5 text-xs font-semibold text-navy-700">
          {product.family}
        </span>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-heading group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 max-w-3xl text-[15px] leading-relaxed text-text-muted">
          {product.summary}
        </p>
      </div>
      <span className="hidden h-11 shrink-0 items-center gap-2 rounded-pill border-2 border-primary px-7 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white sm:inline-flex">
        {productSearchPage.viewLabel}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
