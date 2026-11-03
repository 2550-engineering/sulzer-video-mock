import { ArrowRight, CircleCheck, SearchX } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PageHeaderBand } from '../components/PageHeaderBand'
import { DiscontinuedList } from '../components/replacement/DiscontinuedList'
import { FitNotes } from '../components/replacement/FitNotes'
import { OldProductCard } from '../components/replacement/OldProductCard'
import { ReplacementCard } from '../components/replacement/ReplacementCard'
import { ReplacementSearch } from '../components/replacement/ReplacementSearch'
import { SpecComparison } from '../components/replacement/SpecComparison'
import { replacementPage as copy } from '../data/replacementPage'
import { getProductVariant, variantPath } from '../lib/catalog'
import { comparisonRows, findVariant, fitNotes, replacementInfo } from '../lib/replacement'

/**
 * /products/replacement?from=<product number>: the old product, its
 * recommended successor, whether it fits and how the key specs compare.
 * Without ?from, a search for the old product number and the discontinued
 * products as quick picks.
 */
export function ReplacementPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const from = params.get('from')?.trim() ?? ''
  const old = from ? findVariant(from) : undefined
  const successor = old?.discontinued && getProductVariant(old.discontinued.successorId)

  const search = (query: string) =>
    navigate(
      query ? `/products/replacement?from=${encodeURIComponent(query)}` : '/products/replacement',
    )

  return (
    <>
      <title>{`${old ? `${old.code} – ` : ''}${copy.title} | Sulzer`}</title>
      <PageHeaderBand
        breadcrumb={[...copy.breadcrumb, { label: copy.crumb }]}
        title={copy.title}
        description={copy.description}
      >
        <ReplacementSearch key={from} initial={old?.productNumber ?? from} onSearch={search} />
      </PageHeaderBand>

      <section className="min-h-[480px] bg-surface-muted">
        <div className="site-container space-y-10 py-12">
          {!from ? (
            <DiscontinuedList />
          ) : !old ? (
            <>
              <p className="flex items-start gap-3 rounded-lg border border-border bg-white px-6 py-5 text-[15px] text-text">
                <SearchX aria-hidden className="mt-0.5 size-5 shrink-0 text-text-subtle" />
                {copy.notFound(from)}
              </p>
              <DiscontinuedList />
            </>
          ) : !successor ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-lg border border-success bg-success-tint px-6 py-5">
              <CircleCheck
                aria-hidden
                className="size-8 shrink-0 text-success"
                strokeWidth={1.75}
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-navy-900">{copy.stillAvailable.title(old.code)}</p>
                <p className="mt-0.5 text-sm text-text">{copy.stillAvailable.text}</p>
              </div>
              <Link
                to={variantPath(old)}
                className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {copy.stillAvailable.action}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <div key={old.id} className="animate-fade-in space-y-10">
              <div className="grid items-stretch gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                <OldProductCard variant={old} />
                <div className="flex items-center justify-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-navy-900 text-white shadow-raised max-md:rotate-90">
                    <ArrowRight aria-hidden className="size-5" />
                  </span>
                </div>
                <ReplacementCard variant={successor} info={replacementInfo(old)} />
              </div>

              <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <FitNotes notes={fitNotes(old, successor)} />
                <SpecComparison rows={comparisonRows(old, successor)} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
