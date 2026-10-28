import type { IconItem } from '../types'

type IconCardGridProps = {
  items: IconItem[]
  /** Tailwind grid-cols classes. */
  columns?: string
}

/** Grid of white cards, each with an icon circle, a title and a line of text. */
export function IconCardGrid({ items, columns = 'sm:grid-cols-2' }: IconCardGridProps) {
  return (
    <ul className={`grid gap-4 ${columns}`}>
      {items.map(({ label, text, icon: Icon }) => (
        // An odd last card spans the row, so a 2-column grid never ends on a gap.
        <li
          key={label}
          className="rounded-lg border border-border bg-surface p-6 shadow-card sm:odd:last:col-span-full"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-primary-tint text-primary">
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          <h3 className="mt-5 text-lg font-bold tracking-tight text-navy-900">{label}</h3>
          {text && <p className="mt-1.5 text-[15px] leading-relaxed text-text-muted">{text}</p>}
        </li>
      ))}
    </ul>
  )
}
