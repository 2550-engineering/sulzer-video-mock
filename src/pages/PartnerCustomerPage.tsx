import {
  ArrowRight,
  ChevronRight,
  Mail,
  Package,
  Phone,
  Radio,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AssetList } from '../components/assets/AssetList'
import { AssetStatusDot } from '../components/assets/AssetStatusDot'
import { Avatar } from '../components/Avatar'
import { Breadcrumb } from '../components/Breadcrumb'
import { CustomerLogo } from '../components/CustomerLogo'
import { CustomerSiteCard } from '../components/partner/CustomerSiteCard'
import { ProjectStatusChip } from '../components/projects/ProjectStatusChip'
import { ServiceRequestCard } from '../components/selfservice/ServiceRequestCard'
import { StatusPill } from '../components/selfservice/StatusPill'
import { assetPage, channels } from '../data/assetPages'
import { customers, sites } from '../data/assets'
import { accountUserCounts } from '../data/connect'
import { signedOutRedirect } from '../data/myPages'
import {
  customerPage as copy,
  customersPage,
  partnerCustomersPath,
  shortName,
} from '../data/partner'
import {
  quotationPath,
  quotationStatus,
  quotationsPath,
  requestsPath,
} from '../data/selfServicePages'
import { assetAlert, readingTime, sortAssets } from '../lib/assetList'
import { needsAttention } from '../lib/assetSummary'
import { customerSummary } from '../lib/partner'
import { isSharedWithClient } from '../lib/projects'
import { isOpenRequest, quotationsFor } from '../lib/selfService'
import { useProjects } from '../projects/useProjects'
import { useSelfService } from '../selfService/useSelfService'
import { NotFoundPage } from './NotFoundPage'

const card = 'rounded-lg border border-border bg-white'
const cardTitle =
  'border-b border-border px-6 py-4 text-sm font-semibold tracking-[0.08em] text-text-muted uppercase'
const sectionTitle = 'text-xl font-bold tracking-tight text-navy-900'
const outlined =
  'inline-flex h-11 items-center gap-2 rounded-pill border border-primary bg-white px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')

/**
 * One customer account: /partner/customers/:id. Partners only. The customer's
 * wordmark and key facts, what needs attention, their sites (each filters the
 * installed base), the installed base itself (the same list as My assets; an asset
 * opens the same asset page, in partner mode), open requests, and beside it the
 * contacts, the projects for this customer and the quotations sent to them.
 */
