import { Minus, Plus } from 'lucide-react'

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  label: string
  max?: number
}

/** − / quantity / + (1 to `max`). */
export function QuantityStepper({ value, onChange, label, max = 99 }: QuantityStepperProps) {
  const button =
    'flex size-10 items-center justify-center text-navy-900 transition-colors hover:text-primary disabled:text-text-subtle'
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center rounded-pill border border-border-strong bg-white"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`${label} −1`}
        className={button}
      >
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="w-8 text-center font-semibold text-navy-900 tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`${label} +1`}
        className={button}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
