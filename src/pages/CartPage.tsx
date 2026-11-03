import { ArrowLeft, ArrowRight, FileText, ShoppingCart } from 'lucide-react'
import { useId } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { useCart } from '../cart/useCart'
import { CartLines } from '../components/eshop/CartLines'
import { EshopHeader } from '../components/eshop/EshopHeader'
import { OrderSummary } from '../components/eshop/OrderSummary'
import { SignInRequired } from '../components/eshop/SignInRequired'
import { eshopPages } from '../data/eshopPages'
import { partOwner, sparePartsPath } from '../lib/catalog'
import { useToast } from '../toast/useToast'

const copy = eshopPages.cart

/** /eshop/cart: the lines grouped by pump, order summary, PO number, quotation or checkout. */
export function CartPage() {
  const ids = useId()
  const { user } = useAuth()
  const cart = useCart()
  const showToast = useToast()
  const last = cart.items.at(-1)
  const lastOwner = last && partOwner(last.variantId)

  function saveQuotation() {
    const quotation = cart.saveQuotation()
    showToast({
      message: eshopPages.toasts.quotation(quotation.id),
      detail: eshopPages.toasts.quotationDetail,
      action: eshopPages.toasts.quotations,
    })
  }

  return (
    <>
      <title>{`${copy.title} | Sulzer`}</title>
      <EshopHeader
        breadcrumb={[...eshopPages.breadcrumb, { label: copy.title }]}
        title={copy.title}
      >
        {user && cart.items.length > 0 && (
          <span className="text-lg text-text-muted">{copy.count(cart.count)}</span>
        )}
      </EshopHeader>

      <section className="min-h-[480px] bg-surface-muted">
        <div className="site-container py-10">
          {!user ? (
            <SignInRequired />
          ) : cart.items.length === 0 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
              <ShoppingCart aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
              <h2 className="mt-4 text-xl font-bold text-navy-900">{copy.empty.title}</h2>
              <p className="mt-2 text-text-muted">{copy.empty.text}</p>
              <Link
                to="/products"
                className="mt-6 inline-flex h-11 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {copy.empty.action}
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="min-w-0">
                <CartLines items={cart.items} />
                {lastOwner && (
                  <Link
                    to={sparePartsPath(lastOwner)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    <ArrowLeft className="size-4" />
                    {copy.continue}
                  </Link>
                )}
              </div>

              <OrderSummary items={cart.items}>
                <label
                  htmlFor={`${ids}-reference`}
                  className="mb-1.5 block text-sm font-semibold text-navy-900"
                >
                  {copy.reference}
                </label>
                <input
                  id={`${ids}-reference`}
                  value={cart.reference}
                  onChange={(event) => cart.setReference(event.target.value)}
                  placeholder={copy.referencePlaceholder}
                  className="h-11 w-full rounded-md border border-border-strong bg-white px-3.5 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
                />
                <Link
                  to="/eshop/checkout"
                  className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-primary font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
                >
                  {copy.checkout}
                  <ArrowRight className="size-[18px] transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
                <button
                  type="button"
                  onClick={saveQuotation}
                  className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-pill border-2 border-primary font-semibold text-primary transition-colors hover:bg-primary-tint"
                >
                  <FileText className="size-[18px]" />
                  {copy.saveQuotation}
                </button>
              </OrderSummary>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
