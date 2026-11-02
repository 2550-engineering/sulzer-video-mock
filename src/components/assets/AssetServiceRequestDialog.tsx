import { useState } from 'react'
import { productPage } from '../../data/catalogPages'
import { serviceRequestPrefill } from '../../lib/assetList'
import { getModel, getProduct, servicesFor } from '../../lib/catalog'
import type { Asset } from '../../types'
import { Modal } from '../Modal'
import { ServiceRequestForm } from '../product/ServiceRequestForm'

const copy = productPage.services.request

type AssetServiceRequestDialogProps = {
  asset: Asset
  open: boolean
  onClose: () => void
}

/**
 * "Request service" for one asset, prefilled from its site and active alert.
 * The same dialog (and SR reference) on the website and in Sulzer Connect.
 */
export function AssetServiceRequestDialog({
  asset,
  open,
  onClose,
}: AssetServiceRequestDialogProps) {
  // A new form per opening, while the last one stays visible as the dialog fades out.
  const [session, setSession] = useState(0)
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setSession((n) => n + 1)
  }

  const product = getProduct(asset.productId)
  if (!product) return null
  const model = asset.modelId ? getModel(asset.modelId) : undefined

  return (
    <Modal
      open={open}
      title={copy.title(`${asset.tag} (${model?.name ?? product.name})`)}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-2xl"
    >
      {session > 0 && (
        <ServiceRequestForm
          key={session}
          product={product}
          services={servicesFor(product.serviceIds)}
          prefill={serviceRequestPrefill(asset)}
          onDone={onClose}
        />
      )}
    </Modal>
  )
}
