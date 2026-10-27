import { Tag, Truck } from 'lucide-react'
import { intro, portalPreview } from '../../data/mySulzer'
import { ImageSlot } from '../ImageSlot'

/** Intro visual: brand image with floating snippets of the portal (price, order, request). */
export function PortalPreview() {
  const { price, order, request } = portalPreview

  return (
    <div className="relative aspect-[5/4]">
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <ImageSlot image={intro.image} />
      </div>

      <div className="absolute top-8 right-8 flex items-center gap-2 rounded-pill bg-white/95 px-4 py-2 text-sm shadow-card">
        <span aria-hidden className="size-2 rounded-full bg-primary ring-4 ring-primary-tint" />
        <span className="font-medium text-navy-900">{request.label}</span>
        <span className="text-text-muted">· {request.status}</span>
      </div>

      <div className="absolute top-24 -left-8 w-80 rounded-md bg-white p-5 shadow-card">
        <p className="flex items-center gap-2 text-xs font-medium text-text-muted">
          <Tag className="size-3.5 text-primary" />
          {price.label}
        </p>
        <p className="mt-2 text-sm font-semibold text-navy-900">{price.product}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-brand">{price.value}</p>
        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-success-strong">
          <span aria-hidden className="size-2 rounded-full bg-success" />
          {price.stock}
        </p>
      </div>

      <div className="absolute -right-6 bottom-10 w-[22rem] rounded-md bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-xs font-medium text-text-muted">
            <Truck className="size-3.5 text-primary" />
            {order.label}
          </p>
          <span className="rounded-pill bg-primary-tint px-2.5 py-0.5 text-xs font-semibold text-primary">
            {order.status}
          </span>
        </div>
        <ol className="mt-5 grid grid-cols-3">
          {order.steps.map((step, i) => {
            const done = i <= order.current
            return (
              <li key={step} className="relative flex flex-col items-center text-center">
                {i > 0 && (
                  <span
                    aria-hidden
                    className={`absolute top-[7px] right-1/2 h-0.5 w-full ${done ? 'bg-primary' : 'bg-border'}`}
                  />
                )}
                <span
                  aria-hidden
                  className={`relative size-4 rounded-full border-2 ${
                    done ? 'border-primary bg-primary' : 'border-border-strong bg-white'
                  }`}
                />
                <span
                  className={`mt-2 text-xs ${done ? 'font-semibold text-navy-900' : 'text-text-muted'}`}
                >
                  {step}
                </span>
              </li>
            )
          })}
        </ol>
        <p className="mt-4 border-t border-border pt-3 text-xs text-text-muted">{order.eta}</p>
      </div>
    </div>
  )
}
