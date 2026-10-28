import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** White pill under a page title, e.g. "Results for “pumps”". */
export function ContextChip({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <p className="mt-6 inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 text-sm text-text-muted">
      <Icon className="size-4 text-primary" />
      {children}
    </p>
  )
}
