import { ChevronDown } from 'lucide-react'
import { useId } from 'react'

type SelectFieldProps<T extends string> = {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  /** `inline` puts the label beside the select, `stacked` above it. */
  layout?: 'inline' | 'stacked'
  /** `dark` for navy bands: light label text. */
  tone?: 'light' | 'dark'
}

/** Native select in Sulzer styling, with its label. */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  layout = 'inline',
  tone = 'light',
}: SelectFieldProps<T>) {
  const id = useId()
  return (
    <div
      className={
        layout === 'inline' ? 'flex items-center gap-3 text-sm' : 'flex flex-col gap-1.5 text-sm'
      }
    >
      <label
        htmlFor={id}
        className={
          tone === 'dark'
            ? 'font-semibold text-text-on-dark'
            : layout === 'inline'
              ? 'text-text-muted'
              : 'font-semibold text-navy-900'
        }
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="h-10 w-full cursor-pointer appearance-none rounded-md border border-border-strong bg-white pr-10 pl-3.5 font-medium text-navy-900 transition-colors hover:border-primary focus-visible:border-primary"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-muted"
        />
      </div>
    </div>
  )
}
