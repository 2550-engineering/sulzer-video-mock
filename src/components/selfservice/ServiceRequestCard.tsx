import { ArrowRight, MessageSquareText, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { demoClock } from '../../config/demo'
import { connectAssetPath } from '../../data/assetPages'
import { assetById, customers, siteById } from '../../data/assets'
import { requestStatus, requestsPage as copy } from '../../data/selfServicePages'
import { serviceCenter } from '../../data/serviceRequests'
import { getModel } from '../../lib/catalog'
import { formatDate, formatDateTime } from '../../lib/format'
import { requestSteps } from '../../lib/selfService'
import type { ServiceRequest } from '../../types'
import { AssetStatusDot } from '../assets/AssetStatusDot'
import { ProgressSteps } from './ProgressSteps'
import { StatusPill } from './StatusPill'

type ServiceRequestCardProps = {
  request: ServiceRequest
  /** Partners see whose asset it is. */
  showCustomer: boolean
}

/**
 * An open service request: reference, status and the Received → Planned →
 * Technician assigned → Done timeline, then the asset, site, service center,
 * visit and technician. A request received today is highlighted as it appears.
 */
export function ServiceRequestCard({ request, showCustomer }: ServiceRequestCardProps) {
  const asset = assetById(request.assetId)
  const site = asset && siteById(asset.siteId)
  const model = asset?.modelId ? getModel(asset.modelId) : undefined
  const customer = customers.find((c) => c.id === request.customerId)
  const received = request.steps.Received ?? ''
  const isNew = received.startsWith(demoClock.today)
  const status = requestStatus[request.status]

  const fields: [string, ReactNode][] = [
    ...(showCustomer && customer
      ? [[copy.fields.customer, customer.name] as [string, string]]
      : []),
    [
      copy.fields.asset,
      asset && (
        <span className="flex flex-wrap items-center gap-x-2">
          <AssetStatusDot status={asset.status} />
          <Link
            to={`/assets/${asset.id}`}
            className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          >
            {asset.tag}
          </Link>
          <span className="text-sm font-normal text-text-muted">{model?.name}</span>
        </span>
      ),
    ],
    [copy.fields.site, site ? `${site.name}, ${site.city}` : '–'],
    [
      copy.fields.serviceCenter,
      <>
        {request.serviceCenter}
        <span className="block text-sm font-normal text-text-muted">{serviceCenter.phone}</span>
      </>,
    ],
    [
      copy.fields.visit,
      request.visitDate ? (
        formatDate(request.visitDate)
      ) : (
        <>
          <span className="text-text-muted">{copy.toBePlanned}</span>
          {request.preferredDate && (
            <span className="block text-sm font-normal text-text-muted">
              {copy.fields.preferred(formatDate(request.preferredDate))}
            </span>
          )}
        </>
      ),
    ],
    [
      copy.fields.technician,
      request.technician ?? <span className="text-text-muted">{copy.assignedLater}</span>,
    ],
  ]

  return (
    <article
      id={request.id}
      className={`scroll-mt-32 overflow-hidden rounded-lg border bg-white ${
        isNew ? 'animate-highlight border-primary-border shadow-card' : 'border-border'
      }`}
    >
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-6 py-4">
        <h3 className="text-lg font-bold tracking-wide text-navy-900 tabular-nums">{request.id}</h3>
        <StatusPill {...status} />
        {request.fromAlert && (
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-warning-tint px-2.5 py-1 text-xs font-semibold text-warning-strong">
            <TriangleAlert className="size-3.5" />
            {copy.fromAlert}
          </span>
        )}
        <p className="ml-auto text-sm text-text-muted">
          {copy.received(formatDateTime(received, demoClock.today))} ·{' '}
          <span className="font-medium text-navy-900">{request.requestedBy}</span>
        </p>
      </header>

      <div className="px-6 pt-5 pb-6">
        <p className="text-xl font-bold tracking-tight text-navy-900">
          {request.service}
          {asset && <span className="font-normal text-text-muted"> · {asset.name}</span>}
        </p>

        <div className="mt-6">
          <ProgressSteps
            label={`${request.id} status`}
            current={requestSteps.indexOf(request.status)}
            steps={requestSteps.map((step) => ({
              label: copy.steps[step],
              time: request.steps[step] && formatDateTime(request.steps[step], demoClock.today),
              note:
                step === 'Planned' && request.visitDate
                  ? formatDate(request.visitDate)
                  : copy.next[step],
            }))}
          />
        </div>

        <dl className="mt-7 grid gap-x-8 gap-y-4 border-t border-border pt-5 sm:grid-cols-2 xl:grid-cols-3">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
                {label}
              </dt>
              <dd className="mt-1 font-semibold text-navy-900">{value}</dd>
            </div>
          ))}
        </dl>

        {request.message && (
          <blockquote className="mt-5 flex gap-3 rounded-md bg-surface-subtle px-4 py-3 text-[15px] text-text-muted">
            <MessageSquareText aria-hidden className="mt-0.5 size-4 shrink-0 text-text-subtle" />
            <p>
              <span className="sr-only">{copy.fields.message}: </span>
              {request.message}
            </p>
          </blockquote>
        )}

        {asset && (
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to={`/assets/${asset.id}`}
              className="group inline-flex h-10 items-center gap-2 rounded-pill border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
            >
              {copy.viewAsset}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            {asset.connected && (
              <Link
                to={connectAssetPath(asset.id)}
                className="inline-flex h-10 items-center rounded-pill px-4 text-sm font-semibold text-navy-900 transition-colors hover:bg-surface-muted"
              >
                {copy.openConnect}
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
