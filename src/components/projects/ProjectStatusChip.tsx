import type { ProjectStatus } from '../../types'

const tones: Record<ProjectStatus, string> = {
  'Concept design': 'bg-surface-sunken text-navy-700',
  'Detailed design': 'bg-primary-tint text-primary',
  Tender: 'bg-warning-tint text-warning-strong',
  Ordered: 'bg-success-tint text-success-strong',
  Archived: 'bg-surface-muted text-text-muted',
}

export function ProjectStatusChip({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${tones[status]}`}
    >
      {status}
    </span>
  )
}
