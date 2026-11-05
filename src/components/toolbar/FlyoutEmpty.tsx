import type { LucideIcon } from 'lucide-react'

type FlyoutEmptyProps = {
  icon: LucideIcon
  title: string
  text: string
}

/** Empty state inside a personal toolbar panel. */
export function FlyoutEmpty({ icon: Icon, title, text }: FlyoutEmptyProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border-strong px-8 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary-tint text-primary">
        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <p className="mt-4 font-semibold text-navy-900">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{text}</p>
    </div>
  )
}
