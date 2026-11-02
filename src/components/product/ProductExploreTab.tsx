import { productPage as copy } from '../../data/catalogPages'
import { knowledgeFor } from '../../lib/catalog'
import type { ProductExplore } from '../../types'
import { CtaBand } from '../CtaBand'
import { ExploreIntroBand } from '../ExploreIntroBand'
import { StoryCard } from '../StoryCard'
import { BenefitTiles } from './BenefitTiles'
import { ExploreHeroBand } from './ExploreHeroBand'
import { FeaturedStoryCard } from './FeaturedStoryCard'
import { FeaturePanel } from './FeaturePanel'
import { HowItWorks } from './HowItWorks'
import { PromoBand } from './PromoBand'
import { ShowcaseBand } from './ShowcaseBand'

/**
 * Product Explore tab. Shows the sections the product has, in order: hero photo
 * band (or the grey intro band), how it works, feature panel and columns,
 * benefits, showcase, promo, customer stories and a closing CTA band.
 */
export function ProductExploreTab({ explore }: { explore: ProductExplore }) {
  const stories = knowledgeFor(explore.storyIds ?? [])
  const highlights = explore.highlights ?? []

  return (
    <>
      {explore.hero ? (
        <ExploreHeroBand intro={explore.intro} hero={explore.hero} />
      ) : (
        <ExploreIntroBand intro={explore.intro} />
      )}
      {explore.howItWorks && <HowItWorks {...explore.howItWorks} />}
      {(explore.feature || highlights.length > 0) && (
        <FeaturePanel feature={explore.feature} highlights={highlights} />
      )}
      {explore.benefits && <BenefitTiles {...explore.benefits} />}
      {explore.showcase && <ShowcaseBand showcase={explore.showcase} />}
      {explore.promo && <PromoBand promo={explore.promo} />}
      {stories.length > 0 && (
        <section className="site-container py-16 lg:py-20">
          <div className="max-w-3xl">
            <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">
              {copy.stories.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-text-muted">{copy.stories.text}</p>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <li key={story.id}>
                <StoryCard story={story} label={copy.stories.label} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {explore.story && <FeaturedStoryCard story={explore.story} />}
      {explore.cta && <CtaBand cta={explore.cta} />}
    </>
  )
}
