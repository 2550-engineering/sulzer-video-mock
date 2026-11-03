import { ChartSpline } from 'lucide-react'
import { personalToolbar } from '../../data/personal'
import { getProduct } from '../../lib/catalog'
import { useProjects } from '../../projects/useProjects'
import { FlyoutLink } from './FlyoutLink'
import { FlyoutRow } from './FlyoutRow'

const copy = personalToolbar.sizing

/**
 * Start sizing (this product, on a pump's page) and the sizings saved in
 * projects, newest project first; each opens its row on the project page.
 */
export function SizingFlyout({
  productId,
  onNavigate,
}: {
  /** The product page the toolbar is on, if any. */
  productId?: string
  onNavigate: () => void
}) {
  const { projects } = useProjects()
  const product = productId ? getProduct(productId) : undefined
  const sizable = product?.tabSet === 'pump' ? product : undefined
  const sizings = [...projects]
    .sort((a, b) => b.modifiedOrder - a.modifiedOrder)
    .flatMap((project) => project.sizings.map((sizing) => ({ project, sizing })))

  return (
    <>
      <div className="space-y-3">
        {sizable && (
          <FlyoutLink
            to={`${copy.to}?product=${sizable.id}`}
            label={copy.sizeThis(sizable.name)}
            primary
            onNavigate={onNavigate}
          />
        )}
        <FlyoutLink to={copy.to} label={copy.start} primary={!sizable} onNavigate={onNavigate} />
      </div>

      <h3 className="mt-10 text-sm font-semibold tracking-wide text-text-muted uppercase">
        {copy.recentTitle}
      </h3>
      {sizings.length > 0 ? (
        <ul className="-mx-3 mt-3 space-y-1">
          {sizings.map(({ project, sizing }) => (
            <FlyoutRow
              key={sizing.id}
              to={`/my-projects/${project.id}#sizing-${sizing.id}`}
              title={sizing.name}
              meta={`${copy.inProject(project.name)} · ${getProduct(sizing.productId)?.name ?? ''}`}
              leading={
                <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
                  <ChartSpline aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
              }
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-text-muted">{copy.empty}</p>
      )}
    </>
  )
}
