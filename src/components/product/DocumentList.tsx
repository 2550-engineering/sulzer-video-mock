import { Download } from 'lucide-react'
import { Link } from 'react-router'
import { getProduct, productPath } from '../../lib/catalog'
import type { Document } from '../../types'
import { FileTypeIcon } from './FileTypeIcon'

type DocumentListProps = {
  documents: Document[]
  /**
   * Search results: show the products each document belongs to and link the
   * title to the first product's Documentation tab.
   */
  showProducts?: boolean
}

/** List of downloadable documents: file-type icon, number and type, title, language and a download button. */
export function DocumentList({ documents, showProducts = false }: DocumentListProps) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
      {documents.map((doc) => {
        const products = doc.productIds.map(getProduct).filter((p) => p !== undefined)
        const moreLanguages = doc.languages.length - 1
        return (
          <li key={doc.id} className="flex items-center gap-5 px-6 py-5">
            <FileTypeIcon format={doc.format} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-muted">
                {doc.number} <span className="text-text-subtle">/</span> {doc.type}
              </p>
              {showProducts && products[0] ? (
                <Link
                  to={`${productPath(products[0])}#documentation`}
                  className="mt-1 block font-semibold text-navy-900 underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  {doc.title}
                </Link>
              ) : (
                <p className="mt-1 font-semibold text-navy-900">{doc.title}</p>
              )}
              {showProducts && (
                <p className="mt-1 text-sm text-text-muted">
                  {products.map((product) => product.name).join(', ')}
                </p>
              )}
            </div>
            <p className="hidden text-right text-sm text-text-muted md:block">
              {doc.languages[0]}
              {moreLanguages > 0 && <span className="text-text-subtle"> +{moreLanguages}</span>}
              <span className="block text-xs text-text-subtle tabular-nums">{doc.date}</span>
            </p>
            <button
              type="button"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-pill border border-border-strong px-4 text-sm font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
            >
              <Download className="size-4" />
              {doc.format} · {doc.size}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
