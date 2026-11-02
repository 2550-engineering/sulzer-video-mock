import { searchPage as copy } from '../../data/catalogPages'
import type { KnowledgeItem, Service } from '../../types'
import { KnowledgeCard } from '../KnowledgeCard'
import { ServiceListItem } from '../product/ServiceListItem'

type SupportResultsProps = { services: Service[]; knowledge: KnowledgeItem[] }

/** Support & learn tab: matching services as rows, then knowledge items as cards. */
export function SupportResults({ services, knowledge }: SupportResultsProps) {
  return (
    <div className="space-y-10">
      {services.length > 0 && (
        <section>
          <h2 className="text-lg font-bold tracking-tight text-navy-900">
            {copy.support.services}
          </h2>
          <ul className="mt-4 space-y-4">
            {services.map((service) => (
              <li key={service.id}>
                <ServiceListItem service={service} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {knowledge.length > 0 && (
        <section>
          <h2 className="text-lg font-bold tracking-tight text-navy-900">
            {copy.support.knowledge}
          </h2>
          <ul className="mt-4 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {knowledge.map((item) => (
              <li key={item.id}>
                <KnowledgeCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
