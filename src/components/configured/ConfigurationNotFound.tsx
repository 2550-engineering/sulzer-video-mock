import { ArrowRight, SearchX } from 'lucide-react'
import { Link } from 'react-router'
import { configuredPage } from '../../data/configuredPages'
import { variantPage } from '../../data/variantPages'
import { productPath } from '../../lib/catalog'
import type { Product } from '../../types'
import { Breadcrumb } from '../Breadcrumb'

const copy = configuredPage.notFound

/** A configuration link that doesn't resolve: a friendly message and a way back to the family. */
export function ConfigurationNotFound({ product }: { product: Product }) {
  return (
    <section className="bg-white">
      <title>{`${copy.title} | Sulzer`}</title>
      <div className="site-container py-5">
        <Breadcrumb
          items={[
            ...variantPage.breadcrumb,
            { label: product.name, to: productPath(product) },
            { label: copy.title },
          ]}
        />
      </div>
      <div className="site-container flex animate-fade-in flex-col items-center pt-10 pb-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary-tint text-primary">
          <SearchX className="size-8" strokeWidth={1.75} />
        </span>
        <h1 className="mt-6 text-[2rem] leading-tight font-bold tracking-tight text-brand">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-xl text-text-muted">{copy.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to={productPath(product)}
            className="inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            {copy.back(product.name)}
            <ArrowRight className="size-[18px]" />
          </Link>
          <Link
            to="/sizing"
            className="inline-flex h-12 items-center rounded-pill border-2 border-primary px-7 font-semibold text-primary transition-colors hover:bg-primary-tint"
          >
            {copy.sizing}
          </Link>
        </div>
      </div>
    </section>
  )
}
