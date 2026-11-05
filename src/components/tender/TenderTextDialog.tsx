import { Copy, FileDown, Printer } from 'lucide-react'
import { useId, useState } from 'react'
import { demoNotice } from '../../config/demo'
import { tenderDialog as copy } from '../../data/tenderTexts'
import { tenderDocx } from '../../lib/docx'
import { downloadBlob } from '../../lib/download'
import { tenderPlainText, tenderText } from '../../lib/tenderText'
import { useToast } from '../../toast/useToast'
import type { TenderLanguage, TenderOptions, TenderSubject } from '../../types'
import { Modal } from '../Modal'
import { SegmentedToggle } from '../SegmentedToggle'
import { TenderDocumentView } from './TenderDocumentView'
import { TenderPrintView } from './TenderPrintView'

export type TenderRequest = {
  /** Shown in the dialog title, e.g. the model or the project name. */
  label: string
  /** Document title inside the text. */
  documentTitle: string
  subtitle?: string
  subjects: TenderSubject[]
  /** File name without extension. */
  fileName: string
}

type TenderTextDialogProps = {
  open: boolean
  request: TenderRequest | null
  onClose: () => void
}

const languages: TenderLanguage[] = ['en', 'sv', 'de']

/**
 * Tender text dialog: options on the left (language, detail level, duty
 * point, "or equal" clause), the formatted text on the right, and Copy,
 * Download .docx (a real Word file) and Download PDF (print view).
 * Remount (via `key`) per request to start from the default options.
 */
export function TenderTextDialog({ open, request, onClose }: TenderTextDialogProps) {
  const ids = useId()
  const showToast = useToast()
  const hasDuty = request?.subjects.some((s) => s.duty || s.application) ?? false
  const [options, setOptions] = useState<TenderOptions>({
    language: 'en',
    detail: 'full',
    includeDuty: true,
    orEqual: true,
  })
  if (!request) return null

  const document = tenderText(request.subjects, options, request.documentTitle, request.subtitle)
  const set = <K extends keyof TenderOptions>(key: K, value: TenderOptions[K]) =>
    setOptions((current) => ({ ...current, [key]: value }))

  function copyText() {
    navigator.clipboard?.writeText(tenderPlainText(document)).catch(() => {})
    showToast({ message: copy.copied, detail: copy.copiedDetail })
  }

  function downloadDocx() {
    const fileName = `${request!.fileName}.docx`
    downloadBlob(fileName, tenderDocx(document))
    showToast({ message: copy.downloaded, detail: fileName })
  }

  const button =
    'inline-flex h-10 items-center gap-2 rounded-pill px-4 text-sm font-semibold transition-colors'

  return (
    <Modal
      open={open}
      title={copy.title(request.label)}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-6xl"
    >
      <div className="grid md:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="space-y-6 border-b border-border bg-surface-subtle px-6 py-6 md:border-r md:border-b-0">
          <p className="text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
            {copy.options}
          </p>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-navy-900">{copy.language}</legend>
            <div className="space-y-1.5 text-[15px]">
              {languages.map((language) => {
                const available = language === 'en'
                return (
                  <label
                    key={language}
                    className={`flex items-center gap-2.5 ${available ? 'cursor-pointer' : 'cursor-not-allowed text-text-subtle'}`}
                  >
                    <input
                      type="radio"
                      name={`${ids}-language`}
                      checked={options.language === language}
                      disabled={!available}
                      onChange={() => set('language', language)}
                      className="size-4 accent-primary"
                    />
                    {copy.languages[language]}
                    {!available && (
                      <span className="rounded-pill bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold text-text-muted">
                        {demoNotice.badge}
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <SegmentedToggle<TenderOptions['detail']>
            label={copy.detail}
            value={options.detail}
            options={[
              { value: 'short', label: copy.short },
              { value: 'full', label: copy.full },
            ]}
            onChange={(value) => set('detail', value)}
          />

          <div className="space-y-2 text-[15px]">
            <label
              className={`flex items-start gap-2.5 ${hasDuty ? 'cursor-pointer' : 'text-text-subtle'}`}
            >
              <input
                type="checkbox"
                checked={options.includeDuty}
                onChange={() => set('includeDuty', !options.includeDuty)}
                className="mt-1 size-[18px] shrink-0 accent-primary"
              />
              {copy.includeDuty}
            </label>
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={options.orEqual}
                onChange={() => set('orEqual', !options.orEqual)}
                className="mt-1 size-[18px] shrink-0 accent-primary"
              />
              {copy.orEqual}
            </label>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-6 py-3">
            <button
              type="button"
              onClick={copyText}
              className={`${button} bg-primary text-white hover:bg-primary-hover`}
            >
              <Copy className="size-4" />
              {copy.copy}
            </button>
            <button
              type="button"
              onClick={downloadDocx}
              className={`${button} border border-primary text-primary hover:bg-primary-tint`}
            >
              <FileDown className="size-4" />
              {copy.docx}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              title={copy.pdfHint}
              className={`${button} border border-primary text-primary hover:bg-primary-tint`}
            >
              <Printer className="size-4" />
              {copy.pdf}
            </button>
          </div>
          <div className="max-h-[62vh] overflow-y-auto px-8 py-6">
            <TenderDocumentView document={document} />
          </div>
        </div>
      </div>
      {open && <TenderPrintView document={document} />}
    </Modal>
  )
}
