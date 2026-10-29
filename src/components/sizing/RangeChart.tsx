import { useId, useState, type MouseEvent, type PointerEvent } from 'react'
import { sizingParametersPage } from '../../data/sizingPages'
import { groupThousands } from '../../lib/format'
import { covers, rangeAreas } from '../../lib/rangeChart'
import { roundSignificant } from '../../lib/units'
import type { OperatingPoint } from '../../types'

const copy = sizingParametersPage.chart

type RangeChartProps = {
  productId: string
  productName: string
  frequency: 50 | 60
  duty: OperatingPoint
  /** Area keys ("<hydraulic id>-<poles>p") that still match the parameters; the rest fade out. */
  activeKeys: Set<string>
  /** Click in the chart: the point under the pointer, rounded to 2 significant figures. */
  onPick: (point: OperatingPoint) => void
}

const width = 680
const height = 520
const margin = { top: 14, right: 16, bottom: 44, left: 48 }
const plotWidth = width - margin.left - margin.right
const plotHeight = height - margin.top - margin.bottom
const xAxis = { min: 2, max: 1000 }
const yAxis = { min: 2, max: 200 }

/** 1-2-5 labels, and minor lines at the other whole multiples, within a range. */
function gridLines(axis: { min: number; max: number }) {
  const major: number[] = []
  const minor: number[] = []
  for (let exponent = -1; exponent <= 4; exponent++) {
    for (let m = 1; m <= 9; m++) {
      const v = m * 10 ** exponent
      if (v < axis.min || v > axis.max) continue
      ;([1, 2, 5].includes(m) ? major : minor).push(v)
    }
  }
  return { major, minor }
}

const scale = (v: number, axis: { min: number; max: number }) =>
  (Math.log10(v) - Math.log10(axis.min)) / (Math.log10(axis.max) - Math.log10(axis.min))
const x = (flow: number) => margin.left + scale(flow, xAxis) * plotWidth
const y = (head: number) =>
  margin.top + plotHeight - scale(Math.max(head, yAxis.min / 2), yAxis) * plotHeight
const fromX = (vx: number) =>
  10 **
  (Math.log10(xAxis.min) + ((vx - margin.left) / plotWidth) * Math.log10(xAxis.max / xAxis.min))
const fromY = (vy: number) =>
  10 **
  (Math.log10(yAxis.min) +
    ((margin.top + plotHeight - vy) / plotHeight) * Math.log10(yAxis.max / yAxis.min))

/**
 * Range chart: every size of the product family × pole count as a translucent
 * coverage area on fixed log–log axes, the product name in a box, and the duty
 * point. Areas whose configurations are filtered out fade away; areas covering
 * the duty point are drawn darker. Hover names an area; a click sets the duty
 * point. Hand-made SVG, like the other charts.
 */
