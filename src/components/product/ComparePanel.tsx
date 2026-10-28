import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { productPage } from '../../data/catalogPages'
import { useDismiss } from '../../hooks/useDismiss'
import { compareColors, formatPrice } from '../../lib/modelSpecs'
import type { ProductModel } from '../../types'
import { AvailabilityBadge } from './AvailabilityBadge'
import { PerformanceCurve } from './PerformanceCurve'

const copy = productPage.models.compare
const units = productPage.models.units

type Row = { label: string; value: (model: ProductModel) => ReactNode; priced?: boolean }

const rows: Row[] = [
  { label: copy.rows.productNumber, value: (m) => m.productNumber },
  { label: copy.rows.frequency, value: (m) => `${m.frequency} Hz` },
  { label: copy.rows.flow, value: (m) => `${m.flow} ${units.flow}` },
  { label: copy.rows.head, value: (m) => `${m.head} ${units.head}` },
  { label: copy.rows.power, value: (m) => `${m.power} ${units.power}` },
  { label: copy.rows.speed, value: (m) => `${m.speed} ${units.speed}` },
  { label: copy.rows.efficiency, value: (m) => `${m.efficiency} %` },
  {
    label: copy.rows.connection,
    value: (m) =>
      m.connection.suction
        ? `DN ${m.connection.suction} × DN ${m.connection.discharge}`
        : `DN ${m.connection.discharge}`,
  },
  { label: copy.rows.casingMaterial, value: (m) => m.casingMaterial },
  { label: copy.rows.shaftSeal, value: (m) => m.shaftSeal },
  { label: copy.rows.maxPressure, value: (m) => `${m.maxPressure} bar` },
  { label: copy.rows.weight, value: (m) => `${m.weight} kg` },
  { label: copy.rows.listPrice, value: (m) => formatPrice(m.listPrice), priced: true },
  { label: copy.rows.availability, value: (m) => <AvailabilityBadge model={m} />, priced: true },
]

type ComparePanelProps = {
  open: boolean
  models: ProductModel[]
  signedIn: boolean
  onClose: () => void
}

/** Side panel comparing up to 3 models: overlaid performance curves and a spec table. */
export function ComparePanel({ open, models, signedIn, onClose }: ComparePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useDismiss(panelRef, open, onClose)

  // Focus the close button on open; keep the page behind from scrolling.
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  const series = models.map((model, i) => ({ model, color: compareColors[i] }))
  const columns = `12rem repeat(${Math.max(models.length, 1)}, minmax(0, 1fr))`

  return (
    <div inert={!open} className="fixed inset-0 z-[70]">
      <div
        aria-hidden
        className={`absolute inset-0 bg-navy-900/45 transition-opacity duration-250 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-5xl flex-col bg-white shadow-[-24px_0_60px_-24px_rgba(12,28,46,0.4)] transition-transform duration-250 ease-sz ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-8 py-5">
          <h2 id="compare-title" className="text-2xl font-bold tracking-tight text-brand">
            {copy.panelTitle}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="flex size-10 items-center justify-center rounded-full text-navy-900 transition-colors hover:bg-surface-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <h3 className="font-semibold text-navy-900">{copy.curves}</h3>
          <div className="mt-3 rounded-md border border-border p-4">
            {models.length > 0 && <PerformanceCurve series={series} />}
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {series.map(({ model, color }) => (
                <li key={model.id} className="inline-flex items-center gap-2 text-navy-900">
                  <span
                    aria-hidden
                    className="h-[3px] w-6 rounded-full"
                    style={{ background: color }}
                  />
                  {model.name} · {model.frequency} Hz
                </li>
              ))}
            </ul>
          </div>

          <div role="table" aria-label={copy.panelTitle} className="mt-8 text-[15px]">
            <div
              role="row"
              className="sticky top-0 z-10 grid border-b-2 border-navy-900 bg-white"
              style={{ gridTemplateColumns: columns }}
            >
              <span role="columnheader" className="py-3" />
              {series.map(({ model, color }) => (
                <span
                  key={model.id}
                  role="columnheader"
                  className="flex items-center gap-2 py-3 pr-4 font-bold text-navy-900"
                >
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  {model.name}
                </span>
              ))}
            </div>
            {rows
              .filter((row) => signedIn || !row.priced)
              .map((row) => (
                <div
                  key={row.label}
                  role="row"
                  className="grid border-b border-border"
                  style={{ gridTemplateColumns: columns }}
                >
                  <span role="rowheader" className="py-3 pr-4 text-text-muted">
                    {row.label}
                  </span>
                  {models.map((model) => (
                    <span
                      key={model.id}
                      role="cell"
                      className="py-3 pr-4 text-navy-900 tabular-nums"
                    >
                      {row.value(model)}
                    </span>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
