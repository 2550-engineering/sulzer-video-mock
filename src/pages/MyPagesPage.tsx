import { CircleAlert, Wrench } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { Avatar } from '../components/Avatar'
import { Breadcrumb } from '../components/Breadcrumb'
import { LinksCard } from '../components/mypages/LinksCard'
import { RecentActivity } from '../components/mypages/RecentActivity'
import { StatsCard } from '../components/mypages/StatsCard'
import { PartnerBadge } from '../components/PartnerBadge'
import {
  assetsCard,
  dashboardCards,
  selfServiceBadges,
  signedOutRedirect,
  welcome,
} from '../data/myPages'
import { partnerCustomersPath, partnerDashboard as partnerCopy, shortName } from '../data/partner'
import { personalToolbar } from '../data/personal'
import { ordersPath, quotationsPath, requestsPath } from '../data/selfServicePages'
import { customerSummaries, type CustomerSummary } from '../lib/partner'
import { isSharedWithClient } from '../lib/projects'
import {
  isInTransit,
  isOpenRequest,
  ordersFor,
  quotationsFor,
  requestsFor,
} from '../lib/selfService'
import { usePersonal } from '../personal/usePersonal'
import { useProjects } from '../projects/useProjects'
import { useSelfService } from '../selfService/useSelfService'
import type { DashboardCard, DashboardLink, ServiceRequest, StatsCardData } from '../types'

// Cards fade in one after another on arrival, 50 ms apart.
const enter = 'animate-fade-in [animation-fill-mode:backwards]'
function delay(index: number): CSSProperties {
  return { animationDelay: `${index * 50}ms` }
}

/**
 * Signed-in dashboard: welcome, card grid and recent activity. The end user gets
 * self-service, learning, projects, portals and My assets; the channel partner gets
 * My customers, quotations, orders, partner prices, projects and Partner Academy.
 */
export function MyPagesPage() {
  const { user } = useAuth()
  const { saved } = usePersonal()
  const { orders, requests, quotations } = useSelfService()
  const { projects } = useProjects()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const partner = user.kind === 'partner'
  const inTransit = ordersFor(user, orders).filter(isInTransit).length
  const openRequests = requestsFor(user, requests).filter(isOpenRequest).length
  const openQuotations = quotationsFor(user, quotations).filter((q) =>
    ['Draft', 'Requested', 'Sent'].includes(q.status),
  ).length
  const shared = projects.filter(isSharedWithClient).length

  // Live counts, matched on where the link goes.
  const counts: Record<string, DashboardLink['badge']> = {
    [ordersPath]: inTransit
      ? { label: selfServiceBadges.inTransit(inTransit), tone: 'info' }
      : undefined,
    [requestsPath]: openRequests ? { label: selfServiceBadges.open(openRequests) } : undefined,
    [`${quotationsPath}?status=open`]: openQuotations
      ? { label: selfServiceBadges.open(openQuotations), tone: 'info' }
      : undefined,
    [personalToolbar.saved.to]: { label: String(saved.length) },
    '/my-projects': { label: String(projects.length) },
    '/my-projects?shared=1': { label: String(shared) },
  }
  const withBadges = (card: DashboardCard): DashboardCard => ({
    ...card,
    links: card.links.map((link) => (counts[link.to] ? { ...link, badge: counts[link.to] } : link)),
  })

  return (
    <div className="bg-surface-muted">
      <title>My Pages | mySulzer | Sulzer</title>

      <div className="site-container py-5">
        <Breadcrumb items={[{ label: 'mySulzer', to: '/my-sulzer' }, { label: 'My Pages' }]} />
      </div>

      <div className="site-container pt-6 pb-24">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-[2.75rem] leading-tight font-bold tracking-tight text-brand">
              {welcome.title(user.firstName)}
            </h1>
            <p className="mt-2 text-lg text-text-muted">
              {partner ? partnerCopy.subtitle : welcome.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-pill bg-surface py-2 pr-6 pl-2 shadow-card ring-1 ring-navy-900/5">
            <Avatar initials={user.initials} size="md" />
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                {user.company}
                {partner && <PartnerBadge />}
              </p>
              <p className="text-sm text-text-muted">
                {partner ? `${user.role} · ${partnerCopy.identity}` : user.role}
              </p>
            </div>
          </div>
        </header>

        {partner ? (
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <li className={`md:col-span-2 ${enter}`} style={delay(0)}>
              <StatsCard card={customersCard(requests)} />
            </li>
            {[
              partnerCopy.cards.quotations,
              partnerCopy.cards.orders,
              partnerCopy.cards.prices,
              partnerCopy.cards.projects,
              partnerCopy.cards.academy,
            ].map((card, i) => (
              <li key={card.title} className={enter} style={delay(i + 1)}>
                <LinksCard card={withBadges(card)} />
              </li>
            ))}
            <li className={`md:col-span-2 ${enter}`} style={delay(6)}>
              <RecentActivity items={partnerCopy.activity} />
            </li>
          </ul>
        ) : (
          <>
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                dashboardCards.selfService,
                dashboardCards.learning,
                dashboardCards.productsProjects,
                dashboardCards.portals,
              ].map((card, i) => (
                <li key={card.title} className={enter} style={delay(i)}>
                  <LinksCard card={withBadges(card)} />
                </li>
              ))}
              <li className={`md:col-span-2 ${enter}`} style={delay(4)}>
                <StatsCard card={assetsCard} />
              </li>
            </ul>

            <div className={`mt-6 ${enter}`} style={delay(5)}>
              <RecentActivity />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** "My customers": accounts, the ones that need attention, and open requests. */
function customersCard(requests: ServiceRequest[]): StatsCardData {
  const copy = partnerCopy.customers
  const summaries = customerSummaries(requests)
  const attention = summaries.filter((s) => s.needsAttention > 0)
  const sum = (pick: (s: CustomerSummary) => number) =>
    summaries.reduce((total, s) => total + pick(s), 0)
  const openRequests = sum((s) => s.openRequests)
  return {
    title: copy.title,
    subtitle: copy.subtitle,
    icon: copy.icon,
    stats: [
      {
        value: String(summaries.length),
        label: 'customers',
        detail: copy.customers(
          sum((s) => s.sites),
          sum((s) => s.total),
        ),
        tone: 'neutral',
        icon: copy.icon,
        to: partnerCustomersPath,
      },
      {
        value: String(attention.length),
        label: attention.length === 1 ? 'needs attention' : 'need attention',
        detail: copy.attention(
          attention.map((s) => shortName(s.customer.name)),
          sum((s) => s.alarms),
          sum((s) => s.warnings),
        ),
        tone: 'warning',
        icon: CircleAlert,
        to: `${partnerCustomersPath}?status=attention`,
      },
      {
        value: String(openRequests),
        label: openRequests === 1 ? 'open request' : 'open requests',
        detail: copy.requests,
        tone: 'info',
        icon: Wrench,
        to: requestsPath,
      },
    ],
    source: copy.source,
    link: copy.link,
  }
}
