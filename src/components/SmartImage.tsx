import { useState } from 'react'
import publicImages from 'virtual:public-images'
import { showPlaceholderLabels } from '../config/demo'

const fits = {
  cover: 'object-cover',
  /** For product cut-outs on a light background. */
  contain: 'object-contain',
} as const

type SmartImageProps = {
  /** Fixed path under public/, e.g. "/images/products/ahlstar-main.png". */
  src: string
  alt: string
  /** CSS aspect ratio, e.g. "4 / 3". Without it, the image fills its positioned parent. */
  aspect?: string
  fit?: keyof typeof fits
  className?: string
}

/**
 * An image from public/images, or a Sulzer blue-to-cyan placeholder of the same
 * shape until the file is there. Files that don't exist are never requested
 * (see `virtual:public-images` in vite.config.ts), so missing images cause no
 * failed requests or console errors. `onError` covers files that exist but
 * fail to load.
 */
export function SmartImage({ src, alt, aspect, fit = 'cover', className = '' }: SmartImageProps) {
  const [failedSrc, setFailedSrc] = useState<string>()
  const available = publicImages.has(src) && failedSrc !== src
  const box = aspect ? 'relative w-full' : 'absolute inset-0'

  if (available) {
    return (
      <div className={`${box} overflow-hidden`} style={{ aspectRatio: aspect }}>
        <img
          src={src}
          alt={alt}
          draggable={false}
          onError={() => setFailedSrc(src)}
          className={`absolute inset-0 size-full ${fits[fit]} ${className}`}
        />
      </div>
    )
  }

  return (
    <div
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={`${box} overflow-hidden bg-linear-135 from-brand via-primary to-accent-cyan ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {/* Soft flow lines so the placeholder reads as texture, not an empty box. */}
      <svg
        aria-hidden
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full opacity-20"
        fill="none"
        stroke="white"
      >
        <path d="M0 140 C 80 110, 160 170, 240 130 S 360 90, 400 110" strokeWidth="1" />
        <path d="M0 155 C 90 125, 170 185, 250 145 S 360 105, 400 125" strokeWidth="0.75" />
        <path d="M0 170 C 100 140, 180 200, 260 160 S 360 120, 400 140" strokeWidth="0.5" />
      </svg>
      {showPlaceholderLabels && (
        <span
          aria-hidden
          className="absolute right-2.5 bottom-2 max-w-[calc(100%-1.25rem)] truncate text-[11px] font-medium text-white/65"
        >
          {src.replace(/^\/images\//, '')}
        </span>
      )}
    </div>
  )
}
