import { GitCompareArrows, X } from 'lucide-react'
import { useNavigate } from 'react-router'
import { personalToolbar } from '../../data/personal'
import { getModel, getProduct, productPath } from '../../lib/catalog'
import { compareColors } from '../../lib/modelSpecs'
import { usePersonal } from '../../personal/usePersonal'
import { FlyoutEmpty } from './FlyoutEmpty'
import { FlyoutRow } from './FlyoutRow'

const copy = personalToolbar.compare

/** Models selected for comparison, with "Compare now" (opens the product's comparison panel). */
export function CompareFlyout({ onNavigate }: { onNavigate: () => void }) {
  const navigate = useNavigate()
  const { compareIds, toggleCompare, clearCompare, setCompareOpen } = usePersonal()
  const models = compareIds.map(getModel).filter((model) => model !== undefined)
  const product = models[0] && getProduct(models[0].productId)

  if (!product) {
    return <FlyoutEmpty icon={GitCompareArrows} title={copy.empty.title} text={copy.empty.text} />
  }

  const to = `${productPath(product)}#models`

  function compareNow() {
    onNavigate()
    setCompareOpen(true)
    navigate(to)
  }

  return (
    <>
      <ul className="-mx-3 space-y-1">
        {models.map((model, i) => (
          <FlyoutRow
            key={model.id}
            to={`${productPath(product)}?model=${model.id}#models`}
            title={model.name}
            meta={`${product.name} · ${model.frequency} Hz · ${model.power} kW`}
            leading={
              <span
                aria-hidden
                className="size-3 shrink-0 rounded-full"
                style={{ background: compareColors[i] }}
              />
            }
            trailing={
              <button
                type="button"
                onClick={() => toggleCompare(model.id)}
                aria-label={copy.remove(model.name)}
                className="flex size-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white hover:text-navy-900"
              >
                <X className="size-4" />
              </button>
            }
            onNavigate={onNavigate}
          />
        ))}
      </ul>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={compareNow}
          disabled={models.length < 2}
          className="flex h-11 w-full items-center justify-center rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border-strong disabled:shadow-none"
        >
          {copy.open}
        </button>
        {models.length < 2 && <p className="text-center text-sm text-text-muted">{copy.needTwo}</p>}
        <button
          type="button"
          onClick={clearCompare}
          className="mx-auto block text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {copy.clear}
        </button>
      </div>
    </>
  )
}
