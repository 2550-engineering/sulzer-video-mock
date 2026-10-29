import { RefreshCw, Save, SearchX } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ActiveFilterChips } from '../components/ActiveFilterChips'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { Breadcrumb } from '../components/Breadcrumb'
import { Pagination } from '../components/Pagination'
import { AddToProjectDialog } from '../components/projects/AddToProjectDialog'
import { FilterColumn } from '../components/search/FilterColumn'
import { DutyPointChips } from '../components/sizing/DutyPointChips'
import { SaveSizingDialog } from '../components/sizing/SaveSizingDialog'
import { SelectionBar } from '../components/sizing/SelectionBar'
import { SizingProgress } from '../components/sizing/SizingProgress'
import { SizingResultPanel, type PanelMode } from '../components/sizing/SizingResultPanel'
import { SizingResultsTable } from '../components/sizing/SizingResultsTable'
import { SizingToolbar } from '../components/sizing/SizingToolbar'
import { sizingDemo } from '../config/demo'
import { applications } from '../data/applications'
import { sizingResultsPage as copy } from '../data/sizingPages'
import { useCalculating } from '../hooks/useCalculating'
import { useUrlParams } from '../hooks/useUrlParams'
import { getProduct } from '../lib/catalog'
import { applyFilters } from '../lib/filters'
import { sizePumps, temperatureRange } from '../lib/sizing'
import {
  configurationFilterDefs,
  defaultSizingSort,
  firstDirection,
  matchingConfigurations,
  resultFilterDefs,
  sizingFilterGroups,
  sortSizingResults,
  type SizingSort,
  type SizingSortKey,
} from '../lib/sizingFilters'
import {
  calculationKey,
  readSizingInput,
  sizingParamEntries,
  sizingQuery,
} from '../lib/sizingParams'
import { formatInput } from '../lib/units'
import { configurationsForProduct, variantCount } from '../lib/variants'
import type { SizingDraft } from '../projects/ProjectsContext'
import { useProjects } from '../projects/useProjects'
import { useToast } from '../toast/useToast'
import type { SizingResult } from '../types'

const pageSize = 10
const sortKeys: SizingSortKey[] = ['lcc', 'efficiency', 'p2', 'npshr', 'price', 'lead']
const resultIds = resultFilterDefs.map((d) => d.id)
const inputIds = configurationFilterDefs.map((d) => d.id).filter((id) => !resultIds.includes(id))

/**
 * Sizing results: /sizing/results with every sizing param from /sizing. All
 * filters (from the form or the filter list here; same ids) narrow the
 * configurations before ranking; the best 18 by life cycle cost are shown. A
 * one-second "Sizing …" state runs once per calculation input. "Save as
 * project" stores the whole sizing; with ?project&sizing (from "Open sizing")
 * it becomes "Update project".
 */
