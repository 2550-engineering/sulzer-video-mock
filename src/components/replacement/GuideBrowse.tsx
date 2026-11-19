import { replacementGuidePage } from '../../data/replacementGuidePage'
import type { GuideBrand } from '../../lib/replacementGuide'
import { SelectField } from '../SelectField'

const copy = replacementGuidePage.search

type GuideBrowseProps = {
  brands: GuideBrand[]
  /** '' until a brand is chosen. */
  brand: string
  /** The model, or the article id for a Sulzer product; '' until one is chosen. */
  model: string
  models: { value: string; label: string }[]
  /** Name of the recommended Sulzer replacement, once a pump is chosen. */
  recommended?: string
  onBrand: (brand: string) => void
  onModel: (model: string) => void
}

/** "Or browse by brand": brand and model of the installed pump, and what replaces it. */
export function GuideBrowse({
  brands,
  brand,
  model,
  models,
  recommended,
  onBrand,
  onModel,
}: GuideBrowseProps) {
  return (
    <div>
      <div className="my-6 flex items-center gap-4">
        <span aria-hidden className="h-px flex-1 bg-border" />
        <span className="text-xs tracking-[0.08em] text-text-subtle uppercase">
          {copy.browseDivider}
        </span>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </div>
      <div className="grid items-end gap-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <SelectField
          layout="stacked"
          label={copy.brand}
          value={brand}
          placeholder={copy.brandPlaceholder}
          options={brands.map((b) => ({ value: b.name, label: b.name }))}
          onChange={onBrand}
        />
        <SelectField
          layout="stacked"
          label={copy.model}
          value={model}
          placeholder={copy.modelPlaceholder}
          disabled={!brand}
          options={models}
          onChange={onModel}
        />
        <p className="flex min-h-10 flex-wrap items-center gap-x-3 gap-y-0.5 rounded-md bg-primary-tint px-4 py-2 md:col-span-2 xl:col-span-1 xl:min-w-64">
          <span className="text-[13px] text-text-muted">{copy.recommended}</span>
          {recommended ? (
            <span key={recommended} className="animate-fade-in text-[15px] font-bold text-primary">
              {recommended}
            </span>
          ) : (
            <span className="text-[15px] font-semibold text-text-subtle">
              {copy.recommendedNone}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
