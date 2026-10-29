import { ArrowRight, Download, RotateCcw, Upload } from 'lucide-react'
import type { ReactNode } from 'react'
import { sizingParametersPage as copy } from '../../data/sizingPages'
import type { BreadcrumbItem } from '../Breadcrumb'
import { Breadcrumb } from '../Breadcrumb'
import { GradientBackdrop } from '../GradientBackdrop'
import { SelectField } from '../SelectField'

export type SizeBy = 'product' | 'application'

type SizeProductPanelProps = {
  breadcrumb: BreadcrumbItem[]
  sizeBy: SizeBy
  onSizeBy: (by: SizeBy) => void
  productId: string
  productOptions: { value: string; label: string }[]
  onProduct: (id: string) => void
  applicationId: string
  applicationOptions: { value: string; label: string }[]
  onApplication: (id: string) => void
  /** Shown under the selects, e.g. "Starting from AHLSTAR 100-80-250" or a warning. */
  note?: ReactNode
  onLoad: () => void
  onSave: () => void
  onReset: () => void
  onStart: () => void
  startDisabled: boolean
}

const pill =
  'inline-flex h-10 items-center gap-2 rounded-pill border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint'

/** Step 1: the dark "Size Product" band with what to size, and the action row under it. */
export function SizeProductPanel({
  breadcrumb,
  sizeBy,
  onSizeBy,
  productId,
  productOptions,
  onProduct,
  applicationId,
  applicationOptions,
  onApplication,
  note,
  onLoad,
  onSave,
  onReset,
  onStart,
  startDisabled,
}: SizeProductPanelProps) {
  return (
    <>
      <section className="relative isolate overflow-hidden on-dark">
        <GradientBackdrop tone="deep" />
        <div className="relative site-container pt-5 pb-10">
          <Breadcrumb tone="dark" items={breadcrumb} />
          <div className="mx-auto mt-8 max-w-4xl text-center">
            <h1 className="text-[2.5rem] leading-tight font-bold tracking-tight text-white">
              {copy.title}
            </h1>
            <p className="mt-2 text-lg text-text-on-dark">{copy.intro}</p>
          </div>
          <div className="mx-auto mt-8 grid max-w-4xl gap-5 text-left sm:grid-cols-2">
            <SelectField
              layout="stacked"
              tone="dark"
              label={copy.sizeBy.label}
              value={sizeBy}
              onChange={onSizeBy}
              options={[
                { value: 'product', label: copy.sizeBy.product },
                { value: 'application', label: copy.sizeBy.application },
              ]}
            />
            {sizeBy === 'product' ? (
              <SelectField
                layout="stacked"
                tone="dark"
                label={copy.productFamily}
                value={productId}
                onChange={onProduct}
                options={productOptions}
              />
            ) : (
              <SelectField
                layout="stacked"
                tone="dark"
                label={copy.application}
                value={applicationId}
                onChange={onApplication}
                options={applicationOptions}
              />
            )}
          </div>
          {note && <div className="mx-auto mt-4 max-w-4xl text-sm">{note}</div>}
        </div>
      </section>

      <div className="border-b border-border bg-white">
        <div className="site-container flex flex-wrap items-center gap-3 py-4">
          <span className="mr-1 text-sm text-text-muted">{copy.actions.label}</span>
          <button type="button" onClick={onLoad} className={pill}>
            <Upload className="size-4" />
            {copy.actions.load}
          </button>
          <button type="button" onClick={onSave} className={pill}>
            <Download className="size-4" />
            {copy.actions.save}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center gap-2 px-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <RotateCcw className="size-4" />
            {copy.actions.reset}
          </button>
          <button
            type="button"
            onClick={onStart}
            disabled={startDisabled}
            className="group ml-auto inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border-strong disabled:shadow-none"
          >
            {copy.actions.start}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </>
  )
}
