import { ArrowRight, Search, SearchX } from 'lucide-react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ActiveFilterChips } from '../components/ActiveFilterChips'
import { AssetList } from '../components/assets/AssetList'
import { AssetSummaryStrip, type SummaryTile } from '../components/assets/AssetSummaryStrip'
import { SiteAssetGroup } from '../components/assets/SiteAssetGroup'
import { Breadcrumb } from '../components/Breadcrumb'
import { FilterColumn } from '../components/search/FilterColumn'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { SelectField } from '../components/SelectField'
import { assetListPage as copy, syncLabel } from '../data/assetPages'
import { sites } from '../data/assets'
import { signedOutRedirect } from '../data/myPages'
import { useUrlParams } from '../hooks/useUrlParams'
import { assetFilters, matchesQuery, sortAssets, type AssetSort } from '../lib/assetList'
import { needsAttention, summarizeAssets } from '../lib/assetSummary'
import { assetsFor } from '../lib/connect'
import { applyFilters, filterGroups, type FilterSelection } from '../lib/filters'

type View = 'list' | 'sites'

const sorts = Object.keys(copy.sort.options) as AssetSort[]
const attentionStatuses = ['alarm', 'warning']

const sameValues = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value) => b.includes(value))

/**
 * My assets: /assets. Signed-in only. The installed base with a summary strip
 * (each tile a quick filter), filters, search by tag or serial number, and a
 * list or by-site view. Filters, search, view and sort live in the URL, so
 * My Pages can link straight to e.g. ?status=alarm&status=warning.
 */
