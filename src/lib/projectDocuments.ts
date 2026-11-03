import { myProjectsPage } from '../data/projectPages'
import type { Project } from '../types'
import { articleById } from './articles'
import { getVariant } from './variants'

const copy = myProjectsPage.documents

/** One file in the project's Documents list. */
export type ProjectDocumentRow = {
  id: string
  title: string
  format: string
  size: string
  by: string
  at: string
  /** "Pos. 10" for files of one product. */
  position?: number
  generated: boolean
}

/**
 * The project's documents: files added by the team (uploads, generated CAD,
 * packages, reports; newest first), then the files mySulzer keeps up to date
 * (summary, life cycle cost report, performance curves, data sheets).
 */
export function projectDocumentRows(project: Project): ProjectDocumentRow[] {
  const memberName = (id: string) => project.members.find((m) => m.id === id)?.name ?? id
  const position = (itemId?: string) => project.items.find((item) => item.id === itemId)?.position
  const generated = (title: string, format: string, size: string): ProjectDocumentRow => ({
    id: `generated-${title}`,
    title,
    format,
    size,
    by: copy.generatedBy,
    at: copy.generatedAt,
    generated: true,
  })

  return [
    ...[...project.documents].reverse().map((doc) => ({
      id: doc.id,
      title: doc.title,
      format: doc.format,
      size: doc.size,
      by: memberName(doc.addedBy),
      at: doc.at,
      position: position(doc.itemId),
      generated: false,
    })),
    ...(project.items.length > 0
      ? [
          generated(copy.projectSummary, 'PDF', '0.6 MB'),
          generated(copy.lccReport, 'XLSX', '0.2 MB'),
        ]
      : []),
    ...project.sizings
      .filter((sizing) => sizing.includeCurves)
      .map((sizing) => generated(copy.curves(sizing.name), 'PDF', '0.8 MB')),
    ...[...new Set(project.items.map((item) => item.variantId))].map((id) =>
      generated(
        copy.dataSheet(getVariant(id)?.name ?? articleById(id)?.code ?? id),
        'PDF',
        '1.1 MB',
      ),
    ),
  ]
}
