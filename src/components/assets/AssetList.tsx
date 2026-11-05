import { assetListPage } from '../../data/assetPages'
import type { Asset } from '../../types'
import { AssetListRow } from './AssetListRow'

const copy = assetListPage.columns

const withSite =
  'grid-cols-[0.625rem_minmax(8rem,0.8fr)_minmax(10rem,1fr)_minmax(15rem,1.6fr)_10.5rem_7.5rem_1rem]'
const withoutSite = 'grid-cols-[0.625rem_minmax(9rem,1fr)_minmax(10rem,1.1fr)_10.5rem_8rem_1rem]'

type AssetListProps = {
  assets: Asset[]
  /** Leave out the site column, e.g. inside a site group. */
  showSite?: boolean
  showHeader?: boolean
}

/** Assets as table-like rows, each opening its asset page. */
export function AssetList({ assets, showSite = true, showHeader = true }: AssetListProps) {
  const columns = showSite ? withSite : withoutSite
  return (
    <div className="overflow-x-auto">
      <div className={`${showSite ? 'min-w-[56rem]' : 'min-w-[46rem]'} max-md:min-w-0`}>
        {showHeader && (
          <div
            aria-hidden
            className={`grid gap-x-6 border-b border-border bg-surface-sunken px-6 py-3 text-sm font-semibold text-navy-900 max-md:hidden ${columns}`}
          >
            <span />
            <span>{copy.asset}</span>
            <span>{copy.product}</span>
            {showSite && <span>{copy.site}</span>}
            <span>{copy.reading}</span>
            <span>{copy.service}</span>
            <span />
          </div>
        )}
        <ul className="divide-y divide-border">
          {assets.map((asset) => (
            <AssetListRow key={asset.id} asset={asset} columns={columns} showSite={showSite} />
          ))}
        </ul>
      </div>
    </div>
  )
}
