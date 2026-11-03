import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../auth/useAuth'
import { productPage } from '../../data/catalogPages'
import { useUrlParams } from '../../hooks/useUrlParams'
import { maxCompare } from '../../lib/personal'
import { discountFor } from '../../lib/pricing'
import {
  filterModels,
  modelFilterOptions,
  sortModels,
  type ModelFilters,
  type ModelSort,
  type ModelSortKey,
} from '../../lib/modelSpecs'
import { usePersonal } from '../../personal/usePersonal'
import { useToast } from '../../toast/useToast'
import type { ProductModel } from '../../types'
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
  const showToast = useToast()
  const [params, update] = useUrlParams()
  const [sort, setSort] = useState<ModelSort | null>(null)
  const { compareIds, toggleCompare, clearCompare, compareOpen, setCompareOpen, preferences } =
    usePersonal()

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
  const shown = sortModels(filterModels(models, filters), sort)
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

  function addToProject(model: ProductModel) {
    showToast({
      message: copy.detail.addedToProject,
      detail: `${model.name} · ${model.frequency} Hz`,
      action: { label: copy.detail.viewProjects, to: '/my-projects' },
    })
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
    </>
  )
}
