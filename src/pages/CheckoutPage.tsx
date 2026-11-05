import { Check, CreditCard, LoaderCircle, MapPin } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { useCart } from '../cart/useCart'
import { CustomerLogo } from '../components/CustomerLogo'
import { CartLines } from '../components/eshop/CartLines'
import { ChoiceCard } from '../components/eshop/ChoiceCard'
import { EshopHeader } from '../components/eshop/EshopHeader'
import { OrderSummary } from '../components/eshop/OrderSummary'
import { SignInRequired } from '../components/eshop/SignInRequired'
import { NumberedStep } from '../components/product/NumberedStep'
import { customerAccount, eshop } from '../config/demo'
import { customers } from '../data/assets'
import { eshopPages } from '../data/eshopPages'
import { partnerAccounts, partnerCheckout } from '../data/partner'
import { issuers } from '../data/quotations'
import { deliveryWindow } from '../lib/cart'
import { formatDate } from '../lib/dates'
import type { DeliveryOption } from '../types'

const copy = eshopPages.checkout
/** "Placing order…" before the confirmation, long enough to read. */
const placingMs = 600

/**
 * /eshop/checkout: Delivery, Payment and Review on one page, everything
 * prefilled for the demo company; "Place order" goes to the confirmation.
 * A partner first picks the customer they order on behalf of, and delivers
 * to that customer's addresses or their own warehouse.
 */
