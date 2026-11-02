import { ArrowRight, ClipboardList, Phone, Wrench } from 'lucide-react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ClosedRequestsTable } from '../components/selfservice/ClosedRequestsTable'
import { SelfServicePageHeader } from '../components/selfservice/SelfServicePageHeader'
import { ServiceRequestCard } from '../components/selfservice/ServiceRequestCard'
import { signedOutRedirect } from '../data/myPages'
import { requestsPage as copy } from '../data/selfServicePages'
import { serviceCenter } from '../data/serviceRequests'
import { isOpenRequest, requestsFor } from '../lib/selfService'
import { useSelfService } from '../selfService/useSelfService'

const newestFirst = (a?: string, b?: string) => (b ?? '').localeCompare(a ?? '')

/**
 * Service requests: /self-service/requests. Signed-in only. Open requests as cards
 * with their status timeline (a request sent in the demo, SR-2026-0142, on top),
 * then closed ones with their service reports. Partners see their customers' requests.
 */
export function RequestsPage() {
  const { user } = useAuth()
  const { requests } = useSelfService()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const partner = user.kind === 'partner'
  const visible = requestsFor(user, requests)
  const open = visible
    .filter(isOpenRequest)
    .sort((a, b) => newestFirst(a.steps.Received, b.steps.Received))
  const closed = visible
    .filter((request) => !isOpenRequest(request))
    .sort((a, b) => newestFirst(a.steps.Done, b.steps.Done))

  return (
    <div className="bg-surface-muted">
      <title>{`${copy.title} | mySulzer | Sulzer`}</title>
      <SelfServicePageHeader
        breadcrumb={[...copy.breadcrumb, { label: copy.title }]}
        eyebrow={user.company}
        title={copy.title}
        description={partner ? copy.partnerDescription : copy.description}
        aside={
          <div className="flex items-center gap-4 rounded-lg bg-white py-3 pr-6 pl-3 shadow-card ring-1 ring-navy-900/5">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary-tint text-primary">
              <Wrench className="size-5" strokeWidth={1.75} />
            </span>
            <div className="text-sm">
              <p className="text-text-muted">{copy.serviceCenterCard.title}</p>
              <p className="font-semibold text-navy-900">{serviceCenter.name}</p>
              <a
                href={`tel:${serviceCenter.phone.replaceAll(' ', '')}`}
                className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
              >
                <Phone className="size-3.5" />
                {serviceCenter.phone}
              </a>
            </div>
          </div>
        }
      />

      <div className="site-container pt-10 pb-24">
        <section aria-labelledby="open-requests">
          <h2 id="open-requests" className="text-2xl font-bold tracking-tight text-navy-900">
            {copy.open} <span className="font-normal text-text-muted">({open.length})</span>
          </h2>
          {open.length === 0 ? (
            <div className="mt-5 flex flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
              <ClipboardList aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
              <p className="mt-4 text-lg font-semibold text-navy-900">{copy.noOpen.title}</p>
              <p className="mt-1 text-text-muted">{copy.noOpen.text}</p>
              <Link
                to={copy.noOpen.to}
                className="group mt-6 inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {copy.noOpen.action}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-5">
              {open.map((request) => (
                <li key={request.id} className="animate-fade-in">
                  <ServiceRequestCard request={request} showCustomer={partner} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {closed.length > 0 && (
          <section aria-labelledby="closed-requests" className="mt-14">
            <h2 id="closed-requests" className="text-2xl font-bold tracking-tight text-navy-900">
              {copy.closed} <span className="font-normal text-text-muted">({closed.length})</span>
            </h2>
            <div className="mt-5">
              <ClosedRequestsTable requests={closed} showCustomer={partner} />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
