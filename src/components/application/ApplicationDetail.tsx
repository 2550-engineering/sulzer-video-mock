import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { applicationPage as copy } from '../../data/catalogPages'
import { useHashTab } from '../../hooks/useHashTab'
import { productGroupsFor, productsForApplication } from '../../lib/catalog'
import type { Application } from '../../types'
import type { BreadcrumbItem } from '../Breadcrumb'
import { ComingSoonPanel } from '../ComingSoonPanel'
import { ProductGroups } from '../product/ProductGroups'
import { TabBar } from '../TabBar'
import { TabCallout } from '../TabCallout'
import { TabComingSoon } from '../TabComingSoon'
import { TabPanel } from '../TabPanel'
import { ApplicationExploreTab } from './ApplicationExploreTab'
import { ApplicationPanelHero } from './ApplicationPanelHero'

type ApplicationDetailProps = {
  application: Application
  breadcrumb: BreadcrumbItem[]
}

/** /applications/:areaSlug/:appSlug: hero and the Explore / Products & solutions / Learn tabs. */
export function ApplicationDetail({ application, breadcrumb }: ApplicationDetailProps) {
  const { active: activeTab, select: selectTab, anchorRef } = useHashTab(copy.tabs)
  const products = productsForApplication(application)
  const groups = productGroupsFor(application)
  const { intro } = application

  return (
    <>
      <ApplicationPanelHero
        image={application.heroImage}
        breadcrumb={breadcrumb}
        title={application.name}
        text={application.summary}
        panelSide="left"
        size="lg"
      >
        <Link
          to={`/sizing?application=${application.slug}`}
          className="group mt-7 inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
        >
          {copy.sizeLabel}
          <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </ApplicationPanelHero>

      <TabBar
        tabs={copy.tabs}
        active={activeTab}
        onSelect={selectTab}
        anchorRef={anchorRef}
        idPrefix="application"
      />

      <TabPanel
        idPrefix="application"
        tabId={activeTab}
        bleed={activeTab === 'explore' && intro !== undefined}
      >
        {activeTab === 'explore' &&
          (intro ? (
            <ApplicationExploreTab application={application} intro={intro} />
          ) : (
            <div className="space-y-20">
              <TabComingSoon copy={copy.exploreEmpty} />
              {products.length > 0 && (
                <TabCallout
                  title={copy.productsCallout.title(application.name)}
                  text={copy.productsCallout.text(products.length)}
                  actionLabel={copy.productsCallout.actionLabel}
                  onAction={() => selectTab('products')}
                />
              )}
            </div>
          ))}

        {activeTab === 'products' &&
          (groups.length > 0 ? (
            <ProductGroups groups={groups} />
          ) : (
            <TabComingSoon copy={copy.productsEmpty} />
          ))}

        {activeTab === 'learn' && (
          <ComingSoonPanel
            eyebrow={copy.learn.eyebrow}
            title={copy.learn.title}
            features={copy.learn.features}
            back={copy.learn.back}
          >
            {copy.learn.text}
          </ComingSoonPanel>
        )}
      </TabPanel>
    </>
  )
}
