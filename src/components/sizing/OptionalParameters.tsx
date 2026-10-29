import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import {
  optionalCopy as copy,
  optionalSections,
  type OptionalField,
} from '../../data/sizingParameters'
import { CompactNumber } from './form/CompactNumber'
import { CompactSelect } from './form/CompactSelect'
import { ParamRow } from './form/ParamRow'

type OptionalParametersProps = {
  /** The raw URL value of a field, or null when it uses its default. */
  valueOf: (id: string) => string | null
  onChange: (id: string, value: string) => void
  fullWidth: boolean
  onFullWidth: (fullWidth: boolean) => void
}

/** A field's current value as shown, with its unit. */
function display(field: OptionalField, raw: string | null) {
  if (field.kind === 'select') {
    const value = raw ?? field.default
    return field.options.find((o) => o.value === value)?.label ?? value
  }
  const value = raw ?? String(field.default)
  return field.unit ? `${value} ${field.unit}` : value
}

/**
 * "Optional sizing parameters": collapsible sections (collapsed by default),
 * each with a grey one-line summary of its values. Values are URL params, so
 * they travel with the sizing; hours and energy price feed the life cycle cost.
 */
export function OptionalParameters({
  valueOf,
  onChange,
  fullWidth,
  onFullWidth,
}: OptionalParametersProps) {
  const ids = useId()
  const [open, setOpen] = useState<string[]>([])
  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    )
  const action = 'text-[13px] font-semibold text-primary underline-offset-4 hover:underline'

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border-strong pb-2">
        <h2 className="text-lg font-bold tracking-tight text-navy-900">{copy.title}</h2>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setOpen(optionalSections.map((s) => s.id))}
            className={action}
          >
            {copy.expandAll}
          </button>
          <button type="button" onClick={() => setOpen([])} className={action}>
            {copy.collapseAll}
          </button>
          <button type="button" onClick={() => onFullWidth(!fullWidth)} className={action}>
            {fullWidth ? copy.normalWidth : copy.fullWidth}
          </button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {optionalSections.map((section) => {
          const expanded = open.includes(section.id)
          const panelId = `${ids}-${section.id}`
          return (
            <div key={section.id}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(section.id)}
                className="flex w-full items-start gap-2 py-2.5 text-left"
              >
                <ChevronDown
                  className={`mt-0.5 size-4 shrink-0 text-text-muted transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-navy-900">{section.title}</span>
                  <span className="block truncate text-xs text-text-muted">
                    {section.fields.map((field) => display(field, valueOf(field.id))).join(' · ')}
                  </span>
                </span>
              </button>
              <div
                id={panelId}
                inert={!expanded}
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-sz ${
                  expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className={`pb-3 pl-6 ${fullWidth ? 'grid gap-x-10 xl:grid-cols-2' : ''}`}>
                    {section.fields.map((field) => {
                      const id = `${panelId}-${field.id}`
                      const raw = valueOf(field.id)
                      return (
                        <ParamRow
                          key={field.id}
                          label={field.label}
                          htmlFor={id}
                          after={field.kind === 'number' ? field.unit : undefined}
                        >
                          {field.kind === 'select' ? (
                            <CompactSelect
                              id={id}
                              value={raw ?? field.default}
                              options={field.options}
                              onChange={(value) => onChange(field.id, value)}
                            />
                          ) : (
                            <CompactNumber
                              id={id}
                              value={raw === null ? field.default : Number(raw)}
                              accept={(n) => n >= 0}
                              onValue={(value) => onChange(field.id, String(value))}
                            />
                          )}
                        </ParamRow>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
