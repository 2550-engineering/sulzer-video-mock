import { groupBy } from '../../lib/catalog'
import type { Product } from '../../types'
import { ProductListItem } from './ProductListItem'

/** Products listed under one heading per category. */
export function ProductGroups({ products }: { products: Product[] }) {
  return (
    <div className="space-y-14">
      {groupBy(products, (product) => product.category).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-xl font-semibold text-text-muted">{category}</h2>
          <ul className="mt-5 space-y-4">
            {items.map((product) => (
              <li key={product.id}>
                <ProductListItem product={product} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