export function RangeChart({
  productId,
  productName,
  frequency,
  duty,
  activeKeys,
  onPick,
}: RangeChartProps) {
  const clipId = useId()
  const [hover, setHover] = useState<{ label: string; left: number; top: number } | null>(null)
  const areas = rangeAreas(productId, frequency)
  const covering = new Set(
    areas.filter((a) => activeKeys.has(a.key) && covers(a, duty)).map((a) => a.key),
  )
  // Covering areas last, so they sit on top.
  const ordered = [
    ...areas.filter((a) => !covering.has(a.key)),
    ...areas.filter((a) => covering.has(a.key)),
  ]
  const xGrid = gridLines(xAxis)
  const yGrid = gridLines(yAxis)

  function toView(event: MouseEvent<Element> | PointerEvent<Element>) {
    const svg = (event.currentTarget as Element).closest('svg')!.getBoundingClientRect()
    return {
      vx: ((event.clientX - svg.left) / svg.width) * width,
      vy: ((event.clientY - svg.top) / svg.height) * height,
      left: event.clientX - svg.left,
      top: event.clientY - svg.top,
    }
  }

  function pick(event: MouseEvent<SVGSVGElement>) {
    const { vx, vy } = toView(event)
    if (
      vx < margin.left ||
      vx > margin.left + plotWidth ||
      vy < margin.top ||
      vy > margin.top + plotHeight
    )
      return
    onPick({ flow: roundSignificant(fromX(vx)), head: roundSignificant(fromY(vy)) })
  }

  const dx = x(duty.flow)
  const dy = y(duty.head)
  const labelLeft = dx > margin.left + plotWidth * 0.6
  const label = copy.dutyPoint(
    groupThousands(duty.flow, duty.flow % 1 ? 1 : 0),
    groupThousands(duty.head, duty.head % 1 ? 1 : 0),
  )

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${copy.title(productName)}. ${copy.covering(covering.size, productName)}`}
        onClick={pick}
        className="h-auto w-full cursor-crosshair text-[10px] select-none"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} />
          </clipPath>
        </defs>
        <rect
          x={margin.left}
          y={margin.top}
          width={plotWidth}
          height={plotHeight}
          fill="white"
          stroke="var(--sz-color-border-strong)"
        />

        {xGrid.minor.map((v) => (
          <line
            key={`xm${v}`}
            x1={x(v)}
            x2={x(v)}
            y1={margin.top}
            y2={margin.top + plotHeight}
            stroke="var(--sz-color-border)"
            strokeOpacity={0.6}
          />
        ))}
        {yGrid.minor.map((v) => (
          <line
            key={`ym${v}`}
            x1={margin.left}
            x2={margin.left + plotWidth}
            y1={y(v)}
            y2={y(v)}
            stroke="var(--sz-color-border)"
            strokeOpacity={0.6}
          />
        ))}
        {xGrid.major.map((v) => (
          <g key={`x${v}`}>
            <line
              x1={x(v)}
              x2={x(v)}
              y1={margin.top}
              y2={margin.top + plotHeight}
              stroke="var(--sz-color-border-strong)"
            />
            <text
              x={x(v)}
              y={margin.top + plotHeight + 14}
              textAnchor="middle"
              fill="var(--sz-color-text-muted)"
            >
              {groupThousands(v)}
            </text>
          </g>
        ))}
        {yGrid.major.map((v) => (
          <g key={`y${v}`}>
            <line
              x1={margin.left}
              x2={margin.left + plotWidth}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--sz-color-border-strong)"
            />
            <text
              x={margin.left - 6}
              y={y(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fill="var(--sz-color-text-muted)"
            >
              {groupThousands(v)}
            </text>
          </g>
        ))}
        <text
          x={margin.left + plotWidth / 2}
          y={height - 8}
          textAnchor="middle"
          fill="var(--sz-color-text)"
          fontSize={11}
          fontWeight={600}
        >
          {copy.flowAxis}
        </text>
        <text
          transform={`translate(12 ${margin.top + plotHeight / 2}) rotate(-90)`}
          textAnchor="middle"
          fill="var(--sz-color-text)"
          fontSize={11}
          fontWeight={600}
        >
          {copy.headAxis}
        </text>

        <g clipPath={`url(#${clipId})`}>
          {ordered.map((area) => {
            const active = activeKeys.has(area.key)
            const on = covering.has(area.key)
            return (
              <path
                key={area.key}
                d={`${area.points
                  .map((p, i) => `${i ? 'L' : 'M'}${x(p.flow).toFixed(1)},${y(p.head).toFixed(1)}`)
                  .join(' ')} Z`}
                fill="var(--sz-color-primary)"
                stroke="var(--sz-color-brand)"
                fillOpacity={active ? (on ? 0.32 : 0.13) : 0}
                strokeOpacity={active ? (on ? 1 : 0.55) : 0}
                strokeWidth={on ? 1.4 : 0.8}
                pointerEvents={active ? 'visiblePainted' : 'none'}
                className="transition-[fill-opacity,stroke-opacity] duration-200 ease-sz"
                onPointerMove={(event) => {
                  const { left, top } = toView(event)
                  setHover({
                    label: copy.area(area.hydraulic.code, area.hydraulic.size, area.poles),
                    left,
                    top,
                  })
                }}
                onPointerLeave={() => setHover(null)}
              />
            )
          })}
        </g>

        {/* Product group box, top right. */}
        <g pointerEvents="none">
          <rect
            x={margin.left + plotWidth - 86}
            y={margin.top + 8}
            width={78}
            height={24}
            rx={2}
            fill="white"
            stroke="var(--sz-color-navy-900)"
          />
          <text
            x={margin.left + plotWidth - 47}
            y={margin.top + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--sz-color-navy-900)"
            fontSize={12}
            fontWeight={700}
          >
            {productName}
          </text>
        </g>

        <g pointerEvents="none">
          <path
            d={`M${dx},${margin.top + plotHeight} V${dy} H${margin.left}`}
            fill="none"
            stroke="var(--sz-color-navy-900)"
            strokeOpacity={0.45}
            strokeDasharray="3 3"
          />
          <circle
            cx={dx}
            cy={dy}
            r={6.5}
            fill="var(--sz-color-accent-yellow)"
            stroke="var(--sz-color-navy-900)"
            strokeWidth={1.75}
          />
          <text
            x={labelLeft ? dx - 11 : dx + 11}
            y={dy - 11}
            textAnchor={labelLeft ? 'end' : 'start'}
            fill="var(--sz-color-navy-900)"
            fontSize={12}
            fontWeight={700}
            stroke="white"
            strokeWidth={3}
            paintOrder="stroke"
          >
            {label}
          </text>
        </g>
      </svg>

      {hover && (
        <div
          role="status"
          className="pointer-events-none absolute rounded-sm bg-navy-900 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-card"
          style={{ left: hover.left + 12, top: hover.top - 34 }}
        >
          {hover.label}
        </div>
      )}
    </div>
  )
}
