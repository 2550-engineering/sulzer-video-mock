import { Info } from 'lucide-react'
import { demoNotice } from '../config/demo'

/** Compact card for a tab whose content is not part of the demo. */
export function TabDemoNotice() {
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-6 rounded-lg border border-border bg-surface-muted px-10 py-12">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
        <Info className="size-6" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold tracking-tight text-navy-900">{demoNotice.title}</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
          {demoNotice.text}
        </p>
      </div>
    </div>
  )
}
