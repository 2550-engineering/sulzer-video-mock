import { useEffect, useRef } from 'react'
import { sparePartsTab as copy } from '../../data/sparePartsPage'
import { kitLabel } from '../../lib/bom'
import type { PartGroup, ServiceKit, SparePart } from '../../types'
import { PartRow } from './PartRow'
import { TreeBranch } from './TreeBranch'

type PartTreeProps = {
  groups: PartGroup[]
  parts: SparePart[]
  kits: ServiceKit[]
  selectedPartId: string | null
  selectedKitId: string | null
  /** Filters the rows by name, position or part number. */
  query: string
  /** Open node ids: "recommended", "kits", "service", "kit:<id>", "group:<id>". */
  expanded: string[]
  onToggle: (nodeId: string) => void
  onSelectPart: (partId: string) => void
  onSelectKit: (kitId: string) => void
  /** Bumped when the selection came from elsewhere (the drawing, the URL): scroll to it. */
  reveal: number
}

/** Waits for a branch to finish opening before scrolling to a row in it. */
const openMs = 220

/**
 * "Recommended service parts" (one node per service interval) and "Service
 * parts" (one node per part group). On `reveal`, the selected row scrolls
 * into view inside the tree, never the page.
 */
export function PartTree({
  groups,
  parts,
  kits,
  selectedPartId,
  selectedKitId,
  query,
  expanded,
  onToggle,
  onSelectPart,
  onSelectKit,
  reveal,
}: PartTreeProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const q = query.trim().toLowerCase()
  const matches = (part: SparePart) =>
    !q ||
    part.name.toLowerCase().includes(q) ||
    part.position.includes(q) ||
    part.partNumber.includes(q)
  const byId = new Map(parts.map((part) => [part.id, part]))
  // While searching, every branch with a match is open and the rest are hidden.
  const isOpen = (id: string) => (q ? true : expanded.includes(id))
  const selectedKit = kits.find((kit) => kit.id === selectedKitId)

  useEffect(() => {
    if (reveal === 0) return
    const timer = window.setTimeout(() => {
      const container = scrollRef.current
      const row = container?.querySelector<HTMLElement>('[data-anchor]')
      if (!container || !row) return
      const box = container.getBoundingClientRect()
      const r = row.getBoundingClientRect()
      if (r.top >= box.top + 8 && r.bottom <= box.bottom - 8) return
      container.scrollTo({
        top: container.scrollTop + r.top - box.top - box.height / 3,
        behavior: 'smooth',
      })
    }, openMs)
    return () => window.clearTimeout(timer)
  }, [reveal])

  const kitRows = kits
    .map((kit) => ({
      kit,
      items: kit.items
        .map((item) => ({ part: byId.get(item.partId)!, quantity: item.quantity }))
        .filter(({ part }) => part && matches(part)),
    }))
    .filter(({ items }) => items.length > 0)
  // Recommended sets (per service interval) first, then named kits.
  const recommendedRows = kitRows.filter(({ kit }) => kit.years)
  const namedRows = kitRows.filter(({ kit }) => !kit.years)
  const groupRows = groups
    .map((group) => ({ group, parts: parts.filter((p) => p.groupId === group.id && matches(p)) }))
    .filter(({ parts }) => parts.length > 0)

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
      {kitRows.length === 0 && groupRows.length === 0 ? (
        <p className="px-3 py-6 text-sm text-text-muted">{copy.noMatches(query.trim())}</p>
      ) : (
        <ul role="tree" aria-label={copy.title}>
          {[
            { node: 'recommended', label: copy.recommended, rows: recommendedRows },
            { node: 'kits', label: copy.serviceKits, rows: namedRows },
          ]
            .filter(({ rows }) => rows.length > 0)
            .map(({ node, label, rows }) => (
              <TreeBranch
                key={node}
                label={label}
                open={isOpen(node)}
                onToggle={() => onToggle(node)}
                level={0}
              >
                {rows.map(({ kit, items }) => (
                  <TreeBranch
                    key={kit.id}
                    label={kitLabel(kit)}
                    meta={copy.parts(kit.items.length)}
                    open={isOpen(`kit:${kit.id}`)}
                    onToggle={() => onToggle(`kit:${kit.id}`)}
                    onSelect={() => onSelectKit(kit.id)}
                    selected={kit.id === selectedKitId}
                    anchor={kit.id === selectedKitId}
                    level={1}
                  >
                    {items.map(({ part, quantity }) => (
                      <PartRow
                        key={part.id}
                        part={part}
                        quantity={quantity}
                        level={1}
                        selected={part.id === selectedPartId}
                        inSelection={kit.id === selectedKitId}
                        onSelect={() => onSelectPart(part.id)}
                      />
                    ))}
                  </TreeBranch>
                ))}
              </TreeBranch>
            ))}

          <TreeBranch
            label={copy.serviceParts}
            open={isOpen('service')}
            onToggle={() => onToggle('service')}
            level={0}
          >
            {groupRows.map(({ group, parts: groupParts }) => (
              <TreeBranch
                key={group.id}
                label={group.name}
                meta={String(groupParts.length)}
                open={isOpen(`group:${group.id}`)}
                onToggle={() => onToggle(`group:${group.id}`)}
                level={1}
              >
                {groupParts.map((part) => (
                  <PartRow
                    key={part.id}
                    part={part}
                    quantity={part.quantity}
                    level={1}
                    selected={part.id === selectedPartId}
                    inSelection={selectedKit?.items.some((item) => item.partId === part.id)}
                    anchor={part.id === selectedPartId}
                    onSelect={() => onSelectPart(part.id)}
                  />
                ))}
              </TreeBranch>
            ))}
          </TreeBranch>
        </ul>
      )}
    </div>
  )
}
