import { createPortal } from 'react-dom'
import type { TenderDocument } from '../../types'
import { SulzerLogo } from '../SulzerLogo'
import { TenderDocumentView } from './TenderDocumentView'

/**
 * The tender text as printed ("Download PDF"): mounted in <body> while the
 * dialog is open, hidden on screen; the print style shows only it.
 */
export function TenderPrintView({ document }: { document: TenderDocument }) {
  return createPortal(
    <div className="tender-print bg-white px-[14mm] py-[12mm]">
      <header className="mb-6 flex items-end justify-between border-b-2 border-navy-900 pb-3">
        <SulzerLogo className="h-6" />
      </header>
      <TenderDocumentView document={document} />
    </div>,
    window.document.body,
  )
}
