import { Leaf } from 'lucide-react'
import { useId, useState } from 'react'
import { market, replacementGuideDemo } from '../../config/demo'
import { replacementGuidePage } from '../../data/replacementGuidePage'
import { groupThousands } from '../../lib/format'
import { formatPrice } from '../../lib/modelSpecs'
import { energySavings } from '../../lib/replacementGuide'

const copy = replacementGuidePage.calculator

const currencySymbol =
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: market.currency })
    .formatToParts(0)
    .find((part) => part.type === 'currency')?.value ?? market.currency

const field =
  'h-12 w-full rounded-md border border-navy-600 bg-navy-800 px-3.5 text-base text-white tabular-nums transition-[border-color,box-shadow] focus:border-primary-on-dark focus:shadow-[0_0_0_4px_var(--sz-color-navy-700)] focus-visible:outline-none'

type GuideEnergyCalculatorProps = {
  /** Input power of the installed pump, kW. */
  existingKw: number
  /** Input power of the Sulzer replacement, kW. */
  replacementKw: number
}

/**
 * Energy savings calculator: operating hours and electricity rate in, energy, cost,
 * 10-year cost and CO₂ saved out. The inputs keep their values when the pump changes.
 */
export function GuideEnergyCalculator({ existingKw, replacementKw }: GuideEnergyCalculatorProps) {
  const id = useId()
  const [hours, setHours] = useState(String(replacementGuideDemo.operatingHours))
  const [rate, setRate] = useState(replacementGuideDemo.electricityPrice.toFixed(2))
  const savings = energySavings(existingKw, replacementKw, Number(hours) || 0, Number(rate) || 0)

  const metrics = [
    { label: copy.energy.label, value: groupThousands(savings.kwhPerYear), unit: copy.energy.unit },
    { label: copy.cost.label, value: formatPrice(savings.costPerYear), accent: true },
    { label: copy.tenYears.label, value: formatPrice(savings.costTenYears), accent: true },
    { label: copy.co2.label, value: groupThousands(savings.co2Kg), unit: copy.co2.unit },
  ]

  return (
    <section className="rounded-lg bg-navy-900 px-8 py-7 text-white on-dark max-md:px-5 max-md:py-6">
      <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
        <Leaf aria-hidden className="size-5 text-success-on-dark" />
        {copy.title}
      </h2>
      <p className="mt-1.5 text-sm text-text-on-dark-muted">{copy.text}</p>

      <div className="mt-6 grid max-w-xl gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${id}-hours`}
            className="mb-1.5 block text-xs tracking-[0.08em] text-text-on-dark-muted uppercase"
          >
            {copy.hours}
          </label>
          <input
            id={`${id}-hours`}
            type="number"
            min={0}
            max={8760}
            step={100}
            inputMode="numeric"
            value={hours}
            onChange={(event) => setHours(event.target.value)}
            className={field}
          />
        </div>
        <div>
          <label
            htmlFor={`${id}-rate`}
            className="mb-1.5 block text-xs tracking-[0.08em] text-text-on-dark-muted uppercase"
          >
            {copy.rate(currencySymbol)}
          </label>
          <input
            id={`${id}-rate`}
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className={field}
          />
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 max-sm:grid-cols-1 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-navy-700 bg-navy-800 px-5 py-4"
          >
            <dt className="text-xs tracking-[0.06em] text-text-on-dark-muted uppercase">
              {metric.label}
            </dt>
            <dd
              className={`mt-2 text-[1.75rem] leading-none font-bold tracking-tight tabular-nums ${
                metric.accent ? 'text-success-on-dark' : ''
              }`}
            >
              {metric.value}
              {metric.unit && (
                <span className="ml-1 text-sm font-normal text-text-on-dark-muted">
                  {metric.unit}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
