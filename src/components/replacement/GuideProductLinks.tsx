import { Download } from 'lucide-react'
import { replacementGuidePage } from '../../data/replacementGuidePage'
import { SulzerLogo } from '../SulzerLogo'

const copy = replacementGuidePage.replacement

const outlined =
  'inline-flex h-10 items-center gap-1.5 rounded-md border border-primary bg-white px-3.5 text-[13px] font-semibold whitespace-nowrap text-primary transition-colors duration-150 hover:bg-primary-tint'

/** Product sheet, Sulzer webstore and GC Gruppe: the guide's links, in a new tab. */
export function GuideProductLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      <a href={copy.links.productSheet} target="_blank" rel="noopener" className={outlined}>
        <Download aria-hidden className="size-3.5" strokeWidth={2.25} />
        {copy.productSheet}
      </a>
      <a
        href={copy.links.webstore}
        target="_blank"
        rel="noopener"
        aria-label={copy.webstoreLabel}
        className={outlined}
      >
        <SulzerLogo className="h-3" />
        {copy.webstore}
      </a>
      {/* GC Gruppe's own partner colours (yellow on red), the same as Sulzer's accent tokens. */}
      <a
        href={copy.links.partner}
        target="_blank"
        rel="noopener"
        className="inline-flex h-10 items-center rounded-md bg-accent-yellow px-3.5 text-[13px] font-bold tracking-[0.01em] whitespace-nowrap text-accent-red transition-[filter] duration-150 hover:brightness-95"
      >
        {copy.partner}
      </a>
    </div>
  )
}
