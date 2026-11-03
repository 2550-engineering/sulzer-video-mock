import { itemCadFiles, itemDocuments, itemDrawings, itemProduct } from '../data/projectFiles'
import type { CadFormat, Document, Project } from '../types'
import { chosenItems } from './projects'

/*
 * "Download project package": what goes into the ZIP for the options ticked,
 * per product and in total. Sizes add up the files' own (invented) sizes, so
 * the package always matches what the Files drawer shows.
 */

export type PackageSelection = {
  tender: boolean
  datasheets: boolean
  curves: boolean
  cad: boolean
  cadFormat: CadFormat
  bim: boolean
  bimFormat: CadFormat
  documents: boolean
  projectFiles: boolean
}

export const defaultPackageSelection: PackageSelection = {
  tender: true,
  datasheets: true,
  curves: true,
  cad: true,
  cadFormat: 'STEP',
  bim: true,
  bimFormat: 'Revit',
  documents: true,
  projectFiles: true,
}

export type PackagePart = { id: string; label: string; files: number; mb: number }

/** "2.4 MB" or "640 KB" → MB. */
export function parseMb(size: string) {
  const value = Number.parseFloat(size.replace(',', '.'))
  if (!Number.isFinite(value)) return 0
  return /kb/i.test(size) ? value / 1024 : value
}

const ofType = (documents: Document[], ...types: Document['type'][]) =>
  documents.filter((doc) => types.includes(doc.type))

/** The tender text document: one .docx for all products. */
const tenderMb = 0.1

export function projectPackage(project: Project, selection: PackageSelection) {
  const items: PackagePart[] = chosenItems(project.items).flatMap((item) => {
    const product = itemProduct(item)
    if (!product) return []
    const documents = itemDocuments(product)
    const cad = itemCadFiles(product)
    const sizes = [
      ...(selection.datasheets ? ofType(documents, 'Data sheet') : []),
      ...(selection.curves ? ofType(documents, 'Performance curves') : []),
      ...(selection.documents
        ? [
            ...ofType(
              documents,
              'Installation & operating instructions',
              'Declaration of conformity',
            ),
            ...itemDrawings(product),
          ]
        : []),
    ].map((doc) => parseMb(doc.size))
    for (const [on, format] of [
      [selection.cad, selection.cadFormat],
      [selection.bim, selection.bimFormat],
    ] as const) {
      const file = cad.find((f) => f.spec.format === format)
      if (on && file) sizes.push(file.sizeMb)
    }
    return [
      {
        id: item.id,
        label: `Pos. ${item.position} · ${product.name}`,
        files: sizes.length,
        mb: sizes.reduce((sum, size) => sum + size, 0),
      },
    ]
  })

  // The team's uploads; generated CAD and earlier packages are covered by the options above.
  const projectFiles = project.documents.filter((doc) => doc.kind === 'upload')
  const projectParts: PackagePart[] = []
  if (selection.tender && items.length > 0)
    projectParts.push({ id: 'tender', label: 'tender', files: 1, mb: tenderMb })
  if (selection.projectFiles && projectFiles.length > 0)
    projectParts.push({
      id: 'project-files',
      label: 'project-files',
      files: projectFiles.length,
      mb: projectFiles.reduce((sum, doc) => sum + parseMb(doc.size), 0),
    })

  const parts = [...items, ...projectParts]
  const files = parts.reduce((sum, part) => sum + part.files, 0)
  const totalMb = parts.reduce((sum, part) => sum + part.mb, 0)
  return {
    items,
    projectParts,
    files,
    /** Files the project team uploaded, which can go in. */
    projectFiles: projectFiles.length,
    /** Whole MB once over 10, like a download dialog. */
    size: totalMb >= 10 ? `${Math.round(totalMb)} MB` : `${totalMb.toFixed(1)} MB`,
    fileName: `${project.name} – package.zip`,
  }
}
