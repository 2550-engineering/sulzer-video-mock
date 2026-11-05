import {
  Bell,
  ChartSpline,
  LayoutDashboard,
  Plus,
  Server,
  Settings,
  Users,
  UsersRound,
} from 'lucide-react'
import { demoClock, products } from '../config/demo'
import type { IconItem, IconLink, NavItem } from '../types'

/*
 * Copy and demo data for the Sulzer Connect app ("/connect/*"). Condition data
 * comes from lib/conditionData.ts. People, teams and resolved alerts are
 * invented: see docs/content-to-confirm.md.
 */

const name = products.connect

export const connectApp = {
  name,
  section: 'Asset Monitor',
  /** Left icon rail. */
  nav: [
    { label: 'Dashboard', to: '/connect/dashboard', icon: LayoutDashboard },
    { label: 'Assets', to: '/connect/assets', icon: Server },
    { label: 'Alerts', to: '/connect/alerts', icon: Bell },
    { label: 'Reports', to: '/connect/reports', icon: ChartSpline },
    { label: 'Users', to: '/connect/users', icon: Users },
    { label: 'Teams', to: '/connect/teams', icon: UsersRound },
  ] satisfies IconLink[],
  settings: { label: 'Settings', icon: Settings } satisfies IconItem,
  settingsToast: 'Settings are managed by your Sulzer Connect administrator',
  /** Leaves the app, back to the website. */
  exit: { label: 'Exit', title: 'Back to My Pages', to: '/my-pages' },
  /** Phones: the last tab of the bottom bar opens the remaining pages. */
  more: { label: 'More', close: 'Close menu' },
  synced: `Updated today, ${demoClock.lastSync}`,
  alertsLabel: (count: number) => `${count} active alert${count === 1 ? '' : 's'}`,
  signIn: 'Sign in',
  signedOut: {
    title: 'Sign in to see your assets',
    text: `${name} shows the live condition of the pumps on your mySulzer account.`,
    action: 'Sign in',
  },
  welcome: {
    title: `Welcome to ${name}`,
    text: 'Start by connecting your first device. Live condition data, alerts and reports for your pumps and mixers will appear here.',
    textConnected: (count: number) =>
      `${count} of your assets stream live condition data. Connect another device or go straight to your dashboard.`,
    action: {
      label: 'Connect device',
      to: '/products/sulzer-connect',
      icon: Plus,
    } satisfies IconLink,
    dashboard: { label: 'Go to dashboard', to: '/connect/dashboard' } satisfies NavItem,
  },
  cards: [
    {
      text: 'Manage accounts and assets in the Service portal',
      link: { label: 'Service portal', to: '/connect/assets' },
    },
    {
      text: `Learn more about ${name}`,
      link: { label: 'Learn more', to: '/products/sulzer-connect' },
    },
  ] satisfies { text: string; link: NavItem }[],
}

export const statusNames = { ok: 'Normal', warning: 'Warning', alarm: 'Alarm' } as const

export const needAttention = (n: number) => `${n} need${n === 1 ? 's' : ''} attention`

export const healthNames = { good: 'Good', fair: 'Fair', poor: 'Poor' } as const

export const ranges = [
  { value: '24h', label: '24 h', hours: 24 },
  { value: '7d', label: '7 d', hours: 7 * 24 },
  { value: '30d', label: '30 d', hours: 30 * 24 },
] as const

export type RangeId = (typeof ranges)[number]['value']

export const dashboardPage = {
  title: 'Fleet overview',
  greeting: (firstName: string) => `Good morning, ${firstName}`,
  status: {
    title: 'Fleet health',
    connected: 'Connected assets',
    average: 'Average health',
  },
  alerts: { title: 'Active alerts', viewAll: 'View all alerts', none: 'No active alerts' },
  sites: { title: 'Sites', assets: (n: number) => `${n} connected` },
  runHours: {
    title: 'Run hours this week',
    subtitle: 'All connected pumps, per day',
    total: (hours: string) => `${hours} h this week`,
    today: 'so far today',
    /** Under the last bar when the chart is narrow (phones). */
    todayShort: 'today',
    unit: 'h',
  },
}