export function CheckoutPage() {
  const ids = useId()
  const navigate = useNavigate()
  const { user } = useAuth()
  const cart = useCart()
  const [addressId, setAddressId] = useState<string>(eshop.deliveryAddresses[0].id)
  const partner = user?.kind === 'partner'
  const [customerId, setCustomerId] = useState(customers[0].id)
  const customer = customers.find((c) => c.id === customerId) ?? customers[0]
  const [delivery, setDelivery] = useState<DeliveryOption>('complete')
  const [placing, setPlacing] = useState(false)
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const dates = deliveryWindow(cart.items)
  const addresses: readonly { id: string; name: string; lines: readonly string[] }[] =
    partner && user
      ? [
          ...partnerAccounts[customer.id].deliveryAddresses.map((a) => ({
            id: a.id,
            name: a.label,
            lines: a.lines,
          })),
          {
            id: 'warehouse',
            name: partnerCheckout.warehouse(user.company),
            lines: [user.company, ...issuers.partner.address],
          },
        ]
      : eshop.deliveryAddresses
  const address = addresses.find((a) => a.id === addressId) ?? addresses[0]
  // Partners get the customer step first.
  const step = (n: number) => (partner ? n + 1 : n)

  function placeOrder() {
    setPlacing(true)
    timer.current = window.setTimeout(() => {
      const orderId = cart.placeOrder({
        deliveryAddressId: address.id,
        delivery,
        ...(partner
          ? {
              deliveryAddress: { name: address.name, lines: [...address.lines] },
              customer: { id: customer.id, name: customer.name },
            }
          : {}),
      })
      navigate(`/eshop/order/${orderId}`)
    }, placingMs)
  }

  const card = 'rounded-lg border border-border bg-white px-6 py-6 max-md:px-4 max-md:py-5'

  return (
    <>
      <title>{`${copy.title} | Sulzer`}</title>
      <EshopHeader
        breadcrumb={[
          ...eshopPages.breadcrumb,
          { label: eshopPages.cart.title, to: '/eshop/cart' },
          { label: copy.title },
        ]}
        title={copy.title}
      />

      <section className="min-h-[480px] bg-surface-muted">
        <div className="site-container py-10">
          {!user ? (
            <SignInRequired />
          ) : cart.items.length === 0 ? (
            // Also shown for a moment after placing the order, until the confirmation opens.
            <div className="flex justify-center py-16">
              {placing ? (
                <LoaderCircle className="size-8 animate-spin text-primary" />
              ) : (
                <Link to="/eshop/cart" className="font-semibold text-primary hover:underline">
                  {eshopPages.cart.empty.title}
                </Link>
              )}
            </div>
          ) : (
            <div className="grid items-start gap-8 max-lg:grid-cols-1 max-md:gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="min-w-0 space-y-6">
                {partner && (
                  <div className={card}>
                    <NumberedStep number={1} title={partnerCheckout.title}>
                      <p className="mb-3 text-sm text-text-muted">{partnerCheckout.hint}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {customers.map((c) => (
                          <ChoiceCard
                            key={c.id}
                            name={`${ids}-customer`}
                            checked={c.id === customer.id}
                            onChange={() => {
                              setCustomerId(c.id)
                              setAddressId('')
                            }}
                          >
                            <span className="flex items-center gap-3">
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white">
                                <CustomerLogo customerId={c.id} variant="mark" className="h-5" />
                              </span>
                              <span className="min-w-0">
                                <span className="block font-semibold text-navy-900">{c.name}</span>
                                <span className="block text-sm text-text-muted">
                                  {partnerCheckout.number(c.customerNumber, c.city)}
                                </span>
                              </span>
                            </span>
                          </ChoiceCard>
                        ))}
                      </div>
                    </NumberedStep>
                  </div>
                )}
                <div className={card}>
                  <NumberedStep number={step(1)} title={copy.steps.delivery}>
                    <p className="mb-2 text-sm font-semibold text-navy-900">{copy.address}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {addresses.map((a) => (
                        <ChoiceCard
                          key={a.id}
                          name={`${ids}-address`}
                          checked={address.id === a.id}
                          onChange={() => setAddressId(a.id)}
                        >
                          <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                            <MapPin className="size-4 text-primary" />
                            {a.name}
                          </span>
                          {a.lines.map((line) => (
                            <span key={line} className="block text-text-muted">
                              {line}
                            </span>
                          ))}
                        </ChoiceCard>
                      ))}
                    </div>

                    <p className="mt-6 mb-2 text-sm font-semibold text-navy-900">
                      {copy.deliveryDate}
                    </p>
                    <div className="grid gap-3">
                      <ChoiceCard
                        name={`${ids}-delivery`}
                        checked={delivery === 'complete'}
                        onChange={() => setDelivery('complete')}
                      >
                        <span className="block font-semibold text-navy-900">
                          {copy.complete(formatDate(dates.latest))}
                        </span>
                        <span className="block text-sm text-text-muted">{copy.completeHint}</span>
                      </ChoiceCard>
                      {dates.earliest !== dates.latest && (
                        <ChoiceCard
                          name={`${ids}-delivery`}
                          checked={delivery === 'partial'}
                          onChange={() => setDelivery('partial')}
                        >
                          <span className="block font-semibold text-navy-900">
                            {copy.partial(formatDate(dates.earliest))}
                          </span>
                          <span className="block text-sm text-text-muted">{copy.partialHint}</span>
                        </ChoiceCard>
                      )}
                    </div>
                  </NumberedStep>
                </div>

                <div className={card}>
                  <NumberedStep number={step(2)} title={copy.steps.payment}>
                    <ChoiceCard name={`${ids}-payment`} checked>
                      <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                        <CreditCard className="size-4 text-primary" />
                        {copy.payment}
                      </span>
                      <span className="block text-sm text-text-muted">
                        {copy.paymentHint(customerAccount.customerNumber)}
                      </span>
                    </ChoiceCard>
                  </NumberedStep>
                </div>

                <div className={card}>
                  <NumberedStep number={step(3)} title={copy.steps.review}>
                    <dl className="grid gap-x-8 gap-y-4 text-[15px] sm:grid-cols-3">
                      <div>
                        <dt className="text-sm text-text-muted">{copy.orderedBy}</dt>
                        <dd className="font-semibold text-navy-900">{user?.name}</dd>
                        <dd className="text-text-muted">{user?.company}</dd>
                        {partner && (
                          <dd className="text-text-muted">
                            {partnerCheckout.orderedFor}{' '}
                            <span className="font-semibold text-navy-900">{customer.name}</span>
                          </dd>
                        )}
                      </div>
                      <div>
                        <dt className="text-sm text-text-muted">{copy.deliverTo}</dt>
                        <dd className="font-semibold text-navy-900">{address.name}</dd>
                        <dd className="text-text-muted">
                          {delivery === 'complete'
                            ? formatDate(dates.latest)
                            : `${formatDate(dates.earliest)} – ${formatDate(dates.latest)}`}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-text-muted">{copy.reference}</dt>
                        <dd className="font-semibold text-navy-900">{cart.reference || '–'}</dd>
                        <dd>
                          <Link
                            to="/eshop/cart"
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            {copy.edit}
                          </Link>
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-6">
                      <CartLines items={cart.items} readOnly />
                    </div>
                  </NumberedStep>
                </div>
              </div>

              <OrderSummary items={cart.items}>
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={placing}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-primary font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover disabled:cursor-wait"
                >
                  {placing ? (
                    <LoaderCircle className="size-[18px] animate-spin" />
                  ) : (
                    <Check className="size-[18px]" />
                  )}
                  {placing ? copy.placing : copy.place}
                </button>
                <p className="mt-3 text-center text-xs text-text-muted">
                  {copy.terms}{' '}
                  <Link to="/terms-of-sale" className="font-semibold text-primary hover:underline">
                    {copy.termsLink}
                  </Link>
                  .
                </p>
              </OrderSummary>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
