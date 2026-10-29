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
  Truck,
  Wrench,
} from 'lucide-react'
import { demoUser, products } from '../config/demo'
import type { ActivityItem, AssetStat, DashboardCard, NavItem } from '../types'
import { projects } from './projects'

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
      {
        label: 'Order status incl. track & trace',
        to: '/self-service/orders',
        badge: { label: '2 in transit', tone: 'info' },
      },
      { label: 'Requests', to: '/self-service/requests', badge: { label: '1 open' } },
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
      { label: 'My saved items', to: '/my-pages/saved', badge: { label: '12' } },
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

export const assetsCard = {
  title: 'My assets',
  badge: 'New',
  subtitle: 'Your installed base at a glance',
  icon: Gauge,
  stats: [
    { value: '24', label: 'assets', detail: 'Across 6 sites', tone: 'neutral', icon: Server },
    {
      value: '2',
      label: 'need attention',
      detail: 'Vibration above limit',
      tone: 'warning',
      icon: CircleAlert,
    },
    { value: '1', label: 'service due', detail: 'Within 30 days', tone: 'info', icon: Wrench },
  ] satisfies AssetStat[],
  source: `Monitored with ${products.iotOffering} · Updated today, 08:42`,
  link: { label: 'View all assets', to: '/assets' } satisfies NavItem,
}

export const recentActivity = {
  title: 'Recent activity',
  items: [
    {
      subject: 'Quotation Q-10234',
      text: 'updated with a new delivery date',
      time: 'Today, 09:14',
      to: '/self-service/quotations',
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
      subject: 'Order SO-104382',
      text: 'shipped – expected 30 Oct',
      time: 'Yesterday, 16:20',
      to: '/self-service/orders',
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
