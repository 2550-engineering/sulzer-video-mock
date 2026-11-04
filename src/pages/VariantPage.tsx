import { useParams } from 'react-router'
import { BimTab } from '../components/product/BimTab'
import { DocumentationTab } from '../components/product/DocumentationTab'
import { ServicesTab } from '../components/product/ServicesTab'
import { SparePartsTab } from '../components/spareparts/SparePartsTab'
import { TabBar } from '../components/TabBar'
import { TabDemoNotice } from '../components/TabDemoNotice'
import { TabPanel } from '../components/TabPanel'
import { CurvesTab } from '../components/variant/CurvesTab'
import { QuotationTab } from '../components/variant/QuotationTab'
import { RecommendedParts } from '../components/variant/RecommendedParts'
import { SpecificationsTab } from '../components/variant/SpecificationsTab'
import { VariantHeader } from '../components/variant/VariantHeader'
import { VariantsTab } from '../components/variant/VariantsTab'
import { drawingDocuments } from '../data/drawingDocuments'
import { variantPage as copy } from '../data/variantPages'
import { useHashTab } from '../hooks/useHashTab'
import { articlesFor, getArticle } from '../lib/articles'
import {
  documentsFor,
  getDrawing,
  getModel,
  getProduct,
  partOwner,
  servicesFor,
  sparePartsFor,
  sparePartsPath,
} from '../lib/catalog'
import { scrollToTabBar } from '../lib/scrollToTabBar'
import { NotFoundPage } from './NotFoundPage'

/**
 * Configured product page of a variant (/products/xfp/24150231) or a model
 * (/products/ahlstar/ahlstar-100-80-250): header with price, recommended spare
 * parts, then the tabs, opening on Curves.
 */
export function VariantPage() {
  const { id = '', variantId = '' } = useParams()
  const { active: activeTab, select: selectTab, anchorRef } = useHashTab(copy.tabs, 'curves')
  const product = getProduct(id)
  const article = product && getArticle(product.id, variantId)
  if (!product || !article) return <NotFoundPage />

  const model = getModel(article.modelId)
  const catalogue = sparePartsFor(article.id)
  const owner = partOwner(article.id)

  return (
    <>
      <title>{`${article.code} | Sulzer`}</title>

      <VariantHeader article={article} product={product} onSelectTab={selectTab} />

      {catalogue && owner && (
        <RecommendedParts
          catalogue={catalogue}
          partLink={(query) => sparePartsPath(owner, query)}
          onOpen={() => requestAnimationFrame(() => scrollToTabBar(anchorRef.current))}
        />
      )}

      <TabBar
        tabs={copy.tabs}
        active={activeTab}
        onSelect={selectTab}
        anchorRef={anchorRef}
        idPrefix="variant"
      />

      {/* Keyed by variant or model, so switching starts every tab fresh. */}
      <TabPanel key={article.id} idPrefix="variant" tabId={activeTab}>
        {activeTab === 'variants' && (
          <VariantsTab
            articles={articlesFor(product.id)}
            current={article}
            productName={product.name}
          />
        )}
        {activeTab === 'quotation' && <QuotationTab article={article} />}
        {activeTab === 'specifications' && <SpecificationsTab article={article} />}
        {activeTab === 'curves' && <CurvesTab article={article} />}
        {activeTab === 'spare-parts' && <SparePartsTab ownerId={article.id} />}
        {activeTab === 'cad' &&
          (model ? <BimTab product={product} models={[model]} /> : <TabDemoNotice />)}
        {activeTab === 'drawings' && (
          <DocumentationTab
            product={product}
            documents={drawingDocuments(
              article,
              catalogue && getDrawing(catalogue.drawingId)?.number,
            )}
            title={copy.drawings.title}
          />
        )}
        {activeTab === 'documentation' && (
          <DocumentationTab product={product} documents={documentsFor(product.id)} />
        )}
        {activeTab === 'services' && (
          <ServicesTab product={product} services={servicesFor(product.serviceIds)} />
        )}
      </TabPanel>
    </>
  )
}
