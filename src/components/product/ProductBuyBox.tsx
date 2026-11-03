import { ArrowDown, FileQuestion, LogIn, Store } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { productPage } from '../../data/catalogPages'
import { formatPrice } from '../../lib/modelSpecs'
import type { Product, ProductModel } from '../../types'
import { WhereToBuyDialog } from '../variant/WhereToBuyDialog'

const copy = productPage.buy

type ProductBuyBoxProps = {
  product: Product
  models: ProductModel[]
  /** Opens the Models tab and scrolls to it. */
  onChooseModel: () => void
}

/**
 * Buy box in the product header: signed in, "Price from" the cheapest model
 * and "Choose model and buy" (to the Models tab); "Request quotation" and
 * "Where to buy" for everyone. Signed out it offers the sign-in.
 */
export function ProductBuyBox({ product, models, onChooseModel }: ProductBuyBoxProps) {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [whereToBuy, setWhereToBuy] = useState(false)
  const lowest = Math.min(...models.map((model) => model.listPrice))

  return (
    <div className="rounded-lg border border-border bg-surface-subtle px-6 py-5">
      {user ? (
        <div className="flex animate-fade-in flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="text-sm font-semibold text-text-muted">{copy.priceFrom}</p>
            <p className="text-[1.75rem] leading-tight font-bold tracking-tight text-navy-900 tabular-nums">
              {formatPrice(lowest)}
            </p>
            <p className="text-xs text-text-muted">{copy.exclVat}</p>
          </div>
          <p className="text-sm text-text-muted">{copy.models(models.length)}</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-text-muted">{copy.signedOut}</p>
          <button
            type="button"
            onClick={() => signIn()}
            className="mt-1 inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
          >
            <LogIn className="size-4" />
            {copy.signIn}
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {user && (
          <button
            type="button"
            onClick={onChooseModel}
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            {copy.choose}
            <ArrowDown className="size-4" />
          </button>
        )}
        <Link
          to={copy.quoteLink(product.id)}
          className="inline-flex h-11 items-center gap-2 rounded-pill border-2 border-primary px-5 font-semibold text-primary transition-colors hover:bg-primary-tint"
        >
          <FileQuestion className="size-4" />
          {copy.requestQuote}
        </Link>
        <button
          type="button"
          onClick={() => setWhereToBuy(true)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-strong underline-offset-4 hover:underline"
        >
          <Store className="size-4" />
          {copy.whereToBuy}
        </button>
      </div>

      <WhereToBuyDialog
        open={whereToBuy}
        onClose={() => setWhereToBuy(false)}
        onRequestQuote={() => {
          setWhereToBuy(false)
          navigate(copy.quoteLink(product.id))
        }}
      />
    </div>
  )
}
