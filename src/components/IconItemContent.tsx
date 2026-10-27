import type { IconItem } from '../types'

/** Icon circle, label and optional text — the inside of an IconListCard row. */
export function IconItemContent({ item: { label, text, icon: Icon } }: { item: IconItem }) {
  return (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <span>
        <span className="block font-semibold text-navy-900">{label}</span>
        {text && <span className="mt-0.5 block text-sm text-text-muted">{text}</span>}
      </span>
    </>
  )
}
