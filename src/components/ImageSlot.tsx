import { assetImage } from '../lib/assetImage'
import type { ImageRef } from '../types'
import { BrandArt } from './BrandArt'

const fits = {
  cover: 'object-cover',
  /** For product shots on a white background: centred, and blended into a light stage. */
  contain: 'object-contain mix-blend-multiply',
} as const

type ImageSlotProps = {
  image: ImageRef
  fit?: keyof typeof fits
  className?: string
}

/** Fills its (positioned) parent with the image, or Sulzer brand art if the file is missing. */
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

  return <BrandArt seed={image.file} index={image.art} label={image.alt} className={className} />
}
