import { ArrowRight } from 'lucide-react'

type TabCalloutProps = {
  title: string
  text: string
  actionLabel: string
  onAction: () => void
}

/** Blue band at the end of a tab that points to the next tab. */
export function TabCallout({ title, text, actionLabel, onAction }: TabCalloutProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg bg-primary-tint px-10 py-9">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900">{title}</h2>
        <p className="mt-1.5 text-[15px] text-text-muted">{text}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="group inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        {actionLabel}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  )
}
