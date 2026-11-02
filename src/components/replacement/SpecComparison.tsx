import { replacementPage as copy } from '../../data/replacementPage'

type SpecComparisonProps = {
  rows: { label: string; old: string; next: string; changed: boolean }[]
}

/** Key specs of the old product and its replacement; differing rows highlighted. */
export function SpecComparison({ rows }: SpecComparisonProps) {
  const head = 'border-b border-border bg-surface-sunken px-4 py-3 text-left font-semibold'
  const cell = 'border-b border-border px-4 py-2.5'
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight text-navy-900">{copy.compare.title}</h2>
        <p className="text-sm text-text-muted">{copy.compare.legend}</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[36rem] border-separate border-spacing-0 text-[15px]">
          <thead className="text-sm text-navy-900">
            <tr>
              <th scope="col" className={`${head} w-[30%]`}>
                {copy.compare.spec}
              </th>
              <th scope="col" className={head}>
                {copy.compare.old}
              </th>
              <th scope="col" className={head}>
                {copy.compare.next}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className={row.changed ? 'bg-warning-tint/60' : ''}>
                <th scope="row" className={`${cell} text-left font-normal text-text-muted`}>
                  {row.label}
                  {row.changed && (
                    <span className="ml-2 rounded-pill bg-warning px-2 py-0.5 text-[11px] font-semibold text-navy-900">
                      {copy.compare.changed}
                    </span>
                  )}
                </th>
                <td className={`${cell} text-navy-900`}>{row.old}</td>
                <td
                  className={`${cell} ${row.changed ? 'font-semibold text-navy-900' : 'text-navy-900'}`}
                >
                  {row.next}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
