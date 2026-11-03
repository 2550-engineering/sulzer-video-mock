import { Lightbulb, Search } from 'lucide-react'
import { Link } from 'react-router'
import { assetPage } from '../../data/assetPages'
import { conditionFindings } from '../../data/assets'
import { useUrlParams } from '../../hooks/useUrlParams'
import { getModel, partOwner, partsInVersion, sparePartsFor } from '../../lib/catalog'
import { partsOwnerId } from '../../lib/catalogParts'
import type { Asset } from '../../types'
import { SparePartsBrowser } from '../spareparts/SparePartsBrowser'
import { TabComingSoon } from '../TabComingSoon'
import { TabHeading } from '../TabHeading'

const copy = assetPage.spareParts

/**
 * Spare parts tab: the exploded drawing, parts tree and BOM of this unit's
 * parts list (the shared spare parts browser). The part or kit an active
 * alert calls for is named on top; ?kit= or ?part= selects it, e.g. from
 * "Order bearing kit" in Sulzer Connect.
 */
export function AssetSparePartsTab({ asset }: { asset: Asset }) {
  const [params, update] = useUrlParams()
  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const ownerId = asset.modelId ? partsOwnerId(asset.modelId) : undefined
  const catalogue = ownerId && sparePartsFor(ownerId)
  const owner = ownerId && partOwner(ownerId)

  if (!model || !catalogue || !owner) {
    return (
      <>
        <TabHeading title={copy.title} />
        <div className="mt-8">
          <TabComingSoon copy={copy.empty} />
        </div>
      </>
    )
  }

  const recommendedId = conditionFindings[asset.id]?.partId
  const kit = catalogue.kits.find((k) => k.id === recommendedId)
  const part = partsInVersion(catalogue).find((p) => p.id === recommendedId)
  const recommended = kit ?? part
  const showing = params.get('kit') === recommendedId || params.get('part') === recommendedId

  function showRecommended() {
    update((next) => {
      next.delete('part')
      next.delete('kit')
      next.set(kit ? 'kit' : 'part', recommendedId!)
    })
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
              ({part ? `pos. ${part.position}, ` : ''}
              {recommended.partNumber})
            </span>
          </p>
          {!showing && (
            <button
              type="button"
              onClick={showRecommended}
              className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Search className="size-4" strokeWidth={1.75} />
              {copy.showRecommended}
            </button>
          )}
        </div>
      )}

      <div className="mt-8">
        <SparePartsBrowser key={catalogue.id} catalogue={catalogue} owner={owner} />
      </div>
    </>
  )
}
