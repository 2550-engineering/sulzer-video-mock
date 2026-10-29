type CheckboxGroupProps = {
  label: string
  options: { value: string; label: string; count: number; selected: boolean }[]
  onToggle: (value: string) => void
}

/** Inline checkboxes with hit counts; options with no hits are greyed out unless ticked. */
export function CheckboxGroup({ label, options, onToggle }: CheckboxGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1"
    >
      {options.map((option) => {
        const empty = option.count === 0 && !option.selected
        return (
          <label
            key={option.value}
            className={`inline-flex items-center gap-1.5 text-[13px] transition-opacity duration-200 ${
              empty ? 'cursor-not-allowed opacity-45' : 'cursor-pointer text-text'
            }`}
          >
            <input
              type="checkbox"
              checked={option.selected}
              disabled={empty}
              onChange={() => onToggle(option.value)}
              className="size-[15px] cursor-pointer accent-primary disabled:cursor-not-allowed"
            />
            {option.label}
            <span className="text-text-subtle tabular-nums">({option.count})</span>
          </label>
        )
      })}
    </div>
  )
}
