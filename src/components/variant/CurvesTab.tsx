import { Download, Maximize, Minimize } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { variantPage } from '../../data/variantPages'
import { liquids } from '../../data/liquids'
import { groupThousands } from '../../lib/format'
import { defaultCurveSettings, performance, type CurveSettings } from '../../lib/performance'
import { downloadSvg } from '../../lib/svgExport'
import { useToast } from '../../toast/useToast'
import type { LiquidId, OperatingPoint, ResultArticle } from '../../types'
import { IconButton } from '../IconButton'
import { SegmentedToggle } from '../SegmentedToggle'
import { SelectField } from '../SelectField'
import { CompactNumber } from '../sizing/form/CompactNumber'
import { PerformanceChart, type CurveVisibility, type FlowUnit } from './PerformanceChart'
import { SettingsSection } from './SettingsSection'

const copy = variantPage.curves

type DutyMode = 'none' | 'show' | 'enter'

/**
 * Curves tab: datasheet performance curves (about 70 %) and a Settings column
 * (about 30 %) with operating point, fluid, curve types, hydraulic layout and
 * advanced options (speed, impeller diameter). Full screen and SVG download.
 * Remount (via `key`) per variant or model.
 */
export function CurvesTab({
  article,
  showDuty = false,
}: {
  article: ResultArticle
  /** Open with "Show duty point" chosen, marking `article.rated` (e.g. a project's duty point). */
  showDuty?: boolean
}) {
  const ids = useId()
  const showToast = useToast()
  const frameRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [settings, setSettings] = useState<CurveSettings>(() => defaultCurveSettings(article))
  const [dutyMode, setDutyMode] = useState<DutyMode>(showDuty ? 'show' : 'none')
  const [entered, setEntered] = useState<OperatingPoint>(article.rated)
  const [show, setShow] = useState<CurveVisibility>({
    qh: true,
    eta: true,
    p1: true,
    p2: true,
    npsh: true,
    system: true,
  })
  const [unit, setUnit] = useState<FlowUnit>('m3h')
  const [advanced, setAdvanced] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === frameRef.current)
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [])

  // "Show duty point" marks the rated point (doubled in flow for two pumps in parallel).
  const pumps = settings.layout === 'parallel' ? 2 : 1
  const duty: OperatingPoint | null =
    dutyMode === 'none'
      ? null
      : dutyMode === 'show'
        ? { flow: article.rated.flow * pumps, head: article.rated.head }
        : entered
  const op = duty ? performance(article, settings).operatingPoint(duty).point : null

  const set = <K extends keyof CurveSettings>(key: K, value: CurveSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }))
  const liquid = liquids.find((l) => l.id === settings.liquidId)!

  function toggleFullscreen() {
    const frame = frameRef.current
    if (!frame) return
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else frame.requestFullscreen?.().catch(() => {})
  }

  function download() {
    if (!svgRef.current) return
    const fileName = `${article.code.replace(/[^A-Za-z0-9.]+/g, '_').replace(/_+$/, '')}_curves.svg`
    downloadSvg(svgRef.current, fileName)
    showToast({ message: copy.downloaded, detail: fileName })
  }

  const fmt = (v: number, d = 1) => groupThousands(v, d)
  const label = 'text-sm text-text-muted'
  const types = Object.keys(copy.types) as (keyof CurveVisibility)[]

  return (
    <div
      ref={frameRef}
      className={`grid items-start gap-x-10 gap-y-8 bg-white lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] ${
        fullscreen ? 'h-screen overflow-auto p-8' : ''
      }`}
    >
      <section className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[1.75rem] leading-tight font-bold tracking-tight text-text-muted">
            {copy.title}
          </h2>
          <div className="flex items-center gap-3">
            <SegmentedToggle<FlowUnit>
              label={copy.unit}
              value={unit}
              options={[
                { value: 'm3h', label: 'm³/h' },
                { value: 'ls', label: 'l/s' },
              ]}
              onChange={setUnit}
            />
            <IconButton icon={Download} label={copy.download} onClick={download} />
          </div>
        </div>
        <div className="mt-4">
          <PerformanceChart
            article={article}
            settings={settings}
            duty={duty}
            show={show}
            unit={unit}
            svgRef={svgRef}
          />
        </div>
      </section>

      <aside className="min-w-0">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-[1.75rem] leading-tight font-bold tracking-tight text-text-muted">
            {copy.settings}
          </h3>
          <IconButton
            icon={fullscreen ? Minimize : Maximize}
            label={fullscreen ? copy.exitFullscreen : copy.fullscreen}
            onClick={toggleFullscreen}
          />
        </div>

        <SettingsSection title={copy.sections.operatingPoint} defaultOpen>
          <SelectField<DutyMode>
            layout="stacked"
            label={copy.duty.label}
            value={dutyMode}
            onChange={setDutyMode}
            options={[
              { value: 'none', label: copy.duty.none },
              { value: 'show', label: copy.duty.show },
              { value: 'enter', label: copy.duty.enter },
            ]}
          />
          {dutyMode === 'enter' && (
            <div className="mt-3 grid animate-fade-in grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-x-2 gap-y-2.5 text-sm">
              <label htmlFor={`${ids}-q`} className={label}>
                {copy.duty.flow}
              </label>
              <CompactNumber
                id={`${ids}-q`}
                value={entered.flow}
                onValue={(flow) => setEntered((d) => ({ ...d, flow }))}
              />
              <span className="text-text-muted">m³/h</span>
              <label htmlFor={`${ids}-h`} className={label}>
                {copy.duty.head}
              </label>
              <CompactNumber
                id={`${ids}-h`}
                value={entered.head}
                onValue={(head) => setEntered((d) => ({ ...d, head }))}
              />
              <span className="text-text-muted">m</span>
            </div>
          )}
          {op && (
            <dl aria-live="polite" className="mt-4 animate-fade-in text-sm">
              <dt className="mb-1 font-semibold text-navy-900">{copy.duty.values}</dt>
              {[
                [copy.values.flow, `${fmt(op.flow, 0)} m³/h`],
                [copy.values.head, `${fmt(op.head)} m`],
                [copy.values.etaPump, `${fmt(op.etaPump)} %`],
                [copy.values.etaTotal, `${fmt(op.etaTotal)} %`],
                [copy.values.p1, `${fmt(op.p1)} kW`],
                [copy.values.p2, `${fmt(op.p2)} kW`],
                [copy.values.npsh, `${fmt(op.npsh)} m`],
              ].map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4 py-1">
                  <dd className="text-text-muted">{term}</dd>
                  <dd className="font-semibold text-navy-900 tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </SettingsSection>

        <SettingsSection title={copy.sections.fluid}>
          <SelectField<LiquidId>
            layout="stacked"
            label={copy.fluid.liquid}
            value={settings.liquidId}
            onChange={(value) => {
              const next = liquids.find((l) => l.id === value)!
              setSettings((current) => ({
                ...current,
                liquidId: value,
                temperature: Math.min(
                  next.maxTemperature,
                  Math.max(next.minTemperature, current.temperature),
                ),
              }))
            }}
            options={liquids.map((l) => ({ value: l.id, label: l.label }))}
          />
          <div className="mt-3 grid grid-cols-[6rem_minmax(0,1fr)_2rem] items-center gap-2 text-sm">
            <label htmlFor={`${ids}-t`} className={label}>
              {copy.fluid.temperature}
            </label>
            <CompactNumber
              id={`${ids}-t`}
              value={settings.temperature}
              accept={(t) => t >= liquid.minTemperature && t <= liquid.maxTemperature}
              onValue={(t) => set('temperature', t)}
            />
            <span className="text-text-muted">°C</span>
          </div>
        </SettingsSection>

        <SettingsSection title={copy.sections.curveTypes}>
          <ul className="grid grid-cols-2 gap-y-1.5 text-[15px]">
            {types.map((key) => (
              <li key={key}>
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={show[key]}
                    onChange={() => setShow((current) => ({ ...current, [key]: !current[key] }))}
                    className="size-[18px] cursor-pointer accent-primary"
                  />
                  {copy.types[key]}
                </label>
              </li>
            ))}
          </ul>
        </SettingsSection>

        <SettingsSection title={copy.sections.layout}>
          <div
            role="radiogroup"
            aria-label={copy.sections.layout}
            className="space-y-1.5 text-[15px]"
          >
            {(['single', 'parallel'] as const).map((layout) => (
              <label key={layout} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  name={`${ids}-layout`}
                  checked={settings.layout === layout}
                  onChange={() => set('layout', layout)}
                  className="size-4 cursor-pointer accent-primary"
                />
                {copy.layouts[layout]}
              </label>
            ))}
          </div>
        </SettingsSection>

        <div className="border-t border-border pt-3">
          <button
            type="button"
            aria-expanded={advanced}
            onClick={() => setAdvanced((a) => !a)}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {advanced ? copy.advanced.hide : copy.advanced.show}
          </button>
          {advanced && (
            <div className="mt-3 grid animate-fade-in grid-cols-[8.5rem_minmax(0,1fr)_2.5rem] items-center gap-x-2 gap-y-2.5 text-sm">
              <label htmlFor={`${ids}-speed`} className={label}>
                {copy.advanced.speed}
              </label>
              <CompactNumber
                id={`${ids}-speed`}
                value={settings.speedPct}
                accept={(v) => v >= 50 && v <= 100}
                onValue={(v) => set('speedPct', v)}
              />
              <span className="text-text-muted">%</span>
              <label htmlFor={`${ids}-imp`} className={label}>
                {copy.advanced.impeller}
              </label>
              <CompactNumber
                id={`${ids}-imp`}
                value={settings.impeller}
                accept={(v) => v >= article.impellerDiameter * 0.8 && v <= article.impellerDiameter}
                onValue={(v) => set('impeller', v)}
              />
              <span className="text-text-muted">mm</span>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
