import { Copy, FileDown } from 'lucide-react'
import { configuredPage } from '../../data/configuredPages'
import { tenderDialog as dialogCopy } from '../../data/tenderTexts'
import { tenderDocx } from '../../lib/docx'
import { downloadBlob } from '../../lib/download'
import { tenderPlainText, tenderText } from '../../lib/tenderText'
import { useToast } from '../../toast/useToast'
import type { TenderSubject } from '../../types'
import { TabHeading } from '../TabHeading'
import { TenderDocumentView } from '../tender/TenderDocumentView'

type TenderTextTabProps = {
  subject: TenderSubject
  documentTitle: string
  subtitle?: string
  /** File name without extension. */
  fileName: string
  /** Project position tag, for the intro. */
  position?: string
}

/** The full tender text inline, with Copy and Download (.docx). */
export function TenderTextTab({
  subject,
  documentTitle,
  subtitle,
  fileName,
  position,
}: TenderTextTabProps) {
  const showToast = useToast()
  const document = tenderText(
    [subject],
    { language: 'en', detail: 'full', includeDuty: true, orEqual: true },
    documentTitle,
    subtitle,
  )

  function copyText() {
    navigator.clipboard?.writeText(tenderPlainText(document)).catch(() => {})
    showToast({ message: dialogCopy.copied, detail: dialogCopy.copiedDetail })
  }

  function download() {
    const name = `${fileName}.docx`
    downloadBlob(name, tenderDocx(document))
    showToast({ message: dialogCopy.downloaded, detail: name })
  }

  const button =
    'inline-flex h-11 items-center gap-2 rounded-pill px-5 text-sm font-semibold transition-colors'

  return (
    <>
      <TabHeading title={configuredPage.tender.title}>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyText}
            className={`${button} bg-primary text-white shadow-raised hover:bg-primary-hover`}
          >
            <Copy className="size-4" />
            {dialogCopy.copy}
          </button>
          <button
            type="button"
            onClick={download}
            className={`${button} border-2 border-primary text-primary hover:bg-primary-tint`}
          >
            <FileDown className="size-4" />
            {dialogCopy.docx}
          </button>
        </div>
      </TabHeading>
      <p className="mt-3 max-w-2xl text-text-muted">
        {position ? configuredPage.tender.introProject(position) : configuredPage.tender.intro}
      </p>
      <div className="mt-8 max-w-4xl rounded-lg border border-border bg-white px-8 py-7 shadow-card">
        <TenderDocumentView document={document} />
      </div>
    </>
  )
}
