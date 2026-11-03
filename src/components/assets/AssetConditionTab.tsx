import { ArrowRight, CircleCheck, Power, Timer } from 'lucide-react'
import { Link } from 'react-router'
import { products } from '../../config/demo'
import { assetPage, connectAssetPath } from '../../data/assetPages'
import { conditionChannels, conditionSeries } from '../../lib/conditionData'
import type { Asset } from '../../types'
import { GradientBackdrop } from '../GradientBackdrop'
import { TabHeading } from '../TabHeading'
import { ConditionChannelCard } from './ConditionChannelCard'
import { ConnectUpsell } from './ConnectUpsell'

const copy = assetPage.condition

/** Condition tab: 30-day summary per channel, run time, and a way into Sulzer Connect. */
export function AssetConditionTab({ asset }: { asset: Asset }) {
  const series = conditionSeries(asset.id)
  if (!series) {
    return (
      <>
        <TabHeading title={copy.title} />
        <div className="mt-8">
          <ConnectUpsell />
        </div>
      </>
    )
  }

  const runHours = series.filter((point) => point.running).length
  const starts = series.filter((point, i) => point.running && !series[i - 1]?.running).length

  return (
    <>
      <TabHeading title={copy.title}>
        {asset.status === 'ok' && (
          <p className="flex items-center gap-2 text-sm font-semibold text-success-strong">
            <CircleCheck className="size-4" />
            {copy.healthy}
          </p>
        )}
      </TabHeading>
      <p className="mt-3 text-lg text-text-muted">{copy.intro(products.connect)}</p>

      <div className="mt-8 space-y-4">
        {conditionChannels.map((channel) => (
          <ConditionChannelCard key={channel} channel={channel} series={series} />
        ))}
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          {
            label: copy.runTime,
            value: copy.runTimeValue(runHours, Math.round((runHours / series.length) * 100)),
            icon: Timer,
          },
          { label: copy.starts, value: String(starts), icon: Power },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-lg border border-border bg-white px-6 py-4"
          >
            <Icon className="size-5 text-primary" strokeWidth={1.75} />
            <dt className="text-sm text-text-muted">{label}</dt>
            <dd className="ml-auto text-lg font-semibold text-navy-900 tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="relative isolate mt-10 overflow-hidden rounded-lg px-10 py-9 on-dark">
        <GradientBackdrop tone="deep" className="-z-10" />
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          <div className="max-w-2xl">
            <h3 className="text-[1.75rem] leading-tight font-bold tracking-tight text-white">
              {copy.band.title}
            </h3>
            <p className="mt-2 text-lg text-text-on-dark">{copy.band.text}</p>
          </div>
          <Link
            to={connectAssetPath(asset.id)}
            className="group inline-flex h-12 items-center gap-2 rounded-pill bg-white px-7 font-semibold text-navy-900 transition-colors hover:bg-primary-tint"
          >
            {copy.band.action}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}
