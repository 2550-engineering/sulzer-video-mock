import { useId } from 'react'

type SegmentedToggleProps<T extends string> = {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

/** Pill-shaped choice between a few options (radio group), with a sliding highlight. */
export function SegmentedToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedToggleProps<T>) {
  const labelId = useId()
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span id={labelId} className="font-semibold text-navy-900">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="relative grid h-10 auto-cols-fr grid-flow-col rounded-pill bg-surface-sunken p-1"
      >
        {/* Highlight slides under the selected option. */}
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 rounded-pill bg-white shadow-card transition-transform duration-200 ease-sz"
          style={{
            width: `calc((100% - 0.5rem) / ${options.length})`,
            transform: `translateX(${index * 100}%)`,
          }}
        />
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`relative min-w-16 rounded-pill px-4 font-semibold transition-colors ${
                selected ? 'text-navy-900' : 'text-text-muted hover:text-navy-900'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
