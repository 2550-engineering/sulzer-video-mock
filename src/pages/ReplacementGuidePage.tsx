import { SearchX } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ApplicationPanelHero } from '../components/application/ApplicationPanelHero'
import { GuideBrowse } from '../components/replacement/GuideBrowse'
import { GuideComparisonTable } from '../components/replacement/GuideComparisonTable'
import { GuideEnergyCalculator } from '../components/replacement/GuideEnergyCalculator'
import { GuideExistingCard } from '../components/replacement/GuideExistingCard'
import { GuideFitBadge } from '../components/replacement/GuideFitBadge'
import { GuideReplacementCard } from '../components/replacement/GuideReplacementCard'
import {
  ReplacementGuideSearch,
  type GuideSearchStatus,
} from '../components/replacement/ReplacementGuideSearch'
import { SulzerReplacementResult } from '../components/replacement/SulzerReplacementResult'
import { replacementGuidePage as copy, sulzerReplacementCopy } from '../data/replacementGuidePage'
import {
  guideBrands,
  guideSavingsPower,
  replacementName,
  resolveGuideSelection,
  type GuideSelection,
  type GuideSuggestion,
} from '../lib/replacementGuide'

/** The search line for a ?from search: what it matched, or that it matched nothing. */
function searchStatus(
  from: string,
  selection: GuideSelection | undefined,
): GuideSearchStatus | undefined {
  if (!from) return undefined
  if (!selection) return { kind: 'error', text: copy.search.notFound(from) }
  if (selection.kind === 'competitor') {
    const { pump, replacement } = selection
    return {
      kind: 'found',
      text: copy.search.found(`${pump.brand} ${pump.model}`, replacementName(replacement)),
    }
  }
  return selection.successor
    ? { kind: 'found', text: copy.search.found(selection.article.code, selection.successor.code) }
    : undefined
}

/**
 * /products/replacement: the Replacement Guide. Find the installed pump by part, RSK
 * or Sulzer product number (?from=), from the suggestions, or by brand and model
 * (?brand=&model=), and see the Sulzer pump that replaces it, whether it fits, and
 * the energy it saves. Every choice is a history entry, so Back steps through them.
 * Until a pump is chosen the page shows only the search.
 */
export function ReplacementGuidePage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const selection = useMemo(() => resolveGuideSelection(params), [params])
  const brands = useMemo(() => guideBrands(), [])
  const from = params.get('from')?.trim() ?? ''

  const go = (query: string) => {
    if (query !== search) navigate({ search: query }, { replace: false })
  }
  const browse = (brand: string, model: string) => go(`?${new URLSearchParams({ brand, model })}`)

  // A ?from search that matched nothing: the search line and a note, no pump.
  const unmatched = from && !selection ? from : undefined
  // A brand chosen without a model yet fills the brand list only.
  const brandParam = params.get('brand') ?? ''
  const brand = selection
    ? selection.kind === 'competitor'
      ? selection.pump.brand
      : copy.discontinuedBrand
    : !from && brands.some((b) => b.name === brandParam)
      ? brandParam
      : ''
  const model = selection
    ? selection.kind === 'competitor'
      ? selection.pump.model
      : selection.article.id
    : ''
  const brandModels = brands.find((b) => b.name === brand)?.models ?? []
  // A Sulzer product that is still available is not in the list: show it anyway.
  const models =
    selection?.kind === 'sulzer' && !brandModels.some((m) => m.value === model)
      ? [...brandModels, { value: model, label: selection.article.code }]
      : brandModels
  const recommended = !selection
    ? undefined
    : selection.kind === 'competitor'
      ? replacementName(selection.replacement)
      : (selection.successor ?? selection.article).code

  // A Sulzer product found by id (e.g. from the discontinued banner) shows its product number.
  const initialQuery =
    selection?.kind === 'sulzer' && from === selection.article.id
      ? selection.article.productNumber
      : from

  function pick({ target }: GuideSuggestion) {
    if (target.kind === 'competitor') browse(target.brand, target.model)
    else browse(copy.discontinuedBrand, target.articleId)
  }

  const chooseBrand = (name: string) => go(`?${new URLSearchParams({ brand: name })}`)

  const resultKey = !selection
    ? `unmatched:${unmatched}`
    : selection.kind === 'competitor'
      ? `${selection.pump.brand}:${selection.pump.model}`
      : selection.article.id
  const power = selection && guideSavingsPower(selection)

  return (
    <>
      <title>{`${copy.crumb} | Sulzer`}</title>

      <ApplicationPanelHero
        image={copy.hero.image}
        breadcrumb={[...copy.breadcrumb, { label: copy.crumb }]}
        title={copy.hero.title}
        text={copy.hero.text}
        panelSide="left"
        size="lg"
      />

      <section className="relative z-10 site-container -mt-14">
        <div className="rounded-lg border border-border bg-white px-10 pt-8 pb-8 shadow-raised max-md:px-5 max-md:pt-6 max-md:pb-6">
          <ReplacementGuideSearch
            key={from}
            initial={initialQuery}
            status={searchStatus(from, selection)}
            onSearch={(query) => go(`?${new URLSearchParams({ from: query })}`)}
            onPick={pick}
          />
          <GuideBrowse
            brands={brands}
            brand={brand}
            model={model}
            models={models}
            recommended={recommended}
            onBrand={chooseBrand}
            onModel={(next) => browse(brand, next)}
          />
        </div>
      </section>

      {(selection || unmatched) && (
        <section key={resultKey} className="site-container animate-fade-in pt-8">
          {!selection ? (
            <p className="flex items-start gap-3 rounded-lg border border-border bg-surface-muted px-6 py-5 text-[15px] text-text">
              <SearchX aria-hidden className="mt-0.5 size-5 shrink-0 text-text-subtle" />
              {sulzerReplacementCopy.notFound(from)}
            </p>
          ) : selection.kind === 'competitor' ? (
            <div className="space-y-5">
              <GuideFitBadge fit={selection.fit} />
              <div className="grid items-start gap-5 max-md:hidden lg:grid-cols-2">
                <GuideExistingCard pump={selection.pump} />
                <GuideReplacementCard replacement={selection.replacement} />
              </div>
              <GuideComparisonTable
                pump={selection.pump}
                replacement={selection.replacement}
                className="md:hidden"
              />
            </div>
          ) : (
            <SulzerReplacementResult article={selection.article} successor={selection.successor} />
          )}
        </section>
      )}

      {power && (
        <section className="site-container pt-8">
          <GuideEnergyCalculator {...power} />
        </section>
      )}

      {/* The disclaimer is about the result data: only with a pump. Otherwise just the gap. */}
      {selection ? (
        <div className="site-container pt-10 pb-16">
          <p className="border-t border-border pt-6 text-[13px] text-text-subtle">
            {copy.disclaimer}
          </p>
        </div>
      ) : (
        <div aria-hidden className="pb-16" />
      )}
    </>
  )
}
