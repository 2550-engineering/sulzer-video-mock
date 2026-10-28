import { Bell, ChartSpline, LayoutDashboard, Plus, Server, Settings, Users } from 'lucide-react'
import type { IconItem, IconLink, NavItem } from '../types'

/* Copy for the Sulzer Connect app shell ("/connect"). Not built yet — shows a welcome state. */

export const connectApp = {
  name: 'Sulzer Connect',
  section: 'Asset Monitor',
  /** Left icon rail. Only the first item is active; the rest aren't built yet. */
  nav: [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Assets', icon: Server },
    { label: 'Alerts', icon: Bell },
    { label: 'Reports', icon: ChartSpline },
    { label: 'Users', icon: Users },
  ] satisfies IconItem[],
  settings: { label: 'Settings', icon: Settings } satisfies IconItem,
  /** Leaves the app, back to the website. */
  exit: { label: 'Exit', title: 'Back to My Pages', to: '/my-pages' },
  welcome: {
    badge: 'Coming soon',
    title: 'Welcome to Sulzer Connect',
    text: 'Start by connecting your first device. Live condition data, alerts and reports for your pumps and mixers will appear here.',
    action: { label: 'Connect device', to: '/contact', icon: Plus } satisfies IconLink,
  },
  cards: [
    {
      text: 'Manage accounts and service visits in the Service portal',
      link: { label: 'Service portal', to: '/support/service-portal' },
    },
    {
      text: 'Learn more about Sulzer Connect and condition monitoring',
      link: { label: 'Learn more', to: '/digital-solutions' },
    },
  ] satisfies { text: string; link: NavItem }[],
}
