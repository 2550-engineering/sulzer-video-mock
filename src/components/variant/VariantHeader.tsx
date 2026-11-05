import { useState } from 'react'
import { Link } from 'react-router'
import { productPage } from '../../data/catalogPages'
import { variantPage as copy } from '../../data/variantPages'
import { applicationPath, getApplication, productPath } from '../../lib/catalog'
import type { Product, ResultArticle } from '../../types'
import { Breadcrumb } from '../Breadcrumb'
import { SmartImage } from '../SmartImage'
import { DiscontinuedBanner } from './DiscontinuedBanner'
import { PriceBox } from './PriceBox'
import { VariantActions } from './VariantActions'
import { VariantToolbar } from './VariantToolbar'

type VariantHeaderProps = {
  article: ResultArticle
  product: Product
  /** Opens a tab, e.g. Curves from "Show curve". */
  onSelectTab: (tab: string) => void
}

/**
 * Configured product header: image with the icon toolbar on the left; badge,
 * model code, number, "Suitable for" and description in the middle; actions
 * and the price box on the right. Discontinued variants get a banner on top.
 */
export function VariantHeader({ article, product, onSelectTab }: VariantHeaderProps) {
  const [showAllApplications, setShowAllApplications] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const suitableFor = article.applicationIds.map(getApplication).filter((app) => app !== undefined)
  const shown = showAllApplications ? suitableFor : suitableFor.slice(0, productPage.suitableForMax)
  const image = product.images[0]
  const more = product.tabs.explore.intro.text

  return (
    <section className="bg-white">
      <div className="site-container py-5">
        <Breadcrumb
          items={[
            ...copy.breadcrumb,
            { label: product.name, to: productPath(product) },
            { label: article.code },
          ]}
        />
      </div>

      <div key={article.id} className="site-container animate-fade-in pt-2 pb-12">
        {article.discontinued && (
          <div className="mb-8">
            <DiscontinuedBanner
              article={article}
              onViewSpareParts={() => onSelectTab('spare-parts')}
            />
          </div>
        )}

        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_21rem]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative aspect-square w-full max-w-72">
              <SmartImage src={image.src} alt={image.alt} fit="contain" />
            </div>
            <VariantToolbar />
          </div>

          <div className="flex min-w-0 flex-col items-start">
            <span className="rounded-sm bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-navy-700">
              {article.category}
            </span>
            <h1 className="mt-4 text-[2.25rem] leading-tight font-bold tracking-tight break-words text-brand">
              {article.code}
            </h1>
            <p className="mt-2 text-[15px] font-semibold text-navy-900 tabular-nums">
              {copy.productNumber(article.productNumber)}
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

            <div className="mt-6 max-w-2xl text-[15px] leading-relaxed text-text">
              <p>{product.summary}</p>
              {showMore && <p className="mt-3 animate-fade-in">{more}</p>}
              <button
                type="button"
                aria-expanded={showMore}
                onClick={() => setShowMore((open) => !open)}
                className="mt-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                {showMore ? copy.viewLess : copy.viewMore}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2 lg:grid lg:grid-cols-2 xl:col-span-1 xl:flex">
            <VariantActions article={article} />
            <PriceBox article={article} onRequestQuote={() => onSelectTab('quotation')} />
          </div>
        </div>
      </div>
    </section>
  )
}
