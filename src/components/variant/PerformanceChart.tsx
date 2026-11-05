import { useCallback, useState, type PointerEvent, type Ref } from 'react'
import { variantPage } from '../../data/variantPages'
import { groupThousands } from '../../lib/format'
import { niceAxis } from '../../lib/modelSpecs'
import { performance, type CurvePoint, type CurveSettings } from '../../lib/performance'
import type { OperatingPoint, ResultArticle } from '../../types'
import { useChartTouch } from '../../hooks/useChartTouch'
import { useClampedTooltip } from '../../hooks/useClampedTooltip'
import { useElementWidth } from '../../hooks/useElementWidth'
import { ChartReadout } from '../charts/ChartReadout'

const copy = variantPage.curves.chart

export type CurveVisibility = {
  qh: boolean
  eta: boolean
  p1: boolean
  p2: boolean
  npsh: boolean
  system: boolean
}

export type FlowUnit = 'm3h' | 'ls'

type PerformanceChartProps = {
  article: ResultArticle
  settings: CurveSettings
  /** Duty point to mark, or null for none. */
  duty: OperatingPoint | null
  show: CurveVisibility
  unit: FlowUnit
  /** The <svg>, for "download". */
  svgRef?: Ref<SVGSVGElement>
}

// Layout, in SVG units: two plots on one flow axis.
const width = 760
const left = 60
const right = 60
const plotWidth = width - left - right
const top1 = { y: 30, h: 250 }
const top2 = { y: 336, h: 170 }
const height = top2.y + top2.h + 58
const samples = 80

const blue = 'var(--sz-color-primary)'
const ink = 'var(--sz-color-text)'
const smooth = 'transition-[d] duration-200 ease-sz'

const ticks = (axis: { max: number; step: number }) =>
  Array.from({ length: Math.round(axis.max / axis.step) + 1 }, (_, i) => i * axis.step)

const fmt = (value: number, decimals = 1) => groupThousands(value, decimals)

/**
 * Datasheet-style performance curves, two plots on one flow axis: head with
 * pump and total efficiency on top, P1, P2 and NPSH below. Fine grid, axis
 * titles, a legend box, an optional duty point with the system curve and the
 * values where the pump runs, and a hover crosshair through both plots.
 * Paths morph when settings change.
 */
