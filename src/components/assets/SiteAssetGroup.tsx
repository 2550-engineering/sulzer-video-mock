import { MapPin } from 'lucide-react'
import { assetListPage as copy } from '../../data/assetPages'
import { needsAttention } from '../../lib/assetSummary'
import type { Asset, Site } from '../../types'
import { SmartImage } from '../SmartImage'
import { AssetList } from './AssetList'

type SiteAssetGroupProps = {
  site: Site
  assets: Asset[]
}

/** A site card: its photo, name and counts on the left, its assets on the right. */
export function SiteAssetGroup({ site, assets }: SiteAssetGroupProps) {
  const attention = assets.filter(needsAttention).length
  return (
    <section className="grid overflow-hidden rounded-lg border border-border bg-white max-lg:grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)] 2xl:grid-cols-[19rem_minmax(0,1fr)]">
      <div className="relative isolate flex min-h-52 flex-col justify-end p-5 text-white">
        <div className="absolute inset-0 -z-10">
          <SmartImage src={site.image.src} alt={site.image.alt} />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-navy-900/85 via-navy-900/30 to-transparent"
          />
        </div>
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] text-white/80 uppercase">
          <MapPin className="size-3.5" />
          {site.type}
        </p>
        <h2 className="mt-1.5 text-xl leading-snug font-bold tracking-tight">{site.name}</h2>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-white/85">
          <span>{copy.siteAssets(assets.length)}</span>
          <span aria-hidden className="text-white/40">
            |
          </span>
          <span className={attention ? 'font-semibold text-accent-yellow' : ''}>
            {attention ? copy.siteAttention(attention) : copy.siteAllNormal}
          </span>
        </p>
      </div>
      <AssetList assets={assets} showSite={false} showHeader={false} />
    </section>
  )
}
