import { ArrowRight, Lightbulb, Package, Wrench } from 'lucide-react'
import { Link } from 'react-router'
import { conditionPage } from '../../data/connect'
import { partsInVersion, sparePartsFor } from '../../lib/catalog'
import { partsOwnerId } from '../../lib/catalogParts'
import { formatDate } from '../../lib/format'
import type { Asset, ConditionFinding } from '../../types'

const copy = conditionPage.action

type RecommendedActionProps = {
  asset: Asset
  finding?: ConditionFinding
  onRequestService: () => void
}

/**
 * What to do about the asset: Sulzer Connect's finding with Request service,
 * the part that fixes it and a way back to the asset in mySulzer. Without a
 * finding, a calm "No action needed".
 */
export function RecommendedAction({ asset, finding, onRequestService }: RecommendedActionProps) {
  // The part or kit in this unit's parts list.
  const ownerId = asset.modelId ? partsOwnerId(asset.modelId) : undefined
  const catalogue = ownerId ? sparePartsFor(ownerId) : undefined
  const kit = catalogue?.kits.find((k) => k.id === finding?.partId)
  const part = kit ?? (catalogue && partsInVersion(catalogue).find((p) => p.id === finding?.partId))
  const position = part && 'position' in part ? part.position : undefined
  const severe = asset.status === 'alarm'

  return (
    <section
      className={`relative overflow-hidden rounded-lg border p-6 ${
        finding
          ? severe
            ? 'border-danger-on-dark/40 bg-danger-on-dark/[0.07]'
            : 'border-warning-on-dark/40 bg-warning-on-dark/[0.07]'
          : 'border-white/10 bg-navy-900/70'
      }`}
    >
      <p className="flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-text-on-dark-muted uppercase">
        <Lightbulb
          className={`size-4 ${finding ? (severe ? 'text-danger-on-dark' : 'text-warning-on-dark') : 'text-success-on-dark'}`}
        />
        {copy.title}
      </p>

      {finding ? (
        <>
          <h2 className="mt-3 text-xl leading-snug font-bold tracking-tight text-white">
            {finding.title}
          </h2>
          <p
            className={`mt-2 inline-flex rounded-pill px-3 py-1 text-[13px] font-bold ${
              severe ? 'bg-danger-on-dark text-navy-900' : 'bg-warning-on-dark text-navy-900'
            }`}
          >
            {finding.action}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-on-dark">{finding.detail}</p>
          {part && (
            <p className="mt-4 flex items-center gap-3 rounded-md border border-white/10 bg-navy-900/60 px-3.5 py-2.5 text-sm">
              <Package className="size-4 shrink-0 text-primary-on-dark" />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-white">{part.name}</span>
                <span className="text-xs text-text-on-dark-muted tabular-nums">
                  {copy.position(position, part.partNumber)}
                </span>
              </span>
            </p>
          )}
        </>
      ) : (
        <>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-white">{copy.noneTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-on-dark">
            {copy.noneText(formatDate(asset.nextServiceDue))}
          </p>
        </>
      )}

      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onRequestService}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Wrench className="size-4" />
          {copy.requestService}
        </button>
        {part && finding?.partAction && (
          <Link
            to={`/assets/${asset.id}?${kit ? 'kit' : 'part'}=${part.id}#spare-parts`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <Package className="size-4" />
            {finding.partAction}
          </Link>
        )}
        <Link
          to={`/assets/${asset.id}`}
          className="group inline-flex h-10 items-center justify-center gap-1.5 text-sm font-semibold text-primary-on-dark transition-colors hover:text-white"
        >
          {copy.viewAsset}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
