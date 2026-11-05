import type { ReactNode } from 'react'
import { Link } from 'react-router'
import brandImage from '../assets/images/sulzer-dynamical-still.jpg'
import type { ImageSource, NavItem } from '../types'
import { SmartImage } from './SmartImage'

type NoticePanelProps = {
  eyebrow?: string
  title: string
  children: ReactNode
  /** Button under the text. Defaults to "Back to home". */
  back?: NavItem
  /** Photo on the right. Defaults to the Sulzer brand image. */
  image?: ImageSource
}

const fadeIn = 'lg:[mask-image:linear-gradient(to_right,transparent,black_35%)]'

/** Card with copy, a back button and Sulzer brand imagery, e.g. for pages that aren't part of the demo. */
export function NoticePanel({
  eyebrow,
  title,
  children,
  back = { label: 'Back to home', to: '/' },
  image,
}: NoticePanelProps) {
  return (
    <div className="grid overflow-hidden rounded-lg border border-border bg-surface shadow-card lg:grid-cols-[1.15fr_1fr]">
      <div className="px-8 py-12 sm:px-14 sm:py-16">
        {eyebrow && (
          <span className="mb-5 inline-flex items-center gap-2 rounded-pill bg-primary-tint px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h2 className="max-w-lg text-3xl font-bold tracking-tight text-navy-900">{title}</h2>
        <div className="mt-4 max-w-lg text-base leading-relaxed text-text-muted">{children}</div>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to={back.to}
            className="inline-flex h-11 items-center rounded-pill border border-border-strong px-6 text-sm font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
          >
            {back.label}
          </Link>
        </div>
      </div>
      <div className="relative min-h-64">
        {image ? (
          <SmartImage src={image.src} alt={image.alt} className={fadeIn} />
        ) : (
          <img
            src={brandImage}
            alt=""
            className={`absolute inset-0 size-full object-cover ${fadeIn}`}
            draggable={false}
          />
        )}
      </div>
    </div>
  )
}