export function PerformanceChart({
  article,
  settings,
  duty,
  show,
  unit,
  svgRef,
}: PerformanceChartProps) {
  const [reading, setReading] = useState<{ flow: number; left: number } | null>(null)
  const [containerRef, containerWidth] = useElementWidth<HTMLDivElement>()
  const model = performance(article, settings)
  const toUnit = (flow: number) => (unit === 'ls' ? flow / 3.6 : flow)
  const unitLabel = unit === 'ls' ? 'l/s' : 'm³/h'

  const points: CurvePoint[] = Array.from({ length: samples + 1 }, (_, i) =>
    model.at((i / samples) * model.maxFlow),
  )
  const powered = points.filter((p) => p.flow >= model.minPowerFlow)
  const op = duty ? model.operatingPoint(duty) : null

  const xAxis = niceAxis(toUnit(model.maxFlow) * 1.04)
  const hAxis = niceAxis(Math.max(model.shutOffHead * 1.08, (duty?.head ?? 0) * 1.12))
  const etaAxis = { max: 100, step: 20 }
  const pAxis = niceAxis(Math.max(...powered.map((p) => p.p1)) * 1.12)
  const npshAxis = niceAxis(Math.max(...points.map((p) => p.npsh)) * 1.2)

  const x = (flow: number) => left + (toUnit(flow) / xAxis.max) * plotWidth
  const y = (plot: { y: number; h: number }, axis: { max: number }, v: number) =>
    plot.y + plot.h - (Math.min(Math.max(v, 0), axis.max) / axis.max) * plot.h
  const yH = (v: number) => y(top1, hAxis, v)
  const yEta = (v: number) => y(top1, etaAxis, v)
  const yP = (v: number) => y(top2, pAxis, v)
  const yN = (v: number) => y(top2, npshAxis, v)

  const path = (list: CurvePoint[], value: (p: CurvePoint) => number, toY: (v: number) => number) =>
    list
      .map((p, i) => `${i ? 'L' : 'M'}${x(p.flow).toFixed(1)},${toY(value(p)).toFixed(1)}`)
      .join(' ')

  const curves = [
    show.qh && {
      key: 'qh',
      d: path(points, (p) => p.head, yH),
      color: blue,
      width: 2.5,
      label: 'H',
      at: yH(points.at(-1)!.head),
    },
    show.eta && {
      key: 'eta',
      d: path(points, (p) => p.etaPump, yEta),
      color: ink,
      width: 1.5,
      label: copy.etaPump,
      at: yEta(points.at(-1)!.etaPump),
    },
    show.eta && {
      key: 'etaT',
      d: path(points, (p) => p.etaTotal, yEta),
      color: ink,
      width: 1,
      dash: '5 3',
      label: copy.etaTotal,
      at: yEta(points.at(-1)!.etaTotal),
    },
    show.p1 && {
      key: 'p1',
      d: path(powered, (p) => p.p1, yP),
      color: blue,
      width: 2,
      label: 'P1',
      at: yP(powered.at(-1)!.p1),
    },
    show.p2 && {
      key: 'p2',
      d: path(powered, (p) => p.p2, yP),
      color: blue,
      width: 1.25,
      label: 'P2',
      at: yP(powered.at(-1)!.p2),
    },
    show.npsh && {
      key: 'npsh',
      d: path(points, (p) => p.npsh, yN),
      color: ink,
      width: 1.75,
      label: 'NPSH',
      at: yN(points.at(-1)!.npsh),
    },
  ].filter((c) => c !== false)

  function grid(
    plot: { y: number; h: number },
    axis: { max: number; step: number },
    toY: (v: number) => number,
  ) {
    const minor = ticks({ max: axis.max, step: axis.step / 2 })
    const xMinor = ticks({ max: xAxis.max, step: xAxis.step / 2 })
    return (
      <g>
        {minor.map((v) => (
          <line
            key={`h${v}`}
            x1={left}
            x2={left + plotWidth}
            y1={toY(v)}
            y2={toY(v)}
            stroke="var(--sz-color-border)"
            strokeOpacity={v % axis.step === 0 ? 1 : 0.45}
          />
        ))}
        {xMinor.map((v) => {
          const vx = left + (v / xAxis.max) * plotWidth
          return (
            <line
              key={`v${v}`}
              x1={vx}
              x2={vx}
              y1={plot.y}
              y2={plot.y + plot.h}
              stroke="var(--sz-color-border)"
              strokeOpacity={v % xAxis.step === 0 ? 1 : 0.45}
            />
          )
        })}
        <rect
          x={left}
          y={plot.y}
          width={plotWidth}
          height={plot.h}
          fill="none"
          stroke="var(--sz-color-border-strong)"
        />
      </g>
    )
  }

  const axisText = 'fill-text-muted text-[10px]'
  const titleText = 'fill-text text-[11px] font-semibold'

  function leftTicks(axis: { max: number; step: number }, toY: (v: number) => number) {
    return ticks(axis).map((v) => (
      <text
        key={v}
        x={left - 6}
        y={toY(v)}
        textAnchor="end"
        dominantBaseline="middle"
        className={axisText}
      >
        {groupThousands(v, axis.step % 1 ? 1 : 0)}
      </text>
    ))
  }
  function rightTicks(axis: { max: number; step: number }, toY: (v: number) => number) {
    return ticks(axis).map((v) => (
      <text
        key={v}
        x={left + plotWidth + 6}
        y={toY(v)}
        dominantBaseline="middle"
        className={axisText}
      >
        {groupThousands(v, axis.step % 1 ? 1 : 0)}
      </text>
    ))
  }
  function flowTicks(plot: { y: number; h: number }) {
    return ticks(xAxis).map((v) => (
      <text
        key={v}
        x={left + (v / xAxis.max) * plotWidth}
        y={plot.y + plot.h + 14}
        textAnchor="middle"
        className={axisText}
      >
        {groupThousands(v, xAxis.step % 1 ? 1 : 0)}
      </text>
    ))
  }

  function readAt(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const vx = ((event.clientX - rect.left) / rect.width) * width
    const raw = ((vx - left) / plotWidth) * xAxis.max
    const maxDisplay = unit === 'ls' ? model.maxFlow / 3.6 : model.maxFlow
    // A finger in the chart margin reads the nearest end instead of nothing.
    const display = event.pointerType === 'mouse' ? raw : Math.min(Math.max(raw, 0), maxDisplay)
    const flow = unit === 'ls' ? display * 3.6 : display
    if (display < 0 || flow > model.maxFlow) return setReading(null)
    setReading({ flow, left: (x(flow) / width) * 100 })
  }
  const clearReading = useCallback(() => setReading(null), [])
  const touch = useChartTouch<SVGSVGElement>(containerRef, readAt, clearReading)

  const r = reading && model.at(reading.flow)
  const readingRows = r
    ? [
        [`Q`, `${fmt(toUnit(r.flow), 1)} ${unitLabel}`, ink],
        show.qh && ['H', `${fmt(r.head)} m`, blue],
        show.eta && [copy.etaPump, `${fmt(r.etaPump)} %`, ink],
        show.eta && [copy.etaTotal, `${fmt(r.etaTotal)} %`, ink],
        show.p1 && r.flow >= model.minPowerFlow && ['P1', `${fmt(r.p1)} kW`, blue],
        show.p2 && r.flow >= model.minPowerFlow && ['P2', `${fmt(r.p2)} kW`, blue],
        show.npsh && ['NPSH', `${fmt(r.npsh)} m`, ink],
      ].filter((row): row is string[] => Array.isArray(row))
    : []

  // The chart scales with its box: view units to CSS pixels for the tooltip position.
  const scale = containerWidth / width
  const [tooltipRef, tooltipStyle] = useClampedTooltip(
    containerRef,
    r ? { x: x(r.flow) * scale, y: (show.qh ? yH(r.head) : top1.y) * scale } : null,
  )

  const opPoint = op?.point
  const opLeft = opPoint ? x(opPoint.flow) > left + plotWidth * 0.62 : false
  const legend = [
    article.code,
    settings.layout === 'parallel' ? `${article.supply} · ${copy.parallel}` : article.supply,
  ]

  return (
    <div ref={containerRef} className="relative">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={copy.label(article.code)}
        {...touch}
        className="h-auto w-full touch-none bg-white font-sans select-none max-xl:touch-pan-y"
      >
        {/* Top: head and efficiency. */}
        {grid(top1, hAxis, yH)}
        {leftTicks(hAxis, yH)}
        {rightTicks(etaAxis, yEta)}
        {flowTicks(top1)}
        <text x={left - 6} y={top1.y - 12} textAnchor="end" className={titleText}>
          H [m]
        </text>
        <text x={left + plotWidth + 6} y={top1.y - 12} className={titleText}>
          eta [%]
        </text>

        {/* Bottom: power and NPSH. */}
        {grid(top2, pAxis, yP)}
        {leftTicks(pAxis, yP)}
        {rightTicks(npshAxis, yN)}
        {flowTicks(top2)}
        <text x={left - 6} y={top2.y - 12} textAnchor="end" className={titleText}>
          P [kW]
        </text>
        <text x={left + plotWidth + 6} y={top2.y - 12} className={titleText}>
          NPSH [m]
        </text>
        <text x={left + plotWidth} y={top2.y + top2.h + 34} textAnchor="end" className={titleText}>
          Q [{unitLabel}]
        </text>

        {show.system && op && (
          <path
            d={path(points, (p) => op.systemHead(p.flow), yH)}
            fill="none"
            stroke="var(--sz-color-navy-600)"
            strokeWidth={1.25}
            strokeDasharray="2 4"
            className={smooth}
          />
        )}

        {curves.map((c) => (
          <g key={c.key}>
            <path
              d={c.d}
              fill="none"
              stroke={c.color}
              strokeWidth={c.width}
              strokeDasharray={'dash' in c ? c.dash : undefined}
              strokeLinejoin="round"
              className={smooth}
            />
            <text
              x={left + plotWidth - 4}
              y={c.at - 6}
              textAnchor="end"
              className="text-[10px] font-semibold"
              fill={c.color}
              stroke="white"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {c.label}
            </text>
          </g>
        ))}

        {/* Legend box, top right of the head plot. */}
        <g>
          <rect
            x={left + plotWidth - 264}
            y={top1.y + 6}
            width={258}
            height={34}
            fill="white"
            stroke="var(--sz-color-border-strong)"
          />
          {legend.map((line, i) => (
            <text
              key={line}
              x={left + plotWidth - 256}
              y={top1.y + 19 + i * 13}
              className={`fill-text text-[10px] ${i === 0 ? 'font-semibold' : ''}`}
            >
              {line}
            </text>
          ))}
        </g>

        {/* Duty point, the operating point and the values there, on both plots. */}
        {duty && opPoint && (
          <g pointerEvents="none">
            <line
              x1={x(opPoint.flow)}
              x2={x(opPoint.flow)}
              y1={top1.y}
              y2={top2.y + top2.h}
              stroke="var(--sz-color-navy-900)"
              strokeOpacity={0.4}
              strokeDasharray="3 3"
            />
            <circle
              cx={x(duty.flow)}
              cy={yH(duty.head)}
              r={6}
              fill="var(--sz-color-accent-yellow)"
              stroke="var(--sz-color-navy-900)"
              strokeWidth={1.5}
            />
            <circle
              cx={x(opPoint.flow)}
              cy={yH(opPoint.head)}
              r={4.5}
              fill="white"
              stroke={blue}
              strokeWidth={2.5}
            />
            {show.eta && (
              <circle cx={x(opPoint.flow)} cy={yEta(opPoint.etaPump)} r={3.5} fill={ink} />
            )}
            {show.p1 && <circle cx={x(opPoint.flow)} cy={yP(opPoint.p1)} r={3.5} fill={blue} />}
            {show.p2 && <circle cx={x(opPoint.flow)} cy={yP(opPoint.p2)} r={3.5} fill={blue} />}
            {show.npsh && <circle cx={x(opPoint.flow)} cy={yN(opPoint.npsh)} r={3.5} fill={ink} />}
            <text
              x={x(opPoint.flow) + (opLeft ? -10 : 10)}
              y={top1.y + 54}
              textAnchor={opLeft ? 'end' : 'start'}
              className="fill-navy-900 text-[10.5px] font-semibold"
              stroke="white"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {copy.atTop(
                fmt(toUnit(opPoint.flow), 1),
                unitLabel,
                fmt(opPoint.head),
                fmt(opPoint.etaPump),
              )}
            </text>
            <text
              x={x(opPoint.flow) + (opLeft ? -10 : 10)}
              y={top2.y + 16}
              textAnchor={opLeft ? 'end' : 'start'}
              className="fill-navy-900 text-[10.5px] font-semibold"
              stroke="white"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {copy.atBottom(fmt(opPoint.p1), fmt(opPoint.p2), fmt(opPoint.npsh))}
            </text>
          </g>
        )}

        {/* Hover crosshair through both plots. */}
        {r && (
          <g pointerEvents="none">
            <line
              x1={x(r.flow)}
              x2={x(r.flow)}
              y1={top1.y}
              y2={top2.y + top2.h}
              stroke="var(--sz-color-navy-900)"
              strokeOpacity={0.5}
            />
            {show.qh && <circle cx={x(r.flow)} cy={yH(r.head)} r={3} fill={blue} />}
            {show.eta && <circle cx={x(r.flow)} cy={yEta(r.etaPump)} r={2.5} fill={ink} />}
            {show.p1 && r.flow >= model.minPowerFlow && (
              <circle cx={x(r.flow)} cy={yP(r.p1)} r={2.5} fill={blue} />
            )}
            {show.p2 && r.flow >= model.minPowerFlow && (
              <circle cx={x(r.flow)} cy={yP(r.p2)} r={2.5} fill={blue} />
            )}
            {show.npsh && <circle cx={x(r.flow)} cy={yN(r.npsh)} r={2.5} fill={ink} />}
          </g>
        )}
      </svg>

      {reading && readingRows.length > 0 && (
        <div
          ref={tooltipRef}
          role="status"
          className="pointer-events-none absolute top-10 rounded-md bg-navy-900 px-3.5 py-2.5 text-[12px] text-white shadow-raised max-md:hidden"
          style={
            tooltipStyle ?? {
              left: `${reading.left}%`,
              transform: reading.left > 60 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
            }
          }
        >
          <ul className="space-y-0.5">
            {readingRows.map(([label, value]) => (
              <li key={label} className="flex justify-between gap-5 whitespace-nowrap">
                <span className="text-text-on-dark-muted">{label}</span>
                <span className="font-semibold tabular-nums">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phones: the reading in a bar under the chart instead of a following tooltip. */}
      <ChartReadout
        className="mt-3"
        items={
          readingRows.length
            ? readingRows.map(([label, value, color], i) => ({
                label,
                value,
                color: i === 0 ? undefined : color,
              }))
            : null
        }
      />

      <p className="mt-2 text-xs text-text-muted">
        {copy.note(fmt(settings.temperature, 0), model.liquid.label)}
      </p>
    </div>
  )
}
