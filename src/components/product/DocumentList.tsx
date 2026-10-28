import { Box, Download, FileText } from 'lucide-react'
import { isModelFile } from '../../lib/catalog'
import type { Document } from '../../types'

/** List of downloadable documents: number, type and date above the title, file info and a download button. */
export function DocumentList({ documents }: { documents: Document[] }) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
      {documents.map((doc) => {
        const Icon = isModelFile(doc) ? Box : FileText
        return (
          <li key={doc.id} className="flex items-center gap-5 px-6 py-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-muted">
                {doc.number} <span className="text-text-subtle">/</span> {doc.type}
              </p>
              <p className="mt-1 font-semibold text-navy-900">{doc.title}</p>
            </div>
            <p className="hidden text-right text-sm text-text-muted md:block">
              {doc.language}
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
