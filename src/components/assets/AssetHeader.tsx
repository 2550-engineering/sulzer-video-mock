import { ArrowRight, Building2, MapPin, Package, Radio, RefreshCw, Wrench } from 'lucide-react'
import { Link } from 'react-router'
import { demoClock } from '../../config/demo'
import { assetPage as copy, connectAssetPath } from '../../data/assetPages'
import { getModel, getProduct, productPath } from '../../lib/catalog'
import { formatDate, groupThousands } from '../../lib/format'
import type { Asset, Customer, NavItem, Site } from '../../types'
import { Breadcrumb } from '../Breadcrumb'
import { CustomerLogo } from '../CustomerLogo'
import { SmartImage } from '../SmartImage'
import { AssetStatusChip } from './AssetStatusChip'

type AssetHeaderProps = {
  asset: Asset
  site: Site
  onRequestService: () => void
  /** Opens the Spare parts tab. */
  onOrderParts: () => void
  /** Defaults to My Pages › My assets; the partner comes through the customer. */
  breadcrumbParents?: NavItem[]
  /** Partner mode: whose asset it is, linking to the customer page. */
  customer?: { customer: Customer; to: string }
}

const outlineOnDark =
  'inline-flex h-12 items-center gap-2 rounded-pill border border-white/35 px-6 font-semibold text-white transition-colors hover:border-white hover:bg-white/10'

/**
 * Asset page header: the site photo behind tag, name, status, product and model
 * (links to the product page) and the actions, with the product image on the
 * right. Below it, a strip of key facts.
 */
export function AssetHeader({
  asset,
  site,
  onRequestService,
  onOrderParts,
  breadcrumbParents = copy.breadcrumbParents,
  customer,
}: AssetHeaderProps) {
  const product = getProduct(asset.productId)
  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const image = product?.images[0]
  const warrantyActive = asset.warrantyUntil >= demoClock.today

  const facts = [
    { label: copy.facts.serial, value: asset.serialNumber },
    { label: copy.facts.installed, value: formatDate(asset.installedOn) },
    {
      label: copy.facts.warranty,
      value: formatDate(asset.warrantyUntil),
      note: warrantyActive ? copy.facts.warrantyActive : copy.facts.warrantyExpired,
      noteTone: warrantyActive
        ? 'bg-success-tint text-success-strong'
        : 'bg-surface-sunken text-text-muted',
    },
    { label: copy.facts.runHours, value: `${groupThousands(asset.runHours)} h` },
    { label: copy.facts.lastService, value: formatDate(asset.lastService) },
    { label: copy.facts.nextService, value: formatDate(asset.nextServiceDue) },
  ]

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-900 on-dark">
        <div className="absolute inset-0 -z-10">
          <SmartImage src={site.image.src} alt={site.image.alt} />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-r from-navy-900/95 via-navy-900/80 to-navy-900/35"
          />
        </div>

        <div className="site-container py-5">
          <Breadcrumb tone="dark" items={[...breadcrumbParents, { label: asset.tag }]} />
        </div>

        <div className="site-container grid items-end gap-x-16 gap-y-10 pt-6 pb-14 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="animate-fade-in">
            {customer && (
              <Link
                to={customer.to}
                className="group mb-5 inline-flex items-center gap-3 rounded-pill bg-white/10 py-1.5 pr-4 pl-1.5 text-sm text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-white">
                  <CustomerLogo
                    customerId={customer.customer.id}
                    variant="mark"
                    className="h-[18px]"
                  />
                </span>
                <span className="text-text-on-dark">
                  <Building2 aria-hidden className="-mt-0.5 mr-1.5 inline size-4" />
                  {copy.customer}
                </span>
                <span className="font-semibold">{customer.customer.name}</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <AssetStatusChip status={asset.status} />
              <span className="inline-flex items-center gap-1.5 text-sm text-text-on-dark">
                <MapPin className="size-4" strokeWidth={1.75} />
                {site.name}, {site.city}
              </span>
            </div>
            <h1 className="mt-4 flex flex-wrap items-baseline gap-x-4 text-white">
              <span className="text-[3.5rem] leading-none font-bold tracking-tight">
                {asset.tag}
              </span>
              <span className="text-[1.75rem] font-medium tracking-tight text-text-on-dark">
                {asset.name.replace(` ${asset.tag}`, '')}
              </span>
            </h1>
            {product && (
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg">
                <Link
                  to={productPath(product)}
                  className="group inline-flex items-center gap-2 font-semibold text-white underline decoration-white/35 underline-offset-[6px] transition-colors hover:decoration-white"
                >
                  {model?.name ?? product.name}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <span className="text-text-on-dark-muted">{product.family}</span>
              </p>
            )}

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onRequestService}
                className="inline-flex h-12 items-center gap-2 rounded-pill bg-white px-7 font-semibold text-navy-900 shadow-raised transition-colors hover:bg-primary-tint"
              >
                <Wrench className="size-[18px]" />
                {copy.actions.requestService}
              </button>
              <button type="button" onClick={onOrderParts} className={outlineOnDark}>
                <Package className="size-[18px]" />
                {copy.actions.orderParts}
              </button>
              <Link to={copy.actions.replacementTo(asset.serialNumber)} className={outlineOnDark}>
                <RefreshCw className="size-[18px]" />
                {copy.actions.findReplacement}
              </Link>
              {asset.connected && (
                <Link to={connectAssetPath(asset.id)} className={outlineOnDark}>
                  <Radio className="size-[18px]" />
                  {copy.actions.openConnect}
                </Link>
              )}
            </div>
          </div>

          {image && (
            <div className="relative hidden aspect-[4/3] animate-fade-in rounded-lg bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] lg:block">
              <div className="absolute inset-6">
                <SmartImage src={image.src} alt={image.alt} fit="contain" />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <dl className="site-container grid grid-cols-2 gap-x-8 gap-y-5 py-6 sm:grid-cols-3 xl:grid-cols-6">
          {facts.map(({ label, value, note, noteTone }) => (
            <div
              key={label}
              className="xl:border-l xl:border-border xl:pl-6 xl:first:border-l-0 xl:first:pl-0"
            >
              <dt className="text-sm text-text-muted">{label}</dt>
              <dd className="mt-1 flex flex-wrap items-center gap-2 text-lg font-semibold text-navy-900 tabular-nums">
                {value}
                {note && (
                  <span className={`rounded-sm px-1.5 py-0.5 text-xs font-semibold ${noteTone}`}>
                    {note}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
