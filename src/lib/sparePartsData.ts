import { customerAccount } from '../config/demo'
import type { ServiceInterval, ServiceKit, SparePart } from '../types'

/* Builders shared by the spare parts data files (spareParts/*.ts). */

/** Customer's price: list price less the account's parts discount, to the cent. */
export const netPrice = (listPrice: number) =>
  Math.round(listPrice * (100 - customerAccount.partsDiscount)) / 100

export type PartInput = Omit<SparePart, 'id' | 'netPrice'>

/** A part of one catalogue: its id is "<catalogue id>-<position>". */
export const partOf =
  (catalogueId: string) =>
  (input: PartInput): SparePart => ({
    ...input,
    id: `${catalogueId}-${input.position}`,
    netPrice: netPrice(input.listPrice),
  })

/**
 * Recommended service parts for an interval: every part first due at or
 * before it, in the quantity fitted in the pump. The 5-year set includes the
 * 2-year parts. Prices are the sum of the parts; lead time is the longest.
 */
export function serviceKit(
  catalogueId: string,
  parts: SparePart[],
  years: ServiceInterval,
  partNumber: string,
): ServiceKit {
  const due = parts.filter((p) => p.recommendedAfter !== undefined && p.recommendedAfter <= years)
  const sum = (price: (p: SparePart) => number) =>
    Math.round(due.reduce((total, p) => total + price(p) * p.quantity, 0) * 100) / 100
  return {
    id: `${catalogueId}-kit-${years}y`,
    name: `Recommended service parts – ${years} years of operation`,
    years,
    partNumber,
    items: due.map((p) => ({ partId: p.id, quantity: p.quantity })),
    listPrice: sum((p) => p.listPrice),
    netPrice: sum((p) => p.netPrice),
    availability: due.reduce(
      (longest, p) =>
        p.availability.leadTimeDays > longest.leadTimeDays ? p.availability : longest,
      due[0].availability,
    ),
  }
}

/**
 * A named kit ("Kit, impeller"): the parts at `positions`, in the quantity
 * fitted in the pump. Priced and timed like the recommended sets.
 */
export function namedKit(
  catalogueId: string,
  parts: SparePart[],
  slug: string,
  name: string,
  partNumber: string,
  positions: string[],
): ServiceKit {
  const items = parts.filter((p) => positions.includes(p.position))
  const sum = (price: (p: SparePart) => number) =>
    Math.round(items.reduce((total, p) => total + price(p) * p.quantity, 0) * 100) / 100
  return {
    id: `${catalogueId}-kit-${slug}`,
    name,
    partNumber,
    items: items.map((p) => ({ partId: p.id, quantity: p.quantity })),
    listPrice: sum((p) => p.listPrice),
    netPrice: sum((p) => p.netPrice),
    availability: items.reduce(
      (longest, p) =>
        p.availability.leadTimeDays > longest.leadTimeDays ? p.availability : longest,
      items[0].availability,
    ),
  }
}
