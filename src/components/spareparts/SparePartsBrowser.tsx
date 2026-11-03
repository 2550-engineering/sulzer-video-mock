import { FileDown, Printer, Search, X } from 'lucide-react'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { sparePartsTab as copy } from '../../data/sparePartsPage'
import { useUrlParams } from '../../hooks/useUrlParams'
import { bomCsv, sortBom } from '../../lib/bom'
import { downloadText } from '../../lib/download'
import { getDrawing, partsInVersion } from '../../lib/catalog'
import { useToast } from '../../toast/useToast'
import type { PartOwner, SparePartCatalogue } from '../../types'
import { SegmentedToggle } from '../SegmentedToggle'
import { SelectField } from '../SelectField'
import { BomTable } from './BomTable'
import { EmptySelection } from './EmptySelection'
import { ExplodedDrawing } from './ExplodedDrawing'
import { KitDetailCard } from './KitDetailCard'
import { PartDetailCard } from './PartDetailCard'
import { PartTree } from './PartTree'

const roots = ['recommended', 'kits', 'service']

type SparePartsBrowserProps = {
  catalogue: SparePartCatalogue
  /** The variant or model whose parts these are; cart lines are grouped under it. */
  owner: PartOwner
  /** Above the version select, e.g. the AHLSTAR model select. */
  ownerPicker?: ReactNode
}

type View = 'tree' | 'bom'

/**
 * Spare parts of a configured product: the "Service parts" tree (or the BOM
 * table) on the left, the exploded drawing with the selection's details on
 * the right. One selection drives both, in the URL (?part=<id> or ?kit=<id>,
 * plus ?version= and ?view=bom), so a part number search or a shared link
 * opens with that part selected.
 */

