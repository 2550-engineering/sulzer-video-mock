import type { ExploreContent } from '../types'
import { IconCardGrid } from './IconCardGrid'

/** "Explore" tab intro: heading and paragraph on the left, icon highlights on the right. */
export function ExploreSection({ content }: { content: ExploreContent }) {
  return (
    <section className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div>
        <h2 className="text-[2.25rem] leading-tight font-bold tracking-tight text-heading">
          {content.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">{content.text}</p>
      </div>
      <IconCardGrid items={content.highlights} />
    </section>
  )
}
