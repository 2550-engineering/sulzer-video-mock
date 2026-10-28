import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { productPage } from '../../data/catalogPages'
import type { Product, Service } from '../../types'
import { GradientBackdrop } from '../GradientBackdrop'
import { Modal } from '../Modal'
import { TabHeading } from '../TabHeading'
import { ServiceCard } from './ServiceCard'
import { ServiceRequestForm } from './ServiceRequestForm'

const copy = productPage.services

type ServicesTabProps = {
  product: Product
  services: Service[]
}

/** Services tab: service cards, then a "Need help?" band that opens the service request dialog. */
export function ServicesTab({ product, services }: ServicesTabProps) {
  const [open, setOpen] = useState(false)
  // A new key per opening starts the form fresh, while the last one stays visible as it fades out.
  const [session, setSession] = useState(0)

  function openRequest() {
    setSession((n) => n + 1)
    setOpen(true)
  }

  return (
    <>
      <TabHeading title={copy.title} />
      <p className="mt-3 max-w-2xl text-lg text-text-muted">{copy.intro(product.name)}</p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id}>
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>

      <section className="relative isolate mt-14 overflow-hidden rounded-lg px-10 py-10 on-dark">
        <GradientBackdrop tone="deep" />
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          <div className="max-w-2xl">
            <h3 className="text-[1.75rem] leading-tight font-bold tracking-tight text-white">
              {copy.band.title(product.name)}
            </h3>
            <p className="mt-2 text-lg text-text-on-dark">{copy.band.text}</p>
          </div>
          <button
            type="button"
            onClick={openRequest}
            className="group inline-flex h-12 items-center gap-2 rounded-pill bg-white px-7 font-semibold text-navy-900 transition-colors hover:bg-primary-tint"
          >
            {copy.band.action}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <Modal
        open={open}
        title={copy.request.title(product.name)}
        closeLabel={copy.request.close}
        onClose={() => setOpen(false)}
        width="max-w-2xl"
      >
        {session > 0 && (
          <ServiceRequestForm
            key={session}
            product={product}
            services={services}
            onDone={() => setOpen(false)}
          />
        )}
      </Modal>
    </>
  )
}
