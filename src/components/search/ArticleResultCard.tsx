import { ChartSpline, ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { searchPage } from '../../data/catalogPages'
import { articleById } from '../../lib/articles'
import { getProduct } from '../../lib/catalog'
import { seriesColors } from '../../lib/chartColors'
import { groupThousands } from '../../lib/format'
import { formatPrice } from '../../lib/modelSpecs'
import type { ResultArticle } from '../../types'
import { SizingCurveChart } from '../sizing/SizingCurveChart'
import { SmartImage } from '../SmartImage'
import { StockIndicator } from '../variant/StockIndicator'
import { Highlight } from './Highlight'

const copy = searchPage.variants
const labels = copy.specs

const number = (value: number) => groupThousands(value, value % 1 ? 1 : 0)

/** The two-column spec list of a result card, in display order. */
function specs(article: ResultArticle) {
  return [
    { label: labels.frequency, value: `${article.frequency} Hz` },
    { label: labels.phase, value: String(article.phase) },
    { label: labels.power, value: `${number(article.power)} kW` },
    { label: labels.speed, value: `${groupThousands(article.speed)} rpm` },
    { label: labels.housing, value: article.housing },
    { label: labels.outlet, value: `DN ${article.outlet}` },
    { label: labels.maxFlow, value: `${groupThousands(article.maxFlow)} m³/h` },
    { label: labels.maxHead, value: `${number(article.maxHead)} m` },
    { label: labels.ex, value: article.exApproved ? copy.yesNo.yes : copy.yesNo.no },
    { label: labels.impeller, value: `${article.impellerType}, Ø${article.impellerDiameter}` },
  ]
}

type ArticleResultCardProps = {
  article: ResultArticle
  /** Bolds the matched words in the model code and product number. */
  query: string
}

/**
 * A variant or model in the results: category badge, model code (the whole
 * card opens its page), product number, a two-column spec list, the product
 * image and, signed in, price and stock. "Show curve" opens its Q–H and
 * efficiency curve inside the card, so curves can be compared in the list.
 */
export function ArticleResultCard({ article, query }: ArticleResultCardProps) {
  const curveId = useId()
  const { user } = useAuth()
  const [showCurve, setShowCurve] = useState(false)
  const image = getProduct(article.productId)?.images[0]
  const successor = article.discontinued && articleById(article.discontinued.successorId)

  return (
    <article className="relative rounded-md border border-border bg-white px-6 py-5 transition-colors duration-200 hover:border-primary">
      <div className="grid gap-x-8 gap-y-5 md:grid-cols-[minmax(0,1fr)_10rem]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-surface-sunken px-2 py-0.5 text-xs font-semibold text-navy-700">
              {article.category}
            </span>
            {article.discontinued && (
              <span className="rounded-sm bg-warning-tint px-2 py-0.5 text-xs font-semibold text-warning-strong">
                {copy.discontinued}
              </span>
            )}
          </div>
          <h3 className="mt-2 text-lg leading-snug font-bold tracking-tight text-brand">
            <Link
              to={article.to}
              className="underline-offset-4 after:absolute after:inset-0 after:rounded-md hover:underline"
            >
              <Highlight text={article.code} query={query} />
            </Link>
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            {copy.number}{' '}
            <span className="font-semibold text-navy-900 tabular-nums">
              <Highlight text={article.productNumber} query={query} />
            </span>
          </p>
          {successor && (
            <p className="relative z-10 mt-1 w-fit text-sm text-text-muted">
              {copy.replacedBy}{' '}
              <Link
                to={successor.to}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {successor.code}
              </Link>
            </p>
          )}

          <dl className="mt-4 grid gap-x-10 text-[13px] sm:grid-cols-2">
            {specs(article).map((spec) => (
              <div
                key={spec.label}
                className="flex items-baseline justify-between gap-4 border-b border-border/70 py-1.5"
              >
                <dt className="text-text-muted">{spec.label}</dt>
                <dd className="text-right font-semibold text-navy-900">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col items-stretch gap-3">
          {image && (
            <div className="relative hidden h-36 md:block">
              <SmartImage src={image.src} alt={image.alt} fit="contain" />
            </div>
          )}
          {user && !article.discontinued && (
            <div className="animate-fade-in text-right md:text-left">
              <p className="text-lg font-bold text-navy-900 tabular-nums">
                {formatPrice(article.listPrice)}
              </p>
              <p className="text-xs font-semibold text-navy-900">
                <StockIndicator status={article.availability.status} />
              </p>
              <p className="text-xs text-text-muted">{article.availability.leadTime}</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-expanded={showCurve}
        aria-controls={curveId}
        onClick={() => setShowCurve((open) => !open)}
        className="relative z-10 mt-4 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        <ChartSpline className="size-4" />
        {showCurve ? copy.hideCurve : copy.showCurve}
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${showCurve ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={curveId}
        inert={!showCurve}
        className={`relative z-10 grid transition-[grid-template-rows,opacity] duration-200 ease-sz ${
          showCurve ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {/* Mounted only while open, so a closed card costs nothing. */}
          {showCurve && (
            <div className="mt-3 rounded-md border border-border bg-white p-4">
              <SizingCurveChart
                curves={[article.curve]}
                colors={seriesColors}
                duty={article.rated}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
