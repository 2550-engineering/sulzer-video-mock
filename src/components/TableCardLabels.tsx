import { useEffect } from 'react'

/** Header text of a cell: its visible text, else its aria-label (e.g. a "Select all" checkbox). */
function headerText(cell: HTMLTableCellElement) {
  const text = cell.textContent?.replace(/\s+/g, ' ').trim()
  return text || cell.querySelector('[aria-label]')?.getAttribute('aria-label') || ''
}

/** Copies each column header onto its body cells as data-label, for one table. */
function label(table: HTMLTableElement) {
  const headerRow = table.tHead?.rows[table.tHead.rows.length - 1]
  if (!headerRow) return
  const labels: string[] = []
  for (const cell of headerRow.cells)
    for (let i = 0; i < cell.colSpan; i++) labels.push(headerText(cell))
  for (const section of [...table.tBodies, ...(table.tFoot ? [table.tFoot] : [])])
    for (const row of section.rows) {
      let column = 0
      for (const cell of row.cells) {
        // Spanning cells (totals, notes) get no label: they show full width.
        const text = cell.colSpan > 1 ? '' : (labels[column] ?? '')
        if (cell.dataset.label !== text) cell.dataset.label = text
        column += cell.colSpan
      }
    }
}

/**
 * Phones show tables with the `table-cards` class as one card per row (see
 * index.css). This fills in the column name each cell shows as its label,
 * and keeps it up to date as rows are sorted, filtered or added. Renders
 * nothing; the labels have no effect from 768px up.
 */
export function TableCardLabels() {
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() =>
        document.querySelectorAll<HTMLTableElement>('table.table-cards').forEach(label),
      )
    }
    // Only structure and text changes: the data-label writes don't retrigger it.
    const observer = new MutationObserver(update)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    update()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
