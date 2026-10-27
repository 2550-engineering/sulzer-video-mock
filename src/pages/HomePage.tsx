import { ApplicationTile } from '../components/home/ApplicationTile'
import { ConnectPromo } from '../components/home/ConnectPromo'
import { FinderCard } from '../components/home/FinderCard'
import { HomeHero } from '../components/home/HomeHero'
import { SectionHeading } from '../components/SectionHeading'
import { SupportCard } from '../components/SupportCard'
import { applicationsSection, finderSection, supportSection } from '../data/home'

export function HomePage() {
  return (
    <>
      <title>Sulzer | Everything you need, whenever you need it</title>

      <HomeHero />

      <section className="bg-surface-muted">
        <div className="site-container py-24">
          <SectionHeading title={finderSection.title} subtitle={finderSection.subtitle} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {finderSection.cards.map((card) => (
              <li key={card.title}>
                <FinderCard card={card} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface">
        <div className="site-container py-24">
          <SectionHeading
            title={applicationsSection.title}
            subtitle={applicationsSection.subtitle}
            action={{ label: applicationsSection.linkLabel, to: applicationsSection.to }}
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applicationsSection.items.map((item) => (
              <li key={item.title}>
                <ApplicationTile item={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ConnectPromo />

      <section className="bg-surface-muted">
        <div className="site-container py-24">
          <SectionHeading title={supportSection.title} subtitle={supportSection.subtitle} />
          <ul className="mt-12 grid gap-6 lg:grid-cols-2">
            {supportSection.cards.map((card) => (
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
