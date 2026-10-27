import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useDismiss } from '../../hooks/useDismiss'
import { popoverClasses } from '../../lib/popover'
import type { NavItem } from '../../types'

type ScopeSelectProps = {
  options: NavItem[]
  value: NavItem
  onChange: (option: NavItem) => void
}

/** "Products ⌄" scope picker at the start of the hero search box. */
export function ScopeSelect({ options, value, onChange }: ScopeSelectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Search in: ${value.label}`}
        className="flex h-12 items-center gap-2 rounded-md bg-surface-muted px-4 text-[15px] font-medium text-navy-900 transition-colors hover:bg-surface-sunken"
      >
        {value.label}
        <ChevronDown
          className={`size-4 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <ul
        role="listbox"
        inert={!open}
        className={`absolute top-[calc(100%+10px)] left-0 z-10 w-56 rounded-md bg-white p-1.5 text-left shadow-card ring-1 ring-navy-900/5 ${popoverClasses(open)}`}
      >
        {options.map((option) => {
          const selected = option.label === value.label
          return (
            <li key={option.label} role="option" aria-selected={selected}>
              <button
                type="button"
                onClick={() => {
                  onChange(option)
                  close()
                }}
                className={`flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-[15px] transition-colors hover:bg-primary-tint ${
                  selected ? 'font-medium text-primary' : 'text-text'
                }`}
              >
                {option.label}
                {selected && <Check className="size-4" />}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