export function SizingResultsPage() {
  const { user } = useAuth()
  const showToast = useToast()
  const { projects, updateSizing } = useProjects()
  const [params, update] = useUrlParams()
  const listRef = useRef<HTMLDivElement>(null)

  const query = sizingQuery(params)
  const input = readSizingInput(params)
  const { productId, duty } = input
  const productName = getProduct(productId)?.name ?? productId
  const inputKey = calculationKey(params)
  const { progress, done } = useCalculating(inputKey)

  // Input-level parameters choose what is sized; the filter list narrows the rest. Both before ranking.
  const inputSelection = Object.fromEntries(inputIds.map((id) => [id, input.selection[id] ?? []]))
  const resultSelection = Object.fromEntries(resultIds.map((id) => [id, input.selection[id] ?? []]))
  const response = sizePumps(duty, productId, {
    selection: inputSelection,
    margin: input.margin,
    impellerSize: input.impellerSize,
    settings: input.settings,
    maxResults: Infinity,
  })
  const qualifying = response.all
  const groups = sizingFilterGroups(qualifying, resultSelection)
  const filtered = applyFilters(qualifying, resultFilterDefs, resultSelection).slice(
    0,
    sizingDemo.maxResults,
  )
  const hits = matchingConfigurations(
    configurationsForProduct(productId),
    input.selection,
    duty.temperature,
  ).length

  // Selection, panel and dialogs belong to this calculation; a new one starts empty.
  const [selection, setSelection] = useState({ input: '', ids: [] as string[] })
  const [panel, setPanel] = useState<{ mode: PanelMode; ids: string[]; open: boolean }>({
    mode: 'detail',
    ids: [],
    open: false,
  })
  const [dialog, setDialog] = useState<{
    kind: 'add' | 'save' | null
    results: SizingResult[]
    session: number
  }>({ kind: null, results: [], session: 0 })

  const requestedSort = sortKeys.find((key) => key === params.get('sort'))
  const sort: SizingSort = requestedSort
    ? { key: requestedSort, direction: params.get('dir') === 'desc' ? 'desc' : 'asc' }
    : defaultSizingSort
  const sorted = sortSizingResults(filtered, sort)
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const page = Math.min(pageCount, Math.max(1, Number(params.get('page')) || 1))
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize)

  const selectedIds = selection.input === inputKey ? selection.ids : []
  const selected = filtered.filter((result) => selectedIds.includes(result.variant.id))
  const allSelected = filtered.length > 0 && selected.length === filtered.length
  const panelResults = panel.ids
    .map((id) => qualifying.find((result) => result.variant.id === id))
    .filter((result) => result !== undefined)
  const setSelected = (ids: string[]) => setSelection({ input: inputKey, ids })
  const filtersOn = resultIds.some((id) => params.getAll(id).length > 0)

  // A sizing opened from a project ("Open sizing") updates that record instead of saving a new one.
  const linkedProject = projects.find((p) => p.id === params.get('project'))
  const linked = linkedProject?.sizings.find((s) => s.id === params.get('sizing'))
  const applicationId = input.selection.application?.[0]
  const applicationName = applications.find((a) => a.id === applicationId)?.name ?? productName

  /** What "Save as project" / "Update project" stores: ticked rows, or the best match. */
  const chosen = selected.length > 0 ? selected : filtered.slice(0, 1)
  const sizingBase: Omit<SizingDraft, 'name' | 'includeCurves'> = {
    params: sizingParamEntries(params),
    dutyPoint: duty,
    productId,
    applicationId,
    variantIds: chosen.map((result) => result.variant.id),
    hits,
  }

  function toggleFilter(groupId: string, value: string) {
    update((next) => {
      const values = next.getAll(groupId)
      next.delete(groupId)
      const updated = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
      for (const v of updated) next.append(groupId, v)
      next.delete('page')
    })
  }

  function resetFilters() {
    update((next) => {
      for (const id of resultIds) next.delete(id)
      next.delete('page')
    })
  }

  function setSort(key: SizingSortKey) {
    const direction =
      sort.key === key ? (sort.direction === 'asc' ? 'desc' : 'asc') : firstDirection(key)
    update((next) => {
      if (key === defaultSizingSort.key && direction === defaultSizingSort.direction) {
        next.delete('sort')
        next.delete('dir')
      } else {
        next.set('sort', key)
        next.set('dir', direction)
      }
      next.delete('page')
    })
  }

  function goToPage(n: number) {
    update((next) => (n === 1 ? next.delete('page') : next.set('page', String(n))))
    const list = listRef.current
    if (list && list.getBoundingClientRect().top < 0) {
      list.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function toggleSelected(id: string) {
    setSelected(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
    )
  }

  const openPanel = (mode: PanelMode, results: SizingResult[]) =>
    setPanel({ mode, ids: results.map((result) => result.variant.id), open: true })
  function openDialog(kind: 'add' | 'save', results: SizingResult[] = []) {
    setPanel((p) => ({ ...p, open: false }))
    setDialog((d) => ({ kind, results, session: d.session + 1 }))
  }
  const closeDialog = () => setDialog((d) => ({ ...d, kind: null }))

  function saveOrUpdate() {
    if (!linked || !linkedProject) return openDialog('save')
    const itemIds = updateSizing(linkedProject.id, linked.id, {
      ...sizingBase,
      name: linked.name,
      includeCurves: linked.includeCurves,
    })
    showToast({
      message: copy.saveDialog.updated,
      detail: linkedProject.name,
      action: {
        label: copy.saveDialog.open,
        to: `/my-projects/${linkedProject.id}?added=${itemIds.join(',')}`,
      },
    })
  }
  const saveLabel = linked ? copy.updateProject : copy.saveAsProject

  const range = temperatureRange(productId, duty.liquid)
  const issue = response.issue ?? (qualifying.length === 0 ? 'none' : undefined)
  const issueCopy =
    issue === 'temperature'
      ? {
          title: copy.issues.temperature.title,
          text: copy.issues.temperature.text(range.min, range.max),
        }
      : issue === 'invalid'
        ? copy.issues.invalid
        : copy.issues.none

  return (
    <>
      <title>{`${done && !issue ? copy.title(filtered.length) : copy.sizingCrumb} | Sulzer`}</title>

      <section className="border-b border-border bg-white">
        <div className="site-container pt-5 pb-8">
          <Breadcrumb
            items={[
              ...copy.breadcrumb,
              { label: copy.sizingCrumb, to: `/sizing${query}` },
              { label: copy.resultsCrumb },
            ]}
          />
          {/* Space is reserved while sizing runs, so nothing moves when the heading appears. */}
          <div className="mt-8 flex min-h-[5.25rem] flex-wrap items-start justify-between gap-4">
            {done && !issue && (
              <>
                <div className="animate-fade-in">
                  <h1 className="text-[2.5rem] leading-tight font-bold tracking-tight text-brand">
                    <AnimatedNumber value={filtered.length} /> {copy.titleWords(filtered.length)}
                  </h1>
                  <p className="mt-1.5 text-text-muted">
                    {linked
                      ? copy.updating(linked.name)
                      : copy.subtitle(response.candidates, productName)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={saveOrUpdate}
                  className="inline-flex h-12 animate-fade-in items-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
                >
                  {linked ? (
                    <RefreshCw className="size-[18px]" />
                  ) : (
                    <Save className="size-[18px]" />
                  )}
                  {saveLabel}
                </button>
              </>
            )}
          </div>
          <div className="mt-5">
            <DutyPointChips duty={duty} editTo={`/sizing${query}`} />
          </div>
        </div>
      </section>

      <section className="bg-surface-muted">
        <div className="site-container min-h-[640px] py-10">
          {!done ? (
            <SizingProgress
              progress={progress}
              total={variantCount(productId)}
              productName={productName}
            />
          ) : issue ? (
            <div className="flex animate-fade-in flex-col items-center rounded-lg border border-border bg-white px-8 py-16 text-center">
              <SearchX aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
              <p className="mt-4 text-lg font-semibold text-navy-900">{issueCopy.title}</p>
              <p className="mt-1 text-text-muted">{issueCopy.text}</p>
              <Link
                to={`/sizing${query}`}
                className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {copy.issues.action}
              </Link>
            </div>
          ) : (
            <div className="grid animate-fade-in items-start gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
              <FilterColumn
                title={copy.filterTitle}
                bracketCounts
                facets={groups}
                onToggle={toggleFilter}
                onReset={filtersOn ? resetFilters : undefined}
              />

              <div ref={listRef} className="min-w-0 scroll-mt-[calc(var(--sz-header-height)+1rem)]">
                <ActiveFilterChips
                  groups={groups}
                  onRemove={toggleFilter}
                  onReset={resetFilters}
                  labels={copy.activeFilters}
                />
                <SizingToolbar
                  selectedCount={selected.length}
                  allSelected={allSelected}
                  onToggleAll={() =>
                    setSelected(allSelected ? [] : filtered.map((result) => result.variant.id))
                  }
                  onCompare={() => openPanel('compare', selected)}
                  onDownload={() => showToast({ message: copy.toasts.download(selected.length) })}
                  onAddToProject={() => openDialog('add', selected)}
                  onBookmark={() => showToast({ message: copy.toasts.bookmarked(selected.length) })}
                  onShowCurves={() => openPanel('curves', selected)}
                />
                {rows.length > 0 ? (
                  <SizingResultsTable
                    rows={rows}
                    duty={duty}
                    signedIn={user !== null}
                    sort={sort}
                    onSort={setSort}
                    selectedIds={selectedIds}
                    onToggle={toggleSelected}
                    onOpen={(result) => openPanel('detail', [result])}
                  />
                ) : (
                  <div className="flex flex-col items-center rounded-b-lg border border-border bg-white px-8 py-14 text-center">
                    <p className="text-lg font-semibold text-navy-900">
                      {copy.noFilterMatches.title}
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                      {copy.noFilterMatches.action}
                    </button>
                  </div>
                )}
                {/* Room for the selection bar, so it never covers the pagination. */}
                <div className={`mt-5 ${selected.length > 0 ? 'pb-20' : ''}`}>
                  <Pagination
                    page={page}
                    pageCount={pageCount}
                    onChange={goToPage}
                    labels={copy.pagination}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <SelectionBar
        count={selected.length}
        onAddToProject={() => openDialog('add', selected)}
        saveLabel={saveLabel}
        onSave={saveOrUpdate}
        onClear={() => setSelected([])}
      />

      <AddToProjectDialog
        key={`add-${dialog.session}`}
        open={dialog.kind === 'add'}
        results={dialog.results}
        duty={duty}
        onClose={closeDialog}
      />
      <SaveSizingDialog
        key={`save-${dialog.session}`}
        open={dialog.kind === 'save'}
        sizing={sizingBase}
        bestMatchOnly={selected.length === 0}
        defaultName={copy.saveDialog.defaultName(
          applicationName,
          formatInput(duty.flow),
          formatInput(duty.head),
        )}
        onClose={closeDialog}
      />

      <SizingResultPanel
        open={panel.open}
        mode={panel.mode}
        results={panelResults}
        duty={duty}
        signedIn={user !== null}
        onClose={() => setPanel((p) => ({ ...p, open: false }))}
        onAddToProject={(results) => openDialog('add', results)}
        onDataSheet={(result) =>
          showToast({
            message: copy.toasts.dataSheet(result.variant.productNumber ?? result.variant.name),
          })
        }
      />
    </>
  )
}
