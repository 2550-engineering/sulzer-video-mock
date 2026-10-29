export type CompactOption = { value: string; label: string; disabled?: boolean }

type CompactSelectProps = {
  id: string
  value: string
  options: CompactOption[]
  onChange: (value: string) => void
  /** First option meaning "no choice" ("–"); omit when a value is always set. */
  anyLabel?: string
}

export const compactControl =
  'h-8 w-full rounded-sm border border-border-strong bg-white px-2 text-[13px] text-text transition-[border-color,box-shadow] focus:border-primary focus:shadow-[0_0_0_3px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none'

/** Small native select for the sizing form. Options with no hits come disabled. */
export function CompactSelect({ id, value, options, onChange, anyLabel }: CompactSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${compactControl} cursor-pointer`}
    >
      {anyLabel !== undefined && <option value="">{anyLabel}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
