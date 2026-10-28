import publicImages from 'virtual:public-images'
import { productPage } from '../../data/catalogPages'
import type { Document, Product } from '../../types'
import { GradientBackdrop } from '../GradientBackdrop'
import { SmartImage } from '../SmartImage'
import { SulzerLogo } from '../SulzerLogo'

const copy = productPage.documentation.cover

/**
 * A designed cover page for documents that have no file yet: navy top with the
 * Sulzer logo, document type, product and title. Below: the product photo
 * once its file exists, otherwise the document details. Portrait A4 proportions.
 */
export function DocumentCover({ document, product }: { document: Document; product?: Product }) {
  const image = product?.images[0]
  const showImage = image !== undefined && publicImages.has(image.src)
  const details = [
    ['No.', document.number],
    ...(document.revision ? [['Rev.', document.revision]] : []),
    ['Date', document.date],
    [copy.languages, String(document.languages.length)],
  ]
  return (
    <div className="relative mx-auto flex aspect-[1/1.414] w-full max-w-sm flex-col overflow-hidden rounded-sm bg-white shadow-[0_24px_48px_-24px_rgba(12,28,46,0.45)] ring-1 ring-navy-900/10">
      <div className="relative isolate flex basis-[58%] flex-col px-7 pt-7 pb-6 on-dark">
        <GradientBackdrop tone="deep" />
        <SulzerLogo variant="white" className="h-5 self-start" />
        <div className="mt-auto">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-accent-cyan uppercase">
            {document.type}
          </p>
          {product && (
            <p className="mt-2 text-[1.75rem] leading-none font-bold tracking-tight text-white">
              {product.name}
            </p>
          )}
          <p className="mt-2 text-sm leading-snug text-text-on-dark">{document.title}</p>
        </div>
      </div>
      <div aria-hidden className="h-1 bg-linear-to-r from-primary via-accent-cyan to-primary" />
      <div className="relative flex-1">
        {showImage ? (
          <>
            <div className="absolute inset-x-8 top-4 bottom-12">
              <SmartImage src={image.src} alt="" fit="contain" />
            </div>
            <p className="absolute inset-x-7 bottom-4 flex justify-between text-[10px] text-text-muted tabular-nums">
              <span>{document.number}</span>
              <span>{document.date.slice(0, 7)}</span>
            </p>
          </>
        ) : (
          <dl className="absolute inset-x-7 bottom-6 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
            {details.map(([label, value]) => (
              <div key={label} className="border-t border-border pt-1.5">
                <dt className="text-text-subtle">{label}</dt>
                <dd className="font-semibold text-navy-900 tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}
