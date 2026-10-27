import { digitalOfferings, quickLinks } from '../config/navigation'
import { popoverClasses } from '../lib/popover'
import { QuickLinkSection } from './QuickLinkSection'

type QuickLinksPanelProps = {
  open: boolean
  onNavigate: () => void
}

/** Dropdown under the Quick links button. Render inside a `relative` wrapper around the trigger. */
export function QuickLinksPanel({ open, onNavigate }: QuickLinksPanelProps) {
  return (
    <>
      {/* Caret, centred under the trigger. */}
      <span
        aria-hidden
        className={`absolute top-[calc(100%+17px)] left-1/2 z-10 size-3.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-white ${popoverClasses(open)}`}
      />
      <div
        id="quick-links-panel"
        inert={!open}
        className={`absolute top-[calc(100%+24px)] right-0 w-[392px] rounded-lg bg-white p-6 text-text shadow-card ring-1 ring-navy-900/5 ${popoverClasses(open)}`}
      >
        <QuickLinkSection title="Quick links" links={quickLinks} onNavigate={onNavigate} />
        <div className="my-5 border-t border-border" />
        <QuickLinkSection
          title="Digital offerings"
          links={digitalOfferings}
          onNavigate={onNavigate}
        />
      </div>
    </>
  )
}
