import { ChevronRight } from 'lucide-react'
import { useId, type ReactNode } from 'react'

type TreeBranchProps = {
  label: string
  /** Small grey count after the label, e.g. "8 parts". */
  meta?: string
  open: boolean
  onToggle: () => void
  /** Makes the label itself selectable (a recommended set); the chevron still toggles. */
  onSelect?: () => void
  selected?: boolean
  /** Indent level, 0 for the top. */
  level: number
  /** Marks the row the tree scrolls to. */
  anchor?: boolean
  children: ReactNode
}

/** An expandable node of the parts tree; the children slide open over 200 ms. */
export function TreeBranch({
  label,
  meta,
  open,
  onToggle,
  onSelect,
  selected = false,
  level,
  anchor,
  children,
}: TreeBranchProps) {
  const panelId = useId()
  const chevron = (
    <ChevronRight
      aria-hidden
      className={`size-4 shrink-0 text-text-muted transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
    />
  )
  const top = level === 0
  return (
    <li role="treeitem" aria-expanded={open} aria-selected={selected}>
      <div
        data-anchor={anchor || undefined}
        style={{ paddingLeft: level * 16 }}
        className={`flex items-center rounded-md transition-colors duration-150 ${
          selected ? 'bg-primary-tint shadow-[inset_3px_0_0_var(--sz-color-primary)]' : ''
        }`}
      >
        {onSelect ? (
          <>
            <button
              type="button"
              onClick={onToggle}
              aria-controls={panelId}
              aria-label={label}
              className="flex size-8 shrink-0 items-center justify-center rounded-sm hover:bg-surface-muted"
            >
              {chevron}
            </button>
            <button
              type="button"
              onClick={onSelect}
              className={`flex min-w-0 flex-1 items-baseline gap-2 py-1.5 pr-2 text-left text-[15px] transition-colors hover:text-primary ${
                selected ? 'font-semibold text-primary' : 'font-medium text-navy-900'
              }`}
            >
              <span className="min-w-0">{label}</span>
              {meta && <span className="ml-auto shrink-0 text-xs text-text-subtle">{meta}</span>}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-controls={panelId}
            className={`flex min-w-0 flex-1 items-center gap-1 py-1.5 pr-2 text-left transition-colors hover:text-primary ${
              top
                ? 'text-xs font-semibold tracking-[0.08em] text-text-muted uppercase'
                : 'text-[15px] font-medium text-navy-900'
            }`}
          >
            <span className="flex size-8 shrink-0 items-center justify-center">{chevron}</span>
            <span className="min-w-0">{label}</span>
            {meta && (
              <span className="ml-auto shrink-0 text-xs font-normal tracking-normal text-text-subtle normal-case">
                {meta}
              </span>
            )}
          </button>
        )}
      </div>
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-sz ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <ul role="group" className="overflow-hidden">
          {children}
        </ul>
      </div>
    </li>
  )
}
