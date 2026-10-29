import { Download } from 'lucide-react'
import { productPage } from '../../data/catalogPages'
import type { Document, Product } from '../../types'
import { Modal } from '../Modal'
import { DocumentCover } from './DocumentCover'
import { DocumentPage } from './DocumentPage'

const copy = productPage.documentation

type DocumentPreviewProps = {
  open: boolean
  /** Kept after closing, so the dialog doesn't empty while it fades out. */
  document: Document | null
  product: Product
  onClose: () => void
  onDownload: (document: Document) => void
}

/**
 * Preview dialog: the file in an iframe when there is one, otherwise a page from
 * the document, otherwise a designed cover page.
 */
export function DocumentPreview({
  open,
  document,
  product,
  onClose,
  onDownload,
}: DocumentPreviewProps) {
  return (
    <Modal
      open={open && document !== null}
      title={document?.title ?? ''}
      closeLabel={copy.previewDialog.close}
      onClose={onClose}
      width="max-w-5xl"
    >
      {document && (
        <div className="grid md:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="bg-surface-sunken p-8">
            {document.href ? (
              <iframe
                src={document.href}
                title={document.title}
                className="h-[70vh] w-full rounded-sm border border-border bg-white"
              />
            ) : document.preview ? (
              <DocumentPage document={document} page={document.preview} />
            ) : (
              <DocumentCover document={document} product={product} />
            )}
          </div>
          <aside className="flex flex-col gap-5 border-l border-border p-7 text-sm">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                {document.type}
              </p>
              <p className="mt-2 text-lg leading-snug font-bold text-navy-900">{document.title}</p>
              <p className="mt-1 text-text-muted tabular-nums">
                {document.number}
                {document.revision && ` · ${copy.previewDialog.revision(document.revision)}`}
                {` · ${document.date}`}
              </p>
            </div>
            <div>
              <p className="font-semibold text-navy-900">{copy.previewDialog.languages}</p>
              <p className="mt-1 text-text-muted">{document.languages.join(', ')}</p>
            </div>
            <button
              type="button"
              onClick={() => onDownload(document)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-primary px-5 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
            >
              <Download className="size-4" />
              {copy.download} · {document.format} {document.size}
            </button>
            {!document.href && (
              <p className="text-xs text-text-muted">{copy.previewDialog.placeholderNote}</p>
            )}
          </aside>
        </div>
      )}
    </Modal>
  )
}
