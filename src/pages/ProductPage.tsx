import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { KnowledgeGrid } from '../components/KnowledgeGrid'
import { BimTab } from '../components/product/BimTab'
import { DocumentationTab } from '../components/product/DocumentationTab'
import { ModelsTab } from '../components/product/ModelsTab'
import { ProductExploreTab } from '../components/product/ProductExploreTab'
import { ProductHeader } from '../components/product/ProductHeader'
import { ServicesTab } from '../components/product/ServicesTab'
import { VariantsTab } from '../components/product/VariantsTab'
import { ProductSparePartsTab } from '../components/spareparts/ProductSparePartsTab'
import { TabBar } from '../components/TabBar'
import { TabComingSoon } from '../components/TabComingSoon'
import { TabPanel } from '../components/TabPanel'
import { productPage as copy } from '../data/catalogPages'
import { useHashTab } from '../hooks/useHashTab'
import {
  documentsFor,
  getProduct,
  knowledgeFor,
  modelsFor,
  productTabs,
  servicesFor,
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

  return (
    <>
      <title>{`${product.name} | Sulzer`}</title>

      <ProductHeader
        key={product.id}
        product={product}
        onShowDocumentation={() => selectTab('documentation')}
      />

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
          (models.length > 0 ? (
            <ModelsTab key={product.id} models={models} />
          ) : (
            <TabComingSoon copy={copy.tabEmpty} />
          ))}

        {activeTab === 'variants' &&
          (product.tabs.variants ? (
            <VariantsTab variants={product.tabs.variants} />
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

        {activeTab === 'spare-parts' && <ProductSparePartsTab key={product.id} product={product} />}

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
            <TabComingSoon copy={copy.tabEmpty} />
          ))}
      </TabPanel>
    </>
  )
}
