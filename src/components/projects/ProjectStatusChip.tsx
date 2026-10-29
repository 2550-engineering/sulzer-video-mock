import type { ProjectStatus } from '../../types'

const tones: Record<ProjectStatus, string> = {
  Draft: 'bg-surface-sunken text-navy-700',
  'In progress': 'bg-primary-tint text-primary',
  Quoted: 'bg-success-tint text-success-strong',
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
