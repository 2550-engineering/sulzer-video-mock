import { FileText } from 'lucide-react'
import { assetPage } from '../../data/assetPages'
import { formatDate } from '../../lib/format'
import { serviceHistory } from '../../lib/serviceHistory'
import { useToast } from '../../toast/useToast'
import type { Asset } from '../../types'
import { TabHeading } from '../TabHeading'

const copy = assetPage.history

/** Service history tab: a timeline of visits, newest first, each with its service report. */
export function ServiceHistoryTab({ asset }: { asset: Asset }) {
  const showToast = useToast()
  const entries = serviceHistory(asset)

  return (
    <>
      <TabHeading title={copy.title} />
      <p className="mt-3 text-lg text-text-muted">{copy.intro(entries.length)}</p>

      <ol className="relative mt-10 max-w-4xl">
        {entries.map((entry, i) => (
          <li
            key={entry.id}
            className="relative grid grid-cols-[7.5rem_1.5rem_minmax(0,1fr)] gap-x-5 pb-8 last:pb-0"
          >
            <p className="pt-4 text-right text-sm font-semibold text-navy-900 tabular-nums">
              {formatDate(entry.date)}
            </p>
            <div className="relative flex justify-center">
              {i < entries.length - 1 && (
                <span aria-hidden className="absolute top-6 -bottom-8 w-px bg-border-strong" />
              )}
              <span
                aria-hidden
                className={`relative mt-5 size-3 rounded-full ring-4 ring-surface ${i === 0 ? 'bg-primary' : 'bg-border-strong'}`}
              />
            </div>
            <article className="rounded-lg border border-border bg-white px-6 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${copy.kinds[entry.kind]}`}
                >
                  {entry.kind}
                </span>
                <h3 className="font-semibold text-navy-900">{entry.title}</h3>
                <span className="ml-auto text-sm text-text-subtle tabular-nums">
                  {entry.reference}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{entry.text}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-text-muted">
                  {copy.technician}:{' '}
                  <span className="font-medium text-navy-900">{entry.technician}</span>
                </p>
                <button
                  type="button"
                  onClick={() => showToast({ message: copy.reportDownloaded(entry.reference) })}
                  className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
                >
                  <FileText className="size-4" />
                  {copy.report}
                </button>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </>
  )
}
