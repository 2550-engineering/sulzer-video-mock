import { assetImage } from '../lib/assetImage'
import type { ImageRef } from '../types'
import { GradientBackdrop } from './GradientBackdrop'

const fits = {
  cover: 'object-cover',
  /** For product cut-outs on a light background. */
  contain: 'object-contain',
} as const

type ImageSlotProps = {
  image: ImageRef
  fit?: keyof typeof fits
  className?: string
}

/** Fills its (positioned) parent with the image, or a branded gradient if the file is missing. */
export function ImageSlot({ image, fit = 'cover', className = '' }: ImageSlotProps) {
  const src = assetImage(image.file)

  if (src) {
    return (
      <img
        src={src}
        alt={image.alt}
        draggable={false}
        className={`absolute inset-0 size-full ${fits[fit]} ${className}`}
      />
    )
  }

  return <GradientBackdrop tone={image.tone} label={image.alt} className={className} />
}
