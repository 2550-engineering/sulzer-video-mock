import { Leaf } from 'lucide-react'
import { sizingDemo } from '../../config/demo'
import { replacementPage } from '../../data/replacement'
import { groupThousands } from '../../lib/format'
import { formatPrice } from '../../lib/modelSpecs'
import type { ReplacementOption } from '../../lib/replacement'

const copy = replacementPage.savings

/** "What you save": cost per year, % less energy and payback for the selected suggestion. */
export function EnergySavings({ option }: { option: ReplacementOption }) {
  const saves = option.savingPerYear > 0
  return (
    <section className="flex h-full flex-col rounded-lg bg-navy-900 px-7 py-6 text-white on-dark">
      <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
        <Leaf className="size-5 text-success-on-dark" />
        {copy.title}
      </h2>
      {saves ? (
        <div key={option.result.variant.id} className="mt-5 flex flex-1 animate-fade-in flex-col">
          <p className="text-sm text-text-on-dark-muted">{copy.perYear}</p>
          <p className="mt-1 text-[2.75rem] leading-none font-bold tracking-tight tabular-nums">
            {formatPrice(option.savingPerYear)}
          </p>
          <p className="mt-2 text-sm text-text-on-dark-muted tabular-nums">
            {copy.energySaved(groupThousands(Math.round(option.kwhPerYear / 100) * 100))}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
            <div>
              <dt className="text-sm text-text-on-dark-muted">{copy.less}</dt>
              <dd className="mt-1 text-3xl font-bold text-success-on-dark tabular-nums">
                −{option.savingShare} %
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-on-dark-muted">{copy.payback}</dt>
              <dd className="mt-1 text-3xl font-bold tabular-nums">
                {option.paybackYears === null
                  ? '–'
                  : copy.years(groupThousands(option.paybackYears, 1))}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="mt-5 flex-1 text-text-on-dark-muted">{copy.noSaving}</p>
      )}
      <p className="mt-6 text-xs text-text-on-dark-muted">
        {copy.assumptions(
          groupThousands(sizingDemo.operatingHours),
          `€${sizingDemo.electricityPrice.toFixed(2)}`,
        )}
      </p>
    </section>
  )
}