export const assetsPage = {
  back: 'Back to dashboard',
  title: 'Assets',
  accountsTitle: 'Accounts',
  search: 'Search asset',
  searchAccounts: 'Search account or asset',
  columns: {
    name: 'Name',
    model: 'Model',
    reading: 'Latest reading',
    health: 'Health',
    run: 'Run status',
    seen: 'Last data',
  },
  accountColumns: {
    name: 'Name',
    contact: 'Contact person',
    users: 'Invite and manage users',
    customerNumber: 'Customer number',
    actions: 'Actions',
  },
  running: 'Running',
  stopped: 'Stopped',
  siteSummary: (count: number, attention: number) =>
    `${count} assets${attention ? ` · ${attention} need${attention === 1 ? 's' : ''} attention` : ''}`,
  notConnected: (count: number) => `${count} more assets are not connected yet.`,
  connectMore: 'Connect a device',
  manageUsers: (count: number) => `Manage users (${count})`,
  usersToast: (account: string, count: number) => `${count} people at ${account} use ${name}`,
  invite: 'Invite',
  open: 'View assets',
  close: 'Hide assets',
  noAssets: `Not on ${name} yet`,
  inviteAccount: 'Invite to Sulzer Connect',
  invited: (account: string) => `Invitation to ${name} sent to ${account}`,
  noResults: 'No assets match your search.',
}

export const conditionPage = {
  back: 'Back to assets',
  health: {
    title: 'Health score',
    caption: 'From vibration and temperature against their limits',
    change: 'vs. last week',
  },
  serial: (serial: string) => `S/N ${serial}`,
  kpis: {
    vibration: 'Vibration velocity',
    bearingTemperature: 'Bearing temperature',
    motorTemperature: 'Motor temperature',
    runHours: 'Run hours',
    runHoursNote: (hours: number) => `${hours} h in the last 30 days`,
    change: (text: string) => `${text} in 7 days`,
    limit: (value: string) => `Warning at ${value}`,
  },
  range: 'Time range',
  vibrationChart: {
    title: 'Vibration velocity',
    subtitle: 'RMS, drive-end bearing · ISO 10816-3 zones',
    zones: ['A', 'B', 'C', 'D'],
  },
  bearingChart: { title: 'Bearing temperature', subtitle: 'Drive-end bearing' },
  motorChart: { title: 'Motor temperature', subtitle: 'Winding' },
  warning: 'Warning',
  alarm: 'Alarm',
  run: {
    title: 'Run status',
    running: 'Running',
    stopped: 'Stopped',
    summary: (percent: number, starts: number) =>
      `Running ${percent}% of the time · ${starts} start${starts === 1 ? '' : 's'}`,
  },
  timeline: { title: 'Alert timeline', none: 'No alerts in the last 30 days' },
  action: {
    title: 'Recommended action',
    requestService: 'Request service',
    viewAsset: 'View asset in mySulzer',
    position: (position: string | undefined, partNumber: string) =>
      position === undefined ? partNumber : `Pos. ${position} · ${partNumber}`,
    noneTitle: 'No action needed',
    noneText: (date: string) => `All readings are within limits. Next service ${date}.`,
  },
  notConnected: {
    title: 'This asset is not connected',
    text: `Fit a ${name} sensor to see its condition here.`,
  },
}

export const alertsPage = {
  title: 'Alerts',
  tabs: { active: 'Active', acknowledged: 'Acknowledged', history: 'History' },
  acknowledge: 'Acknowledge',
  acknowledged: (by: string) => `Acknowledged by ${by}`,
  acknowledgedToast: (title: string) => `Alert acknowledged: ${title}`,
  resolved: 'Resolved',
  active: 'active',
  empty: {
    active: 'No active alerts. Everything is running within its limits.',
    acknowledged: 'No acknowledged alerts.',
    history: 'No earlier alerts.',
  },
  severity: { alarm: 'Alarm', warning: 'Warning', info: 'Info' },
}

