import { CalendarClock, Download, FileText, FolderDown, LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ConnectPageHeader } from '../components/connect/ConnectPageHeader'
import { ConnectPanel } from '../components/connect/ConnectPanel'
import { ReportPreview } from '../components/connect/ReportPreview'
import { useConnect } from '../connect/useConnect'
import { connectApp, reportsPage as copy } from '../data/connect'
import { useToast } from '../toast/useToast'

/** How long "Preparing PDF…" shows. Fixed, so recordings match. */
const preparingMs = 1000

/** Reports: /connect/reports. The monthly condition report, previewed, with a mock PDF download. */
export function ConnectReportsPage() {
  const { assets } = useConnect()
  const showToast = useToast()
  const [preparing, setPreparing] = useState(false)
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Only this month is previewed; earlier reports download straight away.
  const current = copy.list[0]

  function download(month: string) {
    setPreparing(true)
    timer.current = window.setTimeout(() => {
      setPreparing(false)
      showToast({ message: copy.downloaded(copy.fileName(month)) })
    }, preparingMs)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-10 pt-8 pb-16">
      <title>{`${copy.title} – ${connectApp.name}`}</title>
      <ConnectPageHeader
        title={copy.title}
        subtitle={
          <span className="inline-flex items-center gap-2">
            <CalendarClock className="size-4" />
            {copy.schedule}
          </span>
        }
        actions={
          <button
            type="button"
            onClick={() => download(current.id)}
            disabled={preparing}
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-70"
          >
            {preparing ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <FolderDown className="size-4" />
            )}
            {preparing ? copy.preparing : copy.download}
          </button>
        }
      />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <ConnectPanel flush className="overflow-hidden">
          <ul className="divide-y divide-white/[0.07]">
            {copy.list.map((report) => {
              const shown = report.id === current.id
              return (
                <li key={report.id}>
                  <button
                    type="button"
                    aria-current={shown ? 'true' : undefined}
                    onClick={() => !shown && download(report.id)}
                    className={`group relative flex w-full items-start gap-3 px-5 py-4 text-left transition-colors ${
                      shown ? 'bg-primary/20' : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    {shown && (
                      <span
                        aria-hidden
                        className="absolute inset-y-0 left-0 w-1 bg-primary-on-dark"
                      />
                    )}
                    <FileText
                      className="mt-0.5 size-5 shrink-0 text-primary-on-dark"
                      strokeWidth={1.75}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-white">{report.label}</span>
                      <span className="block text-xs text-text-on-dark-muted">{report.note}</span>
                    </span>
                    {!shown && (
                      <Download className="mt-0.5 size-4 text-text-on-dark-muted transition-colors group-hover:text-white" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </ConnectPanel>

        <ReportPreview assets={assets} />
      </div>
    </div>
  )
}
