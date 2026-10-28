import type { IconItem, ProductExplore } from '../../types'
import { SmartImage } from '../SmartImage'

type FeaturePanelProps = {
  feature?: ProductExplore['feature']
  highlights: IconItem[]
}

/** Large grey card (headline left, product image right), then three feature columns. */
export function FeaturePanel({ feature, highlights }: FeaturePanelProps) {
  return (
    <section className="site-container py-16 lg:py-20">
      {feature && (
        <div className="grid items-center overflow-hidden rounded-lg bg-surface-sunken lg:grid-cols-2">
          <div className="px-10 py-12 lg:px-14 lg:py-16">
            <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">
              {feature.title}
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-text-muted">{feature.text}</p>
          </div>
          <div className="relative aspect-[16/10] h-full">
            <SmartImage src={feature.image.src} alt={feature.image.alt} fit="contain" />
          </div>
        </div>
      )}

      <ul className={`grid gap-x-12 gap-y-10 md:grid-cols-3 ${feature ? 'mt-12' : ''}`}>
        {highlights.map(({ label, text, icon: Icon }) => (
          <li key={label}>
            <Icon aria-hidden className="size-7 text-primary" strokeWidth={1.5} />
            <h3 className="mt-4 text-xl font-bold tracking-tight text-brand">{label}</h3>
            {text && <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{text}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}
