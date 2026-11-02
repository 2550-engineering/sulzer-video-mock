import { ArrowRight, Quote } from 'lucide-react'
import { Link } from 'react-router'
import { productPage as copy } from '../../data/catalogPages'
import { knowledgeFor } from '../../lib/catalog'
import type { FeaturedStory } from '../../types'
import { SmartImage } from '../SmartImage'

/** One customer story as a wide card: photo on the left; headline, quote and results on the right. */
export function FeaturedStoryCard({ story }: { story: FeaturedStory }) {
  const [item] = knowledgeFor([story.storyId])
  if (!item) return null

  return (
    <section className="site-container py-20 lg:py-24">
      <div className="max-w-3xl">
        <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">
          {copy.stories.title}
        </h2>
      </div>

      <article className="mt-10 grid overflow-hidden rounded-lg bg-surface-sunken lg:grid-cols-[2fr_3fr]">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
          <SmartImage src={item.image.src} alt={item.image.alt} />
        </div>

        <div className="flex flex-col px-8 py-10 lg:px-14 lg:py-14">
          <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
            {copy.storyLabel}
          </p>
          <h3 className="mt-3 text-[1.75rem] leading-snug font-bold tracking-tight text-brand">
            {item.title}
          </h3>

          <figure className="mt-8 border-l-4 border-primary pl-6">
            <Quote aria-hidden className="size-6 text-primary" strokeWidth={2} />
            <blockquote className="mt-3 text-xl leading-relaxed text-navy-900">
              “{story.quote}”
            </blockquote>
            <figcaption className="mt-4 text-[15px] text-text-muted">
              <span className="font-semibold text-navy-900">{story.author}</span> · {story.role}
            </figcaption>
          </figure>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border-strong pt-8">
            {story.figures.map(({ value, label }) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-[2.5rem] leading-none font-bold tracking-tight text-primary tabular-nums">
                  {value}
                </dd>
                <dd className="mt-2 text-[15px] text-text-muted">{label}</dd>
              </div>
            ))}
          </dl>

          <Link
            to={item.to}
            className="group mt-10 inline-flex items-center gap-2 self-start font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            {copy.storyLink}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    </section>
  )
}
