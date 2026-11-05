import { ArrowLeft, Printer } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { SmartImage } from '../components/SmartImage'
import { SulzerLogo } from '../components/SulzerLogo'
import { SpecGroupTable } from '../components/variant/SpecGroupTable'
import { configuredPage } from '../data/configuredPages'
import { variantPage as copy } from '../data/variantPages'
import { useConfiguredPump } from '../hooks/useConfiguredPump'
import { getArticle } from '../lib/articles'
import { getApplication, getProduct } from '../lib/catalog'
import { configuredSpecGroups } from '../lib/configured'
import { articleSpecGroups } from '../lib/variantSpecs'
import { NotFoundPage } from './NotFoundPage'

/**
 * Clean print view of a variant or model (/products/:id/:variantId/print):
 * no site header or footer, A4 width, a toolbar that is hidden when printing.
 * "Print or save as PDF" opens the browser's print dialog. With `configured`,
 * it prints a configured pump (/products/:id/config/:variantId/print).
 */
export function VariantPrintPage({ configured = false }: { configured?: boolean }) {
  const { id = '', variantId = '' } = useParams()
  const { search } = useLocation()
  const configuredPump = useConfiguredPump()
  const pump = configured ? configuredPump : { variant: undefined, article: undefined }
  const product = getProduct(id)
  const article = configured ? pump.article : product && getArticle(product.id, variantId)
  if (!product || !article) return <NotFoundPage />
  const specGroups = pump.variant
    ? configuredSpecGroups(pump.variant, article, pump.duty, pump.result)
    : articleSpecGroups(article)
  const backTo = pump.variant ? `${article.to.split('?')[0]}${search}` : article.to

  const applications = article.applicationIds
    .map(getApplication)
    .filter((app) => app !== undefined)
    .map((app) => app.name)
  const image = product.images[0]

  return (
    <div className="min-h-screen bg-surface-muted py-8 print:bg-white print:py-0">
      <title>{`${article.code} – ${copy.print.printed} | Sulzer`}</title>

      <div className="mx-auto mb-6 flex max-w-[210mm] items-center justify-between gap-4 px-4 print:hidden">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" />
          {copy.print.back}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover max-md:shrink-0 max-md:px-4"
        >
          <Printer className="size-4" />
          {copy.print.print}
        </button>
      </div>

      <article className="mx-auto max-w-[210mm] bg-white px-[14mm] py-[12mm] shadow-card max-md:px-4 max-md:py-6 print:shadow-none">
        <header className="flex items-end justify-between border-b-2 border-navy-900 pb-4">
          <SulzerLogo className="h-7" />
          <p className="text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
            {copy.print.printed}
          </p>
        </header>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_42mm] gap-8 max-md:grid-cols-1 max-md:gap-6">
          <div>
            <span className="rounded-sm bg-surface-sunken px-2 py-0.5 text-xs font-semibold text-navy-700">
              {article.category}
            </span>
            <h1 className="mt-3 text-2xl leading-tight font-bold tracking-tight text-brand">
              {article.code}
            </h1>
            <p className="mt-1 text-sm font-semibold text-navy-900 tabular-nums">
              {pump.variant
                ? configuredPage.productNumber(pump.variant.productNumber)
                : copy.productNumber(article.productNumber)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text">{product.summary}</p>
            <p className="mt-3 text-sm text-text">
              <span className="font-semibold text-navy-900">{copy.suitableFor}: </span>
              {applications.join(', ')}
            </p>
          </div>
          <div className="relative h-[52mm]">
            <SmartImage src={image.src} alt={image.alt} fit="contain" />
          </div>
        </div>

        <div className="mt-8 columns-2 gap-10 max-md:columns-1 [&>section]:mb-7">
          {specGroups.map((group) => (
            <SpecGroupTable key={group.title} title={group.title} rows={group.rows} />
          ))}
        </div>

        <footer className="mt-6 border-t border-border pt-3 text-[11px] text-text-subtle">
          {copy.print.footer}
        </footer>
      </article>
    </div>
  )
}
