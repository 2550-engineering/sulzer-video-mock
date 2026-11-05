import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { dashboardPage, needAttention } from '../../data/connect'
import { sites } from '../../data/assets'
import { needsAttention } from '../../lib/assetSummary'
import { statusOrder } from '../../lib/assetList'
import type { Asset } from '../../types'
import { ConnectStatusDot } from './ConnectStatusDot'

/** Each site with its worst status and its connected assets. Links to the site in the asset list. */
export function SiteStatusList({ assets }: { assets: Asset[] }) {
  const rows = sites
    .map((site) => {
      const own = assets.filter((asset) => asset.siteId === site.id)
      const worst =
        statusOrder.find((status) => own.some((asset) => asset.status === status)) ?? 'ok'
      return { site, own, worst, attention: own.filter(needsAttention).length }
    })
    .filter((row) => row.own.length > 0)

  return (
    <ul className="divide-y divide-white/[0.07]">
      {rows.map(({ site, own, worst, attention }) => (
        <li key={site.id}>
          <Link
            to={`/connect/assets#${site.id}`}
            className="group flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-white/[0.03] max-md:gap-3 max-md:px-4"
          >
            <ConnectStatusDot status={worst} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-white">{site.name}</span>
              <span className="block truncate text-[13px] text-text-on-dark-muted">
                {site.type}
              </span>
            </span>
            <span className="text-right text-[13px] tabular-nums max-md:shrink-0">
              <span className="block text-text-on-dark">
                {dashboardPage.sites.assets(own.length)}
              </span>
              {attention > 0 && (
                <span className="block font-semibold text-warning-on-dark">
                  {needAttention(attention)}
                </span>
              )}
            </span>
            <ChevronRight className="size-4 text-text-on-dark-muted transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
