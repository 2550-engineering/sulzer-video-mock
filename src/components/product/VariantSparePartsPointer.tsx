import { ArrowRight, Wrench } from 'lucide-react'
import { Link } from 'react-router'
import { productPage } from '../../data/catalogPages'
import { variantPath } from '../../lib/catalog'
import type { ProductVariant } from '../../types'

const copy = productPage.variantSpareParts

/** Spare parts tab of a product with configured variants: go to the variant that has its parts online. */
export function VariantSparePartsPointer({ variant }: { variant: ProductVariant }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
      <Wrench aria-hidden className="size-10 text-primary" strokeWidth={1.5} />
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-navy-900">{copy.title}</h2>
      <p className="mt-2 text-text-muted">{copy.text(variant.code)}</p>
      <Link
        to={`${variantPath(variant)}#spare-parts`}
        className="group mt-7 inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
      >
        {copy.action}
        <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
