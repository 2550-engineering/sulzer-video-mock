import { useParams } from 'react-router'
import { BimTab } from '../components/product/BimTab'
import { ConfiguredProductsBand } from '../components/product/ConfiguredProductsBand'
import { DocumentationTab } from '../components/product/DocumentationTab'
import { ModelsTab } from '../components/product/ModelsTab'
import { ProductExploreTab } from '../components/product/ProductExploreTab'
import { ProductBuyBox } from '../components/product/ProductBuyBox'
import { ProductHeader } from '../components/product/ProductHeader'
import { ServicesTab } from '../components/product/ServicesTab'
import { VariantSparePartsPointer } from '../components/product/VariantSparePartsPointer'
import { ModelSparePartsTab } from '../components/spareparts/ModelSparePartsTab'
import { TabBar } from '../components/TabBar'
import { TabComingSoon } from '../components/TabComingSoon'
import { TabPanel } from '../components/TabPanel'
import { serviceProviderDemo } from '../config/demo'
import { productPage as copy } from '../data/catalogPages'
import { useHashTab } from '../hooks/useHashTab'
import {
  documentsFor,
  getProduct,
  getProductVariant,
  modelsFor,
  servicesFor,
  sparePartsFor,
  variantsFor,
} from '../lib/catalog'
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
  const variants = variantsFor(product.id)
  // The demo pump when it is one of this product's, else the first variant with a parts list.
  const demo = getProductVariant(serviceProviderDemo.variantId)
  const featured = demo?.productId === product.id ? demo : variants.find((v) => sparePartsFor(v.id))

  return (
    <>
      <title>{`${product.name} | Sulzer`}</title>

      <ProductHeader
        key={product.id}
        product={product}
        onShowDocumentation={() => selectTab('documentation')}
        buyBox={
          models.length > 0 && (
            <ProductBuyBox
              product={product}
              models={models}
              onChooseModel={() => selectTab('models')}
            />
          )
        }
      />

      {featured && (
        <ConfiguredProductsBand product={product} featured={featured} count={variants.length} />
      )}

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

        {/* Parts lists belong to configured products (point to one) or to models (pick one). */}
        {activeTab === 'spare-parts' &&
          (featured ? (
            <VariantSparePartsPointer variant={featured} />
          ) : models.some((model) => sparePartsFor(model.id)) ? (
            <ModelSparePartsTab product={product} />
          ) : (
            <TabComingSoon copy={copy.spareParts} />
          ))}

        {activeTab === 'services' && (
          <ServicesTab key={product.id} product={product} services={services} />
        )}
      </TabPanel>
    </>
  )
}
