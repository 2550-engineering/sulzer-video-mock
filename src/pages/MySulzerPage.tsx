import { Breadcrumb } from '../components/Breadcrumb'
import { IconListCard } from '../components/IconListCard'
import { AccountBand } from '../components/mysulzer/AccountBand'
import { MySulzerIntro } from '../components/mysulzer/MySulzerIntro'
import { ToolCard } from '../components/mysulzer/ToolCard'
import { SectionHeading } from '../components/SectionHeading'
import { SupportCard } from '../components/SupportCard'
import { exploreSection, questionsSection, tailoredSection } from '../data/mySulzer'
import type { PlaceholderTone } from '../types'

const toolTones: PlaceholderTone[] = ['ocean', 'deep', 'slate']

/** Public landing page for the mySulzer self-service portal. */
export function MySulzerPage() {
  return (
    <>
      <title>mySulzer – your 24/7 self-service | Sulzer</title>

      <div className="site-container py-5">
        <Breadcrumb items={[{ label: 'mySulzer' }]} />
      </div>

      <section className="site-container pt-6 pb-24">
        <MySulzerIntro />
      </section>

      <section className="bg-surface-muted">
        <div className="site-container py-24">
          <SectionHeading title={tailoredSection.title} subtitle={tailoredSection.subtitle} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <IconListCard
              title={tailoredSection.personal.title}
              items={tailoredSection.personal.items}
            />
            <IconListCard title={tailoredSection.tools.title} items={tailoredSection.tools.items} />
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="site-container py-24">
          <SectionHeading title={exploreSection.title} subtitle={exploreSection.subtitle} />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {exploreSection.cards.map((card, i) => (
              <li key={card.title}>
                <ToolCard card={card} tone={toolTones[i % toolTones.length]} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AccountBand />

      <section className="bg-surface-muted">
        <div className="site-container py-24">
          <SectionHeading title={questionsSection.title} subtitle={questionsSection.subtitle} />
          <ul className="mt-12 grid gap-6 lg:grid-cols-2">
            {questionsSection.cards.map((card) => (
              <li key={card.title} className="flex *:flex-1">
                <SupportCard card={card} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
