import { partOwner, sparePartsFor } from '../../lib/catalog'
import { TabDemoNotice } from '../TabDemoNotice'
import { SparePartsBrowser } from './SparePartsBrowser'

/** Spare parts tab of a variant or model; those without a parts list say so. */
export function SparePartsTab({ ownerId }: { ownerId: string }) {
  const catalogue = sparePartsFor(ownerId)
  const owner = partOwner(ownerId)
  return catalogue && owner ? (
    <SparePartsBrowser catalogue={catalogue} owner={owner} />
  ) : (
    <TabDemoNotice />
  )
}
