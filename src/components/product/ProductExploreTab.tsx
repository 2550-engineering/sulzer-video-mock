import { productPage as copy } from '../../data/catalogPages'
import { knowledgeFor } from '../../lib/catalog'
import type { ProductExplore } from '../../types'
import { ExploreIntroBand } from '../ExploreIntroBand'
import { StoryCard } from '../StoryCard'
import { FeaturePanel } from './FeaturePanel'
import { PromoBand } from './PromoBand'

/** Product Explore tab: intro band, feature panel and columns, promo, then customer stories. */
export function ProductExploreTab({ explore }: { explore: ProductExplore }) {
  const stories = knowledgeFor(explore.storyIds ?? [])

  return (
    <>
      <ExploreIntroBand intro={explore.intro} />
      <FeaturePanel feature={explore.feature} highlights={explore.highlights} />
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
    </>
  )
}
