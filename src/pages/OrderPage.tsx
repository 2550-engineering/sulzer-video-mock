import { Download, Headset, MapPin } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { OrderLinesTable } from '../components/selfservice/OrderLinesTable'
import { OrderTracking } from '../components/selfservice/OrderTracking'
import { SelfServicePageHeader } from '../components/selfservice/SelfServicePageHeader'
import { StatusPill } from '../components/selfservice/StatusPill'
import { customers } from '../data/assets'
import { signedOutRedirect } from '../data/myPages'
import {
  orderPage as copy,
  orderStatus,
  ordersPage,
  ordersPath,
  quotationPath,
} from '../data/selfServicePages'
import { formatDate } from '../lib/format'
import { ordersFor } from '../lib/selfService'
import { useSelfService } from '../selfService/useSelfService'
import { useToast } from '../toast/useToast'

const card = 'rounded-lg border border-border bg-white px-6 py-5'
const cardTitle = 'text-sm font-semibold tracking-[0.08em] text-text-muted uppercase'

/**
 * One order: /self-service/orders/:id. Signed-in only. Track & trace with the
 * shipment history, the line items and totals, then delivery and order details.
 */
export function OrderPage() {
  const { user } = useAuth()
  const { orders } = useSelfService()
  const { id } = useParams()
  const showToast = useToast()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const order = ordersFor(user, orders).find((o) => o.id === id)
  if (!order) return <Navigate to={ordersPath} replace />

  const customer = customers.find((c) => c.id === order.customerId)
  const placedOn = formatDate(order.placedAt.slice(0, 10))

  return (
    <div className="bg-surface-muted">
      <title>{`${copy.eyebrow} ${order.id} | mySulzer | Sulzer`}</title>
      <SelfServicePageHeader
        breadcrumb={[
          ...ordersPage.breadcrumb,
          { label: ordersPage.title, to: ordersPath },
          { label: order.id },
        ]}
        eyebrow={copy.eyebrow}
        title={order.id}
        badge={<StatusPill {...orderStatus[order.status]} />}
        description={
          <p className="text-base">
            {copy.placed(placedOn, order.placedBy)} · {copy.po}{' '}
            <span className="font-semibold text-navy-900">{order.poNumber}</span>
            {order.quotationId && (
              <>
                {' '}
                · {copy.fromQuotation}{' '}
                <Link
                  to={quotationPath(order.quotationId)}
                  className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                >
                  {order.quotationId}
                </Link>
              </>
            )}
          </p>
        }
        aside={
          <button
            type="button"
            onClick={() =>
              showToast({ message: copy.confirmationDownloaded(order.id), detail: 'PDF · 92 KB' })
            }
            className="inline-flex h-11 items-center gap-2 rounded-pill border border-primary bg-white px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
          >
            <Download className="size-4" />
            {copy.downloadConfirmation}
          </button>
        }
      />

      <div className="site-container grid items-start gap-6 pt-10 pb-24 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          <OrderTracking order={order} />
          <OrderLinesTable order={order} />
        </div>

        <aside className="space-y-6">
          <section className={card}>
            <h2 className={cardTitle}>{copy.delivery.title}</h2>
            <p className="mt-4 text-sm font-semibold text-navy-900">{copy.delivery.address}</p>
            <address className="mt-1 flex gap-2 text-[15px] leading-relaxed not-italic">
              <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-text-subtle" />
              <span>
                {order.deliveryAddress.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </address>
            <p className="mt-4 text-sm font-semibold text-navy-900">{copy.delivery.method}</p>
            <p className="mt-1 text-[15px]">{order.deliveryMethod}</p>
          </section>

          <section className={card}>
            <h2 className={cardTitle}>{copy.details.title}</h2>
            <dl className="mt-4 space-y-3 text-[15px]">
              {[
                [copy.details.placedOn, placedOn],
                [copy.details.placedBy, order.placedBy],
                ...(order.channel === 'partner' && customer
                  ? [[copy.details.customer, customer.name]]
                  : []),
                [copy.po, order.poNumber],
              ].map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4">
                  <dt className="text-text-muted">{term}</dt>
                  <dd className="text-right font-semibold text-navy-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={`${card} flex gap-4`}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
              <Headset className="size-5" strokeWidth={1.75} />
            </span>
            <div className="text-[15px]">
              <h2 className="font-semibold text-navy-900">{copy.help.title}</h2>
              <p className="mt-1 text-sm text-text-muted">{copy.help.text}</p>
              <p className="mt-2 font-semibold text-navy-900">{copy.help.phone}</p>
              <a
                href={`mailto:${copy.help.email}`}
                className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                {copy.help.email}
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
