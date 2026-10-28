import { productPath } from '../../lib/catalog'
import type { Product } from '../../types'
import { CatalogListRow } from './CatalogListRow'
import { KeySpecTable } from './KeySpecTable'

/**
 * Product row. Pumps (with key specs) show the family badge, spec table and
 * "Size range"; other products show only the description and "View".
 */
export function ProductListItem({ product }: { product: Product }) {
  const { keySpecs } = product
  return (
    <CatalogListRow
      image={product.images[0]}
      imageFit="contain"
      name={product.name}
      text={product.summary}
      to={product.viewTo ?? productPath(product)}
      badge={keySpecs && product.family}
      details={keySpecs && <KeySpecTable specs={keySpecs} />}
      sizeTo={keySpecs && `/sizing?product=${product.id}`}
    />
  )
}
