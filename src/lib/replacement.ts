import { ahlstarReplacements } from '../data/models/ahlstar'
import { replacementPage } from '../data/replacementPage'
import { xfpReplacements } from '../data/xfp'
import type { FitNoteKind, ResultArticle } from '../types'
import { articlesFor } from './articles'
import { getModel, getProductVariant } from './catalog'
import { groupThousands } from './format'
import { articleSpecGroups, variantSpecs } from './variantSpecs'

/*
 * Product replacement: finding the old product (an XFP variant or an AHLSTAR
 * model), comparing it with its successor.
 */

const compact = (text: string) => text.toLowerCase().replace(/\s+/g, '')

/** Products whose variants or models can be looked up for a replacement. */
const replaceableProducts = ['xfp', 'ahlstar']
const allArticles = () => replaceableProducts.flatMap(articlesFor)

/** A variant or model by product number, model code or id, as typed (spaces ignored). */
export function findArticle(query: string) {
  const q = compact(query)
  if (!q) return undefined
  return allArticles().find(
    (article) => article.productNumber === q || compact(article.code) === q || article.id === q,
  )
}

/** Discontinued variants and models, most recently discontinued first. */
export const discontinuedArticles = () =>
  allArticles()
    .filter((article) => article.discontinued)
    .sort((a, b) => b.discontinued!.year - a.discontinued!.year)

export const replacementInfo = (article: ResultArticle) =>
  xfpReplacements[article.id] ?? ahlstarReplacements[article.id]

const kW = (power: number) => `${groupThousands(power, power % 1 ? 1 : 0)} kW`

/** Weight and cable length come from the variant or model behind the article. */
function details(article: ResultArticle) {
  const variant = getProductVariant(article.id)
  if (variant) return { weight: variant.weight, cableLength: variant.cableLength }
  return { weight: getModel(article.id)?.weight ?? 0, cableLength: undefined }
}

/** Spec rows of an article: the variant's search specs, or the model's spec groups. */
function specRows(article: ResultArticle) {
  const variant = getProductVariant(article.id)
  return variant ? variantSpecs(variant) : articleSpecGroups(article).flatMap((group) => group.rows)
}

/** Key specs side by side, marking the rows that differ. */
export function comparisonRows(old: ResultArticle, next: ResultArticle) {
  const rated = (p: { flow: number; head: number }) =>
    replacementPage.compare.ratedValue(
      groupThousands(p.flow),
      groupThousands(p.head, p.head % 1 ? 1 : 0),
    )
  const nextSpecs = new Map(specRows(next).map((row) => [row.label, row.value]))
  const rows = [
    {
      label: replacementPage.compare.ratedPoint,
      old: rated(old.rated),
      next: rated(next.rated),
    },
    ...specRows(old).map((spec) => ({
      label: spec.label,
      old: spec.value,
      next: nextSpecs.get(spec.label) ?? '–',
    })),
  ]
  return rows.map((row) => ({ ...row, changed: row.old !== row.next }))
}

/** How well the successor fits where the old product was installed. */
export function fitNotes(old: ResultArticle, next: ResultArticle) {
  const copy = replacementPage.notes
  const notes: { kind: FitNoteKind; text: string }[] = []
  notes.push(
    old.outlet === next.outlet
      ? { kind: 'ok', text: copy.sameOutlet(next.outlet) }
      : { kind: 'warning', text: copy.otherOutlet(old.outlet, next.outlet) },
  )
  if (old.inlet === next.inlet) notes.push({ kind: 'ok', text: copy.sameInlet(next.inlet) })
  notes.push(
    old.supply === next.supply
      ? { kind: 'ok', text: copy.sameSupply(next.supply) }
      : { kind: 'warning', text: copy.otherSupply(old.supply, next.supply) },
  )
  notes.push(
    next.power > old.power
      ? { kind: 'info', text: copy.morePower(kW(old.power), kW(next.power)) }
      : { kind: 'ok', text: copy.samePower(kW(next.power)) },
  )
  const before = details(old)
  const after = details(next)
  if (before.cableLength !== undefined && before.cableLength === after.cableLength) {
    notes.push({ kind: 'ok', text: copy.sameCable(after.cableLength) })
  }
  if (after.weight > before.weight) {
    notes.push({ kind: 'info', text: copy.heavier(after.weight - before.weight) })
  }
  if (old.exApproved && !next.exApproved) notes.push({ kind: 'warning', text: copy.exLost })
  // Product-specific notes (adapter kits, sensors) from the data.
  notes.push(...(replacementInfo(old)?.notes ?? []))
  // Warnings first, then information, then what simply fits.
  const order: FitNoteKind[] = ['warning', 'info', 'ok']
  return notes.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
}
