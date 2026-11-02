import {
  CircleAlert,
  FileText,
  FolderKanban,
  FolderOpen,
  Gauge,
  GraduationCap,
  HandHelping,
  LayoutGrid,
  Server,
  TriangleAlert,
  Truck,
  Wrench,
} from 'lucide-react'
import { demoClock, demoUser, products } from '../config/demo'
import { serviceDueWithinDays, summarizeAssets } from '../lib/assetSummary'
import type { ActivityItem, AssetStat, DashboardCard, NavItem } from '../types'
import { assets } from './assets'
import { projects } from './projects'
import { orderPath, ordersPath, quotationPath, requestsPath } from './selfServicePages'

/* Copy and demo data for the signed-in dashboard ("/my-pages"). Deterministic — no live values. */

export const welcome = {
  title: `Welcome back, ${demoUser.firstName}`,
  subtitle: 'Connecting you to all your Sulzer things',
}

/** Where signed-out visitors are sent. */
export const signedOutRedirect = '/my-sulzer'

export const dashboardCards = {
  selfService: {
    title: 'Self-service',
    subtitle: 'Easy access to self-service tools',
    icon: HandHelping,
    links: [
      { label: 'List price & availability', to: '/self-service/list-price' },
      { label: 'Spare parts', to: '/spare-parts' },
      { label: 'Replace pump', to: '/products/replacement' },
      // Badges: orders in transit and open requests, from the self-service state (MyPagesPage).
      { label: 'Order status incl. track & trace', to: ordersPath },
      { label: 'Requests', to: requestsPath },
      { label: 'Export information', to: '/self-service/export' },
    ],
  },
  learning: {
    title: 'Learning',
    subtitle: 'Continue your learning with Sulzer Academy',
    icon: GraduationCap,
    links: [
      { label: 'My completed courses', to: '/learn/completed', badge: { label: '6' } },
      {
        label: 'My courses in progress',
        to: '/learn/in-progress',
        badge: { label: '2', tone: 'info' },
      },
      { label: 'My certificates', to: '/learn/certificates', badge: { label: '3' } },
      { label: 'My bookmarks', to: '/learn/bookmarks' },
    ],
  },
  productsProjects: {
    title: 'Products & projects',
    subtitle: 'Access your saved product information',
    icon: FolderKanban,
    links: [
      // The count comes from the personal toolbar state (MyPagesPage).
      { label: 'My saved items', to: '/my-pages/saved' },
      { label: 'My projects', to: '/my-projects', badge: { label: String(projects.length) } },
      { label: 'My recently viewed products', to: '/my-pages/recently-viewed' },
    ],
  },
  portals: {
    title: 'Portals',
    subtitle: 'Easy access to all your portals',
    icon: LayoutGrid,
    links: [
      { label: 'Sulzer Connect', to: '/connect' },
      { label: 'Service portal', to: '/support/service-portal' },
      { label: 'Documentation portal', to: '/support/documentation' },
    ],
  },
} satisfies Record<string, DashboardCard>

/** Live counts on the Self-service card. */
export const selfServiceBadges = {
  inTransit: (n: number) => `${n} in transit`,
  open: (n: number) => `${n} open`,
}

const summary = summarizeAssets(assets.filter((asset) => asset.customerId === demoUser.customerId))

const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? '' : 's'}`

export const assetsCard = {
  title: 'My assets',
  badge: 'New',
  subtitle: 'Your installed base at a glance',
  icon: Gauge,
  stats: [
    {
      value: String(summary.total),
      label: 'assets',
      detail: `Across ${summary.sites} sites`,
      tone: 'neutral',
      icon: Server,
      to: '/assets',
    },
    {
      value: String(summary.needsAttention),
      label: 'need attention',
      detail: `${count(summary.alarms, 'alarm')} · ${count(summary.warnings, 'warning')}`,
      tone: 'warning',
      icon: CircleAlert,
      to: '/assets?status=alarm&status=warning',
    },
    {
      value: String(summary.serviceDue),
      label: 'service due',
      detail: `Within ${serviceDueWithinDays} days`,
      tone: 'info',
      icon: Wrench,
      to: '/assets?service=due',
    },
  ] satisfies AssetStat[],
  source: `Monitored with ${products.iotOffering} · Updated today, ${demoClock.lastSync}`,
  link: { label: 'View all assets', to: '/assets' } satisfies NavItem,
}

export const recentActivity = {
  title: 'Recent activity',
  items: [
    {
      subject: 'Quotation Q-10234',
      text: 'updated with a new delivery date',
      time: 'Today, 09:14',
      to: quotationPath('Q-10234'),
      icon: FileText,
    },
    {
      subject: 'Project ‘Riverside intake’',
      text: 'updated by Johan Berg',
      time: 'Today, 07:58',
      to: '/my-projects/riverside-intake',
      icon: FolderOpen,
    },
    {
      subject: 'RW-02',
      text: 'vibration above warning limit · Riverside intake',
      time: 'Today, 03:12',
      to: '/assets/rw-02',
      icon: TriangleAlert,
      tone: 'warning',
    },
    {
      subject: 'Order SO-104382',
      text: 'shipped – expected 30 Oct',
      time: 'Yesterday, 16:20',
      to: orderPath('SO-104382'),
      icon: Truck,
    },
    {
      subject: 'Course “Submersible pump maintenance”',
      text: '75% complete',
      time: '23 Oct',
      to: '/learn/in-progress',
      icon: GraduationCap,
    },
  ] satisfies ActivityItem[],
}