export function PartnerCustomerPage() {
  const { user } = useAuth()
  const { id = '' } = useParams()
  const { requests, quotations } = useSelfService()
  const { projects } = useProjects()
  const [siteId, setSiteId] = useState<string | null>(null)

  if (!user) return <Navigate to={signedOutRedirect} replace />
  if (user.kind !== 'partner') return <Navigate to="/my-pages" replace />
  const customer = customers.find((c) => c.id === id)
  if (!customer) return <NotFoundPage />

  const summary = customerSummary(customer, requests)
  const { account } = summary
  const customerSites = sites.filter((site) => summary.assets.some((a) => a.siteId === site.id))
  const site = customerSites.find((s) => s.id === siteId)
  const installedBase = sortAssets(
    summary.assets.filter((asset) => !site || asset.siteId === site.id),
    'attention',
  )
  const attention = summary.assets.filter(needsAttention)
  const openRequests = requests.filter((r) => r.customerId === customer.id && isOpenRequest(r))
  const customerProjects = projects
    .filter((p) => p.clientAccount === customer.id)
    .sort((a, b) => b.modifiedOrder - a.modifiedOrder)
  const customerQuotations = quotationsFor(user, quotations)
    .filter((q) => q.customerId === customer.id)
    .sort((a, b) => b.updated.at.localeCompare(a.updated.at))
  const connectUsers = accountUserCounts[customer.id] ?? 0
  const [contact, ...others] = account.contacts

  const facts = [
    { label: copy.facts.city, value: customer.city },
    { label: copy.facts.since, value: String(account.customerSince) },
    { label: copy.facts.manager, value: account.accountManager },
    { label: copy.facts.discount, value: `${account.quotationDiscount}%` },
    {
      label: copy.facts.connectUsers,
      value: connectUsers > 0 ? String(connectUsers) : copy.facts.none,
    },
  ]

  return (
    <div className="bg-surface-muted">
      <title>{`${customer.name} | ${customersPage.title} | mySulzer | Sulzer`}</title>

      <div className="site-container py-5">
        <Breadcrumb
          items={[
            ...customersPage.breadcrumb,
            { label: customersPage.title, to: partnerCustomersPath },
            { label: shortName(customer.name) },
          ]}
        />
      </div>

      <header className="site-container flex flex-wrap items-end justify-between gap-6 pt-4">
        <div className="flex min-w-0 items-center gap-6">
          <span className="flex h-24 w-64 shrink-0 animate-fade-in items-center justify-center rounded-lg bg-white px-6 shadow-card ring-1 ring-navy-900/5">
            <CustomerLogo customerId={customer.id} className="h-12 max-w-full" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-muted">
              {copy.eyebrow(customer.customerNumber, customer.industry)}
            </p>
            <h1 className="mt-1 text-[2.75rem] leading-tight font-bold tracking-tight text-brand">
              {customer.name}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to={copy.actions.partsTo} className={outlined}>
            <Package className="size-4" />
            {copy.actions.parts}
          </Link>
          {summary.connected > 0 && (
            <Link
              to={copy.actions.connectTo}
              className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
            >
              <Radio className="size-4" />
              {copy.actions.connect}
            </Link>
          )}
        </div>
      </header>

      <div className="site-container mt-8">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-5 rounded-lg border border-border bg-white px-6 py-5 sm:grid-cols-3 xl:grid-cols-5">
          {facts.map(({ label, value }) => (
            <div
              key={label}
              className="xl:border-l xl:border-border xl:pl-6 xl:first:border-l-0 xl:first:pl-0"
            >
              <dt className="text-sm text-text-muted">{label}</dt>
              <dd className="mt-1 text-lg font-semibold text-navy-900 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {attention.length > 0 && (
        <section className="site-container mt-6">
          <div className="animate-fade-in overflow-hidden rounded-lg border border-warning/40 bg-warning-tint">
            <h2 className="flex items-center gap-2.5 px-6 pt-4 pb-2 font-bold text-warning-strong">
              <TriangleAlert className="size-5" />
              {copy.attention.title(attention.length)}
            </h2>
            <ul className="divide-y divide-warning/20 px-2 pb-2">
              {attention.map((asset) => {
                const alert = assetAlert(asset)
                return (
                  <li key={asset.id}>
                    <Link
                      to={`/assets/${asset.id}`}
                      className="group flex items-center gap-4 rounded-md px-4 py-3 transition-colors hover:bg-white/60"
                    >
                      <AssetStatusDot status={asset.status} />
                      <span className="w-16 font-bold text-navy-900">{asset.tag}</span>
                      <span className="min-w-0 flex-1 truncate text-[15px] text-navy-900">
                        {alert
                          ? assetPage.alert.title(channels[alert.channel].label, alert.level)
                          : asset.name}
                        {alert?.since != null && (
                          <span className="text-text-muted">
                            {' '}
                            · {assetPage.alert.since(readingTime(alert.since))}
                          </span>
                        )}
                        {alert?.finding && (
                          <span className="text-text-muted"> · {alert.finding.title}</span>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        {copy.attention.view}
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      <div className="site-container grid items-start gap-8 pt-10 pb-24 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className={sectionTitle}>
              {copy.sites.title}{' '}
              <span className="font-normal text-text-muted">({customerSites.length})</span>
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {customerSites.map((s) => {
                const own = summary.assets.filter((asset) => asset.siteId === s.id)
                return (
                  <li key={s.id}>
                    <CustomerSiteCard
                      site={s}
                      assets={own.length}
                      attention={own.filter(needsAttention).length}
                      selected={s.id === siteId}
                      onSelect={() => setSiteId(s.id === siteId ? null : s.id)}
                    />
                  </li>
                )
              })}
            </ul>
          </section>

          <section>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h2 className={sectionTitle}>
                {copy.installedBase.title}{' '}
                <span className="font-normal text-text-muted">
                  ({site ? `${installedBase.length}/${summary.total}` : summary.total})
                </span>
              </h2>
              {site && (
                <button
                  type="button"
                  onClick={() => setSiteId(null)}
                  className="inline-flex animate-fade-in items-center gap-1.5 rounded-pill bg-primary-tint px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint-strong"
                >
                  {copy.installedBase.filteredBy(site.name)}
                  <X aria-label={copy.installedBase.showAll} className="size-3.5" />
                </button>
              )}
            </div>
            <div
              key={siteId ?? 'all'}
              className="mt-4 animate-fade-in overflow-hidden rounded-lg border border-border bg-white"
            >
              <AssetList assets={installedBase} />
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className={sectionTitle}>
                {copy.requests.title}{' '}
                <span className="font-normal text-text-muted">({openRequests.length})</span>
              </h2>
              <Link
                to={requestsPath}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
              >
                {copy.requests.all}
                <ChevronRight className="size-4" />
              </Link>
            </div>
            {openRequests.length > 0 ? (
              <div className="mt-4 space-y-4">
                {openRequests.map((request) => (
                  <ServiceRequestCard key={request.id} request={request} showCustomer={false} />
                ))}
              </div>
            ) : (
              <p className={`${card} mt-4 px-6 py-5 text-text-muted`}>{copy.requests.empty}</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className={card}>
            <h2 className={cardTitle}>{copy.contacts.title}</h2>
            <ul className="divide-y divide-border">
              {[contact, ...others].map((person, i) => (
                <li key={person.email} className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={initials(person.name)} size="md" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold text-navy-900">
                        {person.name}
                        {i === 0 && (
                          <span className="rounded-sm bg-primary-tint px-1.5 py-0.5 text-xs font-semibold text-primary">
                            {copy.contacts.main}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-text-muted">{person.role}</p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Phone aria-hidden className="size-4 text-text-subtle" />
                      {person.phone}
                    </li>
                    <li className="flex min-w-0 items-center gap-2">
                      <Mail aria-hidden className="size-4 shrink-0 text-text-subtle" />
                      <a
                        href={`mailto:${person.email}`}
                        className="truncate font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {person.email}
                      </a>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          <section className={card}>
            <h2 className={cardTitle}>{copy.projects.title}</h2>
            {customerProjects.length > 0 ? (
              <ul className="divide-y divide-border">
                {customerProjects.map((project) => (
                  <li key={project.id}>
                    <Link
                      to={`/my-projects/${project.id}`}
                      className="group block px-6 py-4 transition-colors hover:bg-surface-subtle"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-navy-900 transition-colors group-hover:text-primary">
                          {project.name}
                        </span>
                        <ProjectStatusChip status={project.status} />
                      </span>
                      <span className="mt-1 block text-sm text-text-muted tabular-nums">
                        {project.refNo} ·{' '}
                        {copy.projects.products(
                          project.items.reduce((n, item) => n + item.quantity, 0),
                        )}
                      </span>
                      <span
                        className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold ${
                          isSharedWithClient(project) ? 'text-success-strong' : 'text-text-muted'
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`size-1.5 rounded-full ${isSharedWithClient(project) ? 'bg-success' : 'bg-border-strong'}`}
                        />
                        {isSharedWithClient(project)
                          ? copy.projects.shared
                          : copy.projects.notShared}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-5">
                <p className="text-text-muted">{copy.projects.empty}</p>
                <Link
                  to="/sizing"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  {copy.projects.size}
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            )}
          </section>

          <section className={card}>
            <h2 className={cardTitle}>{copy.quotations.title}</h2>
            {customerQuotations.length > 0 ? (
              <ul className="divide-y divide-border">
                {customerQuotations.map((quotation) => (
                  <li key={quotation.id}>
                    <Link
                      to={quotationPath(quotation.id)}
                      className="group flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-surface-subtle"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-navy-900 tabular-nums transition-colors group-hover:text-primary">
                          {quotation.id}
                        </span>
                        <span className="block truncate text-sm text-text-muted">
                          {quotation.title}
                        </span>
                      </span>
                      <StatusPill {...quotationStatus[quotation.status]} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-6 py-5 text-text-muted">{copy.quotations.empty}</p>
            )}
            <Link
              to={quotationsPath}
              className="flex items-center gap-1 border-t border-border px-6 py-3 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              {copy.quotations.all}
              <ChevronRight className="size-4" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  )
}
