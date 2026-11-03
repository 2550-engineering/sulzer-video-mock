import { Link } from 'react-router'
import { replacementPage as copy } from '../../data/replacementPage'
import { getProduct, variantPath } from '../../lib/catalog'
import type { ProductVariant } from '../../types'
import { SmartImage } from '../SmartImage'

/** The discontinued product the customer has today. */
export function OldProductCard({ variant }: { variant: ProductVariant }) {
  const image = getProduct(variant.productId)?.images[0]
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-white px-6 py-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
          {copy.old.label}
        </span>
        {variant.discontinued && (
          <span className="rounded-sm bg-warning-tint px-2 py-0.5 text-xs font-semibold text-warning-strong">
            {copy.old.discontinued(variant.discontinued.year)}
          </span>
        )}
      </div>
      {image && (
        <div className="relative mx-auto mt-4 aspect-square w-40 opacity-60 grayscale">
          <SmartImage src={image.src} alt={image.alt} fit="contain" />
        </div>
      )}
      <h2 className="mt-4 text-xl leading-snug font-bold tracking-tight text-navy-900">
        <Link to={variantPath(variant)} className="underline-offset-4 hover:underline">
          {variant.code}
        </Link>
      </h2>
      <p className="mt-1 text-sm font-semibold text-text-muted tabular-nums">
        {copy.productNumber(variant.productNumber)}
      </p>
    </article>
  )
}
