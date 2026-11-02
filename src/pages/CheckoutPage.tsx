import { Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { useCartItems } from '../cart/useCartItems'
import { CartSummary } from '../components/eshop/CartSummary'
import { CheckoutSection } from '../components/eshop/CheckoutSection'
import { ChoiceCard } from '../components/eshop/ChoiceCard'
import { SelfServicePageHeader } from '../components/selfservice/SelfServicePageHeader'
import { demoClock } from '../config/demo'
import { cartPath, checkoutCopy as copy, confirmationPath, deliveryOptions } from '../data/eshop'
import { signedOutRedirect } from '../data/myPages'
import { buildOrder, deliveryAddressesFor, expectedDelivery } from '../lib/eshop'
import { formatDate } from '../lib/format'
import { formatMoney } from '../lib/selfService'
import { useSelfService } from '../selfService/useSelfService'

/**
 * /eshop/checkout. Signed-in only. Delivery address from the account, delivery option,
 * PO number and the order summary. "Place order" adds the order to Orders (with track &
 * trace), empties the cart and opens the confirmation.
 */
export function CheckoutPage() {
  const { user } = useAuth()
  const { items, totals, clear } = useCartItems()
  const { orders, addOrder } = useSelfService()
  const [addressId, setAddressId] = useState<string>()
  const [optionId, setOptionId] = useState(deliveryOptions[0].id)
  const [poNumber, setPoNumber] = useState('')
  const [placedId, setPlacedId] = useState<string>()

  if (!user) return <Navigate to={signedOutRedirect} replace />
  // Checked before the empty cart: placing the order empties it.
  if (placedId) return <Navigate to={confirmationPath(placedId)} replace />
  if (items.length === 0) return <Navigate to={cartPath} replace />

  const addresses = deliveryAddressesFor(user)
  const address = addresses.find((a) => a.id === addressId) ?? addresses[0]
  const option = deliveryOptions.find((o) => o.id === optionId) ?? deliveryOptions[0]
  const parts = items.map((item) => item.part)

  function placeOrder(event: FormEvent) {
    event.preventDefault()
    if (!user) return
    const order = buildOrder({
      user,
      lines: items,
      option,
      address,
      poNumber: poNumber.trim() || `${copy.reference.fallback} ${formatDate(demoClock.today)}`,
      orders,
    })
    addOrder(order)
    clear()
    setPlacedId(order.id)
  }

  return (
    <div className="bg-surface-muted">
      <title>{`${copy.title} | eShop | Sulzer`}</title>
      <SelfServicePageHeader
        breadcrumb={[...copy.breadcrumb, { label: copy.title }]}
        eyebrow={copy.orderedBy(user.name, user.company)}
        title={copy.title}
        description={copy.intro}
      />

      <form
        onSubmit={placeOrder}
        className="site-container grid items-start gap-8 pt-10 pb-24 lg:grid-cols-[minmax(0,1fr)_420px]"
      >
        <div className="grid gap-6">
          <CheckoutSection
            step={1}
            title={copy.address.title}
            aside={<p className="text-sm text-text-muted">{copy.address.fromAccount}</p>}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {addresses.map((a) => (
                <ChoiceCard
                  key={a.id}
                  name="address"
                  value={a.id}
                  checked={a.id === address.id}
                  onChange={() => setAddressId(a.id)}
                >
                  <span className="block font-semibold text-navy-900">{a.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-text-muted">
                    {a.lines.map((text) => (
                      <span key={text} className="block">
                        {text}
                      </span>
                    ))}
                  </span>
                </ChoiceCard>
              ))}
            </div>
          </CheckoutSection>

          <CheckoutSection step={2} title={copy.delivery.title}>
            <div className="grid gap-3">
              {deliveryOptions.map((o) => (
                <ChoiceCard
                  key={o.id}
                  name="delivery"
                  value={o.id}
                  checked={o.id === option.id}
                  onChange={() => setOptionId(o.id)}
                  aside={
                    <span className="font-semibold text-navy-900 tabular-nums">
                      {o.price === 0 ? copy.delivery.free : formatMoney(o.price)}
                    </span>
                  }
                >
                  <span className="block font-semibold text-navy-900">{o.label}</span>
                  <span className="mt-0.5 block text-sm text-text-muted">{o.detail}</span>
                  <span className="mt-1.5 block text-sm font-medium text-success-strong">
                    {copy.delivery.expected(formatDate(expectedDelivery(parts, o)))}
                  </span>
                </ChoiceCard>
              ))}
            </div>
          </CheckoutSection>

          <CheckoutSection step={3} title={copy.reference.title}>
            <label className="flex max-w-md flex-col gap-1.5 text-sm">
              <span className="font-semibold text-navy-900">{copy.reference.po}</span>
              <input
                type="text"
                name="po"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                placeholder={copy.reference.poPlaceholder}
                className="h-11 rounded-md border border-border-strong bg-white px-3.5 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
              />
              <span className="text-text-muted">{copy.reference.poHint}</span>
            </label>
          </CheckoutSection>
        </div>

        <div className="lg:sticky lg:top-[calc(var(--sz-header-height)+24px)]">
          <CartSummary
            totals={totals}
            shipping={option.price}
            before={
              <>
                <ul className="mt-5 divide-y divide-border border-y border-border text-sm">
                  {items.map(({ line, part, price }) => (
                    <li
                      key={`${line.partId}-${line.assetId ?? ''}`}
                      className="flex items-baseline gap-4 py-3"
                    >
                      <span className="w-8 shrink-0 font-semibold text-navy-900 tabular-nums">
                        {line.quantity}×
                      </span>
                      <span className="min-w-0 flex-1 text-navy-900">{part.name}</span>
                      <span className="text-navy-900 tabular-nums">
                        {formatMoney(price.net * line.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex items-baseline justify-between gap-6 text-[15px]">
                  <span className="text-text-muted">{copy.summary.expected}</span>
                  <span className="font-semibold text-success-strong">
                    {formatDate(expectedDelivery(parts, option))}
                  </span>
                </p>
              </>
            }
          >
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-primary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Lock className="size-4" strokeWidth={2} />
              {copy.summary.place}
            </button>
            <p className="text-center text-xs text-text-muted">
              {copy.summary.terms}{' '}
              <Link
                to={copy.summary.termsLink.to}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {copy.summary.termsLink.label}
              </Link>
            </p>
          </CartSummary>
        </div>
      </form>
    </div>
  )
}
