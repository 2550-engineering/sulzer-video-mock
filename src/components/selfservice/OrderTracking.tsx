import { Copy, MapPin, Truck } from 'lucide-react'
import { demoClock } from '../../config/demo'
import { orderPage as copy } from '../../data/selfServicePages'
import { formatDate, formatDateTime } from '../../lib/format'
import { orderStepTimes, orderSteps } from '../../lib/selfService'
import { useToast } from '../../toast/useToast'
import type { Order } from '../../types'
import { ProgressSteps } from './ProgressSteps'

const weekday = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' })

/**
 * Track & trace: expected (or actual) delivery, carrier and tracking number, the
 * Confirmed → Packed → Shipped → Delivered steps, and every shipment event, newest first.
 */
export function OrderTracking({ order }: { order: Order }) {
  const showToast = useToast()
  const times = orderStepTimes(order)
  const delivered = order.status === 'Delivered'
  const events = [...order.events].reverse()

  return (
    <section className="rounded-lg border border-border bg-white">
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border px-6 py-5">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary-tint text-primary">
            <Truck className="size-6" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-text-muted">
              {delivered ? copy.tracking.delivered : copy.tracking.expected}
            </h2>
            <p className="text-2xl font-bold tracking-tight text-navy-900">
              {weekday(order.expectedDelivery)}, {formatDate(order.expectedDelivery)}
            </p>
          </div>
        </div>
        {order.shipment ? (
          <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-text-muted">{copy.tracking.carrier}</dt>
              <dd className="mt-0.5 font-semibold text-navy-900">{order.shipment.carrier}</dd>
              <dd className="text-text-muted">
                {copy.tracking.packages(order.shipment.packages, order.shipment.weight)}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">{copy.tracking.trackingNumber}</dt>
              <dd className="mt-0.5 flex items-center gap-2 font-semibold text-navy-900 tabular-nums">
                {order.shipment.trackingNumber}
                <button
                  type="button"
                  aria-label={copy.tracking.copy}
                  onClick={() =>
                    showToast({
                      message: copy.tracking.copied,
                      detail: order.shipment?.trackingNumber,
                    })
                  }
                  className="-m-1 rounded-sm p-1 text-text-subtle transition-colors hover:text-primary"
                >
                  <Copy className="size-4" />
                </button>
              </dd>
            </div>
          </dl>
        ) : (
          <p className="max-w-56 text-sm text-text-muted">{copy.tracking.notShipped}</p>
        )}
      </div>

      <div className="px-6 pt-6 pb-2">
        <ProgressSteps
          label={copy.tracking.title}
          current={orderSteps.indexOf(order.status)}
          steps={orderSteps.map((step) => ({
            label: copy.steps[step],
            time: times[step] && formatDateTime(times[step], demoClock.today),
            note: step === 'Delivered' ? formatDate(order.expectedDelivery) : undefined,
          }))}
        />
      </div>

      <div className="px-6 pt-4 pb-6">
        <h3 className="text-sm font-semibold text-navy-900">{copy.tracking.history}</h3>
        <ol className="mt-3">
          {events.map((event, i) => (
            <li
              key={`${event.at}-${event.text}`}
              className="relative grid grid-cols-[8.5rem_1rem_minmax(0,1fr)] gap-x-4 pb-4 last:pb-0"
            >
              <p className="text-sm text-text-muted tabular-nums">
                {formatDateTime(event.at, demoClock.today)}
              </p>
              <div className="relative flex justify-center">
                {i < events.length - 1 && (
                  <span aria-hidden className="absolute top-3 -bottom-4 w-px bg-border" />
                )}
                <span
                  aria-hidden
                  className={`relative mt-1.5 size-2.5 rounded-full ${i === 0 ? 'bg-primary ring-4 ring-primary-tint' : 'bg-border-strong'}`}
                />
              </div>
              <div>
                <p
                  className={`text-[15px] ${i === 0 ? 'font-semibold text-navy-900' : 'text-text'}`}
                >
                  {event.text}
                </p>
                <p className="flex items-center gap-1 text-sm text-text-muted">
                  <MapPin aria-hidden className="size-3.5" />
                  {event.location}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
