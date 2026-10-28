import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { IconCardGrid } from '../components/IconCardGrid'
import { DocumentList } from '../components/product/DocumentList'
import { ModelsTable } from '../components/product/ModelsTable'
import { ProductExploreTab } from '../components/product/ProductExploreTab'
import { ProductHeader } from '../components/product/ProductHeader'
import { SparePartList } from '../components/product/SparePartList'
import { TabBar } from '../components/TabBar'
import { TabComingSoon } from '../components/TabComingSoon'
import { TabHeading } from '../components/TabHeading'
import { TabPanel } from '../components/TabPanel'
import { productPage as copy } from '../data/catalogPages'
import { useHashTab } from '../hooks/useHashTab'
import {
  documentsFor,
  getProduct,
  isModelFile,
  modelsFor,
  servicesFor,
  sparePartsFor,
} from '../lib/catalog'
import { NotFoundPage } from './NotFoundPage'

/** Product page: /products/:id. */
export function ProductPage() {
  const { id = '' } = useParams()
  const { active: activeTab, select: selectTab, anchorRef } = useHashTab(copy.tabs)
  const product = getProduct(id)
  if (!product) return <NotFoundPage />

  const models = modelsFor(product.id)
  const parts = sparePartsFor(product.id)
  const docs = documentsFor(product.id)
  const documentation = docs.filter((doc) => !isModelFile(doc))
  const bim = docs.filter(isModelFile)
  const services = servicesFor(product.serviceIds).map((service) => ({
    label: service.name,
    text: service.summary,
    icon: service.icon,
  }))

  return (
    <>
      <title>{`${product.name} | Sulzer`}</title>

      <ProductHeader
        key={product.id}
        product={product}
        onShowDocumentation={() => selectTab('documentation')}
      />

      <TabBar
        tabs={copy.tabs}
        active={activeTab}
        onSelect={selectTab}
        anchorRef={anchorRef}
        idPrefix="product"
      />

      <TabPanel idPrefix="product" tabId={activeTab} bleed={activeTab === 'explore'}>
        {activeTab === 'explore' && <ProductExploreTab explore={product.tabs.explore} />}

        {activeTab === 'models' &&
          (models.length > 0 ? (
            <>
              <TabHeading title={copy.modelsTitle(models.length)} />
              <div className="mt-8">
                <ModelsTable models={models} />
              </div>
            </>
          ) : (
            <TabComingSoon copy={copy.tabEmpty} />
          ))}

        {activeTab === 'documentation' &&
          (documentation.length > 0 ? (
            <>
              <TabHeading title={copy.documentationTitle} />
              <div className="mt-8">
                <DocumentList documents={documentation} />
              </div>
            </>
          ) : (
            <TabComingSoon copy={copy.tabEmpty} />
          ))}

        {activeTab === 'bim' &&
          (bim.length > 0 ? (
            <>
              <TabHeading title={copy.bimTitle} />
              <div className="mt-8">
                <DocumentList documents={bim} />
              </div>
            </>
          ) : (
            <TabComingSoon copy={copy.tabEmpty} />
          ))}

        {activeTab === 'spare-parts' &&
          (parts.length > 0 ? (
            <>
              <TabHeading title={copy.sparePartsTitle}>
                <Link
                  to={copy.sparePartsLink.to}
                  className="group inline-flex items-center gap-2 text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  {copy.sparePartsLink.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </TabHeading>
              <div className="mt-8">
                <SparePartList parts={parts} />
              </div>
            </>
          ) : (
            <TabComingSoon copy={copy.tabEmpty} />
          ))}

        {activeTab === 'services' && (
          <>
            <TabHeading title={copy.servicesTitle} />
            <div className="mt-8">
              <IconCardGrid items={services} columns="sm:grid-cols-2 lg:grid-cols-3" />
            </div>
          </>
        )}
      </TabPanel>
    </>
  )
}
