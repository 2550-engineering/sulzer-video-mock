import { productPage } from '../../data/catalogPages'
import type { KeySpecs } from '../../types'

const order: (keyof KeySpecs)[] = ['liquidTemp', 'maxFlow', 'maxHead', 'maxPressure']

/** Compact four-row spec table for list rows: label left, bold value right. */
export function KeySpecTable({ specs }: { specs: KeySpecs }) {
  return (
    // Fixed width, so the tables line up from row to row.
    <dl className="grid w-60 grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-[13px] leading-5">
      {order.map((key) => (
        <div key={key} className="contents">
          <dt className="whitespace-nowrap text-text-muted">{productPage.keySpecLabels[key]}</dt>
          <dd className="text-right font-semibold whitespace-nowrap text-navy-900 tabular-nums">
            {specs[key]}
          </dd>
        </div>
      ))}
    </dl>
  )
}
