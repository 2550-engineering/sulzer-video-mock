import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import { sizingResultsPage } from '../../data/sizingPages'
import { groupThousands } from '../../lib/format'
import { niceAxis } from '../../lib/modelSpecs'
import { bepFlowAt, efficiencyAt, headAt } from '../../lib/pumpCurves'
import { operatingRange, variantCurve } from '../../lib/sizing'
import type { DutyPoint, SizingResult } from '../../types'

const copy = sizingResultsPage.panel

type SizingCurveChartProps = {
  /** One result shows the full picture; several are overlaid for comparison. */
  results: SizingResult[]
  colors: string[]
  duty: DutyPoint
}

const width = 680
const height = 380
const margin = { top: 20, right: 56, bottom: 50, left: 58 }
const plotWidth = width - margin.left - margin.right
const plotHeight = height - margin.top - margin.bottom
const samples = 60
/** Arrow keys move the reading by this share of the flow axis. */
const keyStep = 1 / 40

const ticks = (max: number, step: number) =>
  Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step)

/**
 * Interactive Q–H chart for sizing results: pump curve(s), the system curve
 * through the duty point, the duty and operating points and, for a single
 * result, efficiency on a second axis and the recommended operating range.
 * Pointer or arrow keys move a reading line with a tooltip. Hand-made SVG,
 * like the other charts.
 */
