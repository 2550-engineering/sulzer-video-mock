import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AssetAlertBanner } from '../components/assets/AssetAlertBanner'
import { AssetConditionTab } from '../components/assets/AssetConditionTab'
import { AssetHeader } from '../components/assets/AssetHeader'
import { AssetOverviewTab } from '../components/assets/AssetOverviewTab'
import { AssetSparePartsTab } from '../components/assets/AssetSparePartsTab'
import { ServiceHistoryTab } from '../components/assets/ServiceHistoryTab'
import { Modal } from '../components/Modal'
import { DocumentationTab } from '../components/product/DocumentationTab'
import { ServiceRequestForm } from '../components/product/ServiceRequestForm'
import { TabBar } from '../components/TabBar'
import { TabComingSoon } from '../components/TabComingSoon'
import { TabPanel } from '../components/TabPanel'
import { assetPage as copy, channels } from '../data/assetPages'
import { assetById, assetLocation, siteById } from '../data/assets'
import { productPage } from '../data/catalogPages'
import { signedOutRedirect } from '../data/myPages'
import { useHashTab } from '../hooks/useHashTab'
import { assetAlert, readingTime } from '../lib/assetList'
import { documentsFor, getModel, getProduct, servicesFor } from '../lib/catalog'
import { NotFoundPage } from './NotFoundPage'

/** One installed unit: /assets/:id. Signed-in only. Header, active alert and five tabs. */
export function AssetPage() {
  const { user } = useAuth()
  const { id = '' } = useParams()
  const { active, select, anchorRef } = useHashTab(copy.tabs)
  const [requestOpen, setRequestOpen] = useState(false)
  // A new key per opening starts the form fresh, while the last one stays visible as it fades out.
  const [session, setSession] = useState(0)

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

  function openRequest() {
    setSession((n) => n + 1)
    setRequestOpen(true)
  }

  // The request starts from the alert, so the service team sees what Sulzer Connect saw.
  const message = alert
    ? `${asset.tag}, serial no. ${asset.serialNumber}: ${copy.alert
        .title(channels[alert.channel].label, alert.level)
        .toLowerCase()}${alert.since !== null ? ` ${copy.alert.since(readingTime(alert.since))}` : ''}.${
        alert.finding ? ` ${alert.finding.title}.` : ''
      }`
    : `${asset.tag}, serial no. ${asset.serialNumber}.`

  return (
    <>
      <title>{`${asset.tag} ${asset.name.replace(` ${asset.tag}`, '')} | My assets | Sulzer`}</title>

      <AssetHeader
        key={asset.id}
        asset={asset}
        site={site}
        onRequestService={openRequest}
        onOrderParts={() => select('spare-parts')}
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

      <Modal
        open={requestOpen}
        title={productPage.services.request.title(`${asset.tag} (${unit})`)}
        closeLabel={productPage.services.request.close}
        onClose={() => setRequestOpen(false)}
        width="max-w-2xl"
      >
        {session > 0 && (
          <ServiceRequestForm
            key={session}
            product={product}
            services={servicesFor(product.serviceIds)}
            prefill={{
              site: assetLocation(asset),
              message,
              services: alert ? copy.requestServices.alert : copy.requestServices.routine,
            }}
            onDone={() => setRequestOpen(false)}
          />
        )}
      </Modal>
    </>
  )
}
