import { ArrowRight, FileText } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { productPage as copy } from '../../data/catalogPages'
import { applicationPath, getApplication } from '../../lib/catalog'
import type { Product } from '../../types'
import { Breadcrumb } from '../Breadcrumb'
import { SmartImage } from '../SmartImage'
import { KeySpecStrip } from './KeySpecStrip'

type ProductHeaderProps = {
  product: Product
  /** Opens the Documentation tab. */
  onShowDocumentation: () => void
}

/**
 * Product page header: breadcrumb, badge, name, "Suitable for" links (first three,
 * then "View more"), standard, documentation link and "Size product" on the left;
 * product image and key specs on the right.
 */
export function ProductHeader({ product, onShowDocumentation }: ProductHeaderProps) {
  const [showAllApplications, setShowAllApplications] = useState(false)
  const suitableFor = product.applications.map(getApplication).filter((app) => app !== undefined)
  const shown = showAllApplications ? suitableFor : suitableFor.slice(0, copy.suitableForMax)

  return (
    <section className="bg-white">
      <div className="site-container py-5">
        <Breadcrumb items={[...copy.breadcrumb, { label: product.name }]} />
      </div>

      <div
        key={product.id}
        className="site-container grid animate-fade-in gap-x-16 gap-y-10 pt-4 pb-12 lg:grid-cols-2"
      >
        <div className="flex flex-col items-start">
          <span className="rounded-sm bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-navy-700">
            {product.family}
          </span>
          <h1 className="mt-4 text-[2.75rem] leading-tight font-bold tracking-tight text-brand">
            {product.name}
          </h1>

          {suitableFor.length > 0 && (
            <>
              <p className="mt-5 font-semibold text-navy-900">{copy.suitableForLabel}</p>
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
              {suitableFor.length > copy.suitableForMax && (
                <button
                  type="button"
                  aria-expanded={showAllApplications}
                  onClick={() => setShowAllApplications((open) => !open)}
                  className="mt-3 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
                >
                  {showAllApplications ? copy.viewLessLabel : copy.viewMoreLabel}
                </button>
              )}
            </>
          )}

          {product.standard && <p className="mt-5 text-[15px] text-navy-900">{product.standard}</p>}

          <button
            type="button"
            onClick={onShowDocumentation}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
          >
            <FileText className="size-4" strokeWidth={1.75} />
            {copy.documentationLink}
          </button>

          <Link
            to={`/sizing?product=${product.id}`}
            className="group mt-auto inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover max-lg:mt-8 lg:mt-10"
          >
            {copy.sizeLabel}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex flex-col justify-end gap-8">
          <div className="relative mx-auto aspect-[16/10] w-full max-w-xl">
            <SmartImage src={product.images[0].src} alt={product.images[0].alt} fit="contain" />
          </div>
          {product.keySpecs && <KeySpecStrip specs={product.keySpecs} />}
        </div>
      </div>
    </section>
  )
}