export type ConnectRole = 'Admin' | 'Operator' | 'Viewer' | 'Service partner'

export type ConnectUser = {
  name: string
  initials: string
  email: string
  role: ConnectRole
  teams: string[]
  lastActive: string
  /** Invited but not signed in yet. */
  pending?: boolean
}

/** People with access to the end user's Sulzer Connect account. The signed-in user is listed first. */
export const connectUsers: ConnectUser[] = [
  {
    name: 'Johan Berg',
    initials: 'JB',
    email: 'johan.berg@nordvatten.example',
    role: 'Operator',
    teams: ['Raw and drinking water'],
    lastActive: 'Today, 07:58',
  },
  {
    name: 'Sofia Ahlgren',
    initials: 'SA',
    email: 'sofia.ahlgren@nordvatten.example',
    role: 'Operator',
    teams: ['Wastewater network'],
    lastActive: 'Today, 06:40',
  },
  {
    name: 'Erik Nordin',
    initials: 'EN',
    email: 'erik.nordin@nordvatten.example',
    role: 'Viewer',
    teams: ['Wastewater network'],
    lastActive: 'Yesterday',
  },
  {
    name: 'Mikael Sjöberg',
    initials: 'MS',
    email: 'mikael.sjoberg@sulzer.example',
    role: 'Service partner',
    teams: ['Sulzer Service Västerås'],
    lastActive: '26 Oct',
  },
  {
    name: 'Lars Ek',
    initials: 'LE',
    email: 'lars.ek@aquapumpteknik.example',
    role: 'Service partner',
    teams: ['Sulzer Service Västerås'],
    lastActive: '22 Oct',
  },
  {
    name: 'Karin Holmqvist',
    initials: 'KH',
    email: 'karin.holmqvist@nordvatten.example',
    role: 'Viewer',
    teams: ['Raw and drinking water'],
    lastActive: '—',
    pending: true,
  },
]

export type ConnectTeam = {
  name: string
  description: string
  /** Site ids from data/assets.ts. */
  siteIds: string[]
  alertsBy: string
}

export const connectTeams: ConnectTeam[] = [
  {
    name: 'Raw and drinking water',
    description: 'Intake, treatment and distribution',
    siteIds: ['riverside-intake', 'norra-wtp', 'ekbacken-reservoir'],
    alertsBy: 'App and e-mail, 24/7',
  },
  {
    name: 'Wastewater network',
    description: 'Pump stations and the treatment plant',
    siteIds: ['sodra-pump-station', 'hamnen-pump-station', 'ostra-wwtp'],
    alertsBy: 'App and SMS, 24/7',
  },
  {
    name: 'Sulzer Service Västerås',
    description: 'Service partner with read access to every site',
    siteIds: [
      'riverside-intake',
      'norra-wtp',
      'ekbacken-reservoir',
      'sodra-pump-station',
      'hamnen-pump-station',
      'ostra-wwtp',
    ],
    alertsBy: 'E-mail, alarms only',
  },
]

/** Sulzer Connect users per customer account, for the partner's accounts table. */
export const accountUserCounts: Record<string, number> = {
  nordvatten: connectUsers.length + 1,
  malarbruk: 4,
  // Not on Sulzer Connect yet: the table offers "Invite to Sulzer Connect".
  'sorby-livsmedel': 0,
  'vastmalm-energi': 3,
}

