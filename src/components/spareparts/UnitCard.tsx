import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { assetLocation } from '../../data/assets'
import { sparePartsPage } from '../../data/eshop'
import { formatDate } from '../../lib/format'
import type { Asset, Product, ProductModel } from '../../types'
import { SmartImage } from '../SmartImage'

const copy = sparePartsPage.serial.unit

/** The installed unit a serial number belongs to, with a link to its asset page. */
export function UnitCard({
  asset,
  product,
  model,
  canOpen,
}: {
  asset: Asset
  product: Product
  model?: ProductModel
  /** Only the unit's owner (or their partner) can open the asset page. */
  canOpen: boolean
}) {
  const facts: [string, string][] = [
    [copy.serial, asset.serialNumber],
    [copy.site, assetLocation(asset)],
    [copy.installed, formatDate(asset.installedOn)],
  ]
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-lg border border-border bg-white px-6 py-5 shadow-card">
      <span className="relative size-24 shrink-0 overflow-hidden rounded-md bg-surface-muted">
        <SmartImage src={product.images[0].src} alt="" fit="contain" />
      </span>
      <div className="min-w-56">
        <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">{copy.eyebrow}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-navy-900">
          {asset.tag}{' '}
          <span className="font-medium text-text-muted">{model?.name ?? product.name}</span>
        </p>
        <p className="text-text-muted">{asset.name}</p>
      </div>
      <dl className="flex flex-1 flex-wrap gap-x-10 gap-y-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-text-muted">{label}</dt>
            <dd className="font-semibold text-navy-900 tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      {canOpen && (
        <Link
          to={`/assets/${asset.id}`}
          className="group inline-flex h-11 items-center gap-2 rounded-pill border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
        >
          {copy.open}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
