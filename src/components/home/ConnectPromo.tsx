import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import { connectPromo } from '../../data/home'
import { ImageSlot } from '../ImageSlot'
import { ConnectReadout } from './ConnectReadout'

/** Navy promo band for Sulzer Connect (remote condition monitoring). */
export function ConnectPromo() {
  const [statusReadout, trendReadout] = connectPromo.readouts

  return (
    <section className="bg-navy-900 text-white">
      <div className="site-container grid items-center gap-16 py-28 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-primary-on-dark uppercase">
            {connectPromo.eyebrow}
          </p>
          <h2 className="mt-4 max-w-xl text-[2.75rem] leading-[1.1] font-bold tracking-tight">
            {connectPromo.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-on-dark">
            {connectPromo.text}
          </p>
          <ul className="mt-8 space-y-3.5">
            {connectPromo.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-text-on-dark">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <Link
            to={connectPromo.cta.to}
            className="group mt-10 inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            {connectPromo.cta.label}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative aspect-[4/3]">
          <div className="absolute inset-0 overflow-hidden rounded-lg ring-1 ring-white/10">
            <ImageSlot image={connectPromo.image} />
          </div>
          <ConnectReadout readout={statusReadout} className="absolute top-10 -left-8" />
          <ConnectReadout readout={trendReadout} className="absolute right-10 -bottom-10" />
        </div>
      </div>
    </section>
  )
}
