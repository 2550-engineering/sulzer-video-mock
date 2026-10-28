import { Ruler } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { ContextChip } from '../components/ContextChip'
import { FeatureComingSoon } from '../components/FeatureComingSoon'
import { comingSoon } from '../data/catalogPages'
import { applicationPath, getApplication, getModel, getProduct, productPath } from '../lib/catalog'

/**
 * Sizing & configuration: /sizing, optionally ?product=<id>, ?model=<id> or
 * ?application=<id> from the "Size product", "Size this model" and "Size
 * application" buttons. Not built yet.
 */
export function SizingPage() {
  const [searchParams] = useSearchParams()
  const model = getModel(searchParams.get('model') ?? '')
  const product = getProduct(searchParams.get('product') ?? '')
  const application = getApplication(searchParams.get('application') ?? '')
  const modelProduct = model && getProduct(model.productId)

  const subject = model
    ? {
        label: `${model.name}, ${model.frequency} Hz`,
        to: modelProduct ? `${productPath(modelProduct)}?model=${model.id}#models` : '/products',
      }
    : product
      ? { label: product.name, to: productPath(product) }
      : application
        ? { label: application.name, to: applicationPath(application) }
        : undefined

  return (
    <FeatureComingSoon
      content={comingSoon.sizing}
      back={subject && { label: `Back to ${subject.label}`, to: subject.to }}
    >
      {subject && (
        <ContextChip icon={Ruler}>
          Sizing for <span className="font-semibold text-navy-900">{subject.label}</span>
        </ContextChip>
      )}
    </FeatureComingSoon>
  )
}
