import { Download, Eye } from 'lucide-react'
import { productPage } from '../../data/catalogPages'
import type { Document } from '../../types'
import { FileTypeIcon } from './FileTypeIcon'

const copy = productPage.documentation

type DocumentRowProps = {
  document: Document
  /** The language to show: the filtered one, or the document's first. */
  language: string
  checked: boolean
  onCheck: () => void
  onPreview: () => void
  onDownload: () => void
}

const action =
  'inline-flex h-9 items-center gap-1.5 rounded-pill border px-3.5 text-sm font-semibold transition-colors duration-150'

/** Documentation tab row: checkbox, file icon, title, language, size, date, Preview and Download. */
export function DocumentRow({
  document,
  language,
  checked,
  onCheck,
  onPreview,
  onDownload,
}: DocumentRowProps) {
  const otherLanguages = document.languages.length - 1
  return (
    <li
      className={`grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-x-5 px-5 py-4 transition-colors duration-150 md:grid-cols-[auto_auto_minmax(0,1fr)_9rem_5rem_6.5rem_auto] ${
        checked ? 'bg-primary-tint' : 'hover:bg-surface-subtle'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheck}
        aria-label={copy.select(document.title)}
        className="size-[18px] cursor-pointer accent-primary"
      />
      <FileTypeIcon format={document.format} />
      <div className="min-w-0">
        <button
          type="button"
          onClick={onPreview}
          className="text-left font-semibold text-navy-900 underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {document.title}
        </button>
        <p className="mt-0.5 text-xs text-text-muted tabular-nums">
          {document.number}
          {document.revision && ` · ${copy.previewDialog.revision(document.revision)}`}
        </p>
      </div>
      <p className="hidden text-sm text-text md:block">
        {language}
        {otherLanguages > 0 && (
          <span className="ml-1 text-text-subtle">{copy.moreLanguages(otherLanguages)}</span>
        )}
      </p>
      <p className="hidden text-sm text-text-muted tabular-nums md:block">{document.size}</p>
      <p className="hidden text-sm text-text-muted tabular-nums md:block">{document.date}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPreview}
          className={`${action} border-border-strong text-navy-900 hover:border-primary hover:text-primary`}
        >
          <Eye className="size-4" />
          {copy.preview}
        </button>
        <button
          type="button"
          onClick={onDownload}
          className={`${action} border-primary text-primary hover:bg-primary hover:text-white`}
        >
          <Download className="size-4" />
          {copy.download}
        </button>
      </div>
    </li>
  )
}
