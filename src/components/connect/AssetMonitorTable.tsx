import { sites } from '../../data/assets'
import { assetsPage as copy } from '../../data/connect'
import { needsAttention } from '../../lib/assetSummary'
import type { Asset } from '../../types'
import { AssetMonitorRow } from './AssetMonitorRow'

const assetMonitorColumns =
  'grid-cols-[1.25rem_minmax(11rem,1.3fr)_minmax(9rem,1fr)_minmax(9rem,1fr)_8.5rem_6.5rem_1rem]'

type AssetMonitorTableProps = {
  assets: Asset[]
  /** Group rows under a heading per site; otherwise show the site in each row. */
  groupBySite?: boolean
}

/** Connected assets as a dark table, by site. Each site heading is an anchor (#site-id). */
export function AssetMonitorTable({ assets, groupBySite = true }: AssetMonitorTableProps) {
  const groups = groupBySite
    ? sites
        .map((site) => ({ site, assets: assets.filter((asset) => asset.siteId === site.id) }))
        .filter((group) => group.assets.length > 0)
    : [{ site: null, assets }]

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[60rem] max-md:min-w-0">
        <div
          className={`grid gap-x-5 border-y border-white/10 bg-white/[0.04] px-6 py-3 text-[13px] font-semibold text-text-on-dark ${assetMonitorColumns} max-md:hidden`}
        >
          <span />
          <span>{copy.columns.name}</span>
          <span>{copy.columns.model}</span>
          <span>{copy.columns.reading}</span>
          <span>{copy.columns.health}</span>
          <span>{copy.columns.run}</span>
          <span />
        </div>
        {groups.map(({ site, assets: own }) => (
          <section key={site?.id ?? 'all'} id={site?.id} className="scroll-mt-24">
            {site && (
              <h3 className="flex items-baseline gap-3 border-b border-white/[0.07] bg-navy-900/80 px-6 pt-4 pb-2.5 max-md:flex-wrap max-md:gap-x-3 max-md:gap-y-0.5 max-md:border-t max-md:px-4">
                <span className="text-sm font-semibold text-white">{site.name}</span>
                <span className="text-xs text-text-on-dark-muted">
                  {site.type} · {copy.siteSummary(own.length, own.filter(needsAttention).length)}
                </span>
              </h3>
            )}
            <ul className="divide-y divide-white/[0.06]">
              {own.map((asset) => (
                <AssetMonitorRow
                  key={asset.id}
                  asset={asset}
                  showSite={!groupBySite}
                  columns={assetMonitorColumns}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
