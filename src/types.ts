import type { LucideIcon } from 'lucide-react'

export type User = {
  firstName: string
  name: string
  initials: string
  company: string
  role: string
}

export type NavItem = {
  label: string
  to: string
}

export type MegaMenuItem = NavItem & {
  children?: NavItem[]
}

export type IconLink = NavItem & {
  icon: LucideIcon
}

export type FooterColumn = {
  title: string
  links: NavItem[]
}

/** Gradient shown while an image file hasn't been supplied yet. */
export type PlaceholderTone = 'ocean' | 'deep' | 'steel' | 'slate'

/** An image from `_asset-source/images`, referenced by file name. */
export type ImageRef = {
  file: string
  alt: string
  tone: PlaceholderTone
}

/** Card with an icon, title, one line of text and an arrow link. */
export type LinkCard = {
  title: string
  text: string
  linkLabel: string
  to: string
  icon: LucideIcon
}

/** Icon + label (+ optional line of text), optionally linking somewhere. */
export type IconItem = {
  label: string
  text?: string
  icon: LucideIcon
  to?: string
}

export type ApplicationTeaser = {
  title: string
  caption: string
  to: string
  image: ImageRef
}

/** A live-looking reading shown on the Sulzer Connect promo. Deterministic demo data. */
export type AssetReadout = {
  label: string
  value: string
  status: 'ok' | 'warning'
  /** Sparkline values, 0–100. */
  trend?: number[]
}

/** A route rendered with the "Coming soon" placeholder until its real page is built. */
export type PlaceholderRoute = {
  path: string
  title: string
  description: string
  /** Path of the parent page, used to build the breadcrumb trail. */
  parent?: string
}

/** Colour of a count badge or stat: plain, Sulzer blue, or amber for things that need a look. */
export type StatusTone = 'neutral' | 'info' | 'warning'

export type Badge = {
  label: string
  tone?: StatusTone
}

/** A link in a My Pages card, with an optional count or status badge. */
export type DashboardLink = NavItem & {
  badge?: Badge
}

/** My Pages card: icon, title and subtitle header, then a list of links. */
export type DashboardCard = {
  title: string
  subtitle: string
  icon: LucideIcon
  links: DashboardLink[]
}

/** Headline number on the My assets card. Deterministic demo data. */
export type AssetStat = {
  value: string
  label: string
  detail: string
  tone: StatusTone
  icon: LucideIcon
}

/** A row in the My Pages "Recent activity" list. */
export type ActivityItem = {
  /** Bold lead-in, e.g. the document or project name. */
  subject: string
  text: string
  time: string
  to: string
  icon: LucideIcon
}

/* ── Catalogue (Phase 2 templates) ─────────────────────────────────────────── */

/** Heading, paragraph and icon highlights shown on an "Explore" tab. */
export type ExploreContent = {
  title: string
  text: string
  highlights: IconItem[]
}

/** A node in the application finder tree. The root ("Applications") has `parentId: null`. */
export type Application = {
  /** Also the URL slug: /applications/<id>. */
  id: string
  name: string
  parentId: string | null
  heroImage: ImageRef
  /** One line, for tiles and lists. */
  summary: string
  /** Paragraph under the hero title. */
  intro: string
  /** Ids of child applications, in display order. */
  children: string[]
  explore?: ExploreContent
}

/** Headline figures in the product header strip, pre-formatted with units. */
export type KeySpecs = {
  liquidTemp: string
  maxFlow: string
  maxHead: string
  maxPressure: string
}

export type ProductTabsContent = {
  explore: ExploreContent
  services: IconItem[]
}

export type Product = {
  /** Also the URL slug: /products/<id>. */
  id: string
  name: string
  /** Construction type, shown as the tag above the product name. */
  family: string
  /** Range category, matching the mega menu "Categories" list. */
  category: string
  /** Ids of the applications this product is suitable for. */
  applications: string[]
  summary: string
  keySpecs: KeySpecs
  /** First image is the main product shot. */
  images: ImageRef[]
  tabs: ProductTabsContent
}

/** One size/variant of a product, as listed on the Models tab. */
export type ProductModel = {
  id: string
  productId: string
  name: string
  /** Best-efficiency flow, m³/h. */
  flow: number
  /** Head at best-efficiency flow, m. */
  head: number
  /** Rated motor power, kW. */
  power: number
  /** Nominal speed, rpm. */
  speed: number
  /** Impeller diameter, mm. */
  impeller: number
}

export type SparePart = {
  id: string
  partNumber: string
  name: string
  productId: string
  /** e.g. "Wear parts", "Seals", "Bearings". */
  group: string
  /** Item number on the sectional drawing. */
  position: number
  availability: 'in-stock' | 'on-request'
}

export type DocumentType =
  | 'Data sheet'
  | 'Installation & operating instructions'
  | 'Brochure'
  | 'Spare parts list'
  | 'BIM model'
  | 'CAD drawing'

export type Document = {
  id: string
  title: string
  type: DocumentType
  /** Sulzer document number. */
  number: string
  productIds: string[]
  language: string
  format: string
  size: string
  /** ISO date, e.g. "2026-03-12". */
  date: string
}

export type ProjectStatus = 'Draft' | 'In progress' | 'Quoted'

export type Project = {
  id: string
  name: string
  applicationId: string
  productIds: string[]
  status: ProjectStatus
  owner: string
  /** Pre-formatted, e.g. "Today, 07:58". */
  updated: string
  sharedWith: number
}

export type AssetStatus = 'ok' | 'warning' | 'alarm'

export type Asset = {
  id: string
  name: string
  location: string
  productId: string
  status: AssetStatus
  lastReading: {
    metric: string
    value: string
    /** Pre-formatted, e.g. "Today, 08:42". */
    time: string
  }
}

/** A tab in a page's sticky tab bar. `id` is also the URL hash. */
export type TabDef = {
  id: string
  label: string
}

/** Shown inside a tab whose content isn't built yet. */
export type TabComingSoonCopy = {
  title: string
  text: string
}

/** Copy for a feature page that isn't built yet. */
export type ComingSoonContent = {
  title: string
  description: string
  panelTitle: string
  panelText: string
  /** What the finished page will offer, shown as a checklist. */
  features: string[]
}
