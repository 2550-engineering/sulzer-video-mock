import type { KnowledgeItem } from '../types'
import { KnowledgeCard } from './KnowledgeCard'

type KnowledgeGridProps = {
  title: string
  text: string
  items: KnowledgeItem[]
}

/** Section heading and lead, then a 3-column grid of knowledge cards. */
export function KnowledgeGrid({ title, text, items }: KnowledgeGridProps) {
  return (
    <section className="site-container py-16 lg:py-20">
      <div className="max-w-3xl">
        <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">{title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">{text}</p>
      </div>
      <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <KnowledgeCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}
