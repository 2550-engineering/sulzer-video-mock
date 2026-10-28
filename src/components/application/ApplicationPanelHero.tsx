import type { ReactNode } from 'react'
import type { ImageSource } from '../../types'
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb'
import { SmartImage } from '../SmartImage'

type ApplicationPanelHeroProps = {
  image: ImageSource
  breadcrumb: BreadcrumbItem[]
  title: string
  text: string
  /** Which half of the hero the text panel sits in. */
  panelSide: 'left' | 'right'
  /** `md` (300 px) for overview and area pages, `lg` (360 px) for applications. */
  size?: keyof typeof heights
  /** Optional button under the text. */
  children?: ReactNode
}

const heights = {
  md: 'min-h-[300px]',
  lg: 'min-h-[360px]',
} as const

/** Full-width photo with the breadcrumb on top and a dark translucent text panel. */
export function ApplicationPanelHero({
  image,
  breadcrumb,
  title,
  text,
  panelSide,
  size = 'md',
  children,
}: ApplicationPanelHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 on-dark">
      <SmartImage src={image.src} alt={image.alt} />
      {/* Keeps the breadcrumb readable on light photos. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-navy-900/85 via-navy-900/45 to-transparent"
      />

      <div className={`relative site-container flex ${heights[size]} flex-col pt-5 pb-10`}>
        <Breadcrumb tone="dark" items={breadcrumb} />

        <div
          className={`my-auto w-full max-w-xl pt-6 ${panelSide === 'right' ? 'ml-auto lg:mr-[8%]' : ''}`}
        >
          <div
            key={title}
            className="animate-fade-in rounded-md bg-linear-to-br from-navy-900/90 to-navy-800/75 px-10 py-8 shadow-raised backdrop-blur-sm"
          >
            <h1 className="text-[2.5rem] leading-tight font-bold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-3 text-[17px] leading-relaxed text-text-on-dark">{text}</p>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
