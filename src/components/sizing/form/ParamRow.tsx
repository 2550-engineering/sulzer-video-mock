import type { ReactNode } from 'react'

type ParamRowProps = {
  label: string
  /** The control's id, so the label points at it. Omit for groups and read-only values. */
  htmlFor?: string
  required?: boolean
  /** Unit or note after the control. */
  after?: ReactNode
  error?: string
  children: ReactNode
}

/** One compact form row: small label (about 180 px), control (about 260 px), then the unit. */
export function ParamRow({ label, htmlFor, required, after, error, children }: ParamRowProps) {
  const Label = htmlFor ? 'label' : 'span'
  return (
    <div className="grid grid-cols-[11.25rem_minmax(0,16.25rem)_minmax(0,1fr)] items-start gap-x-3 py-[3px]">
      <Label htmlFor={htmlFor} className="pt-[7px] text-[13px] leading-tight text-text-muted">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </Label>
      <div className="min-w-0">
        {children}
        {error && <p className="mt-0.5 text-[11px] leading-tight text-danger">{error}</p>}
      </div>
      <div className="pt-[7px] text-[13px] text-text-muted">{after}</div>
    </div>
  )
}
