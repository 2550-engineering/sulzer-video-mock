import { ArrowRight, Check } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ProgressSteps } from '../components/selfservice/ProgressSteps'
import { demoClock } from '../config/demo'
import { confirmationCopy as copy, eshopPath } from '../data/eshop'
import { signedOutRedirect } from '../data/myPages'
import { orderPath, ordersPath } from '../data/selfServicePages'
import { formatDate, formatDateTime } from '../lib/format'
import { formatMoney, orderSteps, orderTotals, ordersFor } from '../lib/selfService'
import { useSelfService } from '../selfService/useSelfService'

/**
 * /eshop/confirmation/:id, right after checkout: order number, expected delivery, the
 * order's progress and the way to its track & trace page.
 */
export function OrderConfirmationPage() {
  const { user } = useAuth()
  const { orders } = useSelfService()
  const { id } = useParams()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const order = ordersFor(user, orders).find((o) => o.id === id)
  if (!order) return <Navigate to={ordersPath} replace />

  const totals = orderTotals(order)
  const details: [string, string][] = [
    [copy.details.order, order.id],
    [copy.details.po, order.poNumber],
    [copy.details.expected, formatDate(order.expectedDelivery)],
    [copy.details.delivery, order.deliveryMethod],
    [copy.details.total, formatMoney(totals.total)],
  ]

  return (
    <div className="bg-surface-muted">
      <title>{`${copy.title} ${order.id} | eShop | Sulzer`}</title>
      <div className="site-container py-16">
        <div className="mx-auto max-w-4xl animate-fade-in rounded-lg border border-border bg-white px-10 py-12 shadow-card">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-success text-white shadow-[0_0_0_8px_var(--sz-color-success-tint)]">
              <Check className="size-8" strokeWidth={2.5} />
            </span>
            <p className="mt-6 text-sm font-semibold tracking-[0.08em] text-success-strong uppercase">
              {copy.title}
            </p>
            <h1 className="mt-1 text-[2.5rem] leading-tight font-bold tracking-tight text-brand">
              {copy.thanks(user.firstName)}
            </h1>
            <p className="mt-3 max-w-xl text-lg text-text-muted">
              {copy.text(order.id, user.email)}
            </p>
          </div>

          <dl className="mt-10 grid gap-x-8 gap-y-5 border-y border-border py-7 sm:grid-cols-2 lg:grid-cols-3">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-text-muted">{label}</dt>
                <dd className="mt-0.5 font-semibold text-navy-900 tabular-nums">{value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-sm text-text-muted">{copy.details.address}</dt>
              <dd className="mt-0.5 text-[15px] leading-snug text-navy-900">
                {order.deliveryAddress.slice(0, 3).join(', ')}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <ProgressSteps
              label={copy.progress}
              current={0}
              steps={orderSteps.map((step, i) => ({
                label: copy.steps[step],
                time: i === 0 ? formatDateTime(order.placedAt, demoClock.today) : undefined,
                note: step === 'Packed' || step === 'Shipped' ? copy.nextStep[step] : undefined,
              }))}
            />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to={orderPath(order.id)}
              className="group inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {copy.track}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to={ordersPath}
              className="inline-flex h-12 items-center rounded-pill border border-primary px-7 text-[15px] font-semibold text-primary transition-colors hover:bg-primary-tint"
            >
              {copy.orders}
            </Link>
            <Link
              to={eshopPath}
              className="inline-flex h-12 items-center rounded-pill px-6 text-[15px] font-semibold text-navy-900 transition-colors hover:text-primary"
            >
              {copy.continue}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
