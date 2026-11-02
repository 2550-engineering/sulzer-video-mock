import { ArrowRight, Check, Radio } from 'lucide-react'
import { Link } from 'react-router'
import { assetPage } from '../../data/assetPages'
import { getProduct } from '../../lib/catalog'
import { GradientBackdrop } from '../GradientBackdrop'
import { SmartImage } from '../SmartImage'

const copy = assetPage.upsell

/** Shown instead of readings for an asset that isn't connected: what Sulzer Connect would add. */
export function ConnectUpsell() {
  const image = getProduct('sulzer-connect')?.images[0]
  return (
    <section className="relative isolate grid h-full overflow-hidden rounded-lg on-dark md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <GradientBackdrop tone="deep" className="-z-10" />
      <div className="px-8 py-8">
        <p className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary-on-dark uppercase">
          <Radio className="size-3.5" />
          {copy.badge}
        </p>
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">{copy.title}</h3>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-text-on-dark">{copy.text}</p>
        <ul className="mt-5 space-y-2 text-sm text-white">
          {copy.points.map((point) => (
            <li key={point} className="flex items-center gap-2.5">
              <Check className="size-4 text-primary-on-dark" strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to={copy.actionTo}
            className="group inline-flex h-11 items-center gap-2 rounded-pill bg-white px-6 text-sm font-semibold text-navy-900 transition-colors hover:bg-primary-tint"
          >
            {copy.action}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            to={copy.learnMoreTo}
            className="inline-flex h-11 items-center rounded-pill border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {copy.learnMore}
          </Link>
        </div>
      </div>
      {image && (
        <div className="relative hidden md:block">
          <SmartImage src={image.src} alt={image.alt} />
          {/* Blends the photo into the gradient on its left edge. */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-[#122a4c] to-transparent"
          />
        </div>
      )}
    </section>
  )
}
