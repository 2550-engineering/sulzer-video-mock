import { ChevronDown } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useDismiss } from '../../hooks/useDismiss'
import { popoverClasses } from '../../lib/popover'

type ExportMenuProps = {
  label: string
  options: { id: string; label: string }[]
  onSelect: (id: string) => void
  className: string
}

/** "Export as ⌄" button with a small menu of formats. */
export function ExportMenu({ label, options, onSelect, className }: ExportMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={className}
      >
        {label}
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <ul
        role="menu"
        inert={!open}
        className={`absolute inset-x-0 top-[calc(100%+8px)] z-20 rounded-md bg-white p-1.5 shadow-card ring-1 ring-navy-900/5 ${popoverClasses(open)}`}
      >
        {options.map((option) => (
          <li key={option.id} role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect(option.id)
                close()
              }}
              className="flex w-full items-center rounded-sm px-3 py-2.5 text-left text-[15px] text-text transition-colors hover:bg-primary-tint hover:text-primary"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
