import { useId } from 'react'

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'number'
  /** Rows of a multi-line field; single line when left out. */
  rows?: number
  /** Shown under the field, in red. */
  error?: string
  autoFocus?: boolean
}

const field =
  'w-full rounded-md border bg-white px-3 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none'

/** A labelled text input or textarea in Sulzer form styling. */
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  rows,
  error,
  autoFocus,
}: TextFieldProps) {
  const id = useId()
  const border = error ? 'border-danger' : 'border-border-strong'
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-navy-900">
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          className={`${field} ${border} resize-y py-2 leading-snug`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${field} ${border} h-10`}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
