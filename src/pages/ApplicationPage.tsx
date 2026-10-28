import { useParams } from 'react-router'
import { ApplicationHero } from '../components/application/ApplicationHero'
import { ExploreSection } from '../components/ExploreSection'
import { ApplicationTile } from '../components/home/ApplicationTile'
import { ProductGroups } from '../components/product/ProductGroups'
import { TabBar } from '../components/TabBar'
import { TabCallout } from '../components/TabCallout'
import { TabComingSoon } from '../components/TabComingSoon'
import { TabHeading } from '../components/TabHeading'
import { TabPanel } from '../components/TabPanel'
import { rootApplicationId } from '../data/applications'
import { applicationPage as copy } from '../data/catalogPages'
import { useHashTab } from '../hooks/useHashTab'
import {
  applicationPath,
  applicationTeaser,
  applicationTrail,
  childApplications,
  getApplication,
  productsForApplication,
} from '../lib/catalog'
import { NotFoundPage } from './NotFoundPage'

/** Application finder page: /applications (overview) and /applications/:slug. */
export function ApplicationPage() {
  const { slug } = useParams()
  const { active: activeTab, select: selectTab, anchorRef } = useHashTab(copy.tabs)
  // The overview lives at /applications only, not /applications/applications.
  const application =
    slug === rootApplicationId ? undefined : getApplication(slug ?? rootApplicationId)
  if (!application) return <NotFoundPage />

  const isRoot = application.id === rootApplicationId
  const trail = applicationTrail(application)
  const children = childApplications(application)
  const products = productsForApplication(application)

  return (
    <>
      <title>{`${application.name} | Sulzer`}</title>

      <ApplicationHero
        application={application}
        breadcrumb={trail.map((app, i) => ({
          label: app.name,
          to: i < trail.length - 1 ? applicationPath(app) : undefined,
        }))}
        action={
          isRoot
            ? undefined
            : { label: copy.sizeLabel, to: `/sizing?application=${application.id}` }
        }
      />

      <TabBar
        tabs={copy.tabs}
        active={activeTab}
        onSelect={selectTab}
        anchorRef={anchorRef}
        idPrefix="application"
      />

      <TabPanel idPrefix="application" tabId={activeTab}>
        {activeTab === 'explore' && (
          <div className="space-y-20">
            {application.explore && <ExploreSection content={application.explore} />}

            {children.length > 0 && (
              <section>
                <TabHeading
                  title={isRoot ? copy.rootChildrenTitle : copy.childrenTitle(application.name)}
                />
                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {children.map((child) => (
                    <li key={child.id}>
                      <ApplicationTile item={applicationTeaser(child)} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!application.explore && children.length === 0 && (
              <TabComingSoon copy={copy.exploreEmpty} />
            )}

            {!isRoot && products.length > 0 && (
              <TabCallout
                title={copy.productsCallout.title(application.name)}
                text={copy.productsCallout.text(products.length)}
                actionLabel={copy.productsCallout.actionLabel}
                onAction={() => selectTab('products')}
              />
            )}
          </div>
        )}

        {activeTab === 'products' &&
          (products.length > 0 ? (
            <ProductGroups products={products} />
          ) : (
            <TabComingSoon copy={copy.productsEmpty} />
          ))}

        {activeTab === 'learn' && <TabComingSoon copy={copy.learn} />}
      </TabPanel>
    </>
  )
}
