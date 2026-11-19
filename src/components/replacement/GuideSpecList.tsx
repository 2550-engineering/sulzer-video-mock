import type { GuideSpecRow } from '../../lib/replacementGuide'

/** Spec rows as light tiles, label left and value right; one or two columns. */
export function GuideSpecList({ rows, columns = 1 }: { rows: GuideSpecRow[]; columns?: 1 | 2 }) {
  return (
    <dl className={`grid gap-2 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-3 rounded-md bg-surface-muted px-3.5 py-2.5 text-[13px]"
        >
          <dt className="text-text-muted">{row.label}</dt>
          <dd className="text-right font-semibold text-navy-900">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
