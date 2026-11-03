import { ArrowRight, FolderPlus, ShoppingCart } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { useCart } from '../../cart/useCart'
import { replacementPage as copy } from '../../data/replacementPage'
import { getProduct, variantPath } from '../../lib/catalog'
import { formatPartPrice, formatPrice } from '../../lib/modelSpecs'
import { ratedDutyPoint } from '../../lib/variantCurves'
import type { ProductVariant, ReplacementInfo } from '../../types'
import { AddToProjectDialog } from '../projects/AddToProjectDialog'
import { SmartImage } from '../SmartImage'
import { StockIndicator } from '../variant/StockIndicator'

type ReplacementCardProps = {
  variant: ProductVariant
  /** The adapter kit is offered with the pump, ticked by default. */
  info: ReplacementInfo | undefined
}

/**
 * The recommended successor: picture, code, number, price and availability
 * (signed in), and View product, Add to cart (with the adapter kit) and Add
 * to project.
 */
export function ReplacementCard({ variant, info }: ReplacementCardProps) {
  const ids = useId()
  const { user } = useAuth()
  const cart = useCart()
  const image = getProduct(variant.productId)?.images[0]
  const kit = info?.adapterKit
  const [withKit, setWithKit] = useState(true)
  const [dialog, setDialog] = useState({ open: false, session: 0 })

  function addToCart() {
    cart.add(
      {
        kind: 'product',
        refId: variant.id,
        partNumber: variant.productNumber,
        name: variant.code,
        variantId: variant.id,
        unitPrice: variant.listPrice,
        availability: variant.availability,
      },
      1,
    )
    if (kit && withKit && user) {
      cart.add(
        {
          kind: 'part',
          refId: `adapter-${kit.partNumber}`,
          partNumber: kit.partNumber,
          name: kit.name,
          variantId: variant.id,
          unitPrice: kit.listPrice,
          availability: kit.availability,
        },
        1,
      )
    }
  }

  return (
    <article className="flex h-full flex-col rounded-lg border-2 border-success bg-white px-6 py-6 shadow-card">
      <span className="w-fit rounded-sm bg-success-tint px-2 py-0.5 text-xs font-semibold text-success-strong">
        {copy.next.label}
      </span>
      {image && (
        <div className="relative mx-auto mt-4 aspect-square w-40">
          <SmartImage src={image.src} alt={image.alt} fit="contain" />
        </div>
      )}
      <h2 className="mt-4 text-xl leading-snug font-bold tracking-tight text-brand">
        <Link to={variantPath(variant)} className="underline-offset-4 hover:underline">
          {variant.code}
        </Link>
      </h2>
      <p className="mt-1 text-sm font-semibold text-text-muted tabular-nums">
        {copy.productNumber(variant.productNumber)}
      </p>

      {user && (
        <div className="mt-4 flex animate-fade-in flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-2xl font-bold tracking-tight text-navy-900 tabular-nums">
            {formatPrice(variant.listPrice)}
          </span>
          <span className="text-sm font-semibold text-navy-900">
            <StockIndicator status={variant.availability.status} />
            <span className="ml-2 font-normal text-text-muted">
              {variant.availability.leadTime}
            </span>
          </span>
        </div>
      )}

      {kit && (
        <label
          htmlFor={`${ids}-kit`}
          className="mt-4 flex cursor-pointer gap-3 rounded-md border border-border bg-surface-subtle px-3.5 py-3 text-sm"
        >
          <input
            id={`${ids}-kit`}
            type="checkbox"
            checked={withKit}
            onChange={() => setWithKit((on) => !on)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span className="min-w-0 flex-1 text-navy-900">
            {copy.next.adapter(kit.name)}
            <span className="block text-text-muted tabular-nums">
              {kit.partNumber}
              {user && ` · ${formatPartPrice(kit.listPrice)} · ${kit.availability.leadTime}`}
            </span>
          </span>
        </label>
      )}

      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        <button
          type="button"
          onClick={addToCart}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold whitespace-nowrap text-white shadow-raised transition-colors hover:bg-primary-hover"
        >
          <ShoppingCart className="size-4" />
          {copy.next.addToCart}
        </button>
        <button
          type="button"
          onClick={() => setDialog((d) => ({ open: true, session: d.session + 1 }))}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-primary px-5 text-sm font-semibold whitespace-nowrap text-primary transition-colors hover:bg-primary-tint"
        >
          <FolderPlus className="size-4" />
          {copy.next.addToProject}
        </button>
        <Link
          to={variantPath(variant)}
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-pill px-3 text-sm font-semibold whitespace-nowrap text-primary underline-offset-4 hover:underline"
        >
          {copy.next.view}
          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <AddToProjectDialog
        key={dialog.session}
        open={dialog.open}
        entries={[{ variantId: variant.id, dutyPoint: ratedDutyPoint(variant) }]}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
      />
    </article>
  )
}
