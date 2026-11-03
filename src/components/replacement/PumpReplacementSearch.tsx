import { CircleAlert, Search } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { productModels } from '../../data/productModels'
import { replacementPage, type ReplacementMode } from '../../data/replacement'
import { getModel } from '../../lib/catalog'
import type { ReplacementInput } from '../../lib/pumpReplacement'
import { SegmentedToggle } from '../SegmentedToggle'
import { SelectField } from '../SelectField'

const copy = replacementPage.search

type ReplacementSearchProps = {
  input: ReplacementInput
  /** The serial number that matched no unit, if any. */
  notFound?: string
  onSubmit: (input: ReplacementInput) => void
}

const inputClass =
  'h-12 w-full rounded-md border border-border-strong bg-white px-4 text-[17px] text-text tabular-nums transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none aria-invalid:border-danger'

const typeOptions = [
  { value: '', label: copy.type.placeholder, disabled: true },
  ...productModels.map((model) => ({
    value: model.id,
    label: model.frequency === 60 ? `${model.name} · 60 Hz` : model.name,
  })),
]

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-sm">
      <span className="font-semibold text-navy-900">{label}</span>
      {children}
    </label>
  )
}

/**
 * "Which pump do you want to replace?": serial number, Sulzer type (with its duty
 * point, filled in from the rated point) or another brand (manufacturer and duty
 * point). Starts from the URL; remount (via `key`) when the URL changes.
 */
export function PumpReplacementSearch({ input, notFound, onSubmit }: ReplacementSearchProps) {
  const [form, setForm] = useState(input)
  const set = (patch: Partial<ReplacementInput>) => setForm((current) => ({ ...current, ...patch }))

  function chooseModel(modelId: string) {
    const model = getModel(modelId)
    set({ modelId, flow: String(model?.flow ?? ''), head: String(model?.head ?? '') })
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    onSubmit(form)
  }

  const ready =
    form.mode === 'serial'
      ? form.serial.trim() !== ''
      : form.mode === 'type'
        ? form.modelId !== '' && Number(form.flow) > 0 && Number(form.head) > 0
        : form.brand.trim() !== '' && Number(form.flow) > 0 && Number(form.head) > 0

  const duty = (
    <>
      <Field label={copy.flow}>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={form.flow}
          onChange={(e) => set({ flow: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label={copy.head}>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={form.head}
          onChange={(e) => set({ head: e.target.value })}
          className={inputClass}
        />
      </Field>
    </>
  )

  return (
    <form onSubmit={submit} aria-label={copy.title}>
      <div className="max-w-xl">
        <SegmentedToggle<ReplacementMode>
          label={copy.modeLabel}
          value={form.mode}
          options={copy.modes}
          onChange={(mode) => set({ mode })}
        />
      </div>

      <div key={form.mode} className="mt-5 flex animate-fade-in flex-wrap items-end gap-3">
        {form.mode === 'serial' && (
          <div className="min-w-64 flex-1">
            <Field label={copy.serial.label}>
              <input
                type="text"
                value={form.serial}
                onChange={(e) => set({ serial: e.target.value })}
                placeholder={copy.serial.placeholder}
                aria-invalid={notFound !== undefined || undefined}
                className={`${inputClass} uppercase placeholder:normal-case`}
              />
            </Field>
          </div>
        )}

        {form.mode === 'type' && (
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="[&_select]:h-12 [&_select]:text-[17px]">
              <SelectField
                label={copy.type.label}
                value={form.modelId}
                options={typeOptions}
                onChange={chooseModel}
                layout="stacked"
              />
            </div>
            {duty}
          </div>
        )}

        {form.mode === 'other' && (
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <Field label={copy.other.manufacturer}>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => set({ brand: e.target.value })}
                placeholder={copy.other.manufacturerPlaceholder}
                className={inputClass}
              />
            </Field>
            <Field label={copy.other.model}>
              <input
                type="text"
                value={form.brandModel}
                onChange={(e) => set({ brandModel: e.target.value })}
                placeholder={copy.other.modelPlaceholder}
                className={inputClass}
              />
            </Field>
            {duty}
          </div>
        )}

        <button
          type="submit"
          disabled={!ready}
          className="inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-6 text-[15px] font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border-strong disabled:shadow-none"
        >
          <Search className="size-[18px]" strokeWidth={2} />
          {copy.submit}
        </button>
      </div>

      {form.mode === 'serial' &&
        (notFound ? (
          <p
            role="alert"
            className="mt-3 flex animate-fade-in items-center gap-2 text-sm text-danger"
          >
            <CircleAlert className="size-4 shrink-0" />
            {copy.serial.notFound(notFound)}
          </p>
        ) : (
          <p className="mt-3 text-sm text-text-muted">{copy.serial.hint}</p>
        ))}
    </form>
  )
}
