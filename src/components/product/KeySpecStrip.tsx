import { productPage } from '../../data/catalogPages'
import type { KeySpecs } from '../../types'

const order: (keyof KeySpecs)[] = ['liquidTemp', 'maxFlow', 'maxHead', 'maxPressure']

/** Four headline figures with dividers, as in the product header. */
export function KeySpecStrip({ specs }: { specs: KeySpecs }) {
  return (
    <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
      {order.map((key) => (
        <div
          key={key}
          className="border-border px-4 text-center not-first:border-l max-sm:nth-3:border-l-0"
        >
          <dt className="text-sm whitespace-nowrap text-text-muted">
            {productPage.keySpecLabels[key]}
          </dt>
          <dd className="mt-1.5 text-2xl font-bold tracking-tight whitespace-nowrap text-navy-900 tabular-nums">
            {specs[key]}
          </dd>
        </div>
      ))}
    </dl>
  )
}
