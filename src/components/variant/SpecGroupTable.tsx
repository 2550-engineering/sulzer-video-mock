type SpecGroupTableProps = {
  title: string
  rows: { label: string; value: string }[]
}

/** One titled group of spec rows (label left, value right). */
export function SpecGroupTable({ title, rows }: SpecGroupTableProps) {
  return (
    <section className="break-inside-avoid">
      <h3 className="border-b-2 border-navy-900 pb-2 text-lg font-bold tracking-tight text-navy-900">
        {title}
      </h3>
      <dl className="text-[15px]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-6 border-b border-border py-2.5 max-md:gap-4"
          >
            <dt className="text-text-muted">{row.label}</dt>
            <dd className="text-right font-semibold text-navy-900 max-md:min-w-0 max-md:[overflow-wrap:anywhere]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
