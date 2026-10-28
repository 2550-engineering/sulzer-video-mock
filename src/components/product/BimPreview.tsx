import { Rotate3d } from 'lucide-react'
import { productPage } from '../../data/catalogPages'
import type { ImageSource } from '../../types'
import { SmartImage } from '../SmartImage'

const copy = productPage.bim

/** Blueprint-style grid behind the model. */
const grid = {
  backgroundImage:
    'linear-gradient(var(--sz-color-border) 1px, transparent 1px), linear-gradient(90deg, var(--sz-color-border) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
}

/** Large 3D preview area. The model tilts slightly in 3D on hover. */
export function BimPreview({ image }: { image: ImageSource }) {
  return (
    <div
      className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface-subtle [perspective:1200px]"
      style={grid}
    >
      <div className="absolute inset-10 transition-transform duration-250 ease-sz [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-14deg)_scale(1.03)]">
        <SmartImage src={image.src} alt={image.alt} fit="contain" />
      </div>
      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-pill bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-900 shadow-card backdrop-blur-sm">
        <Rotate3d className="size-3.5 text-primary" />
        {copy.previewLabel}
      </span>
      <span className="absolute right-4 bottom-4 text-xs text-text-muted transition-opacity duration-200 group-hover:opacity-0">
        {copy.previewHint}
      </span>
    </div>
  )
}
