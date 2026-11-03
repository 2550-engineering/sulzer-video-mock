import { CircleCheck, UserCheck } from 'lucide-react'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { useAuth } from '../../auth/useAuth'
import { quotationReference } from '../../config/demo'
import { variantPage } from '../../data/variantPages'
import type { ResultArticle } from '../../types'
import { TabHeading } from '../TabHeading'

const copy = variantPage.quotation

const field =
  'w-full rounded-md border border-border-strong bg-white px-3.5 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none'

/**
 * "Request quotation": prefilled with the demo user when signed in. Sending
 * shows a fixed reference; nothing is stored.
 */
export function QuotationTab({ article }: { article: ResultArticle }) {
  const { user } = useAuth()
  const ids = useId()
  const [values, setValues] = useState({
    name: user?.name ?? '',
    company: user?.company ?? '',
    email: user?.email ?? '',
    quantity: '1',
    delivery: copy.deliveryOptions[0],
    message: '',
  })
  const [sent, setSent] = useState(false)
  const set = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  const label = (key: keyof typeof copy.fields, control: ReactNode, wide = false) => (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={`${ids}-${key}`} className="mb-1.5 block text-sm font-semibold text-navy-900">
        {copy.fields[key]}
      </label>
      {control}
    </div>
  )

  return (
    <>
      <TabHeading title={copy.title} />
      <p className="mt-3 max-w-2xl text-text-muted">{copy.intro}</p>

      <div className="mt-8 max-w-3xl rounded-lg border border-border bg-white">
        {sent ? (
          <div className="flex animate-fade-in flex-col items-center px-8 py-12 text-center">
            <CircleCheck className="size-14 text-success" strokeWidth={1.5} />
            <h3 className="mt-5 text-2xl font-bold tracking-tight text-navy-900">
              {copy.sentTitle}
            </h3>
            <p className="mt-2 max-w-md text-text-muted">{copy.sentText(values.email)}</p>
            <p className="mt-7 rounded-md border border-border bg-surface-subtle px-6 py-3">
              <span className="block text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
                {copy.reference}
              </span>
              <span className="mt-1 block text-2xl font-bold tracking-wide text-brand tabular-nums">
                {quotationReference}
              </span>
            </p>
            <dl className="mt-7 w-full max-w-md divide-y divide-border border-y border-border text-left text-[15px]">
              {[
                [copy.product, article.code],
                [copy.fields.quantity, values.quantity],
                [copy.fields.delivery, values.delivery],
              ].map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-text-muted">{term}</dt>
                  <dd className="text-right font-semibold text-navy-900">{value}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-8 inline-flex h-11 items-center rounded-pill border border-primary px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
            >
              {copy.another}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 py-6">
            {user && (
              <p className="mb-5 flex items-center gap-2 rounded-md bg-primary-tint px-4 py-2.5 text-sm text-navy-900">
                <UserCheck className="size-4 text-primary" />
                {copy.prefilled}
              </p>
            )}
            <p className="mb-5 rounded-md border border-border bg-surface-subtle px-4 py-3 text-[15px]">
              <span className="block text-xs font-semibold text-text-muted">{copy.product}</span>
              <span className="font-semibold text-navy-900">{article.code}</span>{' '}
              <span className="text-text-muted tabular-nums">· {article.productNumber}</span>
            </p>
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              {label(
                'name',
                <input
                  id={`${ids}-name`}
                  required
                  value={values.name}
                  onChange={(e) => set('name')(e.target.value)}
                  className={`${field} h-11`}
                />,
              )}
              {label(
                'company',
                <input
                  id={`${ids}-company`}
                  required
                  value={values.company}
                  onChange={(e) => set('company')(e.target.value)}
                  className={`${field} h-11`}
                />,
              )}
              {label(
                'email',
                <input
                  id={`${ids}-email`}
                  type="email"
                  required
                  value={values.email}
                  onChange={(e) => set('email')(e.target.value)}
                  className={`${field} h-11`}
                />,
              )}
              {label(
                'quantity',
                <input
                  id={`${ids}-quantity`}
                  type="number"
                  min={1}
                  max={99}
                  required
                  value={values.quantity}
                  onChange={(e) => set('quantity')(e.target.value)}
                  className={`${field} h-11 tabular-nums`}
                />,
              )}
              {label(
                'delivery',
                <select
                  id={`${ids}-delivery`}
                  value={values.delivery}
                  onChange={(e) => set('delivery')(e.target.value)}
                  className={`${field} h-11 cursor-pointer`}
                >
                  {copy.deliveryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>,
                true,
              )}
              {label(
                'message',
                <textarea
                  id={`${ids}-message`}
                  rows={3}
                  value={values.message}
                  placeholder={copy.messagePlaceholder}
                  onChange={(e) => set('message')(e.target.value)}
                  className={`${field} resize-none py-2.5`}
                />,
                true,
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="inline-flex h-11 items-center rounded-pill bg-primary px-7 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
              >
                {copy.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
