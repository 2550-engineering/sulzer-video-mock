import { getModel, partsInVersion, sparePartsFor, variantsFor } from './catalog'

/*
 * Installed units, findings and order history on the spare parts catalogues
 * (data/spareParts/*): AHLSTAR models have their own parts list, an XFP model
 * uses its configured variant that has one.
 */

/** The variant or model whose parts list fits a model; undefined when none has one. */
export function partsOwnerId(modelId: string): string | undefined {
  if (sparePartsFor(modelId)) return modelId
  const model = getModel(modelId)
  return model && variantsFor(model.productId, modelId).find((v) => sparePartsFor(v.id))?.id
}

/** What findings and order lines ask for, independent of the product's position numbers. */
export type PartKind = 'bearing-kit' | 'seal-kit' | 'seal' | 'impeller' | 'bottom-plate'

/** A kit slug, or the positions to try in order (gland packing models have 461 for 433). */
const kinds: Record<'ahlstar' | 'xfp', Partial<Record<PartKind, { kit: string } | string[]>>> = {
  ahlstar: {
    'bearing-kit': { kit: 'bearings' },
    'seal-kit': { kit: 'seal' },
    seal: ['433', '461'],
    impeller: ['230'],
  },
  xfp: {
    'bearing-kit': { kit: 'lower-bearing' },
    'seal-kit': ['401'],
    seal: ['401'],
    impeller: ['501'],
    'bottom-plate': ['530'],
  },
}

export type CatalogueItem = {
  /** Part or kit id in the parts list. */
  id: string
  kind: 'part' | 'kit'
  /** The variant or model the parts list belongs to. */
  ownerId: string
  partNumber: string
  name: string
  listPrice: number
  position?: string
}

/** The part or kit of `kind` that fits a model, or undefined. */
export function findCatalogueItem(modelId: string, kind: PartKind): CatalogueItem | undefined {
  const ownerId = partsOwnerId(modelId)
  const catalogue = ownerId && sparePartsFor(ownerId)
  const wanted = catalogue && kinds[catalogue.productId as 'ahlstar' | 'xfp']?.[kind]
  if (!ownerId || !catalogue || !wanted) return undefined
  if ('kit' in wanted) {
    const kit = catalogue.kits.find((k) => k.id === `${catalogue.id}-kit-${wanted.kit}`)
    return kit && { ...kit, kind: 'kit', ownerId }
  }
  const parts = partsInVersion(catalogue)
  const part = wanted.map((position) => parts.find((p) => p.position === position)).find(Boolean)
  return part && { ...part, kind: 'part', ownerId }
}

/** Like `findCatalogueItem`, for data that must exist. */
export function catalogueItem(modelId: string, kind: PartKind): CatalogueItem {
  const item = findCatalogueItem(modelId, kind)
  if (!item) throw new Error(`No ${kind} for ${modelId}`)
  return item
}
