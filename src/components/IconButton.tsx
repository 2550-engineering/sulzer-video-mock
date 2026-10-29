import type { LucideIcon } from 'lucide-react'

type IconButtonProps = {
  icon: LucideIcon
  label: string
  onClick: () => void
  /** Greyed out and inert; the tooltip then shows `disabledHint`. */
  disabled?: boolean
  disabledHint?: string
}

/**
 * Square icon button with a tooltip above it. Disabled buttons stay hoverable
 * (aria-disabled instead of `disabled`), so the tooltip can say why.
 */
export function IconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  disabledHint,
}: IconButtonProps) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && onClick()}
        className={`flex size-10 items-center justify-center rounded-md transition-colors duration-150 ${
          disabled
            ? 'cursor-not-allowed text-text-subtle'
            : 'text-primary hover:bg-primary-tint hover:text-primary-hover'
        }`}
      >
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 rounded-sm bg-navy-900 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-card transition-[opacity,translate] duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
      >
        {label}
        {disabled && disabledHint && (
          <span className="block font-normal text-text-on-dark-muted">{disabledHint}</span>
        )}
      </span>
    </span>
  )
}
