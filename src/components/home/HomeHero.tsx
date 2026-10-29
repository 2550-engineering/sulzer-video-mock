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

      <div className="relative site-container flex min-h-[580px] flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-semibold tracking-[0.16em] text-primary-on-dark uppercase">
          {hero.eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl text-[4rem] leading-[1.05] font-bold tracking-tight text-white">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-text-on-dark">{hero.subtitle}</p>
        <div className="mt-11 flex w-full justify-center">
          <HeroSearch />
        </div>
      </div>
    </section>
  )
}
