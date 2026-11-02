import { Lightbulb, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { useAddToCart } from '../../cart/useAddToCart'
import { assetPage } from '../../data/assetPages'
import { conditionFindings } from '../../data/assets'
import { getModel } from '../../lib/catalog'
import { partPrice } from '../../lib/pricing'
import { bomFor, getPart } from '../../lib/spareParts'
import type { Asset } from '../../types'
import { PartPrice } from '../spareparts/PartPrice'
import { SparePartsExplorer } from '../spareparts/SparePartsExplorer'
import { TabComingSoon } from '../TabComingSoon'
import { TabHeading } from '../TabHeading'

const copy = assetPage.spareParts

/**
 * Spare parts tab: the sectional drawing and parts list for this unit's model. The part
 * an active alert calls for is on top and selected on the drawing.
 */
export function AssetSparePartsTab({ asset }: { asset: Asset }) {
  const { user } = useAuth()
  const addToCart = useAddToCart()
  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const partId = conditionFindings[asset.id]?.partId
  const recommended = model && partId ? getPart(partId) : undefined
  const price = recommended && partPrice(recommended, user)

  if (!model || bomFor(model.id).length === 0) {
    return (
      <>
        <TabHeading title={copy.title} />
        <div className="mt-8">
          <TabComingSoon copy={copy.empty} />
        </div>
      </>
    )
  }

  return (
    <>
      <TabHeading title={copy.title}>
        <Link
          to={copy.quoteTo}
          className="inline-flex h-11 items-center rounded-pill border border-primary px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
        >
          {copy.quote}
        </Link>
      </TabHeading>
      <p className="mt-3 max-w-3xl text-lg text-text-muted">
        {copy.intro(model.name, asset.serialNumber)}
      </p>

      {recommended && (
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border border-warning/40 bg-warning-tint px-5 py-3.5 text-[15px] text-navy-900">
          <Lightbulb className="size-5 shrink-0 text-warning" strokeWidth={1.75} />
          <p className="min-w-0 flex-1">
            <span className="font-semibold">{copy.recommended}:</span> {recommended.name}{' '}
            <span className="text-text-muted tabular-nums">
              (pos. {recommended.position}, {recommended.partNumber})
            </span>
          </p>
          {price && (
            <div className="flex items-center gap-4">
              <PartPrice price={price} />
              <button
                type="button"
                onClick={() => addToCart(recommended, 1, asset.id)}
                className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <ShoppingCart className="size-4" strokeWidth={1.75} />
                {copy.addRecommended}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <SparePartsExplorer
          key={model.id}
          model={model}
          asset={asset}
          initialPosition={recommended?.position}
        />
      </div>
    </>
  )
}
