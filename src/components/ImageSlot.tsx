import { assetImage } from '../lib/assetImage'
import type { ImageRef } from '../types'
import { GradientBackdrop } from './GradientBackdrop'

type ImageSlotProps = {
  image: ImageRef
  className?: string
}

/** Fills its (positioned) parent with the image, or a branded gradient if the file is missing. */
export function ImageSlot({ image, className = '' }: ImageSlotProps) {
  const src = assetImage(image.file)

  if (src) {
    return (
      <img
        src={src}
        alt={image.alt}
        draggable={false}
        className={`absolute inset-0 size-full object-cover ${className}`}
      />
    )
  }

  return <GradientBackdrop tone={image.tone} label={image.alt} className={className} />
}
