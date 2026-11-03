import { ApplicationPanelHero } from '../components/application/ApplicationPanelHero'
import { CtaBand } from '../components/CtaBand'
import { DigitalProductCard } from '../components/digital/DigitalProductCard'
import { ConnectPromo } from '../components/home/ConnectPromo'
import { ToolCard } from '../components/mysulzer/ToolCard'
import { SectionHeading } from '../components/SectionHeading'
import { digitalSolutionsPage as copy } from '../data/digitalSolutions'
import { getProduct } from '../lib/catalog'
import type { PlaceholderTone } from '../types'

const toolTones: PlaceholderTone[] = ['ocean', 'deep', 'slate', 'steel']

/**
 * /digital-solutions: hero photo, the Sulzer Connect promo, a card per digital
 * product, the free mySulzer tools and a "Talk to an expert" band.
 */
export function DigitalSolutionsPage() {
  const portfolio = copy.portfolio.productIds.map(getProduct).filter((p) => p !== undefined)

  return (
    <>
      <title>{`${copy.title} | Sulzer`}</title>

      <ApplicationPanelHero
        image={copy.hero}
        breadcrumb={[...copy.breadcrumb, { label: copy.title }]}
        title={copy.title}
        text={copy.text}
        panelSide="left"
        size="lg"
      />

      <ConnectPromo />

      <section className="site-container py-20 lg:py-24">
        <SectionHeading title={copy.portfolio.title} subtitle={copy.portfolio.text} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {portfolio.map((product) => (
            <li key={product.id}>
              <DigitalProductCard product={product} linkLabel={copy.portfolio.explore} />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface-muted">
        <div className="site-container py-20 lg:py-24">
          <SectionHeading title={copy.tools.title} subtitle={copy.tools.text} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {copy.tools.cards.map((card, i) => (
              <li key={card.title}>
                <ToolCard card={card} tone={toolTones[i % toolTones.length]} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand cta={copy.cta} />
    </>
  )
}
