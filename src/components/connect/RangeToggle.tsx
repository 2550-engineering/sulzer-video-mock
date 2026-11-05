import { ranges, type RangeId } from '../../data/connect'

type RangeToggleProps = {
  label: string
  value: RangeId
  onChange: (value: RangeId) => void
}

/** 24 h / 7 d / 30 d switch for the condition charts, styled for navy surfaces. */
export function RangeToggle({ label, value, onChange }: RangeToggleProps) {
  const index = ranges.findIndex((range) => range.value === value)
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="relative grid h-10 grid-cols-3 rounded-pill border border-white/10 bg-navy-900 p-1 text-sm"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-pill bg-primary transition-transform duration-200 ease-sz"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {ranges.map((range) => {
        const selected = range.value === value
        return (
          <button
            key={range.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(range.value)}
            className={`relative min-w-16 rounded-pill px-4 font-semibold transition-colors ${
              selected ? 'text-white' : 'text-text-on-dark-muted hover:text-white'
            }`}
          >
            {range.label}
          </button>
        )
      })}
    </div>
  )
}
