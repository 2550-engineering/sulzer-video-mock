import { FileText, FolderPlus } from 'lucide-react'
import { sizingResultsPage as copy } from '../../data/sizingPages'
import { seriesColors } from '../../lib/chartColors'
import { keyFigureRows } from '../../lib/keyFigures'
import { formatPrice } from '../../lib/modelSpecs'
import type { DutyPoint, SizingResult } from '../../types'
import { Drawer } from '../Drawer'
import { AvailabilityBadge } from '../product/AvailabilityBadge'
import { KeyFigures } from './KeyFigures'
import { SizingCurveChart } from './SizingCurveChart'

export type PanelMode = 'detail' | 'curves' | 'compare'

type SizingResultPanelProps = {
  open: boolean
  mode: PanelMode
  /** Kept while the panel slides out. */
  results: SizingResult[]
  duty: DutyPoint
  signedIn: boolean
  onClose: () => void
  onAddToProject: (results: SizingResult[]) => void
  onDataSheet: (result: SizingResult) => void
}

/**
 * Side panel for sizing results: one result in detail (curve, key figures,
 * actions), several results' curves overlaid, or up to three compared side by side.
 */
export function SizingResultPanel({
  open,
  mode,
  results,
  duty,
  signedIn,
  onClose,
  onAddToProject,
  onDataSheet,
}: SizingResultPanelProps) {
  const shown = mode === 'compare' ? results.slice(0, 3) : results.slice(0, seriesColors.length)
  const first = shown[0]
  const title =
    mode === 'detail' || shown.length === 1
      ? (first?.variant.name ?? '')
      : mode === 'compare'
        ? copy.panel.compareTitle(shown.length)
        : copy.panel.curvesTitle(shown.length)
  const subtitle =
    first && (mode === 'detail' || shown.length === 1)
      ? (first.variant.productNumber ?? copy.onRequest)
      : undefined

  return (
    <Drawer
      open={open && first !== undefined}
      title={title}
      subtitle={subtitle}
      closeLabel={copy.panel.close}
      onClose={onClose}
    >
      {first && (
        <>
          <SizingCurveChart results={shown} colors={seriesColors} duty={duty} />

          {(mode === 'detail' || shown.length === 1) && (
            <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1fr)_14rem]">
              <section>
                <h3 className="font-semibold text-navy-900">{copy.keyFigures.title}</h3>
                <div className="mt-2">
                  <KeyFigures result={first} />
                </div>
              </section>
              <div className="flex flex-col gap-3 md:pt-8">
                {signedIn && (
                  <div className="mb-2 rounded-md border border-border px-4 py-3 text-sm">
                    <p className="text-text-muted">{copy.columns.price}</p>
                    <p className="text-lg font-bold text-navy-900 tabular-nums">
                      {formatPrice(first.purchasePrice)}
                    </p>
                    <p className="mt-1">
                      <AvailabilityBadge model={first.variant} />
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onAddToProject([first])}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
                >
                  <FolderPlus className="size-4" />
                  {copy.panel.addToProject}
                </button>
                <button
                  type="button"
                  onClick={() => onDataSheet(first)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
                >
                  <FileText className="size-4" />
                  {copy.panel.dataSheet}
                </button>
              </div>
            </div>
          )}

          {mode === 'compare' && shown.length > 1 && (
            <div className="mt-8">
              {results.length > 3 && (
                <p className="mb-3 text-sm text-text-muted">{copy.panel.compareLimit}</p>
              )}
              <table className="w-full text-left text-[15px]">
                <thead>
                  <tr className="border-b-2 border-navy-900">
                    <th scope="col" className="w-56 py-3" />
                    {shown.map((result, i) => (
                      <th
                        key={result.variant.id}
                        scope="col"
                        className="py-3 pr-4 align-top font-bold text-navy-900"
                      >
                        <span
                          aria-hidden
                          className="mr-2 inline-block size-2.5 rounded-full"
                          style={{ background: seriesColors[i] }}
                        />
                        {result.variant.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {keyFigureRows(first).map(([label], row) => (
                    <tr key={label} className="border-b border-border">
                      <th scope="row" className="py-2.5 pr-4 font-normal text-text-muted">
                        {label}
                      </th>
                      {shown.map((result) => (
                        <td
                          key={result.variant.id}
                          className="py-2.5 pr-4 font-semibold text-navy-900 tabular-nums"
                        >
                          {keyFigureRows(result)[row][1]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {mode !== 'detail' && shown.length > 1 && (
            <button
              type="button"
              onClick={() => onAddToProject(shown)}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
            >
              <FolderPlus className="size-4" />
              {copy.panel.addToProject}
            </button>
          )}
        </>
      )}
    </Drawer>
  )
}