export const usersPage = {
  title: 'Users',
  teamsTitle: 'Teams',
  tabs: { users: 'Users', teams: 'Teams' },
  you: 'You',
  pending: 'Invitation sent',
  columns: { name: 'Name', role: 'Role', teams: 'Teams', lastActive: 'Last active' },
  team: {
    sites: (n: number) => `${n} site${n === 1 ? '' : 's'}`,
    members: (n: number) => `${n} member${n === 1 ? '' : 's'}`,
    alerts: 'Alerts',
  },
  invite: {
    action: 'Invite user',
    title: 'Invite a user',
    close: 'Close',
    email: 'E-mail address',
    emailPlaceholder: 'name@company.com',
    role: 'Role',
    team: 'Team',
    message: 'Personal message (optional)',
    cancel: 'Cancel',
    send: 'Send invitation',
    sent: (email: string) => `Invitation sent to ${email}`,
    sentDetail: 'They get access as soon as they accept.',
  },
  roles: ['Admin', 'Operator', 'Viewer', 'Service partner'] satisfies ConnectRole[],
}

export const reportsPage = {
  title: 'Reports',
  list: [
    { id: '2026-10', label: 'October 2026', note: '1–28 Oct · in progress' },
    { id: '2026-09', label: 'September 2026', note: 'Sent 1 Oct' },
    { id: '2026-08', label: 'August 2026', note: 'Sent 1 Sep' },
    { id: '2026-07', label: 'July 2026', note: 'Sent 1 Aug' },
  ],
  download: 'Download PDF',
  preparing: 'Preparing PDF…',
  downloaded: (file: string) => `${file} downloaded`,
  fileName: (month: string) => `Sulzer-Connect-condition-report-${month}.pdf`,
  schedule: 'Sent on the 1st of every month to the Admin and Operator users.',
  report: {
    title: 'Monthly condition report',
    period: 'October 2026 · 1–28 October',
    preparedFor: 'Prepared for',
    generated: `Generated ${demoClock.today.split('-').reverse().join('.')}, ${demoClock.lastSync}`,
    summary: 'Summary',
    kpis: {
      monitored: 'Assets monitored',
      runHours: 'Run hours',
      alerts: 'Alerts raised',
      health: 'Average health',
    },
    attention: 'Assets that need attention',
    columns: { asset: 'Asset', site: 'Site', finding: 'Finding', action: 'Recommended action' },
    trend: (tag: string) => `${tag} vibration, last 30 days`,
    sites: 'Sites',
    siteColumns: { site: 'Site', assets: 'Assets', runHours: 'Run hours', status: 'Status' },
    footer: `${name} · Sulzer Ltd · This report is generated from hourly sensor data.`,
    page: 'Page 1 of 3',
  },
}

/** Alerts that already cleared, for the history. Times are wall-clock "YYYY-MM-DDTHH:MM". */
export const alertHistory = [
  {
    id: 'h-p104-level',
    assetId: 'p-104',
    severity: 'warning',
    title: 'High level in the wet well',
    time: '2026-10-28T05:05',
    resolved: 'Level back to normal after 25 min',
  },
  {
    id: 'h-in02-battery',
    assetId: 'in-02',
    severity: 'info',
    title: 'Sensor battery low (15 %)',
    time: '2026-10-24T09:20',
    resolved: 'Battery replaced on 26 Oct',
  },
  {
    id: 'h-p102-stop',
    assetId: 'p-102',
    severity: 'warning',
    title: 'Pump stopped unexpectedly',
    time: '2026-10-21T22:47',
    resolved: 'Restarted automatically after 6 min',
  },
  {
    id: 'h-p103-gateway',
    assetId: 'p-103',
    severity: 'warning',
    title: 'Gateway offline at Södra pump station',
    time: '2026-10-19T02:10',
    resolved: 'Back online after 41 min',
  },
  {
    id: 'h-bw01-service',
    assetId: 'bw-01',
    severity: 'info',
    title: 'Annual service due in 30 days',
    time: '2026-10-13T06:00',
    resolved: 'Service booked for 12 Nov',
  },
] as const
