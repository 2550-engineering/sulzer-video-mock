import { sparePartsTab as copy } from '../../data/sparePartsPage'
import type { SparePart } from '../../types'

type PartRowProps = {
  part: SparePart
  /** Fitted quantity (or the set's quantity under a recommended set). */
  quantity: number
  level: number
  selected: boolean
  /** Lighter highlight: the part belongs to the selected set. */
  inSelection?: boolean
  anchor?: boolean
  onSelect: () => void
}

/** A part in the tree: position number, name and quantity in the pump. */
export function PartRow({
  part,
  quantity,
  level,
  selected,
  inSelection,
  anchor,
  onSelect,
}: PartRowProps) {
  return (
    <li role="treeitem" aria-selected={selected}>
      <button
        type="button"
        data-anchor={anchor || undefined}
        onClick={onSelect}
        style={{ paddingLeft: level * 16 + 32 }}
        className={`flex w-full items-baseline gap-3 rounded-md py-1.5 pr-3 text-left text-[15px] transition-colors duration-150 ${
          selected
            ? 'animate-highlight bg-primary-tint font-semibold text-primary shadow-[inset_3px_0_0_var(--sz-color-primary)]'
            : inSelection
              ? 'bg-primary-tint/50 text-navy-900'
              : 'text-text hover:bg-surface-muted hover:text-primary'
        }`}
      >
        <span
          className={`w-9 shrink-0 tabular-nums ${selected ? 'text-primary' : 'text-text-muted'}`}
        >
          {part.position}
        </span>
        <span className="min-w-0 flex-1">{part.name}</span>
        <span className="shrink-0 text-xs text-text-subtle tabular-nums">
          {copy.pieces(quantity)}
        </span>
      </button>
    </li>
  )
}
