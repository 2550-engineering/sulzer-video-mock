import { ArrowRight, Lightbulb } from 'lucide-react'
import { Link } from 'react-router'
import { assetPage } from '../../data/assetPages'
import { conditionFindings } from '../../data/assets'
import { getModel, getProduct, sparePartsFor } from '../../lib/catalog'
import type { Asset } from '../../types'
import { SparePartList } from '../product/SparePartList'
import { TabComingSoon } from '../TabComingSoon'
import { TabHeading } from '../TabHeading'

const copy = assetPage.spareParts

/** Spare parts tab: the parts for this unit's product, with the part an active alert calls for on top. */
export function AssetSparePartsTab({ asset }: { asset: Asset }) {
  const parts = sparePartsFor(asset.productId)
  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const unit = model?.name ?? getProduct(asset.productId)?.name ?? asset.tag
  const recommended = parts.find((part) => part.id === conditionFindings[asset.id]?.partId)

  return (
    <>
      <TabHeading title={copy.title}>
        {parts.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <Link
              to={copy.quoteTo}
              className="inline-flex h-11 items-center rounded-pill border border-primary px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
            >
              {copy.quote}
            </Link>
            <Link
              to={copy.orderTo}
              className="group inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {copy.order}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </TabHeading>
      <p className="mt-3 max-w-2xl text-lg text-text-muted">
        {copy.intro(unit, asset.serialNumber)}
      </p>

      {parts.length === 0 ? (
        <div className="mt-8">
          <TabComingSoon copy={copy.empty} />
        </div>
      ) : (
        <>
          {recommended && (
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-warning/40 bg-warning-tint px-5 py-3.5 text-[15px] text-navy-900">
              <Lightbulb className="size-5 text-warning" strokeWidth={1.75} />
              <span className="font-semibold">{copy.recommended}:</span>
              {recommended.name} (pos. {recommended.position}, {recommended.partNumber})
            </p>
          )}
          <div className="mt-6">
            <SparePartList parts={parts} />
          </div>
        </>
      )}
    </>
  )
}
