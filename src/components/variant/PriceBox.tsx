import { LogIn, ShoppingCart, Store } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import { useCart } from '../../cart/useCart'
import { customerAccount } from '../../config/demo'
import { variantPage } from '../../data/variantPages'
import { formatPrice } from '../../lib/modelSpecs'
import type { ResultArticle } from '../../types'
import { WhereToBuyDialog } from './WhereToBuyDialog'

const copy = variantPage.price

type PriceBoxProps = {
  article: ResultArticle
  onRequestQuote: () => void
}

/**
 * Price, availability and lead time (signed in only), and "Where to buy".
 * Signed out it says why there is no price and offers the sign-in.
 */
export function PriceBox({ article, onRequestQuote }: PriceBoxProps) {
  const { user, signIn } = useAuth()
  const cart = useCart()
  const [open, setOpen] = useState(false)
  const discontinued = article.availability.status === 'discontinued'
  // Green in stock, blue with a lead time, orange when sales confirms the date.
  const { status: statusText } = copy
  const status =
    article.availability.status === 'in-stock'
      ? { dot: 'bg-success', text: statusText.inStock }
      : article.availability.status === 'lead-time'
        ? { dot: 'bg-primary', text: statusText.leadTime(article.availability.leadTime) }
        : { dot: 'bg-warning', text: statusText.confirm }

  return (
    <div className="rounded-lg border border-border bg-surface-subtle px-6 py-5">
      <p className="text-sm font-semibold text-text-muted">{copy.title}</p>
      {user && !discontinued ? (
        <div className="animate-fade-in">
          <p className="mt-1 text-[2rem] leading-tight font-bold tracking-tight text-navy-900 tabular-nums">
            {formatPrice(article.listPrice)}
          </p>
          <p className="text-xs text-text-muted">
            {copy.listPrice}, {copy.exclVat}
          </p>
          <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-navy-900">
            <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${status.dot}`} />
            {status.text}
          </p>
          <p className="mt-1.5 text-sm text-text">
            {copy.discountGroup(customerAccount.discountGroup)}
          </p>
        </div>
      ) : (
        <div>
          <p className="mt-1 text-xl font-bold text-navy-900">
            {discontinued ? variantPage.stock.discontinued : copy.unavailable}
          </p>
          {!user && (
            <button
              type="button"
              onClick={signIn}
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              <LogIn className="size-4" />
              {copy.signInHint}
            </button>
          )}
        </div>
      )}

      {!discontinued && (
        <button
          type="button"
          onClick={() =>
            cart.add(
              {
                kind: 'product',
                refId: article.id,
                partNumber: article.productNumber,
                name: article.code,
                variantId: article.id,
                unitPrice: article.listPrice,
                availability: article.availability,
              },
              1,
            )
          }
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
        >
          <ShoppingCart className="size-[18px]" strokeWidth={2} />
          {copy.addToCart}
        </button>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-success px-6 font-semibold text-white transition-colors hover:bg-success-strong"
      >
        <Store className="size-[18px]" strokeWidth={2} />
        {copy.whereToBuy}
      </button>

      <WhereToBuyDialog
        open={open}
        onClose={() => setOpen(false)}
        onRequestQuote={() => {
          setOpen(false)
          onRequestQuote()
        }}
      />
    </div>
  )
}
