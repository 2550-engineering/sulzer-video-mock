import { bom as copy } from '../../data/eshop'
import type { ProductModel } from '../../types'
import { SelectField } from '../SelectField'

/** "AHLSTAR 150-125-315 · 50 Hz" select for the models that have a parts list. */
export function ModelPicker({
  models,
  value,
  onChange,
  label = copy.model,
}: {
  models: ProductModel[]
  value: string
  onChange: (modelId: string) => void
  label?: string
}) {
  return (
    <div className="w-full max-w-sm min-w-72">
      <SelectField
        label={label}
        value={value}
        options={models.map((model) => ({
          value: model.id,
          label: `${model.name} · ${model.frequency} Hz`,
        }))}
        onChange={onChange}
        layout="stacked"
      />
    </div>
  )
}
