import { useId } from 'react'
import { applications } from '../../data/applications'
import { anyOption, formCopy, parameterDefs, type ParameterDef } from '../../data/sizingParameters'
import { applicationTrail } from '../../lib/catalog'
import type { FilterGroup } from '../../types'
import { CheckboxGroup } from './form/CheckboxGroup'
import { CompactNumber } from './form/CompactNumber'
import { CompactSelect, compactControl } from './form/CompactSelect'
import { ParamRow } from './form/ParamRow'
import { ReadOnlyValue } from './form/ReadOnlyValue'

type NumberId = Extract<ParameterDef, { kind: 'number' }>['id']

type SizingParameterFormProps = {
  /** Filter groups with hit counts, by parameter id. */
  groups: Map<string, FilterGroup>
  /** Current value of a select row (from the URL or its default); "" for none. */
  valueOf: (id: string) => string
  onSelect: (id: string, value: string) => void
  onToggle: (id: string, value: string) => void
  /** Number rows in their display units. */
  numbers: Record<NumberId, number>
  units: Record<string, string>
  onNumber: (id: NumberId, value: number) => void
  onUnit: (param: string, unit: string) => void
  errors: Partial<Record<string, string>>
  /** Read-only values that follow other rows, e.g. "Mechanical seal". */
  readOnly: Record<string, string>
  hits: number
}

/** Indents applications under their area in the "Select application" list. */
function applicationLabel(id: string, label: string) {
  const app = applications.find((a) => a.id === id)
  const depth = app ? applicationTrail(app).length - 2 : 0
  return `${'   '.repeat(Math.max(0, depth))}${label}`
}

/**
 * The dense "Select parameters" form: one compact row per parameter in
 * data/sizingParameters.ts. Filter rows show their hit counts; options that
 * would leave no hits are disabled.
 */
export function SizingParameterForm({
  groups,
  valueOf,
  onSelect,
  onToggle,
  numbers,
  units,
  onNumber,
  onUnit,
  errors,
  readOnly,
  hits,
}: SizingParameterFormProps) {
  const ids = useId()

  return (
    <div className="divide-y divide-border/60">
      {parameterDefs.map((def) => {
        const id = `${ids}-${def.id}`
        switch (def.kind) {
          case 'select': {
            const group = groups.get(def.id)
            const options = group
              ? group.options.map((o) => ({
                  value: o.value,
                  label: def.id === 'application' ? applicationLabel(o.value, o.label) : o.label,
                  disabled: o.count === 0 && !o.selected,
                }))
              : (def.options ?? [])
            return (
              <ParamRow key={def.id} label={def.label} htmlFor={id} required={def.required}>
                <CompactSelect
                  id={id}
                  value={valueOf(def.id)}
                  options={options}
                  onChange={(value) => onSelect(def.id, value)}
                  anyLabel={def.default ? undefined : anyOption}
                />
              </ParamRow>
            )
          }
          case 'checkboxes': {
            const group = groups.get(def.id)
            return (
              <ParamRow key={def.id} label={def.label}>
                <CheckboxGroup
                  label={def.label}
                  options={group?.options ?? []}
                  onToggle={(value) => onToggle(def.id, value)}
                />
              </ParamRow>
            )
          }
          case 'number':
            return (
              <ParamRow
                key={def.id}
                label={def.label}
                htmlFor={id}
                required={def.required}
                error={errors[def.id]}
                after={
                  def.units.length > 1 && def.unitParam ? (
                    <select
                      value={units[def.unitParam]}
                      onChange={(e) => onUnit(def.unitParam!, e.target.value)}
                      aria-label={`${def.label}, unit`}
                      className={`${compactControl} -mt-[7px] w-[5.5rem] cursor-pointer`}
                    >
                      {def.units.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    def.units[0]?.label
                  )
                }
              >
                <CompactNumber
                  id={id}
                  value={numbers[def.id]}
                  onValue={(value) => onNumber(def.id, value)}
                  accept={def.id === 'temp' ? Number.isFinite : undefined}
                  invalid={Boolean(errors[def.id])}
                />
              </ParamRow>
            )
          case 'readonly':
            return (
              <ParamRow key={def.id} label={def.label}>
                <ReadOnlyValue value={readOnly[def.id] ?? def.value} />
              </ParamRow>
            )
          case 'hits':
            return (
              <ParamRow key={def.id} label={def.label}>
                <div
                  aria-live="polite"
                  className="flex h-8 items-center text-[15px] font-bold text-primary tabular-nums"
                >
                  {formCopy.hits(hits)}
                </div>
              </ParamRow>
            )
        }
      })}
    </div>
  )
}
