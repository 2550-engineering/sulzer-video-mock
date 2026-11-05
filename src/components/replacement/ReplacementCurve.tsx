import { replacementPage } from '../../data/replacement'
import { groupThousands } from '../../lib/format'
import type { CurveModel } from '../../lib/modelSpecs'
import type { DutyPoint } from '../../types'
import { PerformanceCurve } from '../product/PerformanceCurve'

const copy = replacementPage.curve

const todayColor = 'var(--sz-color-text-subtle)'
const newColor = 'var(--sz-color-primary)'

type ReplacementCurveProps = {
  today: CurveModel | undefined
  suggested: CurveModel
  duty: DutyPoint
}

/** The pump today (dashed grey) against the suggested pump, with the duty point marked. */
export function ReplacementCurve({ today, suggested, duty }: ReplacementCurveProps) {
  const legend = [
    ...(today ? [{ label: `${copy.today}: ${today.name}`, color: todayColor, dashed: true }] : []),
    { label: suggested.name, color: newColor, dashed: false },
  ]
  return (
    <section className="flex h-full flex-col rounded-lg border border-border bg-white px-6 py-5">
      <h2 className="text-lg font-bold tracking-tight text-navy-900">{copy.title}</h2>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-muted">
        {legend.map(({ label, color, dashed }) => (
          <li key={label} className="flex items-center gap-2">
            <svg aria-hidden viewBox="0 0 24 4" className="h-1 w-6">
              <line
                x1="0"
                x2="24"
                y1="2"
                y2="2"
                stroke={color}
                strokeWidth="3"
                strokeDasharray={dashed ? '6 4' : undefined}
              />
            </svg>
            {label}
          </li>
        ))}
      </ul>
      <div key={suggested.id} className="mt-3 flex-1 animate-fade-in">
        <PerformanceCurve
          series={[
            ...(today ? [{ model: today, color: todayColor, dashed: true }] : []),
            { model: suggested, color: newColor },
          ]}
          marker={{
            flow: duty.flow,
            head: duty.head,
            label: `${copy.duty}: ${groupThousands(duty.flow)} m³/h · ${groupThousands(duty.head)} m`,
          }}
        />
      </div>
      <p className="mt-2 text-xs text-text-muted">{copy.note}</p>
    </section>
  )
}
