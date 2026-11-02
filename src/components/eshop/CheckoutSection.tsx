import type { ReactNode } from 'react'

/** A numbered step of the checkout form, in a white card. */
export function CheckoutSection({
  step,
  title,
  aside,
  children,
}: {
  step: number
  title: string
  /** Right of the title, e.g. "From your mySulzer account". */
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-border bg-white px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-navy-900">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm text-white tabular-nums">
            {step}
          </span>
          {title}
        </h2>
        {aside}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
