import { Download, Eye } from 'lucide-react'
import { useState } from 'react'
import { itemCadFiles, itemDocuments, itemDrawings, itemProduct, mb } from '../../data/projectFiles'
import { myProjectsPage } from '../../data/projectPages'
import { useDocumentDownload } from '../../hooks/useDocumentDownload'
import { useFileGeneration } from '../../hooks/useFileGeneration'
import { getProduct } from '../../lib/catalog'
import { useProjects } from '../../projects/useProjects'
import { useToast } from '../../toast/useToast'
import type { CadFormat, Document, Project, ProjectItem } from '../../types'
import { CadFormatCard } from '../product/CadFormatCard'
import { DocumentCover } from '../product/DocumentCover'
import { FileGenerator } from '../product/FileGenerator'
import { ProjectFileRow } from './ProjectFileRow'

const copy = myProjectsPage.files

const section = 'border-t border-border pt-7 first:border-t-0 first:pt-0'
const heading = 'text-lg font-bold tracking-tight text-navy-900'
const iconButton =
  'flex size-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-tint'

/** The drawer's content for one item; remounted per item, so choices start fresh. */
export function ItemFiles({ project, item }: { project: Project; item: ProjectItem }) {
  const showToast = useToast()
  const download = useDocumentDownload()
  const { addDocument } = useProjects()
  const product = itemProduct(item)!
  const catalogProduct = getProduct(product.productId)
  const cadFiles = itemCadFiles(product)
  const drawings = itemDrawings(product)
  const documents = itemDocuments(product)

  const [format, setFormat] = useState<CadFormat>('Revit')
  const [previewId, setPreviewId] = useState(drawings[0].id)
  const generation = useFileGeneration(`${item.id}:${format}`)
  const file = cadFiles.find((f) => f.spec.format === format) ?? cadFiles[0]
  const preview = drawings.find((d) => d.id === previewId) ?? drawings[0]

  function downloadCad() {
    showToast({ message: copy.downloadStarted(file.fileName), detail: copy.savedToProject })
    addDocument(project.id, {
      kind: file.spec.kind === 'BIM object' ? 'bim' : 'cad',
      title: file.fileName,
      format: file.spec.extension.toUpperCase(),
      size: mb(file.sizeMb),
      itemId: item.id,
    })
  }

  const meta = (doc: Document) =>
    [doc.number, doc.revision && copy.revision(doc.revision), doc.size].filter(Boolean).join(' · ')

  return (
    <div className="space-y-8">
      <section className={section}>
        <h3 className={heading}>{copy.sections.cad}</h3>
        <p className="mt-1 text-sm text-text-muted">{copy.cadIntro}</p>
        <div
          role="radiogroup"
          aria-label={copy.sections.cad}
          className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {cadFiles.map((f) => (
            <CadFormatCard
              key={f.spec.format}
              spec={f.spec}
              selected={f.spec.format === format}
              onSelect={() => setFormat(f.spec.format)}
            />
          ))}
        </div>
        <div className="mt-5">
          <FileGenerator
            generation={generation}
            copy={copy}
            fileName={file.fileName}
            detail={`${file.spec.label} · ${mb(file.sizeMb)}`}
            onDownload={downloadCad}
          />
        </div>
      </section>

      <section className={section}>
        <h3 className={heading}>{copy.sections.drawings}</h3>
        <div className="mt-4 grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_14rem]">
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
            {drawings.map((doc) => (
              <ProjectFileRow
                key={doc.id}
                format={doc.format}
                title={doc.type}
                meta={meta(doc)}
                active={doc.id === preview.id}
              >
                <button
                  type="button"
                  onClick={() => setPreviewId(doc.id)}
                  aria-label={`${copy.preview}: ${doc.title}`}
                  aria-pressed={doc.id === preview.id}
                  className={iconButton}
                >
                  <Eye className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => download(doc)}
                  aria-label={`${copy.download}: ${doc.title}`}
                  className={iconButton}
                >
                  <Download className="size-4" />
                </button>
              </ProjectFileRow>
            ))}
          </ul>
          <figure key={preview.id} className="animate-fade-in">
            <DocumentCover document={preview} product={catalogProduct} />
            <figcaption className="mt-2 text-center text-xs text-text-muted">
              {copy.previewing}: {preview.type}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={section}>
        <h3 className={heading}>{copy.sections.documents}</h3>
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
          {documents.map((doc) => (
            <ProjectFileRow key={doc.id} format={doc.format} title={doc.title} meta={meta(doc)}>
              <button
                type="button"
                onClick={() => download(doc)}
                aria-label={`${copy.download}: ${doc.title}`}
                className={iconButton}
              >
                <Download className="size-4" />
              </button>
            </ProjectFileRow>
          ))}
        </ul>
      </section>
    </div>
  )
}
