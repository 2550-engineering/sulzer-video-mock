import type { Document, ImageSource } from '../../types'
import { SmartImage } from '../SmartImage'
import { SulzerLogo } from '../SulzerLogo'

/** One page of a document that has no file yet: Sulzer header, the page image, then number and date. */
export function DocumentPage({ document, page }: { document: Document; page: ImageSource }) {
  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-sm bg-white shadow-[0_24px_48px_-24px_rgba(12,28,46,0.45)] ring-1 ring-navy-900/10">
      <div className="flex items-center justify-between border-b border-border px-7 py-4">
        <SulzerLogo className="h-4" />
        <span className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
          {document.type}
        </span>
      </div>
      <div className="px-7 pt-6 pb-4">
        <SmartImage src={page.src} alt={page.alt} aspect="4 / 3" fit="contain" />
      </div>
      <p className="flex justify-between px-7 pb-4 text-[10px] text-text-muted tabular-nums">
        <span>{document.number}</span>
        <span>{document.date.slice(0, 7)}</span>
      </p>
    </div>
  )
}
