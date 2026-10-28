import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { productPage as copy } from '../../data/catalogPages'
import { applicationPath, getApplication } from '../../lib/catalog'
import type { Product } from '../../types'
import { Breadcrumb } from '../Breadcrumb'
import { ImageSlot } from '../ImageSlot'
import { KeySpecStrip } from './KeySpecStrip'

/** Product page header: breadcrumb, name, "Suitable for" links, image, key specs and "Size product". */
export function ProductHeader({ product }: { product: Product }) {
  const suitableFor = product.applications.map(getApplication).filter((app) => app !== undefined)

  return (
    <section className="bg-white">
      <div className="site-container py-5">
        <Breadcrumb items={[copy.breadcrumbParent, { label: product.name }]} />
      </div>

      <div
        key={product.id}
        className="site-container grid animate-fade-in gap-x-16 gap-y-10 pt-6 pb-12 lg:grid-cols-2"
      >
        <div className="flex flex-col">
          <span className="self-start rounded-sm bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-navy-700">
            {product.family}
          </span>
          <h1 className="mt-4 text-[2.75rem] leading-tight font-bold tracking-tight text-heading">
            {product.name}
          </h1>

          <p className="mt-6 font-semibold text-navy-900">{copy.suitableForLabel}</p>
          <ul className="mt-3 space-y-2 pl-5 text-[15px] [list-style:disc] marker:text-primary">
            {suitableFor.map((app) => (
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

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-text-muted">
            {product.summary}
          </p>

          <Link
            to={`/sizing?product=${product.id}`}
            className="group mt-auto inline-flex h-12 items-center gap-2 self-start rounded-pill bg-primary px-7 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover max-lg:mt-8"
          >
            {copy.sizeLabel}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface-muted">
            <div className="absolute inset-8">
              <ImageSlot image={product.images[0]} fit="contain" />
            </div>
          </div>
          <KeySpecStrip specs={product.keySpecs} />
        </div>
      </div>
    </section>
  )
}
