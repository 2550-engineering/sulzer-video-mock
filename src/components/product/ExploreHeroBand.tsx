import type { CSSProperties } from 'react'
import type { ExploreHero, ExploreIntro } from '../../types'
import { ConnectReadout } from '../home/ConnectReadout'
import { SmartImage } from '../SmartImage'

// The readouts float in one after the other, once the photo is there.
const enter = 'animate-fade-in [animation-duration:600ms] [animation-fill-mode:backwards]'
const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

/**
 * Opening band of a rich Explore tab: a photo bleeding off the left edge, with
 * live-looking readout cards on it, and the intro headline on the right.
 */
export function ExploreHeroBand({ intro, hero }: { intro: ExploreIntro; hero: ExploreHero }) {
  const [statusReadout, trendReadout] = hero.readouts ?? []

  return (
    <section className="relative overflow-hidden bg-primary-tint">
      {/* Ends at the page centre, which is also the centre of the content column. */}
      <div className="relative aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-1/2 lg:left-0 lg:aspect-auto">
        <SmartImage src={hero.image.src} alt={hero.image.alt} />
        {statusReadout && (
          <ConnectReadout
            readout={statusReadout}
            className={`absolute top-10 right-10 max-md:hidden ${enter}`}
          />
        )}
        {trendReadout && (
          <div className={`absolute bottom-10 left-10 max-md:hidden ${enter}`} style={delay(250)}>
            <ConnectReadout readout={trendReadout} />
          </div>
        )}
      </div>

      <div className="relative site-container">
        <div className="py-14 lg:ml-[50%] lg:flex lg:min-h-[560px] lg:flex-col lg:justify-center lg:py-24 lg:pl-16 xl:pl-20">
          <h2 className="max-w-xl text-[2.75rem] leading-[1.06] font-bold tracking-tight text-brand xl:text-[3.5rem]">
            {intro.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted xl:text-xl">
            {intro.text}
          </p>
        </div>
      </div>
    </section>
  )
}
