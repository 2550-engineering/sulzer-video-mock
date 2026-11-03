import { serviceProviderDemo } from '../../config/demo'
import { sparePartsTab as copy } from '../../data/sparePartsPage'
import { useUrlParams } from '../../hooks/useUrlParams'
import { modelsFor, partOwner, sparePartsFor } from '../../lib/catalog'
import type { Product } from '../../types'
import { SelectField } from '../SelectField'
import { SparePartsBrowser } from './SparePartsBrowser'

/**
 * Spare parts tab of a product whose parts lists belong to its models
 * (AHLSTAR): a Model select (?model=, the demo model by default) above the
 * same tree, drawing, BOM and cart as on configured products.
 */
export function ModelSparePartsTab({ product }: { product: Product }) {
  const [params, update] = useUrlParams()
  const models = modelsFor(product.id).filter((model) => sparePartsFor(model.id))
  const model =
    models.find((m) => m.id === params.get('model')) ??
    models.find((m) => m.id === serviceProviderDemo.ahlstarModelId) ??
    models[0]
  const catalogue = model && sparePartsFor(model.id)
  const owner = model && partOwner(model.id)
  if (!catalogue || !owner) return null

  return (
    <SparePartsBrowser
      // A new model is a new parts list: start its tree, search and view fresh.
      key={catalogue.id}
      catalogue={catalogue}
      owner={owner}
      ownerPicker={
        <SelectField
          layout="stacked"
          label={copy.model}
          value={model.id}
          options={models.map((m) => ({
            value: m.id,
            label: copy.modelOption(m.name, m.frequency),
          }))}
          onChange={(id) =>
            update((next) => {
              next.set('model', id)
              next.delete('part')
              next.delete('kit')
            })
          }
        />
      }
    />
  )
}
