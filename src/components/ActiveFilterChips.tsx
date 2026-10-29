import { X } from 'lucide-react'
import type { FilterGroup } from '../types'

type ActiveFilterChipsProps = {
  groups: FilterGroup[]
  onRemove: (groupId: string, value: string) => void
  onReset: () => void
  labels: { title: string; remove: (label: string) => string; reset: string }
}

/** The ticked filter options as removable chips, with "Reset". Renders nothing when none are ticked. */
export function ActiveFilterChips({ groups, onRemove, onReset, labels }: ActiveFilterChipsProps) {
  const active = groups.flatMap((group) =>
    group.options.filter((option) => option.selected).map((option) => ({ group, option })),
  )
  if (active.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-text-muted">{labels.title}</span>
      {active.map(({ group, option }) => (
        <span
          key={`${group.id}:${option.value}`}
          className="inline-flex animate-fade-in items-center gap-1.5 rounded-pill border border-primary-border bg-primary-tint py-1 pr-1 pl-3 text-sm font-medium text-navy-900"
        >
          <span className="text-text-muted">{group.label}:</span>
          {option.label}
          <button
            type="button"
            onClick={() => onRemove(group.id, option.value)}
            aria-label={labels.remove(`${group.label}: ${option.label}`)}
            className="flex size-6 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white hover:text-navy-900"
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="ml-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        {labels.reset}
      </button>
    </div>
  )
}
