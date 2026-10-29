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

/**
 * An image in `public/images`, by its fixed URL path, e.g. "/images/products/ahlstar-main.png".
 * Rendered by <SmartImage>, which shows a placeholder until the file exists.
 * `alt` also describes what the photo should show (see docs/images-needed.md).
 */
export type ImageSource = {
  src: string
  alt: string
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
  image: ImageSource
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
  /** Photo on the "Coming soon" card. Defaults to the Sulzer brand image. */
  image?: ImageSource
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

/** Opening block of an Explore tab: heading, lead paragraph and text behind "Show more". */
export type ExploreIntro = {
  title: string
  text: string
  /** Paragraphs shown after "Show more". */
  more: string[]
}

/** Card with an icon, title, text and a button, e.g. "How can we help you?". */
export type HelpCard = {
  title: string
  text: string
  icon: LucideIcon
  actionLabel: string
  to: string
}

export type KnowledgeType = 'Engineering manual' | 'Expert video' | 'Handbook' | 'Customer story'

/** Learning material: a manual, video, handbook or article. */
export type KnowledgeItem = {
  id: string
  type: KnowledgeType
  title: string
  /** One line. */
  teaser: string
  image: ImageSource
  to: string
}

/** A Sulzer service, listed next to products on Products & solutions and on product Services tabs. */
export type Service = {
  id: string
  name: string
  summary: string
  icon: LucideIcon
  image: ImageSource
  to: string
}

/** A heading on an application's Products & solutions tab and the products and services under it. */
export type ProductGroup = {
  id: string
  title: string
  productIds?: string[]
  serviceIds?: string[]
}

/**
 * A node in the application finder tree. The root ("Applications") has `parentId: null`,
 * nodes with children are categories and nodes without children are applications.
 */
export type Application = {
  /** Unique across the tree. */
  id: string
  /** This node's URL segment: /applications/<parent slug>/<slug>. */
  slug: string
  name: string
  parentId: string | null
  /** One sentence, for cards, tiles and the hero. */
  summary: string
  heroImage: ImageSource
  cardImage: ImageSource
  /** Ids of child applications, in display order. */
  children: string[]
  /** Explore tab: lead paragraph plus text behind "Show more". */
  intro?: ExploreIntro
  /** Ids from data/knowledge.ts. */
  knowledgeItemIds?: string[]
  helpCards?: HelpCard[]
  /** Products & solutions tab, in display order. */
  productGroups?: ProductGroup[]
}

/** Headline figures in the product header strip, pre-formatted with units. */
export type KeySpecs = {
  liquidTemp: string
  maxFlow: string
  maxHead: string
  maxPressure: string
}

/** Round badge drawn in SVG on a product promo, e.g. a delivery programme seal. */
export type PromoBadge = {
  /** Runs around the ring. */
  ring: string
  /** Big text in the centre, e.g. "2 weeks". */
  value: string
  /** Small text under the value. */
  caption: string
}

/** Band on a product Explore tab: text and a button on the left, a badge on the right. */
export type ProductPromo = {
  title: string
  text: string
  actionLabel: string
  to: string
  badge: PromoBadge
}

/** A product's Explore tab. Only `intro` and `highlights` are required. */
export type ProductExplore = {
  intro: ExploreIntro
  /** Large grey panel: headline and text on the left, product image on the right. */
  feature?: { title: string; text: string; image: ImageSource }
  /** Columns under the feature panel. */
  highlights: IconItem[]
  promo?: ProductPromo
  /** Ids of "Customer story" items in data/knowledge.ts. */
  storyIds?: string[]
}

export type ProductTabsContent = {
  explore: ProductExplore
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
  /** One line under "Suitable for", e.g. the standards the pump is built to. */
  standard?: string
  /** Pumps only. Sensors, controllers and software have none. */
  keySpecs?: KeySpecs
  /** Where "View" in product lists goes, when not the product page, e.g. "/connect". */
  viewTo?: string
  /** First image is the main product shot. */
  images: ImageSource[]
  tabs: ProductTabsContent
  /** Ids from data/services.ts, for the Services tab. */
  serviceIds: string[]
}

export type CasingMaterial = 'Grey cast iron' | 'Ductile iron' | 'Duplex stainless steel'
export type ShaftSeal = 'Packing' | 'Single mechanical seal' | 'Double mechanical seal'

/** How fast a model ships. Shown with the price, to signed-in users only. */
export type ModelAvailability = 'In stock' | 'Fast delivery' | 'Made to order'

/** One size/variant of a product, as listed on the Models tab. */
export type ProductModel = {
  id: string
  productId: string
  /** e.g. "AHLSTAR 100-80-250". */
  name: string
  /** Sulzer article number, shown as "Product no.". */
  productNumber: string
  frequency: 50 | 60
  /** Rated (best-efficiency) flow, m³/h. */
  flow: number
  /** Rated head at that flow, m. */
  head: number
  /** Rated motor power P2, kW. */
  power: number
  /** Nominal speed, rpm. */
  speed: number
  /** Impeller diameter, mm. */
  impeller: number
  /** Nominal connection sizes, DN. Submersible pumps have no suction flange. */
  connection: { suction?: number; discharge: number }
  casingMaterial: CasingMaterial
  shaftSeal: ShaftSeal
  /** Max. operating pressure, bar. */
  maxPressure: number
  /** Efficiency at the rated point, %. */
  efficiency: number
  /** Pump with motor (and base frame, where there is one), kg. */
  weight: number
  /** List price in `market.currency`, excl. VAT. Signed-in users only. */
  listPrice: number
  availability: ModelAvailability
  /** e.g. "2 weeks". Signed-in users only. */
  leadTime: string
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
  | 'Quick guide'
  | 'Brochure'
  | 'Performance curves'
  | 'Spare parts list'
  | 'Declaration of conformity'
  | 'Certificate'
  | 'Service video'

export type Document = {
  id: string
  title: string
  type: DocumentType
  /** Sulzer document number. */
  number: string
  productIds: string[]
  /** Languages it is available in. The first is the one listed. */
  languages: string[]
  /** "PDF", or "MP4" for videos. */
  format: string
  size: string
  /** ISO date, e.g. "2026-03-12". */
  date: string
  /** Shown as "Rev. C". */
  revision?: string
  /** The file behind the download button; null while there is no file in public/docs. */
  href: string | null
  /** A page from the document, shown in the preview dialog while there is no file. */
  preview?: ImageSource
  /** Service videos only. */
  video?: { duration: string; thumbnail: ImageSource }
}

export type CadKind = 'BIM object' | '3D model' | '2D drawing'
export type CadFormat = 'Revit' | 'IFC' | 'STEP' | 'DWG' | 'DXF' | 'PDF'

/** A downloadable BIM or CAD file for one model, on the product BIM tab. */
export type CadFile = {
  id: string
  productId: string
  modelId: string
  kind: CadKind
  format: CadFormat
  /** e.g. "Revit 2024", "IFC 4", "AP242". */
  version: string
  /** BIM objects only, e.g. "LOD 300". */
  lod?: string
  /** e.g. "AHLSTAR_100-80-250_50Hz.rfa". */
  fileName: string
  size: string
  date: string
}

export type SearchKind = 'product' | 'model' | 'document' | 'service' | 'application'

/** One search hit. Carries the matched object, so each kind renders with its usual component. */
export type SearchResult = { score: number } & (
  | { kind: 'product'; product: Product }
  | { kind: 'model'; model: ProductModel; product: Product }
  | { kind: 'document'; document: Document }
  | { kind: 'service'; service: Service }
  | { kind: 'application'; application: Application }
)

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
