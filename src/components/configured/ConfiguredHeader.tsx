import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { productPage } from '../../data/catalogPages'
import { configuredPage } from '../../data/configuredPages'
import { variantPage as copy } from '../../data/variantPages'
import { applicationPath, getApplication, productPath } from '../../lib/catalog'
import type { Product, PumpVariant, ResultArticle, SizingResult } from '../../types'
import { Breadcrumb } from '../Breadcrumb'
import { SmartImage } from '../SmartImage'
import { VariantToolbar } from '../variant/VariantToolbar'
import { ConfiguredActions } from './ConfiguredActions'
import { ConfiguredKeyData } from './ConfiguredKeyData'
import { ConfiguredPriceBox } from './ConfiguredPriceBox'

type ConfiguredHeaderProps = {
  variant: PumpVariant
  article: ResultArticle
  product: Product
  result: Omit<SizingResult, 'rank'> | undefined
  /** True for a project's or sizing's duty point, false for the rated point. */
  atDuty: boolean
  /** Shown under the breadcrumb, e.g. the project context bar. */
  context?: ReactNode
  /** Starting quantity in the price block. */
  quantity?: number
  onSelectTab: (tab: string) => void
}

/**
 * Configured pump header, laid out like the model and variant pages: image
 * and icon toolbar; badge, full name, product number, "Suitable for" and key
 * data at the duty point; actions and the price block on the right.
 */
export function ConfiguredHeader({
  variant,
  article,
  product,
  result,
  atDuty,
  context,
  quantity,
  onSelectTab,
}: ConfiguredHeaderProps) {
  const [showAllApplications, setShowAllApplications] = useState(false)
  const suitableFor = article.applicationIds.map(getApplication).filter((app) => app !== undefined)
  const shown = showAllApplications ? suitableFor : suitableFor.slice(0, productPage.suitableForMax)
  const image = product.images[0]

  return (
    <section className="bg-white">
      <div className="site-container py-5">
        <Breadcrumb
          items={[
            ...copy.breadcrumb,
            { label: product.name, to: productPath(product) },
            { label: variant.name },
          ]}
        />
        {context}
      </div>

      <div key={article.id} className="site-container animate-fade-in pt-2 pb-12">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_21rem]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative aspect-square w-full max-w-72">
              <SmartImage src={image.src} alt={image.alt} fit="contain" />
            </div>
            <VariantToolbar />
          </div>

          <div className="flex min-w-0 flex-col items-start">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-sm bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-navy-700">
                {article.category}
              </span>
              <span className="rounded-sm bg-primary-tint px-2.5 py-1 text-xs font-semibold text-primary">
                {configuredPage.configured}
              </span>
            </div>
            <h1 className="mt-4 text-[2.25rem] leading-tight font-bold tracking-tight break-words text-brand">
              {variant.name}
            </h1>
            <p className="mt-2 text-[15px] font-semibold text-navy-900 tabular-nums">
              {configuredPage.productNumber(variant.productNumber)}
            </p>

            {suitableFor.length > 0 && (
              <>
                <p className="mt-6 font-semibold text-navy-900">{copy.suitableFor}</p>
                <ul className="mt-2.5 space-y-1.5 pl-5 text-[15px] [list-style:disc] marker:text-primary">
                  {shown.map((app) => (
                    <li key={app.id}>
                      <Link
                        to={applicationPath(app)}
                        className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-hover hover:decoration-primary"
                      >
                        {app.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {suitableFor.length > productPage.suitableForMax && (
                  <button
                    type="button"
                    aria-expanded={showAllApplications}
                    onClick={() => setShowAllApplications((open) => !open)}
                    className="mt-3 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {showAllApplications ? copy.viewLess : copy.viewMore}
                  </button>
                )}
              </>
            )}

            {result && <ConfiguredKeyData result={result} atDuty={atDuty} />}
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2 lg:grid lg:grid-cols-2 xl:col-span-1 xl:flex">
            <ConfiguredActions
              name={variant.name}
              onTenderText={() => onSelectTab('tender-text')}
            />
            <ConfiguredPriceBox variant={variant} article={article} quantity={quantity} />
          </div>
        </div>
      </div>
    </section>
  )
}
