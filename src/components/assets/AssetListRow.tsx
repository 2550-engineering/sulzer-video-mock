import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { demoClock } from '../../config/demo'
import { assetListPage as copy } from '../../data/assetPages'
import { siteById } from '../../data/assets'
import { isServiceDue } from '../../lib/assetSummary'
import { getModel, getProduct, productPath } from '../../lib/catalog'
import { daysBetween, formatDate } from '../../lib/format'
import type { Asset } from '../../types'
import { SmartImage } from '../SmartImage'
import { AssetReadingCell } from './AssetReadingCell'
import { AssetStatusDot } from './AssetStatusDot'

type AssetListRowProps = {
  asset: Asset
  /** Grid template shared with the header row. */
  columns: string
  showSite: boolean
}

/**
 * One asset: status, tag and name (opens the asset), product and model (opens the
 * product page), site with its photo, last reading and next service.
 */
export function AssetListRow({ asset, columns, showSite }: AssetListRowProps) {
  const product = getProduct(asset.productId)
  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const site = siteById(asset.siteId)
  const daysLeft = daysBetween(demoClock.today, asset.nextServiceDue)
  const due = isServiceDue(asset)

  return (
    <li
      className={`group relative grid items-center gap-x-6 px-6 py-4 transition-colors duration-150 hover:bg-surface-subtle ${columns} ${
        asset.status === 'ok' ? '' : 'bg-warning-tint/40'
      }`}
    >
      <AssetStatusDot status={asset.status} />

      <div className="min-w-0">
        <Link
          to={`/assets/${asset.id}`}
          className="font-bold text-navy-900 transition-colors group-hover:text-primary after:absolute after:inset-0"
        >
          {asset.tag}
        </Link>
        <p className="mt-0.5 truncate text-sm text-text-muted">
          {asset.name.replace(` ${asset.tag}`, '')}
        </p>
      </div>

      <div className="relative z-10 min-w-0 justify-self-start">
        {product && (
          <Link
            to={productPath(product)}
            className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-hover hover:decoration-primary"
          >
            {model?.name ?? product.name}
          </Link>
        )}
        <p className="mt-0.5 truncate text-sm text-text-muted tabular-nums">{asset.serialNumber}</p>
      </div>

      {showSite && site && (
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative h-9 w-14 shrink-0 overflow-hidden rounded-sm">
            <SmartImage src={site.image.src} alt="" />
          </span>
          <span className="min-w-0 text-sm">
            <span className="block truncate font-medium text-navy-900">{site.name}</span>
            <span className="block truncate text-text-muted">{site.type}</span>
          </span>
        </div>
      )}

      <AssetReadingCell asset={asset} />

      <div className="text-sm tabular-nums">
        <p className="font-medium text-navy-900">{formatDate(asset.nextServiceDue)}</p>
        <p className={`mt-0.5 text-xs ${due ? 'font-semibold text-primary' : 'text-text-muted'}`}>
          {copy.inDays(daysLeft)}
        </p>
      </div>

      <ChevronRight className="size-4 text-text-subtle transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
    </li>
  )
}
