type ChipGroupProps = {
  label: string
  /** The first chip, selected when nothing else is. */
  allLabel: string
  options: { value: string; label: string; count: number }[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}

/** Row of toggle chips with counts; several can be on at once. */
export function ChipGroup({
  label,
  allLabel,
  options,
  selected,
  onToggle,
  onClear,
}: ChipGroupProps) {
  const chip = (on: boolean) =>
    `inline-flex h-9 items-center gap-2 rounded-pill border px-4 text-sm font-medium transition-colors duration-150 ${
      on
        ? 'border-primary bg-primary text-white'
        : 'border-border-strong bg-white text-navy-900 hover:border-primary hover:text-primary'
    }`
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={selected.length === 0}
        onClick={onClear}
        className={chip(selected.length === 0)}
      >
        {allLabel}
      </button>
      {options.map((option) => {
        const on = selected.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(option.value)}
            className={chip(on)}
          >
            {option.label}
            <span className={`text-xs tabular-nums ${on ? 'text-white/80' : 'text-text-subtle'}`}>
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
