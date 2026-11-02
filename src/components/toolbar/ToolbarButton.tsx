import type { LucideIcon } from 'lucide-react'

type ToolbarButtonProps = {
  label: string
  icon: LucideIcon
  /** Its panel is open. */
  active: boolean
  /** Red count on the icon; hidden at 0. */
  count?: number
  /** Tiny lines under the icon, e.g. ["Sweden", "50 Hz"]. */
  caption?: string[]
  onClick: () => void
}

/** Icon button on the personal toolbar, with its name in a tooltip on the left. */
export function ToolbarButton({
  label,
  icon: Icon,
  active,
  count = 0,
  caption,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `${label} (${count})` : label}
      aria-expanded={active}
      aria-haspopup="dialog"
      className={`group relative flex w-14 flex-col items-center justify-center gap-1 transition-colors first:rounded-tl-lg last:rounded-bl-lg ${
        caption ? 'py-3' : 'h-14'
      } ${active ? 'bg-primary-tint text-primary' : 'text-primary hover:bg-primary-tint'}`}
    >
      <span className="relative">
        <Icon aria-hidden className="size-[22px]" strokeWidth={1.75} />
        {count > 0 && (
          <span
            key={count}
            className="absolute -top-2 -right-2.5 flex h-[18px] min-w-[18px] animate-fade-in items-center justify-center rounded-full bg-accent-red px-1 text-[10px] font-bold text-white tabular-nums ring-2 ring-white"
          >
            {count}
          </span>
        )}
      </span>
      {caption && (
        <span className="flex max-w-full flex-col px-1 text-center text-[9px] leading-tight font-medium text-text-muted">
          {caption.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[calc(100%+12px)] translate-x-1 -translate-y-1/2 rounded-md bg-navy-900 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-card transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  )
}
