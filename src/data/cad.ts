import { products } from '../config/demo'
import type { CadFile, CadFormat, CadKind, ImageSource, ProductModel } from '../types'
import { productModels } from './productModels'

/*
 * BIM and CAD downloads on the product BIM tab: every format for every model,
 * generated from the model list so files and models never drift apart.
 * Versions, sizes and dates are invented: see docs/content-to-confirm.md.
 */

export type CadFormatSpec = {
  format: CadFormat
  /** Shown in the Format select, e.g. "Revit (RFA)". */
  label: string
  kind: CadKind
  version: string
  lod?: string
  extension: string
  /** File size in MB for a 100 kg pump; scales with the pump's weight. */
  baseSize: number
}

export const cadFormats: CadFormatSpec[] = [
  {
    format: 'Revit',
    label: 'Revit (RFA)',
    kind: 'BIM object',
    version: 'Revit 2024',
    lod: 'LOD 300',
    extension: 'rfa',
    baseSize: 2.4,
  },
  {
    format: 'IFC',
    label: 'IFC',
    kind: 'BIM object',
    version: 'IFC 4',
    lod: 'LOD 300',
    extension: 'ifc',
    baseSize: 3.1,
  },
  {
    format: 'STEP',
    label: 'STEP',
    kind: '3D model',
    version: 'AP242',
    extension: 'stp',
    baseSize: 4.6,
  },
  {
    format: 'DWG',
    label: 'DWG',
    kind: '2D drawing',
    version: 'AutoCAD 2018',
    extension: 'dwg',
    baseSize: 0.8,
  },
  {
    format: 'DXF',
    label: 'DXF',
    kind: '2D drawing',
    version: 'AutoCAD 2018',
    extension: 'dxf',
    baseSize: 1.1,
  },
  {
    format: 'PDF',
    label: 'PDF dimensional drawing',
    kind: '2D drawing',
    version: 'Dimensional drawing',
    extension: 'pdf',
    baseSize: 0.4,
  },
]

function cadFile(model: ProductModel, spec: CadFormatSpec): CadFile {
  // Heavier pumps have more geometry; keep it gentle so sizes stay realistic.
  const size = spec.baseSize * (1 + Math.log10(model.weight / 100 + 1))
  return {
    id: `${model.id}-${spec.extension}`,
    productId: model.productId,
    modelId: model.id,
    kind: spec.kind,
    format: spec.format,
    version: spec.version,
    lod: spec.lod,
    fileName: `${model.name.replaceAll(' ', '_')}_${model.frequency}Hz.${spec.extension}`,
    size: `${size.toFixed(1)} MB`,
    date: '2026-02-02',
  }
}

export const cadFiles: CadFile[] = productModels.flatMap((model) =>
  cadFormats.map((spec) => cadFile(model, spec)),
)

/** 3D preview on the BIM tab, per product id. */
export const cadPreviews: Record<string, ImageSource> = {
  ahlstar: {
    src: '/images/products/ahlstar-bim-preview.png',
    alt: `Grey-shaded 3D CAD render of an ${products.ahlstar} pump on its base frame, isometric view`,
  },
}
