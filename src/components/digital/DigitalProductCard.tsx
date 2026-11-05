import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { productPath } from '../../lib/catalog'
import type { Product } from '../../types'
import { SmartImage } from '../SmartImage'

/** Card on /digital-solutions: product image on a light panel, family tag, name, summary and a link. */
export function DigitalProductCard({
  product,
  linkLabel,
}: {
  product: Product
  linkLabel: string
}) {
  return (
    <Link
      to={productPath(product)}
      className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-navy-900/5 transition-[box-shadow,translate] duration-200 hover:-translate-y-1 hover:shadow-raised"
    >
      <div className="relative bg-linear-to-b from-surface-sunken to-primary-tint">
        <SmartImage
          src={product.images[0].src}
          alt={product.images[0].alt}
          aspect="4 / 3"
          fit="contain"
          className="p-8 transition-transform duration-250 ease-sz group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <span className="self-start rounded-sm bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-navy-700">
          {product.family}
        </span>
        <h3 className="mt-4 text-[1.375rem] font-bold tracking-tight text-brand">{product.name}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{product.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
