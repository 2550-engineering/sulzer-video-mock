import poster from '../../_asset-source/video/sulzer-dynamical-corporate-poster.jpg'
import still from '../assets/images/sulzer-dynamical-still.jpg'

// Art-directed crops of the Sulzer "dynamical" fluid visual (the brand key visual).
// Index them from ImageRef.art; wide ones (0, 9) suit heroes.
const crops = [
  { src: still, position: '50% 50%', scale: 1 },
  { src: still, position: '30% 60%', scale: 1.6 },
  { src: poster, position: '100% 60%', scale: 1.8 },
  { src: still, position: '80% 50%', scale: 1.8 },
  { src: poster, position: '40% 90%', scale: 2.2 },
  { src: still, position: '45% 45%', scale: 2.8 },
  { src: still, position: '55% 70%', scale: 2.2 },
  { src: poster, position: '0% 100%', scale: 1.6 },
  { src: still, position: '95% 45%', scale: 2.4 },
  { src: poster, position: '50% 50%', scale: 1 },
  { src: still, position: '30% 60%', scale: 1.6, flip: true },
  { src: poster, position: '100% 60%', scale: 1.8, flip: true },
]

/** Same seed, same crop — so a page always looks the same between takes. */
function hashCrop(seed: string) {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash % crops.length
}

type BrandArtProps = {
  /** Picks the crop when `index` isn't given, e.g. the image file name it stands in for. */
  seed: string
  index?: number
  label?: string
  className?: string
}

/** Fills its (positioned) parent with a crop of the Sulzer fluid visual. Stand-in for photography. */
export function BrandArt({ seed, index, label, className = '' }: BrandArtProps) {
  const crop = crops[(index ?? hashCrop(seed)) % crops.length]
  return (
    <div className={`absolute inset-0 overflow-hidden bg-white ${className}`}>
      {/* Mirror the whole frame around its centre, then zoom into the crop inside it. */}
      <div className={`absolute inset-0 ${crop.flip ? '-scale-x-100' : ''}`}>
        <img
          src={crop.src}
          alt={label ?? ''}
          draggable={false}
          className="absolute inset-0 size-full object-cover"
          style={{
            objectPosition: crop.position,
            transform: `scale(${crop.scale})`,
            transformOrigin: crop.position,
          }}
        />
      </div>
    </div>
  )
}
