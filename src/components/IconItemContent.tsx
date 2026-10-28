import type { IconItem } from '../types'

/** Icon, label and optional text — the inside of an IconListCard row. */
export function IconItemContent({ item: { label, text, icon: Icon } }: { item: IconItem }) {
  return (
    <>
      <Icon className="size-6 shrink-0 text-primary" strokeWidth={1.5} />
      <span>
        <span className="block font-semibold text-navy-900">{label}</span>
        {text && <span className="mt-0.5 block text-sm text-text-muted">{text}</span>}
      </span>
    </>
  )
}
