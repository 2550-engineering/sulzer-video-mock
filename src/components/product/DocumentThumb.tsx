import type { Document } from '../../types'
import { SulzerLogo } from '../SulzerLogo'

/**
 * A small sheet of paper standing for a document: navy band with the Sulzer
 * logo and the document type, grey text lines and the format. For cards where
 * the full DocumentCover would be too small to read.
 */
export function DocumentThumb({ document }: { document: Document }) {
  return (
    <div className="flex aspect-[1/1.414] w-full flex-col overflow-hidden rounded-sm bg-white shadow-[0_18px_36px_-18px_rgba(12,28,46,0.45)] ring-1 ring-navy-900/10">
      <div className="bg-linear-135 from-brand to-navy-900 px-4 pt-4 pb-5">
        <SulzerLogo variant="white" className="h-3" />
        <p className="mt-6 text-[9px] font-semibold tracking-[0.14em] text-accent-cyan uppercase">
          {document.type}
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug font-bold text-white">
          {document.title}
        </p>
      </div>
      <div aria-hidden className="flex-1 space-y-2 px-4 pt-4">
        {[100, 92, 96, 70, 88, 60].map((width, i) => (
          <span
            key={i}
            className="block h-1 rounded-full bg-surface-sunken"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
      <p className="px-4 pb-3 text-right text-[9px] font-bold text-primary">
        {document.format} · {document.number}
      </p>
    </div>
  )
}
