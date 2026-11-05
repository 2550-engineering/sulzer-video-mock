import { ArrowLeft, FolderPlus, LogIn, Scale } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { Breadcrumb } from '../components/Breadcrumb'
import { AddToProjectDialog } from '../components/projects/AddToProjectDialog'
import { CompareTable } from '../components/sizing/CompareTable'
import { SizingCurveChart } from '../components/sizing/SizingCurveChart'
import { Switch } from '../components/Switch'
import { applications } from '../data/applications'
import { getLiquid } from '../data/liquids'
import { sizingComparePage as copy } from '../data/sizingPages'
import { tenderDialog } from '../data/tenderTexts'
import { tenderFileName, useTenderDialog } from '../hooks/useTenderDialog'
import { useUrlParams } from '../hooks/useUrlParams'
import { seriesColors } from '../lib/chartColors'
import { alternativeLetter, compareRows, comparedResults } from '../lib/compare'
import { groupThousands } from '../lib/format'
import { resultSeries } from '../lib/sizing'
import { readSizingInput, sizingQuery } from '../lib/sizingParams'
import { sizedSubject } from '../lib/tenderSubjects'
import type { ProductEntry } from '../projects/ProjectsContext'
import type { SizingResult } from '../types'

/**
 * /sizing/compare?<sizing params>&ids=a,b,c: two or three sized pumps side by
 * side. One chart with every pump's curve, the system curve and the duty
 * point; aligned key figures with the best value per row in green; Select,
 * Add to project and View product per pump; "Save comparison to project"
 * saves them all as Alternative A/B/C. The selected pump is in the URL too.
 */
export function SizingComparePage() {
  const { user } = useAuth()
  const [params, update] = useUrlParams()
  const [differencesOnly, setDifferencesOnly] = useState(false)
  const { openTender, tenderDialog: tenderDialogElement } = useTenderDialog()
  const applicationName = applications.find((a) => a.id === params.get('application'))?.name
  const [dialog, setDialog] = useState<{
    entries: ProductEntry[]
    title?: string
    session: number
    open: boolean
  }>({
    entries: [],
    session: 0,
    open: false,
  })

  const { duty, settings } = readSizingInput(params)
  const ids = (params.get('ids') ?? '').split(',').filter(Boolean)
  const results = comparedResults(ids, duty, settings)
  const selectedId = results.some((r) => r.variant.id === params.get('selected'))
    ? params.get('selected')
    : null
  const backTo = `/sizing/results${sizingQuery(params)}`
  const allRows = compareRows(results, Boolean(user), settings.lifeCycleYears)
  const rows = differencesOnly ? allRows.filter((row) => row.differs) : allRows

  const entry = (result: SizingResult, i?: number): ProductEntry => ({
    variantId: result.variant.id,
    dutyPoint: duty,
    ...(i !== undefined
      ? { alternative: alternativeLetter(i), preferred: result.variant.id === selectedId }
      : {}),
  })
  const openDialog = (entries: ProductEntry[], title?: string) =>
    setDialog((d) => ({ entries, title, session: d.session + 1, open: true }))

  return (
    <>
      <title>{`${copy.title} | Sulzer`}</title>
      <section className="border-b border-border bg-white">
        <div className="site-container py-5">
          <Breadcrumb
            items={[
              ...copy.breadcrumb,
              { label: copy.resultsCrumb, to: backTo },
              { label: copy.crumb },
            ]}
          />
        </div>
        <div className="site-container flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pb-8">
          <div>
            <h1 className="text-[2.5rem] leading-tight font-bold tracking-tight text-navy-900">
              {copy.title}
            </h1>
            <p className="mt-1 text-text-muted tabular-nums">
              {copy.duty(
                groupThousands(duty.flow),
                groupThousands(duty.head),
                getLiquid(duty.liquid).label,
                String(duty.temperature),
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={backTo}
              className="inline-flex h-11 items-center gap-2 rounded-pill px-4 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" />
              {copy.back}
            </Link>
            {results.length >= 2 && (
              <button
                type="button"
                onClick={() =>
                  openDialog(
                    results.map((result, i) => entry(result, i)),
                    copy.saveTitle(results.length),
                  )
                }
                className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
              >
                <FolderPlus className="size-4" />
                {copy.saveAll}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="min-h-[480px] bg-surface-muted">
        <div className="site-container py-10">
          {results.length < 2 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
              <Scale aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
              <h2 className="mt-4 text-xl font-bold text-navy-900">{copy.notEnough.title}</h2>
              <p className="mt-2 text-text-muted">{copy.notEnough.text}</p>
              <Link
                to={backTo}
                className="mt-6 inline-flex h-11 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {copy.notEnough.action}
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="rounded-lg border border-border bg-white p-6">
                <h2 className="mb-4 text-lg font-bold tracking-tight text-navy-900">
                  {copy.curvesTitle}
                </h2>
                <SizingCurveChart
                  curves={results.map((result) => resultSeries(result, duty.frequency))}
                  colors={seriesColors}
                  duty={duty}
                />
              </section>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <Switch
                  label={copy.differencesOnly}
                  checked={differencesOnly}
                  onChange={setDifferencesOnly}
                />
                {!user && (
                  <p className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                    <LogIn className="size-4" />
                    {copy.signInForPrices}
                  </p>
                )}
              </div>

              <CompareTable
                results={results}
                duty={duty}
                rows={rows}
                colors={seriesColors}
                selectedId={selectedId}
                onSelect={(id) =>
                  update((next) =>
                    id === selectedId ? next.delete('selected') : next.set('selected', id),
                  )
                }
                onAddToProject={(result) => openDialog([entry(result)])}
                onTenderText={(result) =>
                  openTender({
                    label: result.variant.name,
                    documentTitle: tenderDialog.documentTitle(result.variant.name),
                    subjects: [sizedSubject(result.variant, result, duty, applicationName)],
                    fileName: tenderFileName(result.variant.name),
                  })
                }
              />
            </div>
          )}
        </div>
      </section>

      <AddToProjectDialog
        key={dialog.session}
        open={dialog.open}
        entries={dialog.entries}
        title={dialog.title}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
      />
      {tenderDialogElement}
    </>
  )
}
