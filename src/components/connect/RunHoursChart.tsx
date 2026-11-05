import { useState } from 'react'
import { dashboardPage } from '../../data/connect'
import { useElementWidth } from '../../hooks/useElementWidth'
import { niceTicks } from '../../lib/connect'
import { formatDay, groupThousands } from '../../lib/format'

const copy = dashboardPage.runHours
const height = 330
const margin = { top: 24, right: 8, bottom: 30, left: 44 }

/** Run hours per day as bars that grow in one after another. The last bar is today so far, drawn lighter. */
export function RunHoursChart({ days }: { days: { day: number; hours: number }[] }) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...days.map((d) => d.hours)) * 1.1
  const ticks = niceTicks(0, max)
  const top = ticks[ticks.length - 1]
  const plotWidth = Math.max(0, width - margin.left - margin.right)
  const plotHeight = height - margin.top - margin.bottom
  const slot = plotWidth / days.length
  const barWidth = Math.min(56, slot * 0.56)
  const y = (v: number) => margin.top + plotHeight - (v / top) * plotHeight

  return (
    <div ref={ref} style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          className="block text-[11px]"
          role="img"
          aria-label={copy.title}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={margin.left}
                x2={width - margin.right}
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
              >
                {groupThousands(tick)}
              </text>
            </g>
          ))}
          {days.map((d, i) => {
            const today = i === days.length - 1
            const cx = margin.left + slot * i + slot / 2
            const active = hover === i
            return (
              <g
                key={d.day}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              >
                <rect
                  x={cx - slot / 2}
                  y={margin.top}
                  width={slot}
                  height={plotHeight}
                  fill="transparent"
                />
                <rect
                  x={cx - barWidth / 2}
                  y={y(d.hours)}
                  width={barWidth}
                  height={y(0) - y(d.hours)}
                  rx={4}
                  fill={today ? 'var(--sz-color-accent-cyan)' : 'var(--sz-color-primary-on-dark)'}
                  fillOpacity={today ? 0.45 : active ? 1 : 0.85}
                  className="animate-grow"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'bottom',
                    animationDelay: `${i * 60}ms`,
                  }}
                />
                <text
                  x={cx}
                  y={y(d.hours) - 8}
                  textAnchor="middle"
                  fill="white"
                  fontWeight={600}
                  className="tabular-nums"
                >
                  {d.hours}
                </text>
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  fill={today ? 'white' : 'var(--sz-color-text-on-dark-muted)'}
                >
                  {today
                    ? slot < 64
                      ? copy.todayShort
                      : copy.today
                    : formatDay(d.day).replace(/ \w+$/, '')}
                </text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}
