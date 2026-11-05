import { useId, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { conditionPage, type RangeId } from '../../data/connect'
import { useElementWidth } from '../../hooks/useElementWidth'
import { niceTicks, timeTickLabel, timeTicks } from '../../lib/connect'
import { formatClock, formatDay } from '../../lib/format'
import type { ConditionPoint } from '../../types'

export type ChartBand = { from: number; to: number; label: string; color: string }
export type ChartLimit = { value: number; label: string; color: string }
export type ChartMarker = { time: number; label: string; color: string }

type TrendChartProps = {
  points: ConditionPoint[]
  value: (point: ConditionPoint) => number
  unit: string
  decimals: number
  range: RangeId
  domain: { min: number; max: number }
  color: string
  /** Shaded value zones, e.g. ISO vibration zones A–D, labelled on the right. */
  bands?: ChartBand[]
  /** Dashed horizontal lines, e.g. warning and alarm limits. */
  limits?: ChartLimit[]
  /** Vertical marks, e.g. when an alert was raised. */
  markers?: ChartMarker[]
  height?: number
  label: string
}

const margin = { top: 14, right: 30, bottom: 30, left: 44 }
const HOUR = 60 * 60 * 1000

/**
 * Time series for the condition page, drawn at its real width: optional zone
 * bands and limit lines, the trend with a soft fill that draws in from the
 * left, and a reading line with a tooltip under the pointer (or arrow keys).
 * Idle samples are part of the line, as on the real dashboards.
 */
export function TrendChart({
  points,
  value,
  unit,
  decimals,
  range,
  domain,
  color,
  bands = [],
  limits = [],
  markers = [],
  height = 240,
  label,
}: TrendChartProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [index, setIndex] = useState<number | null>(null)
  const gradientId = `trend${useId().replace(/[^\w-]/g, '')}`

  const start = points[0].time
  const end = points[points.length - 1].time
  const plotWidth = Math.max(0, width - margin.left - margin.right)
  const plotHeight = height - margin.top - margin.bottom
  const x = (time: number) =>
    margin.left + ((time - start) / Math.max(end - start, HOUR)) * plotWidth
  const y = (v: number) =>
    margin.top +
    plotHeight -
    ((Math.min(Math.max(v, domain.min), domain.max) - domain.min) / (domain.max - domain.min)) *
      plotHeight

  const line = points
    .map((point, i) => `${i ? 'L' : 'M'}${x(point.time).toFixed(1)},${y(value(point)).toFixed(1)}`)
    .join(' ')
  const area = `${line} L${x(end).toFixed(1)},${y(domain.min)} L${x(start).toFixed(1)},${y(domain.min)} Z`

  function readAt(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const share = (event.clientX - rect.left - margin.left) / plotWidth
    setIndex(share < 0 || share > 1 ? null : Math.round(share * (points.length - 1)))
  }

  function handleKey(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const step = event.key === 'ArrowRight' ? 1 : -1
    setIndex((current) =>
      Math.min(points.length - 1, Math.max(0, (current ?? points.length - 1) + step)),
    )
  }

  const reading = index === null ? null : points[index]
  const readingLeft = reading ? x(reading.time) : 0

  return (
    <div ref={ref} className="relative" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={label}
          tabIndex={0}
          onPointerMove={readAt}
          onPointerLeave={() => setIndex(null)}
          onKeyDown={handleKey}
          onBlur={() => setIndex(null)}
          className="block touch-none text-[11px] select-none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {bands.map((band) => {
            const top = y(Math.min(band.to, domain.max))
            const bottom = y(Math.max(band.from, domain.min))
            return bottom - top > 0 ? (
              <g key={band.label}>
                <rect
                  x={margin.left}
                  y={top}
                  width={plotWidth}
                  height={bottom - top}
                  fill={band.color}
                  opacity={0.14}
                />
                <text
                  x={margin.left + plotWidth + 10}
                  y={(top + bottom) / 2}
                  dominantBaseline="middle"
                  fill={band.color}
                  fontWeight={700}
                >
                  {band.label}
                </text>
              </g>
            ) : null
          })}

          {niceTicks(domain.min, domain.max).map((tick) => (
            <g key={tick}>
              <line
                x1={margin.left}
                x2={margin.left + plotWidth}
                y1={y(tick)}
                y2={y(tick)}
                stroke="white"
                strokeOpacity={0.07}
              />
              <text
                x={margin.left - 10}
                y={y(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="var(--sz-color-text-on-dark-muted)"
                className="tabular-nums"
              >
                {tick}
              </text>
            </g>
          ))}
          <text
            x={4}
            y={margin.top - 2}
            fill="var(--sz-color-text-on-dark-muted)"
            dominantBaseline="hanging"
          >
            {unit}
          </text>

          {timeTicks(start, end, range).map((tick) => (
            <text
              key={tick}
              x={x(tick)}
              y={height - 8}
              textAnchor="middle"
              fill="var(--sz-color-text-on-dark-muted)"
            >
              {timeTickLabel(tick, range)}
            </text>
          ))}

          {/* Keyed by range, so switching range draws the line in again. */}
          <path
            key={`area-${range}`}
            d={area}
            fill={`url(#${gradientId})`}
            className="animate-fade-in [animation-duration:800ms]"
          />
          <path
            key={`line-${range}`}
            d={line}
            fill="none"
            stroke={color}
            strokeWidth={1.75}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            className="animate-draw"
          />

          {limits.map((limit) => {
            // A limit just below another one gets its label under the line, so they don't overlap.
            const crowded = limits.some(
              (other) => other.value > limit.value && y(limit.value) - y(other.value) < 20,
            )
            return (
              <g key={limit.label}>
                <line
                  x1={margin.left}
                  x2={margin.left + plotWidth}
                  y1={y(limit.value)}
                  y2={y(limit.value)}
                  stroke={limit.color}
                  strokeWidth={1.25}
                  strokeDasharray="6 4"
                />
                <text
                  x={margin.left + 8}
                  y={y(limit.value) + (crowded ? 14 : -6)}
                  fill={limit.color}
                  fontWeight={600}
                  className="tabular-nums"
                >
                  {limit.label}
                </text>
              </g>
            )
          })}

          {markers
            .filter((marker) => marker.time >= start && marker.time <= end)
            .map((marker) => (
              <g key={marker.label}>
                <line
                  x1={x(marker.time)}
                  x2={x(marker.time)}
                  y1={margin.top}
                  y2={margin.top + plotHeight}
                  stroke={marker.color}
                  strokeOpacity={0.6}
                />
                <rect
                  x={x(marker.time) - 22}
                  y={margin.top}
                  width={44}
                  height={18}
                  rx={9}
                  fill={marker.color}
                />
                <text
                  x={x(marker.time)}
                  y={margin.top + 9}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--sz-color-navy-900)"
                  fontWeight={700}
                  className="tabular-nums"
                >
                  {marker.label}
                </text>
              </g>
            ))}

          {reading && (
            <g pointerEvents="none">
              <line
                x1={readingLeft}
                x2={readingLeft}
                y1={margin.top}
                y2={margin.top + plotHeight}
                stroke="white"
                strokeOpacity={0.35}
              />
              <circle
                cx={readingLeft}
                cy={y(value(reading))}
                r={4.5}
                fill={color}
                stroke="var(--sz-color-navy-900)"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>
      )}

      {reading && (
        <div
          role="status"
          className="pointer-events-none absolute top-2 z-10 rounded-md border border-white/10 bg-navy-900 px-3.5 py-2.5 text-[13px] text-white shadow-raised"
          style={{
            left: readingLeft,
            transform:
              readingLeft > width * 0.65 ? 'translateX(calc(-100% - 14px))' : 'translateX(14px)',
          }}
        >
          <p className="text-text-on-dark-muted tabular-nums">
            {formatDay(reading.time)}, {formatClock(reading.time)}
          </p>
          <p className="mt-0.5 text-base font-bold tabular-nums">
            {value(reading).toFixed(decimals)} {unit}
          </p>
          <p className="text-xs text-text-on-dark-muted">
            {reading.running ? conditionPage.run.running : conditionPage.run.stopped}
          </p>
        </div>
      )}
    </div>
  )
}
