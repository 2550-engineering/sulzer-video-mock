import { getArticle } from '../lib/articles'
import { getModel, partOwner } from '../lib/catalog'
import { getVariant } from '../lib/variants'
import type { Document, DocumentType, ProjectItem } from '../types'
import { cadFormats, cadSizeMb, type CadFormatSpec } from './cad'

/*
 * The files of a product in My projects (the Files drawer and the project
 * package): CAD and BIM in every format, drawings and documents. Built from
 * the item's sized variant or catalogue article, so every item has them.
 * Numbers, sizes and dates are invented: see docs/content-to-confirm.md.
 */

/** What the file lists need to know about a project item's product. */
export type ItemProduct = {
  name: string
  productId: string
  productNumber: string | null
  /** kg; drives CAD file sizes. */
  weight: number
}

export function itemProduct(item: ProjectItem): ItemProduct | undefined {
  const sized = getVariant(item.variantId)
  if (sized)
    return {
      name: sized.name,
      productId: sized.productId,
      productNumber: sized.productNumber,
      // Pump, motor and base frame: roughly 150 kg plus 12 kg per motor kW.
      weight: Math.round(150 + sized.motorPower * 12),
    }
  const owner = partOwner(item.variantId)
  const article = owner && getArticle(owner.productId, owner.id)
  if (!article) return undefined
  return {
    name: article.code,
    productId: article.productId,
    productNumber: article.productNumber,
    weight: getModel(article.modelId)?.weight ?? Math.round(150 + article.power * 12),
  }
}

/** A CAD or BIM file of an item in one format. */
export type ItemCadFile = { spec: CadFormatSpec; fileName: string; sizeMb: number }

export const mb = (value: number) => `${value.toFixed(1)} MB`

export function itemCadFiles(product: ItemProduct): ItemCadFile[] {
  const base = product.name.replaceAll('/', '-').replaceAll(' ', '_')
  return cadFormats.map((spec) => ({
    spec,
    fileName: `${base}.${spec.extension}`,
    sizeMb: cadSizeMb(spec, product.weight),
  }))
}

/** "AHLSTARA23-150-400" from "AHLSTAR A23-150-400/365 C1-SD-4P-F", for document numbers. */
const key = (name: string) => name.split(' ').slice(0, 2).join('').replace(/\/.*/, '').toUpperCase()

function document(
  product: ItemProduct,
  type: DocumentType,
  title: string,
  number: string,
  sizeMb: number,
  date = '2026-02-02',
  revision = 'B',
): Document {
  return {
    id: `${number}-${type}`,
    title,
    type,
    number,
    productIds: [product.productId],
    languages: ['English'],
    format: 'PDF',
    size: mb(sizeMb),
    date,
    revision,
    href: null,
  }
}

export function itemDrawings(product: ItemProduct): Document[] {
  const k = key(product.name)
  return [
    document(
      product,
      'Dimensional drawing',
      `Dimensional drawing, ${product.name}`,
      `DD-${k}-01`,
      0.6,
    ),
    document(product, 'Sectional drawing', `Sectional drawing, ${product.name}`, `SD-${k}-01`, 0.9),
    document(
      product,
      'Wiring diagram',
      `Wiring diagram, motor and sensors, ${product.name}`,
      `WD-${k}-01`,
      0.3,
      '2025-06-02',
      'C',
    ),
  ]
}

export function itemDocuments(product: ItemProduct): Document[] {
  const k = key(product.name)
  return [
    document(
      product,
      'Data sheet',
      `Data sheet, ${product.name}`,
      `DS-${k}`,
      1.1,
      '2026-10-02',
      'A',
    ),
    document(
      product,
      'Installation & operating instructions',
      `Installation and operating manual, ${product.name}`,
      `IOM-${k}-EN`,
      2.4,
    ),
    document(
      product,
      'Declaration of conformity',
      `EU declaration of conformity, ${product.name}`,
      `DoC-${k}`,
      0.3,
      '2026-01-12',
      'A',
    ),
    document(
      product,
      'Performance curves',
      `Performance curve at duty point, ${product.name}`,
      `PC-${k}`,
      0.8,
      '2026-10-02',
      'A',
    ),
  ]
}