export function AssetsPage() {
  const { user } = useAuth()
  const [params, update] = useUrlParams()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const owned = assetsFor(user)
  const summary = summarizeAssets(owned)

  const selection: FilterSelection = Object.fromEntries(
    assetFilters.map((def) => [def.id, params.getAll(def.id)]),
  )
  const query = params.get('q') ?? ''
  const view: View = params.get('view') === 'sites' ? 'sites' : 'list'
  const requestedSort = params.get('sort') as AssetSort
  const sort = sorts.includes(requestedSort) ? requestedSort : sorts[0]

  const searched = owned.filter((asset) => matchesQuery(asset, query))
  const shown = sortAssets(applyFilters(searched, assetFilters, selection), sort)
  const groups = filterGroups(searched, assetFilters, selection)
  const filtered = Object.values(selection).some((values) => values.length > 0)

  function setGroup(id: string, values: string[]) {
    update((next) => {
      next.delete(id)
      for (const value of values) next.append(id, value)
    })
  }

  function toggle(id: string, value: string) {
    const current = selection[id]
    setGroup(id, current.includes(value) ? current.filter((v) => v !== value) : [...current, value])
  }

  function resetFilters() {
    update((next) => {
      for (const def of assetFilters) next.delete(def.id)
      next.delete('q')
    })
  }

  function showAll() {
    update((next) => {
      for (const def of assetFilters) next.delete(def.id)
      next.delete('q')
      next.delete('view')
    })
  }

  /** A summary tile: shows only its group's values, or clears them when it is already on. */
  function quickFilter(id: string, values: string[]): Pick<SummaryTile, 'active' | 'onSelect'> {
    const active =
      sameValues(selection[id], values) &&
      assetFilters.every((def) => def.id === id || selection[def.id].length === 0)
    return {
      active,
      onSelect: () =>
        update((next) => {
          for (const def of assetFilters) next.delete(def.id)
          next.delete('q')
          if (!active) for (const value of values) next.append(id, value)
        }),
    }
  }

  const tiles: SummaryTile[] = [
    {
      id: 'all',
      value: summary.total,
      ...copy.summary.all,
      tone: 'neutral',
      active: !filtered && !query && view === 'list',
      onSelect: showAll,
    },
    {
      id: 'sites',
      value: summary.sites,
      ...copy.summary.sites,
      tone: 'neutral',
      active: view === 'sites',
      onSelect: () =>
        update((next) => (view === 'sites' ? next.delete('view') : next.set('view', 'sites'))),
    },
    {
      id: 'connected',
      value: summary.connected,
      ...copy.summary.connected,
      tone: 'info',
      ...quickFilter('connected', ['yes']),
    },
    {
      id: 'attention',
      value: summary.needsAttention,
      ...copy.summary.attention,
      detail: copy.summary.attention.detail(summary.alarms, summary.warnings),
      tone: 'warning',
      ...quickFilter('status', attentionStatuses),
    },
    {
      id: 'service',
      value: summary.serviceDue,
      ...copy.summary.service,
      tone: 'info',
      ...quickFilter('service', ['due']),
    },
  ]

  // By site: sites that need attention first, each with its matching assets.
  const siteGroups = sites
    .map((site) => ({ site, assets: shown.filter((asset) => asset.siteId === site.id) }))
    .filter((group) => group.assets.length > 0)
    .sort((a, b) => Number(b.assets.some(needsAttention)) - Number(a.assets.some(needsAttention)))

  return (
    <div className="bg-surface-muted">
      <title>{`${copy.title} | mySulzer | Sulzer`}</title>

      <div className="site-container py-5">
        <Breadcrumb items={[...copy.breadcrumb, { label: copy.title }]} />
      </div>

      <div className="site-container pt-4 pb-24">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-text-muted">{user.company}</p>
            <h1 className="mt-1 text-[2.75rem] leading-tight font-bold tracking-tight text-brand">
              {copy.title}
            </h1>
            <p className="mt-2 max-w-2xl text-lg text-text-muted">
              {copy.description(summary.sites)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <span
                aria-hidden
                className="size-2 rounded-full bg-success ring-4 ring-success-tint"
              />
              {syncLabel}
            </p>
            <Link
              to={copy.connectTo}
              className="group inline-flex h-11 items-center gap-2 rounded-pill border border-primary bg-white px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
            >
              {copy.openConnect}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </header>

        <div className="mt-10">
          <AssetSummaryStrip label={copy.summary.label} tiles={tiles} />
        </div>

        <div className="mt-8 grid items-start gap-6 max-lg:grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <FilterColumn
            facets={groups}
            onToggle={toggle}
            title={copy.filters.title}
            onReset={filtered || query ? resetFilters : undefined}
          />

          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-4">
              <div className="relative w-full max-w-sm">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-subtle"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) =>
                    update((next) =>
                      e.target.value ? next.set('q', e.target.value) : next.delete('q'),
                    )
                  }
                  placeholder={copy.search}
                  aria-label={copy.search}
                  className="h-11 w-full rounded-pill border border-border-strong bg-white pr-4 pl-10 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
                />
              </div>
              <p
                className="pb-2.5 text-sm font-semibold text-navy-900 tabular-nums"
                aria-live="polite"
              >
                {copy.count(shown.length, owned.length)}
              </p>
              <div className="ml-auto flex flex-wrap items-end gap-4">
                <SegmentedToggle
                  label={copy.view.label}
                  value={view}
                  onChange={(value) =>
                    update((next) =>
                      value === 'sites' ? next.set('view', 'sites') : next.delete('view'),
                    )
                  }
                  options={[
                    { value: 'list', label: copy.view.list },
                    { value: 'sites', label: copy.view.sites },
                  ]}
                />
                <SelectField
                  layout="stacked"
                  label={copy.sort.label}
                  value={sort}
                  onChange={(value) =>
                    update((next) =>
                      value === sorts[0] ? next.delete('sort') : next.set('sort', value),
                    )
                  }
                  options={sorts.map((value) => ({ value, label: copy.sort.options[value] }))}
                />
              </div>
            </div>

            <ActiveFilterChips
              groups={groups}
              onRemove={toggle}
              onReset={resetFilters}
              labels={{
                title: copy.filters.active,
                remove: copy.filters.remove,
                reset: copy.filters.reset,
              }}
            />

            {shown.length === 0 ? (
              <div className="flex animate-fade-in flex-col items-center rounded-lg border border-border bg-white px-8 py-16 text-center">
                <SearchX aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
                <p className="mt-4 text-lg font-semibold text-navy-900">{copy.noResults.title}</p>
                <p className="mt-1 text-text-muted">{copy.noResults.text}</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  {copy.noResults.action}
                </button>
              </div>
            ) : view === 'sites' ? (
              <div className="space-y-5">
                {siteGroups.map(({ site, assets }) => (
                  <div key={site.id} className="animate-fade-in">
                    <SiteAssetGroup site={site} assets={assets} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="animate-fade-in overflow-hidden rounded-lg border border-border bg-white">
                <AssetList assets={shown} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
