import type { SparePart } from '../../types'

const availability = {
  'in-stock': { label: 'In stock', className: 'bg-success-tint text-success-strong' },
  'on-request': { label: 'On request', className: 'bg-surface-sunken text-text-muted' },
} as const

/** Spare parts tab: drawing position, part number, name, group and availability. */
export function SparePartList({ parts }: { parts: SparePart[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-[15px]">
        <thead className="bg-surface-sunken text-sm text-navy-900">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">
              Pos.
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Part number
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Description
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Group
            </th>
            <th scope="col" className="px-6 py-4 text-right font-semibold">
              Availability
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {parts.map((part) => (
            <tr key={part.id} className="transition-colors hover:bg-surface-muted">
              <td className="px-6 py-4 text-text-muted tabular-nums">{part.position}</td>
              <td className="px-6 py-4 font-semibold text-primary tabular-nums">
                {part.partNumber}
              </td>
              <th scope="row" className="px-6 py-4 font-medium text-navy-900">
                {part.name}
              </th>
              <td className="px-6 py-4 text-text-muted">{part.group}</td>
              <td className="px-6 py-4 text-right">
                <span
                  className={`rounded-pill px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${availability[part.availability].className}`}
                >
                  {availability[part.availability].label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
