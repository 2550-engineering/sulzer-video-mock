import { CalendarClock } from 'lucide-react'
import { Link } from 'react-router'
import { demoClock } from '../../config/demo'
import { assetListPage, assetPage } from '../../data/assetPages'
import { customers } from '../../data/assets'
import { isServiceDue } from '../../lib/assetSummary'
import { readingTime } from '../../lib/assetList'
import { getModel, getProduct, productPath } from '../../lib/catalog'
import { conditionChannels, conditionSeries } from '../../lib/conditionData'
import { daysBetween, formatDate } from '../../lib/format'
import type { Asset, Site } from '../../types'
import { ConnectUpsell } from './ConnectUpsell'
import { ReadingCard } from './ReadingCard'

const copy = assetPage.overview

type AssetOverviewTabProps = {
  asset: Asset
  site: Site
  onRequestService: () => void
}

/** Overview tab: key facts, latest readings (or the Connect upsell) and the next service. */
export function AssetOverviewTab({ asset, site, onRequestService }: AssetOverviewTabProps) {
  const product = getProduct(asset.productId)
  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const owner = customers.find((customer) => customer.id === asset.customerId)
  const series = conditionSeries(asset.id)
  const latest = series?.findLast((point) => point.running) ?? series?.at(-1)
  const due = isServiceDue(asset)

  const facts = [
    {
      label: copy.product,
      value: product && (
        <Link
          to={productPath(product)}
          className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        >
          {product.name}
        </Link>
      ),
    },
    { label: copy.model, value: model?.name },
    { label: copy.productNumber, value: model?.productNumber },
    { label: copy.rated, value: model && copy.ratedValue(model.flow, model.head) },
    { label: copy.power, value: model && `${model.power} kW · ${model.speed} rpm` },
    { label: assetPage.facts.serial, value: asset.serialNumber },
    { label: copy.site, value: site.name },
    { label: copy.customer, value: owner?.name },
  ].filter((fact) => fact.value)

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <section className="rounded-lg border border-border bg-white">
        <h2 className="border-b border-border px-6 py-4 text-lg font-bold tracking-tight text-navy-900">
          {copy.facts}
        </h2>
        <dl className="divide-y divide-border px-6">
          {facts.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-6 py-3 text-[15px]">
              <dt className="text-text-muted">{label}</dt>
              <dd className="text-right font-medium text-navy-900 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="space-y-8">
        {series && latest ? (
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-lg font-bold tracking-tight text-navy-900">{copy.readings}</h2>
              <p className="flex items-center gap-2 text-sm text-text-muted">
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-success ring-4 ring-success-tint"
                />
                {copy.readingsNote(readingTime(latest.time))}
              </p>
            </div>
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {conditionChannels.map((channel) => (
                <li key={channel}>
                  <ReadingCard
                    channel={channel}
                    latest={latest}
                    trend={series.slice(-copy.trendHours)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <ConnectUpsell />
        )}

        <section className="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-lg border border-border bg-white px-6 py-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
            <CalendarClock className="size-6" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-text-muted">{copy.nextService}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-3 text-xl font-bold tracking-tight text-navy-900 tabular-nums">
              {formatDate(asset.nextServiceDue)}
              <span
                className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
                  due ? 'bg-primary text-white' : 'bg-surface-sunken text-navy-700'
                }`}
              >
                {assetListPage.inDays(daysBetween(demoClock.today, asset.nextServiceDue))}
              </span>
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {copy.serviceType} · {copy.serviceBy} ·{' '}
              {copy.lastService(formatDate(asset.lastService))}
            </p>
          </div>
          <button
            type="button"
            onClick={onRequestService}
            className={`inline-flex h-11 items-center rounded-pill px-6 text-sm font-semibold transition-colors ${
              due
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'border border-primary text-primary hover:bg-primary-tint'
            }`}
          >
            {due ? copy.book : copy.reschedule}
          </button>
        </section>
      </div>
    </div>
  )
}
