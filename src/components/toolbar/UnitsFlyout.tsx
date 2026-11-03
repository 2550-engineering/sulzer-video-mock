import { Globe } from 'lucide-react'
import { personalToolbar } from '../../data/personal'
import { usePersonal } from '../../personal/usePersonal'
import { useToast } from '../../toast/useToast'
import type { PersonalPreferences, UnitSystem } from '../../types'
import { SegmentedToggle } from '../SegmentedToggle'

const copy = personalToolbar.units

const unitOptions = (Object.keys(copy.units) as UnitSystem[]).map((value) => ({
  value,
  label: copy.units[value],
}))
const frequencyOptions = [
  { value: '50', label: '50 Hz' },
  { value: '60', label: '60 Hz' },
] as const

/** The account's market (read-only) and the unit and mains frequency preferences. */
export function UnitsFlyout() {
  const { preferences, setPreferences } = usePersonal()
  const showToast = useToast()

  function change(patch: Partial<PersonalPreferences>) {
    setPreferences(patch)
    showToast({ message: copy.saved })
  }

  return (
    <>
      <section className="rounded-lg bg-surface-muted p-5 ring-1 ring-border">
        <h3 className="flex items-center gap-2 font-semibold text-navy-900">
          <Globe aria-hidden className="size-4 text-primary" strokeWidth={2} />
          {copy.marketTitle}
        </h3>
        <dl className="mt-4 space-y-2 text-[15px]">
          {copy.rows.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-text-muted">{label}</dt>
              <dd className="font-semibold text-navy-900">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">{copy.marketNote}</p>
      </section>

      <div className="mt-8 space-y-6">
        <SegmentedToggle
          label={copy.unitsLabel}
          value={preferences.units}
          options={unitOptions}
          onChange={(units) => change({ units })}
        />
        <div>
          <SegmentedToggle
            label={copy.frequencyLabel}
            value={String(preferences.frequency) as '50' | '60'}
            options={[...frequencyOptions]}
            onChange={(hz) => change({ frequency: hz === '60' ? 60 : 50 })}
          />
          <p className="mt-2 text-sm text-text-muted">{copy.frequencyNote}</p>
        </div>
      </div>
    </>
  )
}
