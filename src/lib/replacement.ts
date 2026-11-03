import { replacementPage } from '../data/replacementPage'
import { xfpReplacements } from '../data/xfp'
import type { FitNoteKind, ProductVariant } from '../types'
import { variantsFor } from './catalog'
import { groupThousands } from './format'
import { ratedPoint } from './variantCurves'
import { variantSpecs } from './variantSpecs'

/* Product replacement: finding the old product, comparing it with its successor. */

const compact = (text: string) => text.toLowerCase().replace(/\s+/g, '')

const allVariants = () => variantsFor('xfp')

/** A variant by product number or model code, as typed (spaces ignored). */
export function findVariant(query: string) {
  const q = compact(query)
  if (!q) return undefined
  return allVariants().find(
    (variant) => variant.productNumber === q || compact(variant.code) === q || variant.id === q,
  )
}

export const discontinuedVariants = () => allVariants().filter((variant) => variant.discontinued)

export const replacementInfo = (variant: ProductVariant) => xfpReplacements[variant.id]

const kW = (power: number) => `${groupThousands(power, power % 1 ? 1 : 0)} kW`

/** Key specs side by side, marking the rows that differ. */
export function comparisonRows(old: ProductVariant, next: ProductVariant) {
  const ratedOld = ratedPoint(old)
  const ratedNext = ratedPoint(next)
  const rated = (p: { flow: number; head: number }) =>
    replacementPage.compare.ratedValue(
      groupThousands(p.flow),
      groupThousands(p.head, p.head % 1 ? 1 : 0),
    )
  const specsOld = variantSpecs(old)
  const specsNext = variantSpecs(next)
  const rows = [
    { label: replacementPage.compare.ratedPoint, old: rated(ratedOld), next: rated(ratedNext) },
    ...specsOld.map((spec, i) => ({
      label: spec.label,
      old: spec.value,
      next: specsNext[i].value,
    })),
  ]
  return rows.map((row) => ({ ...row, changed: row.old !== row.next }))
}

/** How well the successor fits where the old product was installed. */
export function fitNotes(old: ProductVariant, next: ProductVariant) {
  const copy = replacementPage.notes
  const notes: { kind: FitNoteKind; text: string }[] = []
  notes.push(
    old.connection.outlet === next.connection.outlet
      ? { kind: 'ok', text: copy.sameOutlet(next.connection.outlet) }
      : { kind: 'warning', text: copy.otherOutlet(old.connection.outlet, next.connection.outlet) },
  )
  if (old.connection.inlet === next.connection.inlet) {
    notes.push({ kind: 'ok', text: copy.sameInlet(next.connection.inlet) })
  }
  notes.push(
    old.voltage === next.voltage && old.frequency === next.frequency
      ? { kind: 'ok', text: copy.sameSupply(next.voltage, next.frequency) }
      : {
          kind: 'warning',
          text: copy.otherSupply(
            `${old.voltage} ${old.frequency} Hz`,
            `${next.voltage} ${next.frequency} Hz`,
          ),
        },
  )
  notes.push(
    next.power > old.power
      ? { kind: 'info', text: copy.morePower(kW(old.power), kW(next.power)) }
      : { kind: 'ok', text: copy.samePower(kW(next.power)) },
  )
  if (old.cableLength === next.cableLength) {
    notes.push({ kind: 'ok', text: copy.sameCable(next.cableLength) })
  }
  if (next.weight > old.weight) {
    notes.push({ kind: 'info', text: copy.heavier(next.weight - old.weight) })
  }
  if (old.exApproved && !next.exApproved) notes.push({ kind: 'warning', text: copy.exLost })
  // Product-specific notes (adapter kits, sensors) from the data.
  notes.push(...(replacementInfo(old)?.notes ?? []))
  // Warnings first, then information, then what simply fits.
  const order: FitNoteKind[] = ['warning', 'info', 'ok']
  return notes.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
}
