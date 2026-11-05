import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { KnowledgeGrid } from '../components/KnowledgeGrid'
import { BimTab } from '../components/product/BimTab'
import { ConfiguredProductsBand } from '../components/product/ConfiguredProductsBand'
import { DocumentationTab } from '../components/product/DocumentationTab'
import { ModelsTab } from '../components/product/ModelsTab'
import { ProductExploreTab } from '../components/product/ProductExploreTab'
import { ProductBuyBox } from '../components/product/ProductBuyBox'
import { ProductHeader } from '../components/product/ProductHeader'
import { ServicesTab } from '../components/product/ServicesTab'
import { VariantSparePartsPointer } from '../components/product/VariantSparePartsPointer'
import { VariantsTab } from '../components/product/VariantsTab'
import { ModelSparePartsTab } from '../components/spareparts/ModelSparePartsTab'
import { TabBar } from '../components/TabBar'
import { TabDemoNotice } from '../components/TabDemoNotice'
import { TabPanel } from '../components/TabPanel'
import { serviceProviderDemo } from '../config/demo'
import { productPage as copy } from '../data/catalogPages'
import { useHashTab } from '../hooks/useHashTab'
import {
  documentsFor,
  getProduct,
  getProductVariant,
  knowledgeFor,
  modelsFor,
  productTabs,
  servicesFor,
  sparePartsFor,
  variantsFor,
} from '../lib/catalog'
import { usePersonal } from '../personal/usePersonal'
import { NotFoundPage } from './NotFoundPage'

/**
 * Product page: /products/:id. Pumps have Explore / Models / Documentation /
 * BIM / Spare parts / Services; digital products Explore / Variants /
 * Documentation / Learn (the product's `tabSet`). Signed in, each visit goes
 * to the top of Recently viewed.
 */
export function ProductPage() {
  const { id = '' } = useParams()
  const product = getProduct(id)
  const {
    active: activeTab,
    select: selectTab,
    anchorRef,
  } = useHashTab(product ? productTabs(product) : copy.tabSets.pump)
  const { user } = useAuth()
  const { recordView } = usePersonal()

  useEffect(() => {
    if (user && product) recordView(product.id)
  }, [user, product, recordView])

  if (!product) return <NotFoundPage />

  const models = modelsFor(product.id)
  const documentation = documentsFor(product.id)
  const services = servicesFor(product.serviceIds)
  const learning = knowledgeFor(product.tabs.learnIds ?? [])
  const bleed = activeTab === 'explore' || (activeTab === 'learn' && learning.length > 0)
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
        tabs={productTabs(product)}
        active={activeTab}
        onSelect={selectTab}
        anchorRef={anchorRef}
        idPrefix="product"
      />

      <TabPanel idPrefix="product" tabId={activeTab} bleed={bleed}>
        {activeTab === 'explore' && <ProductExploreTab explore={product.tabs.explore} />}

        {activeTab === 'models' &&
          (models.length > 0 ? <ModelsTab key={product.id} models={models} /> : <TabDemoNotice />)}

        {activeTab === 'variants' &&
          (product.tabs.variants ? (
            <VariantsTab variants={product.tabs.variants} />
          ) : (
            <TabDemoNotice />
          ))}

        {activeTab === 'documentation' &&
          (documentation.length > 0 ? (
            <DocumentationTab key={product.id} product={product} documents={documentation} />
          ) : (
            <TabDemoNotice />
          ))}

        {activeTab === 'bim' &&
          (models.length > 0 ? (
            <BimTab key={product.id} product={product} models={models} />
          ) : (
            <TabDemoNotice />
          ))}

        {/* Parts lists belong to configured products (point to one) or to models (pick one). */}
        {activeTab === 'spare-parts' &&
          (featured ? (
            <VariantSparePartsPointer variant={featured} />
          ) : models.some((model) => sparePartsFor(model.id)) ? (
            <ModelSparePartsTab product={product} />
          ) : (
            <TabDemoNotice />
          ))}

        {activeTab === 'services' && (
          <ServicesTab key={product.id} product={product} services={services} />
        )}

        {activeTab === 'learn' &&
          (learning.length > 0 ? (
            <KnowledgeGrid
              title={copy.learn.title(product.name)}
              text={copy.learn.text}
              items={learning}
            />
          ) : (
            <TabDemoNotice />
          ))}
      </TabPanel>
    </>
  )
}
