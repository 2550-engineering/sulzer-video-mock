import { ArrowRight, Check, FolderPlus, GitCompareArrows } from 'lucide-react'
import { Link } from 'react-router'
import { productPage } from '../../data/catalogPages'
import { modelDimensions } from '../../lib/modelSpecs'
import type { ProductModel } from '../../types'
import { PerformanceCurve } from './PerformanceCurve'

const copy = productPage.models.detail

type ModelDetailProps = {
  model: ProductModel
  comparing: boolean
  /** False when 3 other models are already selected. */
  canCompare: boolean
  onAddToProject: () => void
  onToggleCompare: () => void
}

const outlined =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-pill border border-primary px-5 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-primary-tint disabled:cursor-not-allowed disabled:border-border-strong disabled:text-text-subtle disabled:hover:bg-transparent'

/** Expanded model row: performance curve, dimensions and actions. */
export function ModelDetail({
  model,
  comparing,
  canCompare,
  onAddToProject,
  onToggleCompare,
}: ModelDetailProps) {
  return (
    <div className="grid animate-fade-in gap-x-12 gap-y-8 px-6 py-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_14rem]">
      <section>
        <h3 className="font-semibold text-navy-900">{copy.curveTitle}</h3>
        <div className="mt-3 rounded-md border border-border bg-white p-3">
          <PerformanceCurve
            series={[{ model, color: 'var(--sz-color-primary)' }]}
            showEfficiency
            showRatedPoint
          />
        </div>
        <p className="mt-2 text-xs text-text-muted">{copy.curveNote}</p>
      </section>

      <section>
        <h3 className="font-semibold text-navy-900">{copy.dimensionsTitle}</h3>
        <dl className="mt-3 divide-y divide-border border-y border-border text-[15px]">
          {modelDimensions(model).map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 py-2.5">
              <dt className="text-text-muted">{label}</dt>
              <dd className="font-semibold text-navy-900 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-col gap-3 lg:pt-9">
        <Link
          to={`/sizing?product=${model.productId}&model=${model.id}`}
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
        >
          {copy.size}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <button type="button" onClick={onAddToProject} className={outlined}>
          <FolderPlus className="size-4" />
          {copy.addToProject}
        </button>
        <button
          type="button"
          onClick={onToggleCompare}
          disabled={!comparing && !canCompare}
          aria-pressed={comparing}
          className={outlined}
        >
          {comparing ? <Check className="size-4" /> : <GitCompareArrows className="size-4" />}
          {comparing ? copy.comparing : copy.compare}
        </button>
      </div>
    </div>
  )
}
