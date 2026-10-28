import { Ruler } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { ContextChip } from '../components/ContextChip'
import { FeatureComingSoon } from '../components/FeatureComingSoon'
import { comingSoon } from '../data/catalogPages'
import { applicationPath, getApplication, getProduct, productPath } from '../lib/catalog'

/**
 * Sizing & configuration: /sizing, optionally ?product=<id> or ?application=<id>
 * from the "Size product" / "Size application" buttons. Not built yet.
 */
export function SizingPage() {
  const [searchParams] = useSearchParams()
  const product = getProduct(searchParams.get('product') ?? '')
  const application = getApplication(searchParams.get('application') ?? '')

  const subject = product
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
