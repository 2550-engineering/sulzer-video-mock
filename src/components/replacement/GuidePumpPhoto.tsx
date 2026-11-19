import type { ImageSource } from '../../types'
import { SmartImage } from '../SmartImage'

type GuidePumpPhotoProps = {
  image: ImageSource | undefined
  /** Size, e.g. "size-28". */
  className: string
  /** Accessible name when there is no photo; leave out for a decorative thumbnail. */
  label?: string
}

/** A pump photo on a light, bordered tile; an empty tile when the pump has no photo. */
export function GuidePumpPhoto({ image, className, label }: GuidePumpPhotoProps) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-md border border-border bg-surface-muted ${className}`}
      role={!image && label ? 'img' : undefined}
      aria-label={!image ? label : undefined}
    >
      {image && (
        <span className="absolute inset-1.5">
          <SmartImage src={image.src} alt={label ? image.alt : ''} fit="contain" />
        </span>
      )}
    </span>
  )
}
