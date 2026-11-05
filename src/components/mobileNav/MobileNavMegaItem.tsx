import { useState } from 'react'
import { Link } from 'react-router'
import type { MegaMenuItem } from '../../types'
import { MobileNavAccordionButton } from './MobileNavAccordionButton'
import { subRow } from './rows'

/** A mega menu item: a link, or a nested accordion when it has children. */
export function MobileNavMegaItem({
  item,
  onNavigate,
}: {
  item: MegaMenuItem
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)
  const id = `mobile-nav-${item.label.toLowerCase().replace(/[^a-z]+/g, '-')}`

  if (!item.children?.length) {
    return (
      <li>
        <Link to={item.to} onClick={onNavigate} className={subRow}>
          {item.label}
        </Link>
      </li>
    )
  }
  return (
    <li>
      <MobileNavAccordionButton
        label={item.label}
        expanded={open}
        onClick={() => setOpen((value) => !value)}
        controls={id}
        nested
      />
      <ul id={id} hidden={!open} className="pb-1">
        <li>
          <Link
            to={item.to}
            onClick={onNavigate}
            className={`${subRow} pl-13 font-semibold text-primary`}
          >
            All {item.label.toLowerCase()}
          </Link>
        </li>
        {item.children.map((child) => (
          <li key={child.label}>
            <Link to={child.to} onClick={onNavigate} className={`${subRow} pl-13 text-sm`}>
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}