export function SizingCurveChart({ results, colors, duty }: SizingCurveChartProps) {
  const [reading, setReading] = useState<number | null>(null)
  const single = results.length === 1
  const series = results.map((result, i) => ({
    result,
    color: colors[i % colors.length],
    ...variantCurve(result.variant, duty.frequency),
  }))

  const xAxis = niceAxis(
    Math.max(duty.flow * 1.3, ...series.map((s) => bepFlowAt(s.curve, s.scale) * 1.4)),
  )
  const yAxis = niceAxis(
    Math.max(duty.head * 1.2, ...series.map((s) => headAt(s.curve, s.scale, 0) * 1.05)),
  )
  const x = (flow: number) => margin.left + (flow / xAxis.max) * plotWidth
  const y = (head: number) => margin.top + plotHeight - (head / yAxis.max) * plotHeight
  const yEta = (eta: number) => margin.top + plotHeight - (eta / 100) * plotHeight
  const clampY = (v: number) => Math.min(margin.top + plotHeight, Math.max(margin.top, v))

  const path = (value: (flow: number) => number, toY: (v: number) => number, maxFlow: number) =>
    Array.from({ length: samples + 1 }, (_, i) => {
      const flow = (i / samples) * maxFlow
      return `${i ? 'L' : 'M'}${x(flow).toFixed(1)},${clampY(toY(value(flow))).toFixed(1)}`
    }).join(' ')

  const systemHead = (flow: number) => duty.head * (flow / duty.flow) ** 2
  const primary = series[0]
  const range = primary && {
    from: bepFlowAt(primary.curve, primary.scale) * operatingRange.min,
    to: bepFlowAt(primary.curve, primary.scale) * operatingRange.max,
  }

  function readAt(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const vx = ((event.clientX - rect.left) / rect.width) * width
    const flow = ((vx - margin.left) / plotWidth) * xAxis.max
    setReading(flow >= 0 && flow <= xAxis.max ? flow : null)
  }

  function handleKey(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const step = xAxis.max * keyStep * (event.key === 'ArrowRight' ? 1 : -1)
    setReading((current) => Math.min(xAxis.max, Math.max(0, (current ?? duty.flow) + step)))
  }

  const tooltipLeft = reading === null ? 0 : (x(reading) / width) * 100
  const values =
    reading === null
      ? []
      : [
          ...series.map((s) => ({
            label: single ? copy.pumpCurve : s.result.variant.name,
            color: s.color,
            value: `${Math.max(0, headAt(s.curve, s.scale, reading)).toFixed(1)} m`,
          })),
          {
            label: copy.systemCurve,
            color: 'var(--sz-color-navy-600)',
            value: `${systemHead(reading).toFixed(1)} m`,
          },
          ...(single
            ? [
                {
                  label: copy.efficiencyCurve,
                  color: 'var(--sz-color-accent-cyan)',
                  value: `${efficiencyAt(primary.curve, primary.scale, primary.trimRatio, reading).toFixed(1)} %`,
                },
              ]
            : []),
        ]

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${copy.pumpCurve}: ${results.map((r) => r.variant.name).join(', ')}. ${copy.dutyPoint} ${duty.flow} m³/h, ${duty.head} m.`}
        tabIndex={0}
        onPointerMove={readAt}
        onPointerLeave={() => setReading(null)}
        onKeyDown={handleKey}
        onBlur={() => setReading(null)}
        className="h-auto w-full touch-none text-[11px] select-none"
      >
        {single && range && (
          <rect
            x={x(range.from)}
            y={margin.top}
            width={x(range.to) - x(range.from)}
            height={plotHeight}
            fill="var(--sz-color-primary)"
            opacity={0.06}
          />
        )}

        {ticks(yAxis.max, yAxis.step).map((tick) => (
          <g key={`y${tick}`}>
            <line
              x1={margin.left}
              x2={margin.left + plotWidth}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--sz-color-border)"
            />
            <text
              x={margin.left - 8}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fill="var(--sz-color-text-muted)"
            >
              {groupThousands(tick)}
            </text>
          </g>
        ))}
        {ticks(xAxis.max, xAxis.step).map((tick) => (
          <text
            key={`x${tick}`}
            x={x(tick)}
            y={margin.top + plotHeight + 16}
            textAnchor="middle"
            fill="var(--sz-color-text-muted)"
          >
            {groupThousands(tick)}
          </text>
        ))}
        <line
          x1={margin.left}
          x2={margin.left + plotWidth}
          y1={margin.top + plotHeight}
          y2={margin.top + plotHeight}
          stroke="var(--sz-color-border-strong)"
        />
        <text
          x={margin.left + plotWidth / 2}
          y={height - 8}
          textAnchor="middle"
          fill="var(--sz-color-text)"
          fontWeight={600}
        >
          {copy.flowAxis}
        </text>
        <text
          transform={`translate(14 ${margin.top + plotHeight / 2}) rotate(-90)`}
          textAnchor="middle"
          fill="var(--sz-color-text)"
          fontWeight={600}
        >
          {copy.headAxis}
        </text>

        {single && (
          <>
            {ticks(100, 20).map((tick) => (
              <text
                key={`eta${tick}`}
                x={margin.left + plotWidth + 8}
                y={yEta(tick)}
                dominantBaseline="middle"
                fill="var(--sz-color-text-subtle)"
              >
                {tick}
              </text>
            ))}
            <text
              transform={`translate(${width - 10} ${margin.top + plotHeight / 2}) rotate(90)`}
              textAnchor="middle"
              fill="var(--sz-color-text-muted)"
              fontWeight={600}
            >
              {copy.efficiencyAxis}
            </text>
            <path
              d={path(
                (flow) => efficiencyAt(primary.curve, primary.scale, primary.trimRatio, flow),
                yEta,
                bepFlowAt(primary.curve, primary.scale) * 1.4,
              )}
              fill="none"
              stroke="var(--sz-color-accent-cyan)"
              strokeWidth={2}
              strokeDasharray="5 4"
            />
          </>
        )}

        <path
          d={path(systemHead, y, xAxis.max)}
          fill="none"
          stroke="var(--sz-color-navy-600)"
          strokeWidth={1.5}
          strokeDasharray="2 4"
        />
        {series.map((s) => (
          <path
            key={s.result.variant.id}
            d={path((flow) => headAt(s.curve, s.scale, flow), y, bepFlowAt(s.curve, s.scale) * 1.4)}
            fill="none"
            stroke={s.color}
            strokeWidth={2.75}
            strokeLinecap="round"
          />
        ))}

        {/* Operating points, then the duty point on top. */}
        {series.map((s) => (
          <circle
            key={`op-${s.result.variant.id}`}
            cx={x(s.result.operatingPoint.flow)}
            cy={y(s.result.operatingPoint.head)}
            r={4.5}
            fill="white"
            stroke={s.color}
            strokeWidth={2.5}
          />
        ))}
        <circle
          cx={x(duty.flow)}
          cy={y(duty.head)}
          r={6}
          fill="var(--sz-color-accent-yellow)"
          stroke="var(--sz-color-navy-900)"
          strokeWidth={1.5}
        />
        <text
          x={x(duty.flow) - 12}
          y={y(duty.head) + 22}
          textAnchor="end"
          fill="var(--sz-color-navy-900)"
          fontWeight={600}
        >
          {`${copy.dutyPoint}: ${groupThousands(duty.flow)} m³/h · ${duty.head} m`}
        </text>

        {reading !== null && (
          <g pointerEvents="none">
            <line
              x1={x(reading)}
              x2={x(reading)}
              y1={margin.top}
              y2={margin.top + plotHeight}
              stroke="var(--sz-color-navy-900)"
              strokeOpacity={0.35}
            />
            {series.map((s) => {
              const head = headAt(s.curve, s.scale, reading)
              return head >= 0 ? (
                <circle
                  key={`r-${s.result.variant.id}`}
                  cx={x(reading)}
                  cy={y(head)}
                  r={3.5}
                  fill={s.color}
                />
              ) : null
            })}
          </g>
        )}
      </svg>

      {reading !== null && (
        <div
          role="status"
          className="pointer-events-none absolute top-3 rounded-md bg-navy-900 px-3.5 py-2.5 text-[13px] text-white shadow-raised"
          style={{
            left: `${tooltipLeft}%`,
            transform: tooltipLeft > 60 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
          }}
        >
          <p className="font-semibold tabular-nums">Q = {groupThousands(reading, 0)} m³/h</p>
          <ul className="mt-1 space-y-0.5">
            {values.map((v) => (
              <li key={v.label} className="flex items-center gap-2 whitespace-nowrap">
                <span aria-hidden className="size-2 rounded-full" style={{ background: v.color }} />
                <span className="text-text-on-dark-muted">{v.label}</span>
                <span className="ml-auto pl-3 font-semibold tabular-nums">{v.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-text-muted">
        {series.map((s) => (
          <li key={s.result.variant.id} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-[3px] w-5 rounded-full"
              style={{ background: s.color }}
            />
            {single ? copy.pumpCurve : s.result.variant.name}
          </li>
        ))}
        <li className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-0 w-5 border-t-2 border-dotted border-navy-600" />
          {copy.systemCurve}
        </li>
        {single && (
          <>
            <li className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-0 w-5 border-t-2 border-dashed border-accent-cyan" />
              {copy.efficiencyCurve}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-3 w-5 rounded-sm bg-primary/10" />
              {copy.operatingRange}
            </li>
          </>
        )}
        <li className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2.5 rounded-full border border-navy-900 bg-accent-yellow"
          />
          {copy.dutyPoint}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full border-2 border-primary bg-white" />
          {copy.operatingPoint}
        </li>
      </ul>
      <p className="mt-2 text-xs text-text-subtle">{copy.chartHint}</p>
    </div>
  )
}
