import { Check, Copy, Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { tenderText as copy } from '../../data/tenderTexts'
import { copyText, downloadFile } from '../../lib/download'
import { tenderPlainText, tenderRtf, type TenderDocument } from '../../lib/tenderText'
import { Modal } from '../Modal'
import { SelectField } from '../SelectField'

type TenderTextDialogProps = {
  open: boolean
  document: TenderDocument
  onClose: () => void
}

const outlined =
  'inline-flex h-10 items-center gap-2 rounded-pill border border-primary px-4 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-primary-tint'

/**
 * "Tender text": the specification as a formatted page, with a language selector
 * (English only for now), Copy (plain text) and Download (RTF, opens in Word).
 */
export function TenderTextDialog({ open, document: doc, onClose }: TenderTextDialogProps) {
  const [language, setLanguage] = useState('en')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copyToClipboard() {
    if (await copyText(tenderPlainText(doc))) setCopied(true)
  }

  return (
    <Modal
      open={open}
      title={copy.dialogTitle(doc.title)}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-3xl"
    >
      <div className="sticky top-0 z-10 flex flex-wrap items-end justify-between gap-4 border-b border-border bg-white px-7 py-4">
        <div className="w-56">
          <SelectField
            label={copy.language}
            value={language}
            options={copy.languages}
            onChange={setLanguage}
            layout="stacked"
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={copyToClipboard} className={outlined}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? copy.copied : copy.copy}
          </button>
          <button
            type="button"
            onClick={() =>
              downloadFile(copy.fileName(doc.title), tenderRtf([doc]), 'application/rtf')
            }
            className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            <Download className="size-4" />
            {copy.download}
          </button>
        </div>
      </div>

      <div className="bg-surface-muted px-7 py-6">
        <article className="rounded-md border border-border bg-white px-9 py-8 shadow-card">
          <p className="text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
            {copy.heading}
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-brand">{doc.title}</h3>
          {doc.position && <p className="mt-1 text-sm text-navy-900">{doc.position}</p>}
          <p className="mt-0.5 text-sm text-text-muted tabular-nums">{doc.reference}</p>

          <ol className="mt-6 space-y-6">
            {doc.sections.map((section, i) => (
              <li key={section.heading}>
                <h4 className="font-semibold text-navy-900">
                  <span className="mr-2 text-primary tabular-nums">{i + 1}.</span>
                  {section.heading}
                </h4>
                {section.paragraphs && (
                  <ul
                    className={`mt-2 space-y-1.5 text-[15px] leading-relaxed text-text ${
                      section.paragraphs.length > 1 ? 'list-disc pl-5 marker:text-text-subtle' : ''
                    }`}
                  >
                    {section.paragraphs.map((paragraph) => (
                      <li key={paragraph}>{paragraph}</li>
                    ))}
                  </ul>
                )}
                {section.rows && (
                  <dl className="mt-2 divide-y divide-border border-y border-border text-[15px]">
                    {section.rows.map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[15rem_minmax(0,1fr)] gap-4 py-2">
                        <dt className="text-text-muted">{label}</dt>
                        <dd className="font-medium text-navy-900 tabular-nums">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ol>
        </article>
        <p className="mt-3 text-xs text-text-muted">{copy.note}</p>
      </div>
    </Modal>
  )
}
