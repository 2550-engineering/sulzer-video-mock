import { ArrowRight, CircleCheck, Truck } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { useCart } from '../cart/useCart'
import { CartLines } from '../components/eshop/CartLines'
import { EshopHeader } from '../components/eshop/EshopHeader'
import { SignInRequired } from '../components/eshop/SignInRequired'
import { eshop } from '../config/demo'
import { eshopPages } from '../data/eshopPages'
import { partnerCheckout } from '../data/partner'
import { orderPath } from '../data/selfServicePages'
import { partOwner, sparePartsPath } from '../lib/catalog'
import { formatDate } from '../lib/dates'
import { formatPartPrice } from '../lib/modelSpecs'
import { ordersFor } from '../lib/selfService'
import { trackedOrder } from '../lib/trackedOrder'
import { useSelfService } from '../selfService/useSelfService'
import { NotFoundPage } from './NotFoundPage'

const copy = eshopPages.confirmation
const summary = eshopPages.summary

/**
 * /eshop/order/:orderId: the confirmation with order number, items and expected
 * delivery. The order is also added to /self-service/orders, where "Track order"
 * opens its track & trace.
 */
export function OrderConfirmationPage() {
  const { orderId = '' } = useParams()
  const { user } = useAuth()
  const { orders } = useCart()
  const order = orders.find((o) => o.id === orderId)
  const address =
    order?.deliveryAddress ?? eshop.deliveryAddresses.find((a) => a.id === order?.deliveryAddressId)
  const selfService = useSelfService()
  const added = selfService.orders.some((o) => o.id === orderId)
  // Only accounts with track & trace see it there (the consultant has none).
  const tracked = user !== null && ordersFor(user, selfService.orders).some((o) => o.id === orderId)
  const { addOrder } = selfService
  useEffect(() => {
    if (order && user && !added) addOrder(trackedOrder(order, user, [...(address?.lines ?? [])]))
  }, [order, user, added, address, addOrder])
  if (!order) return <NotFoundPage />

  const owner = partOwner(order.lines[0]?.variantId ?? '')
  const expected =
    order.earliestDelivery === order.latestDelivery
      ? formatDate(order.latestDelivery)
      : summary.between(formatDate(order.earliestDelivery), formatDate(order.latestDelivery))

  return (
    <>
      <title>{`${order.id} – ${copy.title} | Sulzer`}</title>
      <EshopHeader
        breadcrumb={[...eshopPages.breadcrumb, { label: order.id }]}
        title={copy.title}
      />

      <section className="min-h-[480px] bg-surface-muted">
        <div className="site-container py-10">
          {!user ? (
            <SignInRequired />
          ) : (
            <div className="animate-fade-in space-y-8">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-lg border border-success bg-success-tint px-7 py-6 max-md:px-5">
                <CircleCheck
                  aria-hidden
                  className="size-12 shrink-0 text-success"
                  strokeWidth={1.5}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold tracking-[0.12em] text-text-muted uppercase">
                    {copy.orderNumber}
                  </p>
                  <p className="text-3xl font-bold tracking-wide text-brand tabular-nums">
                    {order.id}
                  </p>
                  <p className="mt-1 text-text max-md:[overflow-wrap:anywhere]">
                    {copy.text(user?.email ?? '')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={tracked ? orderPath(order.id) : copy.trackTo}
                    className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    <Truck className="size-4" />
                    {copy.track}
                  </Link>
                  <Link
                    to={owner ? sparePartsPath(owner) : '/products'}
                    className="group inline-flex h-11 items-center gap-2 rounded-pill border border-primary bg-white px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
                  >
                    {copy.continue}
                    <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              <dl className="grid gap-6 rounded-lg border border-border bg-white px-7 py-6 text-[15px] max-md:grid-cols-1 max-md:px-5 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-text-muted">{copy.expected}</dt>
                  <dd className="text-lg font-bold text-navy-900">{expected}</dd>
                </div>
                <div>
                  <dt className="text-sm text-text-muted">{copy.deliverTo}</dt>
                  {address?.lines.map((line) => (
                    <dd key={line} className="text-navy-900">
                      {line}
                    </dd>
                  ))}
                </div>
                <div>
                  <dt className="text-sm text-text-muted">{copy.reference}</dt>
                  <dd className="font-semibold text-navy-900">{order.reference || '–'}</dd>
                  <dd className="text-text-muted">
                    {order.placedBy}, {order.company}
                  </dd>
                  {order.customer && (
                    <dd className="text-text-muted">
                      {partnerCheckout.orderedFor}{' '}
                      <span className="font-semibold text-navy-900">{order.customer.name}</span>
                    </dd>
                  )}
                </div>
              </dl>

              <div>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-navy-900">
                  {copy.items}
                </h2>
                <CartLines items={order.lines} readOnly />
                <dl className="mt-4 ml-auto w-full max-w-xs text-[15px]">
                  {[
                    [summary.subtotal, formatPartPrice(order.subtotal)],
                    [
                      summary.freight,
                      order.freight === 0 ? summary.freeFreight : formatPartPrice(order.freight),
                    ],
                    [summary.vat, formatPartPrice(order.vat)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-1">
                      <dt className="text-text-muted">{label}</dt>
                      <dd className="tabular-nums">{value}</dd>
                    </div>
                  ))}
                  <div className="mt-1 flex items-baseline justify-between border-t border-border pt-2">
                    <dt className="font-semibold text-navy-900">{summary.total}</dt>
                    <dd className="text-xl font-bold text-navy-900 tabular-nums">
                      {formatPartPrice(order.total)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
