import { Droplets, MoveHorizontal, MoveVertical, Pencil, Thermometer } from 'lucide-react'
import { Link } from 'react-router'
import { getLiquid } from '../../data/liquids'
import { sizingResultsPage as copy } from '../../data/sizingPages'
import { groupThousands } from '../../lib/format'
import type { DutyPoint } from '../../types'

type DutyPointChipsProps = {
  duty: DutyPoint
  /** Back to the parameters, keeping them. */
  editTo: string
}

const chip =
  'inline-flex h-9 items-center gap-2 rounded-pill border border-border bg-white px-3.5 text-sm font-medium text-navy-900'

/** Chip row with the sizing input, and "Edit parameters". */
export function DutyPointChips({ duty, editTo }: DutyPointChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-text-muted">{copy.duty.label}</span>
      <span className={chip}>
        <Droplets className="size-4 text-primary" />
        {getLiquid(duty.liquid).label}
      </span>
      <span className={chip}>
        <Thermometer className="size-4 text-primary" />
        {copy.duty.temperature(duty.temperature)}
      </span>
      <span className={chip}>
        <MoveHorizontal className="size-4 text-primary" />
        {copy.duty.flow(groupThousands(duty.flow, duty.flow % 1 ? 1 : 0))}
      </span>
      <span className={chip}>
        <MoveVertical className="size-4 text-primary" />
        {copy.duty.head(groupThousands(duty.head, duty.head % 1 ? 1 : 0))}
      </span>
      {duty.frequency === 60 && <span className={chip}>{copy.duty.frequency(60)}</span>}
      <Link
        to={editTo}
        className="ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        <Pencil className="size-3.5" />
        {copy.duty.edit}
      </Link>
    </div>
  )
}
