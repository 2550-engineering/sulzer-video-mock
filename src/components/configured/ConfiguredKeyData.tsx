import { configuredPage } from '../../data/configuredPages'
import { groupThousands } from '../../lib/format'
import type { SizingResult } from '../../types'

const copy = configuredPage.keyData

type ConfiguredKeyDataProps = {
  result: Omit<SizingResult, 'rank'>
  /** A project's or sizing's duty point; otherwise the rated point. */
  atDuty: boolean
}

/** Five headline figures where the pump runs: flow, head, efficiency, P2, NPSHr. */
export function ConfiguredKeyData({ result, atDuty }: ConfiguredKeyDataProps) {
  const figures: [string, string, string][] = [
    [copy.flow, groupThousands(result.operatingPoint.flow, 1), 'm³/h'],
    [copy.head, groupThousands(result.operatingPoint.head, 1), 'm'],
    [copy.efficiency, groupThousands(result.efficiency, 1), '%'],
    [copy.p2, groupThousands(result.p2, 1), 'kW'],
    [copy.npshr, groupThousands(result.npshr, 1), 'm'],
  ]
  return (
    <section className="mt-7 w-full max-w-2xl rounded-lg border border-border bg-surface-subtle px-5 py-4">
      <h2 className="text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
        {atDuty ? copy.title : copy.rated}
      </h2>
      <dl className="mt-3 grid grid-cols-3 gap-y-4 sm:grid-cols-5">
        {figures.map(([label, value, unit]) => (
          <div
            key={label}
            className="border-border px-3 not-first:border-l first:pl-0 max-sm:nth-4:border-l-0 max-sm:nth-4:pl-0"
          >
            <dt className="text-sm text-text-muted">{label}</dt>
            <dd className="mt-1 text-xl font-bold tracking-tight whitespace-nowrap text-navy-900 tabular-nums">
              {value}
              <span className="ml-1 text-sm font-semibold text-text-muted">{unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
