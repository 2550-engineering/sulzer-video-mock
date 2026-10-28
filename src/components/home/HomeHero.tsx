import poster from '../../../_asset-source/video/sulzer-dynamical-corporate-poster.jpg'
import { hero } from '../../data/home'
import { HeroSearch } from './HeroSearch'

// The brand video is gitignored (large media), so it's optional: without it the poster shows.
const videos = import.meta.glob<string>('../../../_asset-source/video/*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
})
const video = Object.values(videos)[0]

/** White hero on the Sulzer fluid brand film, with headline and scoped product search. */
export function HomeHero() {
  return (
    // z-10 keeps the scope dropdown above the next section.
    <section className="relative z-10 overflow-hidden bg-white">
      <img
        src={poster}
        alt=""
        draggable={false}
        className="absolute inset-0 size-full object-cover object-[50%_85%]"
      />
      {video && (
        <video
          src={video}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 size-full object-cover object-[50%_85%] motion-reduce:hidden"
        />
      )}
      {/* White wash at the top keeps the headline clear whatever frame the film is on. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-white from-10% via-white/55 via-40% to-white/0 to-65%"
      />

      <div className="relative site-container flex min-h-[660px] flex-col items-center justify-start pt-24 pb-40 text-center">
        <h1 className="max-w-4xl text-[3.5rem] leading-[1.05] font-bold tracking-tight text-heading">
          {hero.title}
        </h1>
        <p className="mt-5 max-w-2xl text-xl leading-relaxed text-text">{hero.subtitle}</p>
        <div className="mt-10 flex w-full justify-center">
          <HeroSearch />
        </div>
      </div>
    </section>
  )
}
