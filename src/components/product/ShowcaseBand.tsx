import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import type { ExploreShowcase } from '../../types'
import { SmartImage } from '../SmartImage'

/** Navy band: eyebrow, headline, text, checkmarks and a button; a large image on the right. */
export function ShowcaseBand({ showcase }: { showcase: ExploreShowcase }) {
  return (
    <section className="overflow-hidden bg-navy-900 text-white on-dark">
      <div className="site-container grid items-center gap-x-16 gap-y-12 py-20 lg:grid-cols-[5fr_7fr] lg:py-24">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-primary-on-dark uppercase">
            {showcase.eyebrow}
          </p>
          <h2 className="mt-4 text-[2.5rem] leading-[1.1] font-bold tracking-tight">
            {showcase.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-on-dark">{showcase.text}</p>
          <ul className="mt-8 space-y-3.5">
            {showcase.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-text-on-dark">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link
            to={showcase.action.to}
            className="group mt-10 inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            {showcase.action.label}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* A soft glow behind the devices lifts them off the navy. */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-[10%] rounded-full bg-primary/35 blur-[90px]"
          />
          <SmartImage
            src={showcase.image.src}
            alt={showcase.image.alt}
            aspect="16 / 10"
            fit="contain"
          />
        </div>
      </div>
    </section>
  )
}
