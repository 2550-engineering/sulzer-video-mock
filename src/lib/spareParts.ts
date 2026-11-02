import { assets } from '../data/assets'
import { productModels } from '../data/productModels'
import { sectionalDrawings } from '../data/sectionalDrawings'
import { spareParts, sparePartGroups } from '../data/spareParts'
import type { SparePart } from '../types'

/* Lookups over the parts lists in data/spareParts.ts. */

export const getPart = (id: string) => spareParts.find((part) => part.id === id)

export const drawingFor = (productId: string) => sectionalDrawings[productId]

/** Products with parts lists, in catalogue order. */
export const productIdsWithParts = [...new Set(spareParts.map((part) => part.productId))]

/** A product's models that have a parts list. */
export const modelsWithParts = (productId: string) =>
  productModels.filter(
    (model) =>
      model.productId === productId && spareParts.some((p) => p.modelIds.includes(model.id)),
  )

const groupIndex = (part: SparePart) => sparePartGroups.indexOf(part.group)

/** A model's parts list: by group, then position (kits for the whole pump last). */
export function bomFor(modelId: string) {
  return spareParts
    .filter((part) => part.modelIds.includes(modelId))
    .sort(
      (a, b) =>
        groupIndex(a) - groupIndex(b) ||
        (a.position ?? Infinity) - (b.position ?? Infinity) ||
        a.name.localeCompare(b.name),
    )
}

/** What a kit holds, with the parts looked up. */
export function kitContents(kit: SparePart) {
  return (kit.contains ?? []).flatMap((item) => {
    const part = getPart(item.partId)
    return part ? [{ part, quantity: item.quantity }] : []
  })
}

/** True for the part at this drawing position, and for kits that hold one. */
export function atPosition(part: SparePart, position: number) {
  return (
    part.position === position || kitContents(part).some((item) => item.part.position === position)
  )
}

/** Part numbers are shown and typed with or without spaces. */
const digits = (text: string) => text.replace(/\s+/g, '')

/** An exact part number, e.g. from quick order. */
export const partByNumber = (partNumber: string) =>
  spareParts.find((part) => part.partNumber === digits(partNumber))

/**
 * Parts whose number starts with the query (at least 3 digits) or whose name has every
 * word of it. Exact part numbers first.
 */
export function searchParts(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const number = digits(q)
  if (/^\d+$/.test(number)) {
    if (number.length < 3) return []
    return spareParts
      .filter((part) => part.partNumber.startsWith(number))
      .sort((a, b) => Number(b.partNumber === number) - Number(a.partNumber === number))
  }
  const words = q.split(/\s+/)
  return spareParts.filter((part) => {
    const name = part.name.toLowerCase()
    return words.every((word) => name.includes(word))
  })
}

/** The installed unit with this serial number (any case, spaces ignored). */
export function assetBySerial(serial: string) {
  const wanted = digits(serial).toUpperCase()
  return wanted ? assets.find((asset) => asset.serialNumber === wanted) : undefined
}

/** "AHLSTAR 150-125-315" or "AHLSTAR 100-80-250 and 4 more sizes". */
export function fitsLabel(part: SparePart) {
  const names = part.modelIds
    .map((id) => productModels.find((model) => model.id === id))
    .filter((model) => model !== undefined)
    .map((model) => (model.frequency === 60 ? `${model.name} (60 Hz)` : model.name))
  const unique = [...new Set(names)]
  return unique.length > 1 ? `${unique[0]} and ${unique.length - 1} more` : (unique[0] ?? '')
}
