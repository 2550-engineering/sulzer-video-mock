import { replacementGuidePage } from '../../data/replacementGuidePage'
import { guideComparisonRows, replacementName } from '../../lib/replacementGuide'
import type { GuideExistingPump, GuideReplacement } from '../../types'
import { GuideAvailabilityChip } from './GuideAvailabilityChip'
import { GuideProductLinks } from './GuideProductLinks'
import { GuidePumpPhoto } from './GuidePumpPhoto'

const copy = replacementGuidePage

type GuideComparisonTableProps = {
  pump: GuideExistingPump
  replacement: GuideReplacement
  className?: string
}

const labelCell =
  'bg-surface-subtle px-2.5 py-2 text-left align-middle text-[11px] font-normal text-text-muted'
const valueCell = 'border-l px-2.5 py-2 align-middle text-xs font-semibold text-navy-900'

/** Phones: existing pump and Sulzer replacement in one 3-column table, as in the guide. */
export function GuideComparisonTable({
  pump,
  replacement,
  className = '',
}: GuideComparisonTableProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-white ${className}`}>
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b-2 border-border bg-surface-muted">
            <td />
            <th scope="col" className="border-l border-border px-2.5 py-3 text-left align-top">
              <span className="block text-[10px] font-semibold tracking-[0.08em] text-text-subtle uppercase">
                {copy.existing.mobileLabel}
              </span>
              <span className="mt-1 block text-[13px] leading-tight font-bold text-navy-900">
                {pump.brand} {pump.model}
              </span>
            </th>
            <th
              scope="col"
              className="border-t-[3px] border-l-[3px] border-primary px-2.5 py-3 text-left align-top"
            >
              <span className="block text-[10px] font-semibold tracking-[0.08em] text-primary uppercase">
                {copy.replacement.mobileLabel(replacement.tier)}
              </span>
              <span className="mt-1 block text-[13px] leading-tight font-bold text-navy-900">
                {replacementName(replacement)}
              </span>
              <span className="mt-1.5 block">
                <GuideAvailabilityChip availability={replacement.availability} size="sm" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-surface-sunken">
            <th scope="row" className={labelCell}>
              {copy.specs.photo}
            </th>
            <td className="border-l border-surface-sunken px-2.5 py-2">
              <GuidePumpPhoto
                image={pump.image}
                label={copy.existing.photo(pump.brand)}
                className="mx-auto size-[72px]"
              />
            </td>
            <td className="border-l border-primary-tint-strong px-2.5 py-2">
              <GuidePumpPhoto
                image={replacement.image}
                label={copy.replacement.photo(replacement.range)}
                className="mx-auto size-[72px]"
              />
            </td>
          </tr>
          {guideComparisonRows(pump, replacement).map((row) => (
            <tr key={row.label} className="border-b border-surface-sunken">
              <th scope="row" className={labelCell}>
                {row.label}
              </th>
              <td className={`${valueCell} border-surface-sunken`}>{row.existing}</td>
              <td className={`${valueCell} border-primary-tint-strong`}>{row.replacement}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="flex gap-2 border-b border-surface-sunken px-2.5 py-3 text-[11px] leading-relaxed">
        <span className="shrink-0 font-semibold text-text-muted">{copy.replacement.comments}</span>
        <span className="text-navy-500">{replacement.comment}</span>
      </p>
      <GuideProductLinks className="px-3 py-4" />
    </div>
  )
}
