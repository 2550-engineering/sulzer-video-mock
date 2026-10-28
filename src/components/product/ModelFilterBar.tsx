import { productPage } from '../../data/catalogPages'
import type { ModelFilters, modelFilterOptions } from '../../lib/modelSpecs'
import { SegmentedToggle } from '../SegmentedToggle'
import { SelectField } from '../SelectField'

const copy = productPage.models

type ModelFilterBarProps = {
  filters: ModelFilters
  options: ReturnType<typeof modelFilterOptions>
  shown: number
  total: number
  onFrequency: (hz: 50 | 60) => void
  onPower: (value: string) => void
  onConnection: (value: string) => void
  /** Shows "Reset" when given. */
  onReset?: () => void
}

/** Frequency toggle, motor power and discharge size selects, and the model count. */
export function ModelFilterBar({
  filters,
  options,
  shown,
  total,
  onFrequency,
  onPower,
  onConnection,
  onReset,
}: ModelFilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-5 rounded-lg border border-border bg-surface-subtle px-6 py-5">
      {options.frequencies.length > 1 && (
        <SegmentedToggle
          label={copy.filters.frequency}
          value={String(filters.frequency)}
          options={options.frequencies.map((hz) => ({ value: String(hz), label: `${hz} Hz` }))}
          onChange={(value) => onFrequency(Number(value) as 50 | 60)}
        />
      )}
      <div className="w-52">
        <SelectField
          layout="stacked"
          label={copy.filters.power}
          value={filters.power}
          onChange={onPower}
          options={[
            { value: '', label: copy.filters.allPower },
            ...options.power.map(({ value, label }) => ({ value, label })),
          ]}
        />
      </div>
      <div className="w-44">
        <SelectField
          layout="stacked"
          label={copy.filters.connection}
          value={filters.connection}
          onChange={onConnection}
          options={[{ value: '', label: copy.filters.allConnections }, ...options.connection]}
        />
      </div>

      <div className="ml-auto flex h-10 items-center gap-4">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {copy.filters.reset}
          </button>
        )}
        <p className="font-semibold text-navy-900" aria-live="polite">
          {copy.count(shown, total)}
        </p>
      </div>
    </div>
  )
}
