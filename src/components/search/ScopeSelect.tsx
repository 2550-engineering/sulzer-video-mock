import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useDismiss } from '../../hooks/useDismiss'
import { popoverClasses } from '../../lib/popover'

type ScopeOption = { id: string; label: string }

type ScopeSelectProps<T extends ScopeOption> = {
  options: T[]
  value: T
  onChange: (option: T) => void
  /** Height and colours of the button; defaults to the hero's. */
  buttonClassName?: string
}

/** "Products ⌄" scope picker at the start of a search box (home hero, header). */
export function ScopeSelect<T extends ScopeOption>({
  options,
  value,
  onChange,
  buttonClassName = 'h-12 bg-surface-muted hover:bg-surface-sunken',
}: ScopeSelectProps<T>) {
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
        className={`flex items-center gap-2 rounded-md px-4 text-[15px] font-medium whitespace-nowrap text-navy-900 transition-colors ${buttonClassName}`}
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
          const selected = option.id === value.id
          return (
            <li key={option.id} role="option" aria-selected={selected}>
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
