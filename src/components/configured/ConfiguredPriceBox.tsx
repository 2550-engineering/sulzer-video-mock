import { FileQuestion, LogIn, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import { useCart } from '../../cart/useCart'
import { customerAccount } from '../../config/demo'
import { configuredPage } from '../../data/configuredPages'
import { variantPage } from '../../data/variantPages'
import { sizedCartArticle } from '../../lib/cartArticles'
import { formatPrice } from '../../lib/modelSpecs'
import type { PumpVariant, ResultArticle } from '../../types'
import { Modal } from '../Modal'
import { QuantityStepper } from '../spareparts/QuantityStepper'
import { QuotationTab } from '../variant/QuotationTab'

const copy = variantPage.price

type ConfiguredPriceBoxProps = {
  variant: PumpVariant
  article: ResultArticle
  /** Starting quantity, e.g. the project item's. */
  quantity?: number
}

/**
 * Price block of a configured pump. Standard variants (with a product number)
 * show list price and lead time when signed in, and "Add to cart". "On
 * request" variants show "Price on request" with "Request quotation" instead.
 */
export function ConfiguredPriceBox({
  variant,
  article,
  quantity: initial = 1,
}: ConfiguredPriceBoxProps) {
  const { user, signIn } = useAuth()
  const cart = useCart()
  const [quantity, setQuantity] = useState(initial)
  const [quote, setQuote] = useState({ open: false, session: 0 })
  const cartArticle = sizedCartArticle(variant)
  const onRequest = !cartArticle
  const lead = article.availability.status === 'lead-time'
  const openQuote = () => setQuote((q) => ({ open: true, session: q.session + 1 }))

  return (
    <div className="rounded-lg border border-border bg-surface-subtle px-6 py-5">
      <p className="text-sm font-semibold text-text-muted">{copy.title}</p>
      {onRequest ? (
        <div className="animate-fade-in">
          <p className="mt-1 text-[1.75rem] leading-tight font-bold tracking-tight text-navy-900">
            {configuredPage.price.onRequest}
          </p>
          <p className="mt-2 text-sm text-text">{configuredPage.price.onRequestText}</p>
          {user && (
            <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-navy-900">
              <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-warning" />
              {configuredPage.price.madeToOrder(variant.leadTime)}
            </p>
          )}
        </div>
      ) : user ? (
        <div className="animate-fade-in">
          <p className="mt-1 text-[2rem] leading-tight font-bold tracking-tight text-navy-900 tabular-nums">
            {formatPrice(article.listPrice)}
          </p>
          <p className="text-xs text-text-muted">
            {copy.listPrice}, {copy.exclVat}
          </p>
          <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-navy-900">
            <span
              aria-hidden
              className={`size-2.5 shrink-0 rounded-full ${lead ? 'bg-primary' : 'bg-warning'}`}
            />
            {lead
              ? copy.status.leadTime(variant.leadTime)
              : copy.status.madeToOrder(variant.leadTime)}
          </p>
          <p className="mt-1.5 text-sm text-text">
            {copy.discountGroup(customerAccount.discountGroup)}
          </p>
        </div>
      ) : (
        <div>
          <p className="mt-1 text-xl font-bold text-navy-900">{copy.unavailable}</p>
          <button
            type="button"
            onClick={() => signIn()}
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <LogIn className="size-4" />
            {copy.signInHint}
          </button>
        </div>
      )}

      {cartArticle ? (
        <>
          <div className="mt-5 flex items-center gap-3">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              label={copy.quantityFor(variant.name)}
            />
            <button
              type="button"
              onClick={() => cart.add(cartArticle, quantity)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-pill bg-primary px-5 font-semibold whitespace-nowrap text-white shadow-raised transition-colors hover:bg-primary-hover"
            >
              <ShoppingCart className="size-[18px]" strokeWidth={2} />
              {copy.addToCart}
            </button>
          </div>
          <button
            type="button"
            onClick={openQuote}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-pill border-2 border-primary px-6 font-semibold text-primary transition-colors hover:bg-primary-tint"
          >
            <FileQuestion className="size-[18px]" strokeWidth={2} />
            {copy.requestQuote}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={openQuote}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
        >
          <FileQuestion className="size-[18px]" strokeWidth={2} />
          {copy.requestQuote}
        </button>
      )}

      <Modal
        open={quote.open}
        title={configuredPage.price.quotationTitle}
        closeLabel={variantPage.whereToBuy.close}
        onClose={() => setQuote((q) => ({ ...q, open: false }))}
        width="max-w-3xl"
      >
        <div className="px-7 py-6">
          <QuotationTab key={quote.session} article={article} embedded quantity={quantity} />
        </div>
      </Modal>
    </div>
  )
}
