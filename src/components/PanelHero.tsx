import type { ReactNode } from 'react'
import type { ImageRef } from '../types'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'
import { ImageSlot } from './ImageSlot'

type PanelHeroProps = {
  image: ImageRef
  breadcrumb: BreadcrumbItem[]
  title: string
  text: string
  /** Under the text, e.g. a primary button or a search form. */
  children?: ReactNode
  /** Re-runs the fade-in when the content changes on the same route. */
  contentKey?: string
}

/** Full-bleed image with the breadcrumb on top and a navy text panel on the left. */
export function PanelHero({
  image,
  breadcrumb,
  title,
  text,
  children,
  contentKey,
}: PanelHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <ImageSlot image={image} />
      {/* Keeps the white breadcrumb legible over light imagery. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-navy-900/70 to-transparent"
      />

      <div className="relative site-container flex min-h-[420px] flex-col pt-5">
        <Breadcrumb tone="dark" items={breadcrumb} />

        <div
          key={contentKey}
          className="mt-6 mb-12 max-w-[44rem] animate-fade-in bg-navy-900/90 px-12 py-11 backdrop-blur-sm on-dark"
        >
          <h1 className="text-5xl leading-[1.08] font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-text-on-dark">{text}</p>
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
