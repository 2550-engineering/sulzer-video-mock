import { Download, FileClock, FileText, Mail, Phone, Send } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { Avatar } from '../components/Avatar'
import { QuotationDocument } from '../components/selfservice/QuotationDocument'
import { SelfServicePageHeader } from '../components/selfservice/SelfServicePageHeader'
import { StatusPill } from '../components/selfservice/StatusPill'
import { demoClock, partnerPricing } from '../config/demo'
import { customers } from '../data/assets'
import { signedOutRedirect } from '../data/myPages'
import {
  orderPath,
  quotationPage as copy,
  quotationStatus,
  quotationsPage,
  quotationsPath,
} from '../data/selfServicePages'
import { formatDate, formatDateTime } from '../lib/format'
import { sentQuotation } from '../lib/partner'
import { formatMoney, partnerMargin, quotationsFor, quotationTotals } from '../lib/selfService'
import { useProjects } from '../projects/useProjects'
import { useSelfService } from '../selfService/useSelfService'
import { useToast } from '../toast/useToast'

const card = 'rounded-lg border border-border bg-white px-6 py-5'
const cardTitle = 'text-sm font-semibold tracking-[0.08em] text-text-muted uppercase'
const link =
  'font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')

/**
 * One quotation: /self-service/quotations/:id. Signed-in only. The quotation as a
 * document preview (the partner's on their own letterhead) with Download PDF, and
 * beside it the summary, the partner's margin, the contact and the history.
 */
