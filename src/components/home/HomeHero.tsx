import { hero } from '../../data/home'
import { SmartImage } from '../SmartImage'
import { HeroSearch } from './HeroSearch'

/** Full-width image hero with headline and scoped product search. */
export function HomeHero() {
  return (
    // z-10 keeps the scope dropdown above the next section.
    <section className="relative z-10 bg-navy-900 on-dark">
      <SmartImage src={hero.image.src} alt={hero.image.alt} />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-navy-900/45 via-navy-900/60 to-navy-900/85"
      />

      <div className="relative site-container flex min-h-[580px] flex-col items-center justify-center py-24 text-center max-xl:min-h-[520px] max-xl:py-20 max-md:min-h-0 max-md:py-14">
        <p className="text-sm font-semibold tracking-[0.16em] text-primary-on-dark uppercase max-md:text-xs">
          {hero.eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl text-[4rem] leading-[1.05] font-bold tracking-tight text-balance text-white max-xl:text-[2.75rem] max-xl:leading-[1.1] max-md:mt-4 max-md:text-[2rem] max-md:leading-[1.15]">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-text-on-dark max-xl:text-lg max-md:mt-4 max-md:text-base">
          {hero.subtitle}
        </p>
        <div className="mt-11 flex w-full justify-center max-md:mt-8">
          <HeroSearch />
        </div>
      </div>
    </section>
  )
}
