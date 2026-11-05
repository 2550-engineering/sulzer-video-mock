import { History } from 'lucide-react'
import { personalToolbar } from '../../data/personal'
import { getProduct, productPath } from '../../lib/catalog'
import { usePersonal } from '../../personal/usePersonal'
import { ProductThumb } from '../ProductThumb'
import { FlyoutEmpty } from './FlyoutEmpty'
import { FlyoutLink } from './FlyoutLink'
import { FlyoutRow } from './FlyoutRow'

const copy = personalToolbar.recent

/** The last few products viewed, newest first. */
export function RecentFlyout({ onNavigate }: { onNavigate: () => void }) {
  const { recent } = usePersonal()
  const products = recent
    .map(getProduct)
    .filter((product) => product !== undefined)
    .slice(0, copy.max)

  if (products.length === 0) {
    return <FlyoutEmpty icon={History} title={copy.empty.title} text={copy.empty.text} />
  }

  return (
    <>
      <ul className="-mx-3 space-y-1">
        {products.map((product) => (
          <FlyoutRow
            key={product.id}
            to={productPath(product)}
            title={product.name}
            meta={product.family}
            leading={<ProductThumb product={product} />}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
      <div className="mt-8">
        <FlyoutLink to={copy.to} label={copy.viewAll} onNavigate={onNavigate} />
      </div>
    </>
  )
}
