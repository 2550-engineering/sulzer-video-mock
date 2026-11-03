import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AssetAlertBanner } from '../components/assets/AssetAlertBanner'
import { AssetConditionTab } from '../components/assets/AssetConditionTab'
import { AssetHeader } from '../components/assets/AssetHeader'
import { AssetOverviewTab } from '../components/assets/AssetOverviewTab'
import { AssetServiceRequestDialog } from '../components/assets/AssetServiceRequestDialog'
import { AssetSparePartsTab } from '../components/assets/AssetSparePartsTab'
import { ServiceHistoryTab } from '../components/assets/ServiceHistoryTab'
import { DocumentationTab } from '../components/product/DocumentationTab'
import { TabBar } from '../components/TabBar'
import { TabComingSoon } from '../components/TabComingSoon'
import { TabPanel } from '../components/TabPanel'
import { assetPage as copy } from '../data/assetPages'
import { assetById, customers, siteById } from '../data/assets'
import { signedOutRedirect } from '../data/myPages'
import { partnerAssetBreadcrumb, partnerCustomerPath } from '../data/partner'
import { useHashTab } from '../hooks/useHashTab'
import { assetAlert } from '../lib/assetList'
import { documentsFor, getModel, getProduct } from '../lib/catalog'
import { NotFoundPage } from './NotFoundPage'

/** One installed unit: /assets/:id. Signed-in only. Header, active alert and five tabs. */
export function AssetPage() {
  const { user } = useAuth()
  const { id = '' } = useParams()
  const { active, select, anchorRef } = useHashTab(copy.tabs)
  const [requestOpen, setRequestOpen] = useState(false)

  if (!user) return <Navigate to={signedOutRedirect} replace />

  const asset = assetById(id)
  const site = asset && siteById(asset.siteId)
  const product = asset && getProduct(asset.productId)
  if (!asset || !site || !product || (user.customerId && asset.customerId !== user.customerId)) {
    return <NotFoundPage />
  }

  const model = asset.modelId ? getModel(asset.modelId) : undefined
  const unit = model?.name ?? product.name
  const alert = assetAlert(asset)
  const documents = documentsFor(product.id)
  // A partner sees the same page, reached through the customer.
  const owner =
    user.kind === 'partner' ? customers.find((c) => c.id === asset.customerId) : undefined

  const openRequest = () => setRequestOpen(true)

  return (
    <>
      <title>{`${asset.tag} ${asset.name.replace(` ${asset.tag}`, '')} | My assets | Sulzer`}</title>

      <AssetHeader
        key={asset.id}
        asset={asset}
        site={site}
        onRequestService={openRequest}
        onOrderParts={() => select('spare-parts')}
        {...(owner
          ? {
              breadcrumbParents: partnerAssetBreadcrumb(owner.id),
              customer: { customer: owner, to: partnerCustomerPath(owner.id) },
            }
          : {})}
      />

      <div className="bg-surface-muted">
        {alert && (
          <AssetAlertBanner
            alert={alert}
            onViewCondition={() => select('condition')}
            onRequestService={openRequest}
          />
        )}

        <div className={alert ? 'pt-8' : ''}>
          <TabBar
            tabs={copy.tabs}
            active={active}
            onSelect={select}
            anchorRef={anchorRef}
            idPrefix="asset"
          />
        </div>

        <TabPanel idPrefix="asset" tabId={active}>
          {active === 'overview' && (
            <AssetOverviewTab asset={asset} site={site} onRequestService={openRequest} />
          )}
          {active === 'condition' && <AssetConditionTab asset={asset} />}
          {active === 'documents' &&
            (documents.length > 0 ? (
              <DocumentationTab
                key={asset.id}
                product={product}
                documents={documents}
                title={copy.documents.title}
                intro={copy.documents.intro(unit, asset.serialNumber)}
                documentNote={(doc) =>
                  copy.documents.genericTypes.includes(doc.type)
                    ? undefined
                    : copy.documents.forSerial(asset.serialNumber)
                }
              />
            ) : (
              <TabComingSoon copy={copy.documents.empty} />
            ))}
          {active === 'spare-parts' && <AssetSparePartsTab asset={asset} />}
          {active === 'service-history' && <ServiceHistoryTab asset={asset} />}
        </TabPanel>
      </div>

      <AssetServiceRequestDialog
        asset={asset}
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
      />
    </>
  )
}
