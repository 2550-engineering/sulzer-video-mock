import type { Service } from '../../types'
import { CatalogListRow } from './CatalogListRow'

/** Service row: photo thumbnail, name, description and "View". */
export function ServiceListItem({ service }: { service: Service }) {
  return (
    <CatalogListRow
      image={service.image}
      imageFit="cover"
      name={service.name}
      text={service.summary}
      to={service.to}
    />
  )
}
