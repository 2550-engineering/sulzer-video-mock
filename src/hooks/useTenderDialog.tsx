import { useState } from 'react'
import { TenderTextDialog, type TenderRequest } from '../components/tender/TenderTextDialog'

/** "AHLSTAR A23-150-400/365 C1-SD-4P-F" → "Tender_text_AHLSTAR_A23-150-400_365_C1-SD-4P-F". */
export const tenderFileName = (label: string) =>
  `Tender_text_${label.replace(/[^A-Za-z0-9.-]+/g, '_').replace(/_+$/, '')}`

/**
 * The tender text dialog for a page: `openTender(request)` opens it, and
 * `tenderDialog` is the element to render. Each opening starts from the
 * default options.
 */
export function useTenderDialog() {
  const [state, setState] = useState<{
    request: TenderRequest | null
    open: boolean
    session: number
  }>({
    request: null,
    open: false,
    session: 0,
  })
  return {
    openTender: (request: TenderRequest) =>
      setState((current) => ({ request, open: true, session: current.session + 1 })),
    tenderDialog: (
      <TenderTextDialog
        key={state.session}
        open={state.open}
        request={state.request}
        onClose={() => setState((current) => ({ ...current, open: false }))}
      />
    ),
  }
}
