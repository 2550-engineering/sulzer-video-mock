import { productPage } from '../../data/catalogPages'
import { curveFlowRange, efficiencyAt, headAt, niceAxis } from '../../lib/modelSpecs'
import type { ProductModel } from '../../types'

const copy = productPage.models.detail

export type CurveSeries = { model: ProductModel; color: string }

type PerformanceCurveProps = {
  series: CurveSeries[]
  /** Dashed efficiency curve on a right-hand axis. One model only. */
  showEfficiency?: boolean
  /** Marks the rated point with guide lines and a label. One model only. */
  showRatedPoint?: boolean
}

const width = 480
const height = 290
const samples = 48

/** "5 000" style thousands, like the key specs. */
const formatNumber = (n: number) => n.toLocaleString('en-GB').replaceAll(',', ' ')

const ticks = (max: number, step: number) =>
  Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step)

/**
 * Head–flow curve drawn in SVG from the model's rated point: a parabola from
 * shut-off head through the rated point, out to 1.4 × rated flow. Static and
 * deterministic, so it looks the same in every recording.
 */
export function PerformanceCurve({
  series,
  showEfficiency = false,
  showRatedPoint = false,
}: PerformanceCurveProps) {
  const margin = { top: 18, right: showEfficiency ? 48 : 18, bottom: 46, left: 54 }
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom

  const xAxis = niceAxis(Math.max(...series.map(({ model }) => model.flow * curveFlowRange)))
  const yAxis = niceAxis(Math.max(...series.map(({ model }) => headAt(model, 0))) * 1.05)
  const etaAxis = { max: 100, step: 20 }

  const x = (flow: number) => margin.left + (flow / xAxis.max) * plotWidth
  const y = (head: number) => margin.top + plotHeight - (head / yAxis.max) * plotHeight
  const yEta = (eta: number) => margin.top + plotHeight - (eta / etaAxis.max) * plotHeight

  const path = (
    model: ProductModel,
    value: (flow: number) => number,
    scale: (v: number) => number,
  ) =>
    Array.from({ length: samples + 1 }, (_, i) => {
      const flow = (i / samples) * model.flow * curveFlowRange
      return `${i === 0 ? 'M' : 'L'}${x(flow).toFixed(1)},${scale(value(flow)).toFixed(1)}`
    }).join(' ')

  const rated = series[0]?.model
  const label = series
    .map(({ model }) => `${model.name}: ${model.flow} m³/h at ${model.head} m`)
    .join('; ')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${copy.curveTitle}. ${label}`}
      className="h-auto w-full text-[11px]"
    >
      {/* Grid and axes */}
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
            {formatNumber(tick)}
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
          {formatNumber(tick)}
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
        y={height - 6}
        textAnchor="middle"
        fill="var(--sz-color-text)"
        fontWeight={600}
      >
        {copy.flowAxis}
      </text>
      <text
        transform={`translate(13 ${margin.top + plotHeight / 2}) rotate(-90)`}
        textAnchor="middle"
        fill="var(--sz-color-text)"
        fontWeight={600}
      >
        {copy.headAxis}
      </text>

      {showEfficiency && rated && (
        <>
          {ticks(etaAxis.max, etaAxis.step).map((tick) => (
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
            transform={`translate(${width - 8} ${margin.top + plotHeight / 2}) rotate(90)`}
            textAnchor="middle"
            fill="var(--sz-color-text-muted)"
            fontWeight={600}
          >
            {copy.efficiencyAxis}
          </text>
          <path
            d={path(rated, (flow) => efficiencyAt(rated, flow), yEta)}
            fill="none"
            stroke="var(--sz-color-accent-cyan)"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
        </>
      )}

      {/* Head curves */}
      {series.map(({ model, color }) => (
        <path
          key={model.id}
          d={path(model, (flow) => headAt(model, flow), y)}
          fill="none"
          stroke={color}
          strokeWidth={2.75}
          strokeLinecap="round"
        />
      ))}

      {showRatedPoint && rated && (
        <g>
          <path
            d={`M${x(rated.flow)},${margin.top + plotHeight} V${y(rated.head)} H${margin.left}`}
            fill="none"
            stroke="var(--sz-color-text-subtle)"
            strokeDasharray="3 3"
          />
          <circle
            cx={x(rated.flow)}
            cy={y(rated.head)}
            r={5}
            fill="white"
            stroke={series[0].color}
            strokeWidth={2.5}
          />
          {/* Below-left of the point: the curve runs above it there, and it never overflows the right edge. */}
          <text
            x={x(rated.flow) - 10}
            y={y(rated.head) + 20}
            textAnchor="end"
            fill="var(--sz-color-navy-900)"
            fontWeight={600}
          >
            {`${copy.ratedPoint}: ${formatNumber(rated.flow)} m³/h · ${rated.head} m`}
          </text>
        </g>
      )}
    </svg>
  )
}