export function SparePartsBrowser({ catalogue, owner, ownerPicker }: SparePartsBrowserProps) {
  const ids = useId()
  const { user } = useAuth()
  const showToast = useToast()
  const [params, update] = useUrlParams()
  const drawing = getDrawing(catalogue.drawingId)
  const view: View = params.get('view') === 'bom' ? 'bom' : 'tree'

  const requestedVersion = params.get('version')
  const version =
    catalogue.versions.find((v) => v.id === requestedVersion)?.id ?? catalogue.versions[0].id
  const parts = partsInVersion(catalogue, version)
  const byId = new Map(parts.map((part) => [part.id, part]))

  // ?part= takes a part id; a position number works too.
  const partParam = params.get('part')
  const part = parts.find((p) => p.id === partParam || p.position === partParam)
  const kit = part ? undefined : catalogue.kits.find((k) => k.id === params.get('kit'))
  const selectedHotspots = part
    ? [part.hotspot]
    : (kit?.items.map((item) => byId.get(item.partId)?.hotspot ?? '') ?? [])

  const [expanded, setExpanded] = useState<string[]>(() => [
    ...roots,
    ...(part ? [`group:${part.groupId}`] : []),
    ...(kit ? [`kit:${kit.id}`] : []),
  ])
  // Bumped when the tree should scroll to the selection (it did not come from the tree).
  const [reveal, setReveal] = useState(() => (part || kit ? 1 : 0))
  const [query, setQuery] = useState('')

  const open = (nodes: string[]) => setExpanded((current) => [...new Set([...current, ...nodes])])

  function selectPart(partId: string, fromTree = false) {
    update((next) => {
      next.set('part', partId)
      next.delete('kit')
    })
    if (fromTree) return
    const groupId = byId.get(partId)?.groupId
    open(['service', ...(groupId ? [`group:${groupId}`] : [])])
    setReveal((n) => n + 1)
  }

  function selectKit(kitId: string, fromTree = false) {
    update((next) => {
      next.set('kit', kitId)
      next.delete('part')
    })
    if (fromTree) return
    const named = !catalogue.kits.find((k) => k.id === kitId)?.years
    open([named ? 'kits' : 'recommended'])
    setReveal((n) => n + 1)
  }

  const selected = Boolean(part || kit)
  function clear() {
    update((next) => {
      next.delete('part')
      next.delete('kit')
    })
  }

  // Esc clears the selection (full screen keeps Esc for leaving full screen).
  useEffect(() => {
    if (!selected) return
    function handleKey(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented || document.fullscreenElement) return
      update((next) => {
        next.delete('part')
        next.delete('kit')
      })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, update])

  function exportBom() {
    const fileName = copy.bom.fileName(owner.name, version)
    downloadText(
      fileName,
      bomCsv(sortBom(parts, { key: 'position', direction: 'asc' }), catalogue.kits, Boolean(user)),
    )
    showToast({ message: copy.bom.exported, detail: copy.bom.exportedDetail(fileName) })
  }

  const labels = new Map(parts.map((p) => [p.hotspot, { position: p.position, name: p.name }]))
  const toolButton =
    'rounded-sm px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint'

  return (
    <div
      className={`grid items-start gap-8 ${
        view === 'bom'
          ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'
          : 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'
      }`}
    >
      <aside className="flex max-h-[44rem] flex-col rounded-lg border border-border bg-white lg:sticky lg:top-[calc(var(--sz-header-height)+5.5rem)] lg:h-[calc(100vh-var(--sz-header-height)-8rem)] lg:max-h-none lg:min-h-[32rem]">
        <div className="border-b border-border px-5 pt-5 pb-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-lg font-bold tracking-tight text-navy-900">
              {view === 'bom' ? copy.bom.title : copy.title}
            </h2>
            <SegmentedToggle<View>
              label={copy.view.label}
              value={view}
              options={[
                { value: 'tree', label: copy.view.tree },
                { value: 'bom', label: copy.view.bom },
              ]}
              onChange={(value) =>
                update((next) => (value === 'bom' ? next.set('view', 'bom') : next.delete('view')))
              }
            />
          </div>
          {ownerPicker && <div className="mt-3">{ownerPicker}</div>}
          {catalogue.versions.length > 1 && (
            <div className="mt-3">
              <SelectField
                layout="stacked"
                label={copy.version}
                value={version}
                options={catalogue.versions.map((v) => ({ value: v.id, label: v.label }))}
                onChange={(value) =>
                  update((next) =>
                    value === catalogue.versions[0].id
                      ? next.delete('version')
                      : next.set('version', value),
                  )
                }
              />
              <p className="mt-1 text-xs text-text-subtle">{copy.versionHint}</p>
            </div>
          )}
          <div className="relative mt-4">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-subtle"
            />
            <input
              id={`${ids}-search`}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={copy.search}
              placeholder={copy.searchPlaceholder}
              className="h-10 w-full rounded-md border border-border-strong bg-white pr-3 pl-9 text-sm text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_3px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1">
            {view === 'tree' ? (
              <>
                <button type="button" onClick={() => setExpanded(roots)} className={toolButton}>
                  {copy.collapse}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setExpanded([
                      ...roots,
                      ...catalogue.kits.map((k) => `kit:${k.id}`),
                      ...catalogue.groups.map((g) => `group:${g.id}`),
                    ])
                  }
                  className={toolButton}
                >
                  {copy.expand}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={exportBom}
                  className={`${toolButton} inline-flex items-center gap-1.5`}
                >
                  <FileDown className="size-4" />
                  {copy.bom.export}
                </button>
                <Link
                  to={`/products/${owner.productId}/${owner.id}/bom${version === catalogue.versions[0].id ? '' : `?version=${version}`}`}
                  className={`${toolButton} inline-flex items-center gap-1.5`}
                >
                  <Printer className="size-4" />
                  {copy.bom.print}
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                clear()
                setQuery('')
              }}
              className={`${toolButton} ml-auto`}
            >
              {copy.clear}
            </button>
          </div>
        </div>
        {view === 'bom' ? (
          <BomTable
            parts={parts}
            kits={catalogue.kits}
            selectedPartId={part?.id ?? null}
            selectedKitId={kit?.id ?? null}
            query={query}
            onSelectPart={(id) => selectPart(id, true)}
            reveal={reveal}
          />
        ) : (
          <PartTree
            groups={catalogue.groups}
            parts={parts}
            kits={catalogue.kits}
            selectedPartId={part?.id ?? null}
            selectedKitId={kit?.id ?? null}
            query={query}
            expanded={expanded}
            onToggle={(node) =>
              setExpanded((current) =>
                current.includes(node) ? current.filter((n) => n !== node) : [...current, node],
              )
            }
            onSelectPart={(id) => selectPart(id, true)}
            onSelectKit={(id) => selectKit(id, true)}
            reveal={reveal}
          />
        )}
      </aside>

      <div className="min-w-0">
        {drawing && (
          <ExplodedDrawing
            drawing={drawing}
            labels={labels}
            selected={selectedHotspots}
            onSelect={(hotspot) => {
              const hit = parts.find((p) => p.hotspot === hotspot)
              if (hit) selectPart(hit.id)
            }}
          />
        )}

        <section
          aria-live="polite"
          className="relative mt-5 min-h-[15rem] rounded-lg border border-border bg-white px-6 py-5"
        >
          {selected && (
            <button
              type="button"
              onClick={clear}
              aria-label={copy.detail.close}
              title={copy.detail.close}
              className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-muted hover:text-navy-900"
            >
              <X className="size-4" />
            </button>
          )}
          {part ? (
            <PartDetailCard
              key={part.id}
              part={part}
              hotspot={drawing?.hotspots.find((h) => h.id === part.hotspot)}
              kits={catalogue.kits.filter((k) => k.items.some((item) => item.partId === part.id))}
              onSelectKit={(id) => selectKit(id)}
              ownerId={owner.id}
              drawingId={catalogue.drawingId}
            />
          ) : kit ? (
            <KitDetailCard
              key={kit.id}
              kit={kit}
              parts={byId}
              onSelectPart={(id) => selectPart(id)}
              ownerId={owner.id}
            />
          ) : (
            <EmptySelection />
          )}
        </section>
      </div>
    </div>
  )
}
