import type { ResolvedProductGroup } from '../../lib/catalog'
import { ProductListItem } from './ProductListItem'
import { ServiceListItem } from './ServiceListItem'

/** Products & solutions: a small grey heading per group, then its product and service rows. */
export function ProductGroups({ groups }: { groups: ResolvedProductGroup[] }) {
  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`} className="text-lg font-semibold text-text-muted">
            {group.title}
          </h2>
          <ul className="mt-4 space-y-3">
            {group.products.map((product) => (
              <li key={product.id}>
                <ProductListItem product={product} />
              </li>
            ))}
            {group.services.map((service) => (
              <li key={service.id}>
                <ServiceListItem service={service} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
