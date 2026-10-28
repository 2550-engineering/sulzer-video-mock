import { CircleCheck, UserCheck } from 'lucide-react'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { serviceRequestReference } from '../../config/demo'
import { assets } from '../../data/assets'
import { productPage } from '../../data/catalogPages'
import type { Product, Service } from '../../types'

const copy = productPage.services.request
const other = 'other'

const field =
  'w-full rounded-md border border-border-strong bg-white px-3.5 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none'

type ServiceRequestFormProps = {
  product: Product
  services: Service[]
  onDone: () => void
}

/**
 * "Request service" form. Signed in, it is prefilled with the demo user, their
 * company and the site where they run this product. Sending shows a fixed
 * reference number; nothing is stored.
 */
export function ServiceRequestForm({ product, services, onDone }: ServiceRequestFormProps) {
  const { user } = useAuth()
  const ids = useId()
  const [values, setValues] = useState({
    service: services[0]?.id ?? other,
    date: '',
    site: user ? (assets.find((asset) => asset.productId === product.id)?.location ?? '') : '',
    name: user?.name ?? '',
    company: user?.company ?? '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const set = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  const serviceName =
    services.find((service) => service.id === values.service)?.name ?? copy.otherService

  if (sent) {
    return (
      <div className="flex animate-fade-in flex-col items-center px-8 py-12 text-center">
        <CircleCheck className="size-14 text-success" strokeWidth={1.5} />
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-navy-900">{copy.sentTitle}</h3>
        <p className="mt-2 max-w-md text-text-muted">{copy.sentText}</p>
        <p className="mt-7 rounded-md border border-border bg-surface-subtle px-6 py-3">
          <span className="block text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
            {copy.reference}
          </span>
          <span className="mt-1 block text-2xl font-bold tracking-wide text-brand tabular-nums">
            {serviceRequestReference}
          </span>
        </p>
        <dl className="mt-7 w-full max-w-sm divide-y divide-border border-y border-border text-left text-[15px]">
          {[
            [copy.serviceType, serviceName],
            [copy.date, values.date || copy.noDate],
            [copy.site, values.site],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2.5">
              <dt className="text-text-muted">{label}</dt>
              <dd className="text-right font-semibold text-navy-900">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex gap-3">
          <Link
            to={copy.requestsTo}
            className="inline-flex h-11 items-center rounded-pill border border-primary px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
          >
            {copy.viewRequests}
          </Link>
          <button
            type="button"
            onClick={onDone}
            className="inline-flex h-11 items-center rounded-pill bg-primary px-7 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            {copy.done}
          </button>
        </div>
      </div>
    )
  }

  const label = (key: string, text: string, input: ReactNode, wide = false) => (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={`${ids}-${key}`} className="mb-1.5 block text-sm font-semibold text-navy-900">
        {text}
      </label>
      {input}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="px-7 py-6">
      {user && (
        <p className="mb-5 flex items-center gap-2 rounded-md bg-primary-tint px-4 py-2.5 text-sm text-navy-900">
          <UserCheck className="size-4 text-primary" />
          {copy.prefilled}
        </p>
      )}
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {label(
          'service',
          copy.serviceType,
          <select
            id={`${ids}-service`}
            value={values.service}
            onChange={(e) => set('service')(e.target.value)}
            className={`${field} h-11 cursor-pointer`}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
            <option value={other}>{copy.otherService}</option>
          </select>,
        )}
        {label(
          'date',
          copy.date,
          <input
            id={`${ids}-date`}
            type="date"
            value={values.date}
            onChange={(e) => set('date')(e.target.value)}
            className={`${field} h-11`}
          />,
        )}
        {label(
          'site',
          copy.site,
          <input
            id={`${ids}-site`}
            required
            value={values.site}
            onChange={(e) => set('site')(e.target.value)}
            placeholder={copy.sitePlaceholder}
            className={`${field} h-11`}
          />,
          true,
        )}
        {label(
          'name',
          copy.name,
          <input
            id={`${ids}-name`}
            required
            autoComplete="name"
            value={values.name}
            onChange={(e) => set('name')(e.target.value)}
            className={`${field} h-11`}
          />,
        )}
        {label(
          'company',
          copy.company,
          <input
            id={`${ids}-company`}
            required
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set('company')(e.target.value)}
            className={`${field} h-11`}
          />,
        )}
        {label(
          'message',
          copy.message,
          <textarea
            id={`${ids}-message`}
            rows={4}
            value={values.message}
            onChange={(e) => set('message')(e.target.value)}
            placeholder={copy.messagePlaceholder}
            className={`${field} resize-none py-2.5`}
          />,
          true,
        )}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-11 items-center rounded-pill px-5 text-sm font-semibold text-navy-900 transition-colors hover:bg-surface-muted"
        >
          {copy.cancel}
        </button>
        <button
          type="submit"
          className="inline-flex h-11 items-center rounded-pill bg-primary px-7 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
        >
          {copy.submit}
        </button>
      </div>
    </form>
  )
}
