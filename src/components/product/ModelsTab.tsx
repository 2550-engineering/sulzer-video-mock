import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../auth/useAuth'
import { productPage } from '../../data/catalogPages'
import { tenderDialog } from '../../data/tenderTexts'
import { tenderFileName, useTenderDialog } from '../../hooks/useTenderDialog'
import { useUrlParams } from '../../hooks/useUrlParams'
import { articleById, articleDutyPoint, articlesOfModel } from '../../lib/articles'
import { maxCompare } from '../../lib/personal'
import { discountFor } from '../../lib/pricing'
import { modelSubject } from '../../lib/tenderSubjects'
import {
  filterModels,
  modelFilterOptions,
  sortModels,
  type ModelFilters,
  type ModelSort,
  type ModelSortKey,
} from '../../lib/modelSpecs'
import { usePersonal } from '../../personal/usePersonal'
import type { ProductEntry } from '../../projects/ProjectsContext'
import type { ProductModel } from '../../types'
import { AddToProjectDialog } from '../projects/AddToProjectDialog'
import { TabHeading } from '../TabHeading'
import { CompareBar } from './CompareBar'
import { ComparePanel } from './ComparePanel'
import { ModelDetail } from './ModelDetail'
import { ModelFilterBar } from './ModelFilterBar'
import { ModelsTable } from './ModelsTable'

const copy = productPage.models

/**
 * Models tab. Filters and the open row are in the URL (?hz, ?power, ?dn,
 * ?model), so reload and links keep them; sort is local. The comparison is
 * shared with the personal toolbar, and the frequency defaults to the one set
 * under Units & market.
 */
export function ModelsTab({ models }: { models: ProductModel[] }) {
  const { user, signIn } = useAuth()
  const discount = user ? discountFor(user) : 0
  const { openTender, tenderDialog: tenderDialogElement } = useTenderDialog()
  function tenderText(model: ProductModel) {
    const subject = modelSubject(model)
    if (!subject) return
    openTender({
      label: model.name,
      documentTitle: tenderDialog.documentTitle(model.name),
      subjects: [subject],
      fileName: tenderFileName(model.name),
    })
  }
  const [params, update] = useUrlParams()
  const [sort, setSort] = useState<ModelSort | null>(null)
  const { compareIds, toggleCompare, clearCompare, compareOpen, setCompareOpen, preferences } =
    usePersonal()
  const [projectDialog, setProjectDialog] = useState<{
    entries: ProductEntry[]
    open: boolean
    session: number
  }>({ entries: [], open: false, session: 0 })

  const frequencies = modelFilterOptions(models, 50).frequencies
  const requestedHz = Number(params.get('hz'))
  const preferred = frequencies.includes(preferences.frequency)
    ? preferences.frequency
    : frequencies[0]
  const frequency = frequencies.find((hz) => hz === requestedHz) ?? preferred ?? 50
  const options = modelFilterOptions(models, frequency)
  // Values that don't exist at this frequency (e.g. from an edited URL) count as "all".
  const power = options.power.some((o) => o.value === params.get('power'))
    ? params.get('power')!
    : ''
  const connection = options.connection.some((o) => o.value === params.get('dn'))
    ? params.get('dn')!
    : ''
  const filters: ModelFilters = { frequency, power, connection }

  const atFrequency = models.filter((model) => model.frequency === frequency)
  const sorted = sortModels(filterModels(models, filters), sort)
  // Discontinued models last, whatever the sort: they are there for spare parts and replacement.
  const shown = [...sorted.filter((m) => !m.discontinued), ...sorted.filter((m) => m.discontinued)]
  const expandedId = params.get('model')
  const compared = compareIds
    .map((id) => models.find((model) => model.id === id))
    .filter((model) => model !== undefined)

  const setParam = (key: string, value: string) =>
    update((next) => (value ? next.set(key, value) : next.delete(key)))

  function selectFrequency(hz: 50 | 60) {
    update((next) => {
      next.set('hz', String(hz))
      // Sizes and powers differ per frequency, so start over.
      next.delete('power')
      next.delete('dn')
      next.delete('model')
    })
  }

  function resetFilters() {
    update((next) => ['power', 'dn'].forEach((key) => next.delete(key)))
  }

  function toggleSort(key: ModelSortKey) {
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  /** The model itself (AHLSTAR), or its first variant where the product is sold as variants. */
  function addToProject(model: ProductModel) {
    const article = articleById(model.id) ?? articlesOfModel(model.id)[0]
    if (!article) return
    setProjectDialog((d) => ({
      entries: [{ variantId: article.id, dutyPoint: articleDutyPoint(article) }],
      open: true,
      session: d.session + 1,
    }))
  }

  return (
    <>
      <TabHeading title={copy.title} />

      <div className="mt-8">
        <ModelFilterBar
          filters={filters}
          options={options}
          shown={shown.length}
          total={atFrequency.length}
          onFrequency={selectFrequency}
          onPower={(value) => setParam('power', value)}
          onConnection={(value) => setParam('dn', value)}
          onReset={power || connection ? resetFilters : undefined}
        />
      </div>

      <div className="mt-6">
        {shown.length > 0 ? (
          <ModelsTable
            models={shown}
            signedIn={user !== null}
            discount={discount}
            onSignIn={() => signIn()}
            sort={sort}
            onSort={toggleSort}
            expandedId={expandedId}
            onToggleExpand={(id) => setParam('model', id === expandedId ? '' : id)}
            compareIds={compared.map((model) => model.id)}
            onToggleCompare={toggleCompare}
            detail={(model) => (
              <ModelDetail
                model={model}
                comparing={compared.includes(model)}
                canCompare={compared.length < maxCompare}
                onAddToProject={() => addToProject(model)}
                onToggleCompare={() => toggleCompare(model.id)}
                onTenderText={() => tenderText(model)}
              />
            )}
          />
        ) : (
          <div className="flex flex-col items-center rounded-lg border border-border px-8 py-14 text-center">
            <SlidersHorizontal aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-semibold text-navy-900">{copy.noMatches.title}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {copy.noMatches.action}
            </button>
          </div>
        )}
        {user && (
          <p className="mt-3 text-right text-xs text-text-muted">
            {discount > 0 ? copy.partnerPriceNote(discount) : copy.priceNote}
          </p>
        )}
      </div>

      {/* In <body>: the tab panel's fade-in uses a transform, which would anchor fixed elements to it. */}
      {createPortal(
        <>
          <CompareBar
            models={compared}
            onRemove={toggleCompare}
            onClear={clearCompare}
            onOpen={() => setCompareOpen(true)}
          />
          <ComparePanel
            open={compareOpen && compared.length > 1}
            models={compared}
            signedIn={user !== null}
            discount={discount}
            onClose={() => setCompareOpen(false)}
          />
        </>,
        document.body,
      )}
      {tenderDialogElement}
      <AddToProjectDialog
        key={`project-${projectDialog.session}`}
        open={projectDialog.open}
        entries={projectDialog.entries}
        onClose={() => setProjectDialog((d) => ({ ...d, open: false }))}
      />
    </>
  )
}
