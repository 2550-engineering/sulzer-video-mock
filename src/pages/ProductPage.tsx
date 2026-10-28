import { useParams } from 'react-router'
import { BimTab } from '../components/product/BimTab'
import { DocumentationTab } from '../components/product/DocumentationTab'
import { ModelsTab } from '../components/product/ModelsTab'
import { ProductExploreTab } from '../components/product/ProductExploreTab'
import { ProductHeader } from '../components/product/ProductHeader'
import { ServicesTab } from '../components/product/ServicesTab'
import { TabBar } from '../components/TabBar'
import { TabComingSoon } from '../components/TabComingSoon'
import { TabPanel } from '../components/TabPanel'
import { productPage as copy } from '../data/catalogPages'
import { useHashTab } from '../hooks/useHashTab'
import { documentsFor, getProduct, modelsFor, servicesFor } from '../lib/catalog'
import { NotFoundPage } from './NotFoundPage'

/** Product page: /products/:id. */
export function ProductPage() {
  const { id = '' } = useParams()
  const { active: activeTab, select: selectTab, anchorRef } = useHashTab(copy.tabs)
  const product = getProduct(id)
  if (!product) return <NotFoundPage />

  const models = modelsFor(product.id)
  const documentation = documentsFor(product.id)
  const services = servicesFor(product.serviceIds)

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
            <ModelsTab key={product.id} models={models} />
          ) : (
            <TabComingSoon copy={copy.tabEmpty} />
          ))}

        {activeTab === 'documentation' &&
          (documentation.length > 0 ? (
            <DocumentationTab key={product.id} product={product} documents={documentation} />
          ) : (
            <TabComingSoon copy={copy.tabEmpty} />
          ))}

        {activeTab === 'bim' &&
          (models.length > 0 ? (
            <BimTab key={product.id} product={product} models={models} />
          ) : (
            <TabComingSoon copy={copy.tabEmpty} />
          ))}

        {/* Spare parts arrive with the spare parts and eCommerce module. */}
        {activeTab === 'spare-parts' && <TabComingSoon copy={copy.spareParts} />}

        {activeTab === 'services' && (
          <ServicesTab key={product.id} product={product} services={services} />
        )}
      </TabPanel>
    </>
  )
}
