import { bom as copy } from '../../data/eshop'
import { useUrlParams } from '../../hooks/useUrlParams'
import { modelsWithParts } from '../../lib/spareParts'
import type { Product } from '../../types'
import { TabComingSoon } from '../TabComingSoon'
import { TabHeading } from '../TabHeading'
import { ModelPicker } from './ModelPicker'
import { SparePartsExplorer } from './SparePartsExplorer'

/**
 * Product page Spare parts tab: pick a model (?bom=, or the row open on the Models tab),
 * then its sectional drawing and parts list.
 */
export function ProductSparePartsTab({ product }: { product: Product }) {
  const [params, update] = useUrlParams()
  const models = modelsWithParts(product.id)
  if (models.length === 0) return <TabComingSoon copy={copy.noParts} />

  const model =
    models.find((m) => m.id === params.get('bom')) ??
    models.find((m) => m.id === params.get('model')) ??
    models[0]

  return (
    <>
      <TabHeading title={copy.title}>
        <ModelPicker
          models={models}
          value={model.id}
          onChange={(id) => update((next) => next.set('bom', id))}
        />
      </TabHeading>
      <p className="mt-3 max-w-3xl text-lg text-text-muted">{copy.intro(model.name)}</p>
      <div className="mt-10">
        <SparePartsExplorer key={model.id} model={model} />
      </div>
    </>
  )
}
