import { ChevronDown } from 'lucide-react'
import { row, subRow } from './rows'

/** A disclosure row in the mobile nav drawer. */
export function MobileNavAccordionButton({
  label,
  expanded,
  onClick,
  controls,
  nested = false,
}: {
  label: string
  expanded: boolean
  onClick: () => void
  controls: string
  nested?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      className={nested ? subRow : row}
    >
      {label}
      <ChevronDown
        className={`ml-auto size-4 text-text-subtle transition-transform duration-200 ${
          expanded ? 'rotate-180' : ''
        }`}
      />
    </button>
  )
}