export function QuotationPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const showToast = useToast()
  const { quotations, saveQuotation } = useSelfService()
  const { projects } = useProjects()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const quotation = quotationsFor(user, quotations).find((q) => q.id === id)
  if (!quotation) return <Navigate to={quotationsPath} replace />

  const partner = quotation.issuer === 'partner'
  const preparing = quotation.status === 'Requested'
  const draft = quotation.status === 'Draft'
  const customer = customers.find((c) => c.id === quotation.customerId)
  const project = projects.find((p) => p.id === quotation.projectId)
  const totals = quotationTotals(quotation)
  const margin = partner ? partnerMargin(quotation) : undefined

  const summary: [string, ReactNode][] = [
    ...(partner && customer ? [[copy.summary.customer, customer.name] as [string, string]] : []),
    ...(quotation.validUntil
      ? [[copy.summary.validUntil, formatDate(quotation.validUntil)] as [string, string]]
      : []),
    ...(quotation.issuedOn
      ? [[copy.summary.issued, formatDate(quotation.issuedOn)] as [string, string]]
      : []),
    [copy.summary.yourReference, quotation.yourReference],
    ...(project
      ? [
          [
            copy.summary.project,
            <Link key="project" to={`/my-projects/${project.id}`} className={link}>
              {project.name}
            </Link>,
          ] as [string, ReactNode],
        ]
      : []),
    ...(quotation.orderId
      ? [
          [
            copy.summary.order,
            <Link key="order" to={orderPath(quotation.orderId)} className={link}>
              {quotation.orderId}
            </Link>,
          ] as [string, ReactNode],
        ]
      : []),
  ]

  const history = [
    {
      at: formatDateTime(quotation.requestedAt, demoClock.today),
      // A quotation the partner made from a project was never requested.
      text: quotation.projectId && partner ? copy.createdStep : copy.requested,
    },
    // An update on the day it was sent is the sending itself, e.g. "Sent to Emma Lindqvist".
    ...(quotation.issuedOn && !quotation.updated.at.startsWith(quotation.issuedOn)
      ? [{ at: formatDate(quotation.issuedOn), text: copy.issuedStep }]
      : []),
    ...(quotation.updated.at !== quotation.requestedAt && !draft
      ? [
          {
            at: formatDateTime(quotation.updated.at, demoClock.today),
            text: quotation.updated.text.replace(/^./, (c) => c.toUpperCase()),
          },
        ]
      : []),
  ].reverse()

  return (
    <div className="bg-surface-muted">
      <title>{`${copy.eyebrow} ${quotation.id} | mySulzer | Sulzer`}</title>
      <SelfServicePageHeader
        breadcrumb={[
          ...quotationsPage.breadcrumb,
          { label: quotationsPage.title, to: quotationsPath },
          { label: quotation.id },
        ]}
        eyebrow={copy.eyebrow}
        title={quotation.id}
        badge={<StatusPill {...quotationStatus[quotation.status]} />}
        description={quotation.title}
        aside={
          !preparing && (
            <>
              <button
                type="button"
                onClick={() =>
                  showToast({ message: copy.downloaded(quotation.id), detail: copy.fileDetail })
                }
                className={
                  draft
                    ? 'inline-flex h-11 items-center gap-2 rounded-pill border border-primary bg-white px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint'
                    : 'inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover'
                }
              >
                <Download className="size-4" />
                {copy.download}
              </button>
              {draft && customer && (
                <button
                  type="button"
                  onClick={() => {
                    saveQuotation(sentQuotation(quotation))
                    showToast({
                      message: copy.sent(quotation.id, customer.contact.name),
                      detail: customer.name,
                    })
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
                >
                  <Send className="size-4" />
                  {copy.send(customer.contact.name)}
                </button>
              )}
            </>
          )
        }
      />

      <div className="site-container grid items-start gap-6 pt-10 pb-24 max-lg:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_21rem]">
        {preparing ? (
          <div className="flex flex-col items-center rounded-lg border border-border bg-white px-8 py-20 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-primary-tint text-primary">
              <FileClock className="size-8" strokeWidth={1.5} />
            </span>
            <p className="mt-5 text-xl font-bold text-navy-900">{copy.preparing.title}</p>
            <p className="mt-2 text-text-muted">
              {copy.preparing.text(
                quotation.contact.name,
                quotation.expectedBy ? formatDate(quotation.expectedBy) : '',
              )}
            </p>
          </div>
        ) : (
          <div className="min-w-0 animate-fade-in rounded-lg bg-surface-sunken ring-1 ring-border">
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 text-sm">
              <p className="flex items-center gap-2 font-semibold text-navy-900">
                <FileText className="size-4 text-text-muted" />
                {copy.fileName(quotation.id)}
              </p>
              <p className="text-text-muted tabular-nums">1 / 1</p>
            </div>
            <div className="overflow-x-auto px-6 py-8 max-xl:relative max-md:px-3 max-md:py-4 xl:px-10">
              <QuotationDocument quotation={quotation} />
            </div>
          </div>
        )}

        <aside className="space-y-6">
          <section className={card}>
            <h2 className={cardTitle}>{copy.summary.title}</h2>
            {quotation.lines.length > 0 && (
              <>
                <p className="mt-4 text-sm text-text-muted">{copy.summary.total}</p>
                <p className="text-3xl font-bold tracking-tight text-navy-900 tabular-nums">
                  {formatMoney(totals.net)}
                </p>
              </>
            )}
            <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-[15px]">
              {summary.map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4">
                  <dt className="text-text-muted">{term}</dt>
                  <dd className="text-right font-semibold text-navy-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {margin && (
            <section className="rounded-lg border border-primary-border bg-primary-tint px-6 py-5">
              <h2 className="text-sm font-semibold tracking-[0.08em] text-primary uppercase">
                {copy.margin.title}
              </h2>
              <p className="mt-3 text-3xl font-bold tracking-tight text-navy-900 tabular-nums">
                {formatMoney(margin.margin)}
                <span className="ml-2 text-base font-semibold text-primary">
                  {margin.marginPercent}%
                </span>
              </p>
              <p className="text-sm text-text-muted">{copy.margin.margin}</p>
              <dl className="mt-4 space-y-2 border-t border-primary-border pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-text-muted">{copy.margin.list}</dt>
                  <dd className="text-text-muted tabular-nums">{formatMoney(margin.list)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-muted">{copy.margin.cost(partnerPricing.discount)}</dt>
                  <dd className="font-semibold text-navy-900 tabular-nums">
                    {formatMoney(margin.cost)}
                  </dd>
                </div>
                {margin.services > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">{copy.margin.services}</dt>
                    <dd className="font-semibold text-navy-900 tabular-nums">
                      {formatMoney(margin.services)}
                    </dd>
                  </div>
                )}
              </dl>
              <p className="mt-4 text-xs text-text-muted">{copy.margin.note}</p>
            </section>
          )}

          <section className={card}>
            <h2 className={cardTitle}>{copy.contact}</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar initials={initials(quotation.contact.name)} size="md" />
              <div>
                <p className="font-semibold text-navy-900">{quotation.contact.name}</p>
                <p className="text-sm text-text-muted">{quotation.contact.role}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone aria-hidden className="size-4 text-text-subtle" />
                {quotation.contact.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail aria-hidden className="size-4 text-text-subtle" />
                <a
                  href={`mailto:${quotation.contact.email}`}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {quotation.contact.email}
                </a>
              </li>
            </ul>
          </section>

          <section className={card}>
            <h2 className={cardTitle}>{copy.history}</h2>
            <ol className="mt-4 space-y-3 text-[15px]">
              {history.map((entry, i) => (
                <li key={entry.text} className="flex gap-3">
                  <span
                    aria-hidden
                    className={`mt-2 size-2 shrink-0 rounded-full ${i === 0 ? 'bg-primary' : 'bg-border-strong'}`}
                  />
                  <div>
                    <p className={i === 0 ? 'font-semibold text-navy-900' : ''}>{entry.text}</p>
                    <p className="text-sm text-text-muted tabular-nums">{entry.at}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  )
}
