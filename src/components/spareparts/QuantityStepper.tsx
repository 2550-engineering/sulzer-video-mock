import { Minus, Plus } from 'lucide-react'

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  /** e.g. "Quantity" or "Quantity, Bearing kit". */
  label: string
  /** 0 lets the minus button remove a cart line. */
  min?: number
  max?: number
}

const step =
  'flex size-8 items-center justify-center rounded-full text-navy-900 transition-colors hover:bg-primary-tint hover:text-primary disabled:pointer-events-none disabled:text-text-subtle'

/** − 1 + in a pill. The number can be typed too. */
export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  const set = (next: number) => onChange(Math.min(max, Math.max(min, next)))
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-10 shrink-0 items-center rounded-pill border border-border-strong bg-white px-1"
    >
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => set(value - 1)}
        disabled={value <= min}
        className={step}
      >
        <Minus className="size-3.5" strokeWidth={2.25} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(e) => {
          const next = Number(e.target.value.replace(/\D/g, ''))
          if (next) set(next)
        }}
        onFocus={(e) => e.target.select()}
        className="w-7 bg-transparent text-center text-[15px] font-semibold text-navy-900 tabular-nums focus-visible:outline-none"
      />
      <button
        type="button"
        aria-label="Increase"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        className={step}
      >
        <Plus className="size-3.5" strokeWidth={2.25} />
      </button>
    </div>
  )
}
