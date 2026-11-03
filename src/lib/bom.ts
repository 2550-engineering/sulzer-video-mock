import { sparePartsTab } from '../data/sparePartsPage'
import type { ServiceKit, SparePart } from '../types'

/* Bill of material: sorting, the kits column and the CSV export. */

export type BomSortKey =
  'position' | 'name' | 'partNumber' | 'quantity' | 'material' | 'price' | 'leadTime'
export type BomSort = { key: BomSortKey; direction: 'asc' | 'desc' }

const compareBy: Record<BomSortKey, (a: SparePart, b: SparePart) => number> = {
  position: (a, b) => a.position.localeCompare(b.position, 'en', { numeric: true }),
  name: (a, b) => a.name.localeCompare(b.name, 'en'),
  partNumber: (a, b) => a.partNumber.localeCompare(b.partNumber, 'en'),
  quantity: (a, b) => a.quantity - b.quantity,
  material: (a, b) => a.material.localeCompare(b.material, 'en'),
  price: (a, b) => a.listPrice - b.listPrice,
  leadTime: (a, b) => a.availability.leadTimeDays - b.availability.leadTimeDays,
}

/** Sorted copy; ties keep position order. */
export function sortBom(parts: SparePart[], sort: BomSort) {
  const sign = sort.direction === 'asc' ? 1 : -1
  return [...parts].sort((a, b) => sign * compareBy[sort.key](a, b) || compareBy.position(a, b))
}

/** "2 years", or a named kit's own name ("Kit, impeller"). */
export const kitShortLabel = (kit: ServiceKit) =>
  kit.years ? sparePartsTab.bom.kitShort(kit.years) : kit.name

/** "2 years of operation", or a named kit's own name. */
export const kitLabel = (kit: ServiceKit) =>
  kit.years ? sparePartsTab.kitLabel(kit.years) : kit.name

/** The sets and kits a part is in: "2 years, 5 years, Kit, impeller". */
export const kitsOf = (part: SparePart, kits: ServiceKit[]) =>
  kits.filter((kit) => kit.items.some((item) => item.partId === part.id)).map(kitShortLabel)

const csvCell = (value: string | number) => {
  const text = String(value)
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** The BOM as CSV (prices only when `withPrices`), with a BOM mark so Excel reads UTF-8. */
export function bomCsv(parts: SparePart[], kits: ServiceKit[], withPrices: boolean) {
  const c = sparePartsTab.bom.columns
  const header = [c.position, c.name, c.partNumber, c.quantity, c.material, c.kits]
  if (withPrices) header.push(c.price, c.stock, c.leadTime)
  const rows = parts.map((part) => {
    const row: (string | number)[] = [
      part.position,
      part.name,
      part.partNumber,
      part.quantity,
      part.material,
      kitsOf(part, kits).join(' / '),
    ]
    if (withPrices) {
      row.push(
        part.listPrice.toFixed(2),
        sparePartsTab.bom.stock[part.availability.status],
        part.availability.leadTime,
      )
    }
    return row
  })
  return '﻿' + [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
}
