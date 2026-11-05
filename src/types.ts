import type { LucideIcon } from 'lucide-react'

/** A customer (asset owner), a Sulzer channel partner or a consultant. */
export type PersonaKind = 'customer' | 'partner' | 'consultant'

/** A demo persona. The ids are the keys of `personas` in config/demo.ts. */
export type User = {
  kind: PersonaKind
  /** Shift+D panel: "Sign in as <label>". */
  label: string
  firstName: string
  name: string
  initials: string
  company: string
  role: string
  email: string
  /** Customers only: their account in data/assets.ts. */
  customerId?: string
  /** Partners only. */
  partner?: { type: string; region: string }
}

/** Who the presenter signs in as: the end user (maintenance), the consultant or the channel partner. */
export type PersonaId = 'endUser' | 'consultant' | 'channelPartner'

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

/** A route that is not part of the demo: renders the live demo notice inside the site layout. */
export type PlaceholderRoute = {
  path: string
  title: string
  description: string
  /** Path of the parent page, used to build the breadcrumb trail. */
  parent?: string
  /** Photo on the notice card. Defaults to the Sulzer brand image. */
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
  /** The asset list, filtered to what the stat counts. */
  to: string
}

/** Wide My Pages card with three headline stats: "My assets", or the partner's "My customers". */
export type StatsCardData = {
  title: string
  subtitle: string
  icon: LucideIcon
  /** Small yellow pill after the title, e.g. "New". */
  badge?: string
  stats: AssetStat[]
  /** Small line with a green dot, e.g. where the numbers come from. */
  source: string
  link: NavItem
}

/** A row in the My Pages "Recent activity" list. */
export type ActivityItem = {
  /** Bold lead-in, e.g. the document or project name. */
  subject: string
  text: string
  time: string
  to: string
  icon: LucideIcon
  /** Amber icon, for alerts. */
  tone?: 'warning'
  /** Shown only to this persona, e.g. a link to one of their projects. */
  persona?: PersonaId
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

/** Photo band that opens an Explore tab in place of the grey intro band, with live-looking readouts on the photo. */
export type ExploreHero = {
  image: ImageSource
  readouts?: AssetReadout[]
}

/** A step in an Explore tab's "How it works" diagram. */
export type ExploreStep = {
  label: string
  text: string
  icon: LucideIcon
}

/** A headline figure, e.g. value "50 %" with label "less unplanned downtime". */
export type BenefitStat = {
  value: string
  label: string
  text?: string
}

/** Navy band with text and checkmarks on the left and a large image on the right. */
export type ExploreShowcase = {
  eyebrow: string
  title: string
  text: string
  points: string[]
  image: ImageSource
  action: NavItem
}

/** One customer story, told with a quote and its results. */
export type FeaturedStory = {
  /** A "Customer story" item in data/knowledge.ts: its photo, headline and link. */
  storyId: string
  quote: string
  author: string
  role: string
  figures: BenefitStat[]
}

/** Closing band with a headline and buttons. The first action is the primary button. */
export type CtaBandContent = {
  title: string
  text: string
  actions: NavItem[]
}

/**
 * A product's Explore tab. Only `intro` is required; each other section shows
 * when it is set, in this order: hero (or the grey intro band), how it works,
 * feature panel and highlights, benefits, showcase, promo, stories, CTA.
 */
export type ProductExplore = {
  intro: ExploreIntro
  hero?: ExploreHero
  howItWorks?: { title: string; text: string; steps: ExploreStep[] }
  /** Large grey panel: headline and text on the left, product image on the right. */
  feature?: { title: string; text: string; image: ImageSource }
  /** Columns under the feature panel. */
  highlights?: IconItem[]
  benefits?: { title: string; text: string; stats: BenefitStat[] }
  showcase?: ExploreShowcase
  promo?: ProductPromo
  /** Ids of "Customer story" items in data/knowledge.ts, shown as a row of cards. */
  storyIds?: string[]
  /** One story told in full, with a quote. */
  story?: FeaturedStory
  cta?: CtaBandContent
}

/** A package on a digital product's Variants tab. Each package includes everything in the ones before it. */
export type ProductPackage = {
  id: string
  name: string
  /** One line under the name. */
  tagline: string
  /** Who it is for. */
  audience: string
  /** What this package adds to the one before it. */
  features: string[]
  /** Small badge, e.g. "Most popular". Also makes it the featured card. */
  badge?: string
}

export type ProductVariants = {
  title: string
  text: string
  packages: ProductPackage[]
}

export type ProductTabsContent = {
  explore: ProductExplore
  /** Digital products: the Variants tab. */
  variants?: ProductVariants
  /** Digital products: ids from data/knowledge.ts for the Learn tab. */
  learnIds?: string[]
}

/**
 * Which tabs a product page has: pumps get Explore / Models / Documentation /
 * BIM / Spare parts / Services, digital products Explore / Variants /
 * Documentation / Learn. The tabs themselves are in data/catalogPages.ts.
 */
export type ProductTabSet = 'pump' | 'digital'

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
  tabSet: ProductTabSet
  /** Where "View" in product lists goes, when not the product page. No product sets it now. */
  viewTo?: string
  /** The header button, in place of "Size product", e.g. "Open Sulzer Connect". */
  action?: NavItem
  /** First image is the main product shot. */
  images: ImageSource[]
  tabs: ProductTabsContent
  /** Ids from data/services.ts, for the Services tab. */
  serviceIds: string[]
}

export type CasingMaterial =
  'Grey cast iron' | 'Ductile iron' | 'Duplex stainless steel' | 'Aluminium alloy'
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
  /** Where it isn't the casing material, e.g. "High-chrome iron" on dewatering pumps. */
  impellerMaterial?: string
  /** Largest solid that passes the strainer, mm. Dewatering pumps. */
  solidsSize?: number
  /** Max. submergence depth, m. Submersible pumps. */
  maxSubmergence?: number
  /** List price in `market.currency`, excl. VAT. Signed-in users only. */
  listPrice: number
  availability: ModelAvailability
  /** e.g. "2 weeks". Signed-in users only. */
  leadTime: string
  /** No longer built: the year production ended and the model that replaces it. Parts stay available. */
  discontinued?: { year: number; successorId: string }
}

/** Stock situation of an orderable article: a pump variant, a spare part or a service kit. */
export type StockStatus = 'in-stock' | 'lead-time' | 'made-to-order' | 'discontinued'

export type Availability = {
  status: StockStatus
  /** As shown, e.g. "In stock – ships in 2 days" or "2–3 weeks". */
  leadTime: string
  /** Working days to dispatch, for delivery dates. */
  leadTimeDays: number
}

/** One configured, orderable article of a product: motor, voltage, cable and approvals fixed. */
export type ProductVariant = {
  /** The product number. Also the URL slug: /products/<productId>/<id>. */
  id: string
  productId: string
  /** ProductModel id, e.g. "xfp-150-e". */
  modelId: string
  /** Long model code, e.g. "XFP 150E CB1.6 PE220/4-D01 *10-ST". */
  code: string
  productNumber: string
  /** Category badge above the code. */
  category: string
  frequency: 50 | 60
  phase: 1 | 3
  /** Rated motor power P2, kW. */
  power: number
  /** Rated speed, rpm. */
  speed: number
  voltage: string
  ipClass: string
  housingMaterial: string
  impeller: { type: string; material: string; diameter: number }
  /** Nominal connection sizes, DN. */
  connection: { inlet: number; outlet: number }
  /** Max. ambient (liquid) temperature, °C. */
  maxAmbientTemp: number
  exApproved: boolean
  /** m. */
  cableLength: number
  /** kg. */
  weight: number
  /** In `market.currency`, excl. VAT. Signed-in users only. */
  listPrice: number
  availability: Availability
  /** Ids of the applications it suits (links to the application pages). */
  applicationIds: string[]
  /** No longer sold; `successorId` is the variant that replaces it. */
  discontinued?: { year: number; successorId: string }
}

export type FitNoteKind = 'ok' | 'warning' | 'info'

/** What it takes to replace a discontinued variant with its successor, beyond the spec comparison. */
export type ReplacementInfo = {
  /** Needed to fit the successor in the old installation, offered with it. */
  adapterKit?: {
    partNumber: string
    name: string
    listPrice: number
    availability: Availability
  }
  notes: { kind: FitNoteKind; text: string }[]
}

/**
 * One orderable size or configuration in the product search results: a
 * configured variant (XFP) or a model (AHLSTAR), in the same shape so they
 * list, filter, sort and chart alike.
 */
export type ResultArticle = {
  /** Variant or model id. */
  id: string
  kind: 'variant' | 'model'
  productId: string
  /** Full model code, e.g. "XFP 150E CB1.6 PE220/4-D01 *10-ST" or "AHLSTAR 100-80-250". */
  code: string
  productNumber: string
  /** Category badge. */
  category: string
  /** The ProductModel it is (or is built on), for CAD and drawings. */
  modelId: string
  /** e.g. "3×400 V, 50 Hz", in the curve legend. */
  supply: string
  applicationIds: string[]
  frequency: 50 | 60
  phase: 1 | 3
  /** P2, kW. */
  power: number
  /** rpm. */
  speed: number
  housing: string
  /** DN. */
  inlet: number
  outlet: number
  /** End of the curve, m³/h. */
  maxFlow: number
  /** Shut-off head, m. */
  maxHead: number
  exApproved: boolean
  impellerType: string
  impellerDiameter: number
  ipClass: string
  listPrice: number
  availability: Availability
  discontinued?: { year: number; successorId: string }
  /** Where the code links: the configured product page, or the model on the Models tab. */
  to: string
  /** Performance curve for "Show curve", running at its rated point. */
  curve: CurveSeries
  /** Speed / curve reference speed, for NPSH. */
  speedRatio: number
  rated: OperatingPoint
}

/** What a tender text says about a pump: built from a sized pump, a variant or a model. */
export type TenderSubject = {
  productId: string
  kind: 'end-suction' | 'submersible'
  /** Full model name or code. */
  model: string
  productNumber: string | null
  quantity: number
  /** In a project: position number and the customer's tag. */
  position?: { number: number; tag: string }
  /** Application name, e.g. "Surface water intake". */
  application?: string
  /** The duty point it was sized for, if any. */
  duty?: { flow: number; head: number; liquid: string; temperature: number }
  /** Where it runs: the operating point (sized) or the rated point. */
  hydraulic: {
    flow: number
    head: number
    efficiency: number
    npshr?: number
    speed: number
    impeller: number
  }
  materials: { casing: string; impeller: string; shaft: string; wearParts: string }
  /** "SD" / "DD" (sized), the model's shaft seal, or "submersible". */
  seal:
    'SD' | 'DD' | 'Packing' | 'Single mechanical seal' | 'Double mechanical seal' | 'submersible'
  motor: {
    power: number
    voltage: string
    frequency: 50 | 60
    poles: number
    efficiencyClass: string
    enclosure: string
  }
  connections: { suction?: number; discharge: number }
  exApproved?: boolean
  /** m, submersibles. */
  cableLength?: number
}

export type TenderLanguage = 'en' | 'sv' | 'de'

export type TenderOptions = {
  language: TenderLanguage
  detail: 'short' | 'full'
  includeDuty: boolean
  orEqual: boolean
}

export type TenderSection = {
  title: string
  paragraphs: string[]
  /** Label–value lines, e.g. ["Flow rate", "220 m³/h"]. */
  rows?: [string, string][]
  /** Bulleted items. */
  items?: string[]
}

/** One product's text; in a project document, headed by its position. */
export type TenderPart = { heading?: string; sections: TenderSection[] }

export type TenderDocument = { title: string; subtitle?: string; parts: TenderPart[] }

/** A recommended service interval, in years of operation. */
export type ServiceInterval = 2 | 5

/** One line of a variant's bill of material. */
export type SparePart = {
  /** Same as the part number. */
  id: string
  /** Position number on the exploded drawing, e.g. "501". */
  position: string
  name: string
  partNumber: string
  /** Quantity in the pump. */
  quantity: number
  /** PartGroup id. */
  groupId: string
  material: string
  /** Each, in `market.currency`, excl. VAT. */
  listPrice: number
  /** Each, after the customer's discount. */
  netPrice: number
  availability: Availability
  /** First recommended replacement, if it is a service part. */
  recommendedAfter?: ServiceInterval
  /** Id of the part on the exploded drawing. */
  hotspot: string
}

/** An assembly in the spare parts tree, e.g. "Shaft seal". */
export type PartGroup = { id: string; name: string }

/** Parts sold together: recommended service parts for an interval, or a named kit ("Kit, impeller"). */
export type ServiceKit = {
  id: string
  name: string
  /** Set for the recommended service parts of an interval; named kits have none. */
  years?: ServiceInterval
  partNumber: string
  items: { partId: string; quantity: number }[]
  listPrice: number
  netPrice: number
  availability: Availability
}

/** A production version of the pump. Parts listed in `changes` differ from the current BOM. */
export type ProductVersion = {
  id: string
  label: string
  /** Production code (year and week, YYWW) range, as on the rating plate. */
  productionCode: { from?: string; until?: string }
  changes: Record<
    string,
    Pick<SparePart, 'name' | 'partNumber' | 'material' | 'listPrice' | 'netPrice' | 'availability'>
  >
}

/**
 * A primitive of the exploded drawing, in drawing units. Paths use absolute
 * M, L, C and Z commands only, so their points give their bounds.
 */
export type DrawingShape =
  /** A vertical cylinder seen slightly from above: top ellipse, sides, bottom arc. */
  | { kind: 'cylinder'; cx: number; y: number; w: number; h: number; ry: number }
  /** A horizontal cylinder seen slightly from the left: left end ellipse, sides, right arc. */
  | { kind: 'hcylinder'; x: number; cy: number; l: number; d: number; rx: number }
  /** An O-ring, gasket or washer seen from the side. */
  | { kind: 'ring'; cx: number; cy: number; rx: number; ry: number; t: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { kind: 'rect'; x: number; y: number; w: number; h: number }
  /** A screw standing upright: hexagon head, shank and thread lines. */
  | { kind: 'bolt'; cx: number; y: number; length: number; d: number }
  /** A cable or wire: a path drawn as a tube `w` wide. */
  | { kind: 'tube'; d: string; w: number }
  /** A front edge line around a cylinder at height `y`, e.g. a flange or band. */
  | { kind: 'band'; cx: number; y: number; w: number; ry: number }
  /** The same around a horizontal cylinder at `x`. */
  | { kind: 'hband'; x: number; cy: number; d: number; rx: number }
  /** Any outline; `open` paths are detail lines without fill. */
  | { kind: 'path'; d: string; open?: boolean }

/** One clickable part on the drawing, with its position-number callout. */
export type DrawingHotspot = {
  /** Matches `SparePart.hotspot`. */
  id: string
  shapes: DrawingShape[]
  /** Leader line from a point on the part to the position-number circle. */
  callout: { from: [number, number]; to: [number, number] }
}

export type ExplodedDrawing = {
  id: string
  /** Drawing number, e.g. "TD-XFP150E-01". */
  number: string
  title: string
  width: number
  height: number
  /** Radius of the position-number circles, in drawing units (default 14). */
  calloutRadius?: number
  /** Centre lines (dash-dot), one per column (or row) of the explosion. */
  axes: { x1: number; y1: number; x2: number; y2: number }[]
  /** In drawing order: later parts are drawn over earlier ones. */
  hotspots: DrawingHotspot[]
}

export type CartItemKind = 'part' | 'kit' | 'product'

/** A line in the cart. Price and lead time are copied when added, like a real basket. */
export type CartItem = {
  /** `${kind}:${refId}`; adding the same article again raises the quantity. */
  id: string
  kind: CartItemKind
  /** Part id, kit id or variant id. */
  refId: string
  partNumber: string
  name: string
  /** Position on the exploded drawing (parts only). */
  position?: string
  /** The variant or model it belongs to (the variant itself for kind "product"). */
  variantId: string
  /** Exploded drawing and hotspot, for the part thumbnail. */
  drawing?: { id: string; hotspot: string }
  quantity: number
  /** Each, in `market.currency`, excl. VAT. */
  unitPrice: number
  /** Partners: the list price before their discount (`unitPrice` is their net price). */
  listPrice?: number
  availability: Availability
}

export type DeliveryOption = 'partial' | 'complete'

export type Order = {
  /** "SO-104390". */
  id: string
  placedBy: string
  company: string
  lines: CartItem[]
  reference: string
  deliveryAddressId: string
  /** When the address is not one of `eshop.deliveryAddresses`, e.g. a partner's customer's. */
  deliveryAddress?: { name: string; lines: string[] }
  /** Partners: the customer the order is on behalf of. */
  customer?: { id: string; name: string }
  delivery: DeliveryOption
  subtotal: number
  freight: number
  vat: number
  total: number
  /** ISO dates. */
  earliestDelivery: string
  latestDelivery: string
}

/** A cart saved as a quotation request. */
export type Quotation = { id: string; reference: string; lines: CartItem[]; total: number }

/**
 * Who a parts list belongs to: a configured variant (XFP, on its own page) or
 * a model (AHLSTAR, on the product page's Spare parts tab).
 */
export type PartOwner = { id: string; productId: string; name: string; kind: 'variant' | 'model' }

/** Spare parts of variants or models: groups, BOM, service kits and production versions. */
export type SparePartCatalogue = {
  id: string
  productId: string
  /** Variant ids (XFP) or model ids (AHLSTAR) this parts list is for. */
  forIds: string[]
  /** Exploded drawing the hotspots belong to. */
  drawingId: string
  groups: PartGroup[]
  /** Current production version. */
  parts: SparePart[]
  kits: ServiceKit[]
  /** The "Recommended spare parts" cards on the product page, in order. */
  featured: { kind: 'part' | 'kit'; id: string }[]
  /** Newest first; the first is the one `parts` describes. */
  versions: ProductVersion[]
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
  | 'Data privacy sheet'
  | 'Service video'
  | 'Dimensional drawing'
  | 'Sectional drawing'
  | 'Exploded view'
  | 'Wiring diagram'

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

export type SearchKind =
  'product' | 'variant' | 'model' | 'part' | 'document' | 'service' | 'knowledge' | 'application'

/** What a search field searches in (its scope dropdown). */
export type SearchScope = 'products' | 'parts' | 'documents'

/** A spare part with the variant or model whose parts list it is on. */
export type PartHit = { part: SparePart; owner: PartOwner }

/** One search hit. Carries the matched object, so each kind renders with its usual component. */
export type SearchResult = { score: number } & (
  | { kind: 'product'; product: Product }
  | { kind: 'variant'; variant: ProductVariant; product: Product }
  | { kind: 'model'; model: ProductModel; product: Product }
  | ({ kind: 'part' } & PartHit)
  | { kind: 'document'; document: Document }
  | { kind: 'service'; service: Service }
  | { kind: 'knowledge'; item: KnowledgeItem }
  | { kind: 'application'; application: Application }
)

/** Project lifecycle, in order. Ordered and Archived projects are no longer active. */
export type ProjectStatus = 'Concept design' | 'Detailed design' | 'Tender' | 'Ordered' | 'Archived'

/** Where a product in a project stands. */
export type ProjectItemStatus = 'Proposed' | 'For review' | 'Approved' | 'Quoted' | 'Ordered'

/** A sized pump in a project. Rebuilt from its variant id and duty point, so curves and prices stay in step. */
export type ProjectItem = {
  id: string
  /** 10, 20, 30 … like an order position. */
  position: number
  /** The customer's own tag, e.g. "RW-01". Editable. */
  customerPosition: string
  variantId: string
  dutyPoint: DutyPoint
  quantity: number
  /** The sizing record this product came from, if any. */
  sizingId?: string
  /** Saved from a comparison: "A", "B" or "C". */
  alternative?: string
  /** The alternative chosen in the comparison. */
  preferred?: boolean
  /** Alternatives saved from one comparison share this id. */
  alternativeGroup?: string
  /** Missing on older items: shown as "Proposed". */
  status?: ProjectItemStatus
}

/** A whole sizing saved in a project: its input, filters and chosen products. */
export type SizingRecord = {
  /** "<project id>-s<n>". */
  id: string
  name: string
  /** Pre-formatted, e.g. "Today". */
  created: string
  createdBy: string
  /** Every sizing param (form rows, units, optional parameters, result filters) as URL entries. */
  params: [string, string][]
  dutyPoint: DutyPoint
  productId: string
  applicationId?: string
  variantIds: string[]
  /** "Number of hits" when it was saved. */
  hits: number
  /** Adds performance curves and data sheets to the project documents. */
  includeCurves: boolean
  note?: string
}

export type ProjectAccess = 'owner' | 'editor' | 'viewer'

export type ProjectMember = {
  id: string
  name: string
  initials: string
  email: string
  company: string
  role: string
  access: ProjectAccess
  status: 'active' | 'invited'
}

/** A comment in the project discussion. Mentions are written as @[member id]. */
export type ProjectComment = {
  id: string
  /** ProjectMember id. */
  authorId: string
  /** Display label, e.g. "Yesterday, 14:20" or "Just now". */
  at: string
  text: string
  /** The product item the comment is about, if any. */
  itemId?: string
  /** One reply level. */
  parentId?: string
  resolved?: boolean
}

export type ProjectActivityKind =
  | 'created'
  | 'sizing'
  | 'items'
  | 'status'
  | 'member'
  | 'comment'
  | 'tender'
  | 'cad'
  | 'upload'
  | 'report'
  | 'details'
  | 'renamed'
  | 'alternative'
  | 'itemStatus'
  | 'access'
  | 'share'

/** One entry in the project's activity log, newest first. */
export type ProjectActivity = {
  id: string
  kind: ProjectActivityKind
  /** ProjectMember id. */
  actorId: string
  at: string
  /** Values for the entry's sentence, e.g. { status: 'Tender' } or { file: 'P&ID rev B.pdf' }. */
  detail: Record<string, string>
}

export type ProjectDocumentKind =
  'datasheet' | 'curves' | 'tender' | 'cad' | 'bim' | 'report' | 'package' | 'upload'

/** A file in the project. Uploads are metadata only: nothing is read or stored. */
export type ProjectDocument = {
  id: string
  kind: ProjectDocumentKind
  /** File name, e.g. "P&ID rev B.pdf". */
  title: string
  /** PDF, DWG, DOCX, ZIP … */
  format: string
  size: string
  /** ProjectMember id. */
  addedBy: string
  at: string
  itemId?: string
}

/** Who a project is shared with. */
export type ProjectShare = {
  access: 'project' | 'specific'
  /** With "specific": the member ids. */
  memberIds: string[]
  /** A read-only link for the client contact. */
  clientReadOnly: boolean
}

export type ProjectClient = {
  company: string
  contact: string
  /** Postal address, one line. */
  address?: string
  /** Site or location of the installation. */
  site: string
  email: string
}

export type Project = {
  id: string
  /** Shown as "Ref no.", e.g. "P-2026-0318". */
  refNo: string
  /** Shown as "Project ID", e.g. "396088". */
  projectNumber: string
  name: string
  applicationId?: string
  status: ProjectStatus
  /** Pre-formatted dates, e.g. "14 Oct 2026" or "Just now". */
  created: string
  createdBy: string
  lastModified: string
  lastModifiedBy: string
  /** Higher = modified more recently; drives "By date" sorting. */
  modifiedOrder: number
  deadline?: string
  members: ProjectMember[]
  /**
   * The customer account it is for (data/assets.ts `customers`), when a partner runs
   * it for a customer. "Share with customer" adds the client contact as a member.
   */
  clientAccount?: string
  client: ProjectClient
  description?: string
  /** The engineering firm the project is run by, e.g. the consultant's. */
  consultantFirm?: string
  /** EUR. */
  budget?: number
  /** Key requirements: duty points, standards, site conditions. */
  requirements?: string[]
  share?: ProjectShare
  items: ProjectItem[]
  sizings: SizingRecord[]
  comments: ProjectComment[]
  activity: ProjectActivity[]
  documents: ProjectDocument[]
}

export type AssetStatus = 'ok' | 'warning' | 'alarm'

/** An asset owner. The channel partner sees several. */
export type Customer = {
  id: string
  name: string
  /** Sulzer customer number, shown as "Customer no.". */
  customerNumber: string
  city: string
  industry: string
  contact: { name: string; role: string; email: string }
}

/** A contact person, e.g. at a customer. */
export type Contact = { name: string; role: string; email: string; phone: string }

/** A delivery address on an account. `lines` are printed as they are. */
export type DeliveryAddress = { id: string; label: string; lines: string[] }

/** How a customer's wordmark is drawn (components/CustomerLogo.tsx). Made for the demo. */
export type CustomerLogoSpec = {
  mark: 'wave' | 'sheets' | 'leaf' | 'flame'
  /** Mark and first line. */
  color: string
  /** Second line. */
  accent: string
  name: string
  tagline: string
}

/** The channel partner's side of a customer account (data/partner.ts). */
export type PartnerAccount = {
  customerId: string
  /** The partner's own salesperson for this customer. */
  accountManager: string
  customerSince: number
  /** % off list on the partner's quotations to this customer. */
  quotationDiscount: number
  /** The first is the main contact (the customer's `contact`). */
  contacts: Contact[]
  deliveryAddresses: DeliveryAddress[]
  logo: CustomerLogoSpec
}

export type Site = {
  id: string
  customerId: string
  name: string
  city: string
  /** e.g. "Raw water intake". */
  type: string
  /** `alt` also describes what the photo should show (see docs/images-needed.md). */
  image: ImageSource
}

/** One installed unit. Dates are ISO, e.g. "2026-11-12". */
export type Asset = {
  /** The tag in lower case, also the URL slug: /assets/<id>. */
  id: string
  /** The customer's own tag, e.g. "RW-02". */
  tag: string
  /** e.g. "Raw water pump RW-02". */
  name: string
  customerId: string
  siteId: string
  productId: string
  /** From data/productModels.ts. Products without a Models tab have none. */
  modelId?: string
  serialNumber: string
  installedOn: string
  warrantyUntil: string
  runHours: number
  lastService: string
  nextServiceDue: string
  /** Streams condition data to Sulzer Connect (lib/conditionData.ts). */
  connected: boolean
  /** From the latest condition reading. Assets that aren't connected are 'ok'. */
  status: AssetStatus
}

/**
 * One hourly condition sample. `time` is a wall-clock time stored as Date.UTC
 * milliseconds, so format it with `timeZone: 'UTC'` to get the same clock on every machine.
 */
export type ConditionPoint = {
  time: number
  /** Bearing vibration velocity, mm/s RMS. */
  vibration: number
  /** °C. */
  bearingTemperature: number
  /** Motor winding temperature, °C. */
  motorTemperature: number
  running: boolean
}

export type ConditionChannel = 'vibration' | 'bearingTemperature' | 'motorTemperature'

/** What Sulzer Connect concludes from an asset's alert, and what to do about it. */
export type ConditionFinding = {
  /** The channel that raised the alert. */
  channel: ConditionChannel
  /** e.g. "Bearing wear pattern detected". */
  title: string
  /** e.g. "Inspect within 14 days". */
  action: string
  /** What Sulzer Connect saw, in one or two sentences. */
  detail: string
  /** The spare part that fixes it, from data/spareParts.ts, and the button that orders it. */
  partId?: string
  partAction?: string
}

export type ServiceKind = 'Service' | 'Repair' | 'Inspection' | 'Upgrade' | 'Commissioning'

/** One visit in an asset's service history. */
export type ServiceHistoryEntry = {
  id: string
  /** ISO date. */
  date: string
  kind: ServiceKind
  title: string
  text: string
  technician: string
  /** Work order number, e.g. "WO-260317-RW02". */
  reference: string
}

/* ── Self-service: requests, orders and quotations (Phase 3, P4) ───────────── */

/** A wall-clock date and time without a time zone, e.g. "2026-10-28T09:26". */
export type DateTime = string

export type ServiceRequestStatus = 'Received' | 'Planned' | 'Technician assigned' | 'Done'

/** A service request on one asset. Persona-agnostic: whoever sent it is `requestedBy`. */
export type ServiceRequest = {
  /** e.g. "SR-2026-0142". */
  id: string
  customerId: string
  assetId: string
  /** The service type picked in the form, e.g. "Inspection". */
  service: string
  message: string
  /** ISO date the customer asked for, if any. */
  preferredDate?: string
  requestedBy: string
  /** Raised from a condition alert (Sulzer Connect), not routine. */
  fromAlert: boolean
  status: ServiceRequestStatus
  /** When each step was reached. Steps not reached yet are missing. */
  steps: Partial<Record<ServiceRequestStatus, DateTime>>
  serviceCenter: string
  /** ISO date of the planned visit, once planned. */
  visitDate?: string
  technician?: string
  /** Work order number, once done. Matches the asset's service history. */
  workOrder?: string
}

export type OrderStatus = 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered'

/** Direct orders are the customer's own; partner orders are a channel partner's, for a customer. */
export type OrderChannel = 'direct' | 'partner'

export type OrderLine = {
  position: number
  partNumber: string
  description: string
  quantity: number
  /** List price per unit in `market.currency`, excl. VAT. */
  listPrice: number
  /** The asset the part is for, if any (its id). */
  assetId?: string
}

/** One track & trace event. `status` marks the event that reached an order step. */
export type TrackingEvent = {
  at: DateTime
  text: string
  location: string
  status?: OrderStatus
}

/**
 * A Sulzer order with track & trace. The seeds are in data/orders.ts; checkout adds
 * new ones through the self-service context (`addOrder`).
 */
export type SalesOrder = {
  /** e.g. "SO-104382". */
  id: string
  customerId: string
  channel: OrderChannel
  placedAt: DateTime
  placedBy: string
  /** The buyer's purchase order number. */
  poNumber: string
  /** The quotation the order came from, if any. */
  quotationId?: string
  status: OrderStatus
  /** ISO date. The delivery date once delivered. */
  expectedDelivery: string
  deliveryAddress: string[]
  deliveryMethod: string
  /** Once shipped. */
  shipment?: { carrier: string; trackingNumber: string; packages: number; weight: string }
  /** Oldest first. */
  events: TrackingEvent[]
  /** % off list on every line: the partner discount, or 0. */
  discount: number
  shippingCost: number
  lines: OrderLine[]
}

/** Draft: a partner's quotation, created from a project and not sent yet. */
export type QuotationStatus = 'Draft' | 'Requested' | 'Sent' | 'Accepted' | 'Expired'

/** Who a quotation is from: Sulzer (to an end user), or the signed-in channel partner (to their customer). */
export type QuotationIssuer = 'sulzer' | 'partner'

export type QuotationLine = {
  position: number
  /** Product or part number. Services have none. */
  number?: string
  description: string
  /** Second line, e.g. the duty point or what the work covers. */
  detail?: string
  quantity: number
  unit: 'pcs' | 'h' | 'lot'
  /** Per unit in `market.currency`, excl. VAT. */
  listPrice: number
  /** Sulzer products and parts, bought at the partner discount; services are the issuer's own work. */
  kind: 'sulzer' | 'service'
  /** e.g. "Week 49" or "3 weeks". */
  delivery: string
}

export type SalesQuotation = {
  /** e.g. "Q-10234". */
  id: string
  issuer: QuotationIssuer
  customerId: string
  title: string
  status: QuotationStatus
  requestedAt: DateTime
  /** ISO dates, once sent. */
  issuedOn?: string
  validUntil?: string
  /** While requested: when the issuer expects to send it (ISO date). */
  expectedBy?: string
  /** The latest change, shown in the list and on My Pages. */
  updated: { at: DateTime; text: string }
  /** The customer's reference, e.g. their project or work order. */
  yourReference: string
  projectId?: string
  /** The order it became, once accepted. */
  orderId?: string
  /** The issuer's contact person for this quotation. */
  contact: { name: string; role: string; email: string; phone: string }
  /** % off list on every line, agreed with the customer. */
  discount: number
  lines: QuotationLine[]
  deliveryTerms: string
  paymentTerms: string
  /** Remarks printed under the lines. */
  notes: string[]
}

/** A tab in a page's sticky tab bar. `id` is also the URL hash. */
export type TabDef = {
  id: string
  label: string
}

/* ── Sizing (Phase 2, module 3) ────────────────────────────────────────────── */

export type LiquidId = 'water' | 'seawater' | 'raw-solids' | 'glycol' | 'light-oil'

/** What the customer asks for. Canonical units: m³/h, m, °C. */
export type DutyPoint = {
  flow: number
  head: number
  liquid: LiquidId
  temperature: number
  frequency: 50 | 60
}

/**
 * A hydraulic's curves at full impeller and the 4-pole reference speed:
 * head H = H0 − k·Q², efficiency η = ηb·(2x − x²) and NPSHr = Nb·(0.5 + 0.5x²),
 * where x = Q / bepFlow.
 */
export type HydraulicCurve = {
  /** H0, m. */
  shutOffHead: number
  /** k, m per (m³/h)². */
  k: number
  /** m³/h. */
  bepFlow: number
  /** %. */
  bepEfficiency: number
  /** NPSHr at the best-efficiency point, m. */
  npshrAtBep: number
}

export type Poles = 2 | 4 | 6

/** C1 cast iron, S2 duplex impeller in stainless housing, D3 super duplex in duplex housing. */
export type MaterialCode = 'C1' | 'S2' | 'D3'
export type SealCode = 'SD' | 'DD'
/** F: flexible coupling without spacer; FS: with spacer. */
export type CouplingCode = 'F' | 'FS'
export type MotorClass = 'IE4'

/** One pump size (casing + impeller pattern) as sizing sees it. */
export type Hydraulic = {
  /** e.g. "ahlstar-a23". */
  id: string
  productId: string
  /** Short hydraulic code in the variant name, e.g. "A23". */
  code: string
  /** Suction DN - discharge DN - nominal impeller, e.g. "150-125-400". */
  size: string
  connection: { suction: number; discharge: number }
  /** Nominal impeller diameter in the name, mm. */
  nominalImpeller: number
  impellerMax: number
  impellerMin: number
  /** At impellerMax and the 4-pole reference speed (1 475 rpm). */
  curve: HydraulicCurve
  /** Rated speeds at 50 Hz per pole count this size is sold with, rpm. */
  speeds: Partial<Record<Poles, number>>
  materials: MaterialCode[]
  couplings: CouplingCode[]
  /** Bare-shaft pump in cast iron with a single seal, EUR. */
  basePrice: number
}

/**
 * A pump unit as the configurator offers it: hydraulic × poles × material ×
 * seal × coupling, with its motor and what it supports. Counted as "hits".
 * Multi-valued attributes list every option the unit supports.
 */
export type PumpConfiguration = {
  /** e.g. "ahlstar-a23-4p-c1-sd-f". */
  id: string
  hydraulicId: string
  productId: string
  /** "AHLSTAR A23 · 150-125-400". */
  productName: string
  /** The part after the size: material, seal, poles, coupling, e.g. "C1-SD-4P-F". */
  code: string
  poles: Poles
  /** Rated speed at 50 Hz, rpm. */
  speed: number
  connection: { suction: number; discharge: number }
  nominalImpeller: number
  material: MaterialCode
  impellerMaterial: string
  housingMaterial: string
  housingGrade: string
  seal: SealCode
  coupling: CouplingCode
  /** Motor fitted to the unit: sized for the full impeller. */
  motorPower: number
  motorEfficiency: number
  motorPrice: number
  motorClass: MotorClass
  motorNumber: string
  motorVoltage: string
  motorEnclosure: string
  mainsVoltages: string[]
  enclosures: string[]
  variableSpeed: string[]
  motorSupply: string[]
  impellerTypes: string[]
  liquids: LiquidId[]
  /** Liquid temperature the unit is rated for, °C. */
  temperature: { min: number; max: number }
  /** Pump without motor, EUR. */
  pumpPrice: number
}

/** A configuration with its impeller trimmed: one orderable pump. */
export type PumpVariant = PumpConfiguration & {
  /** "<configuration id>-t<trim>". */
  id: string
  configurationId: string
  /** e.g. "AHLSTAR A23-150-400/365 C1-SD-4P-F". */
  name: string
  impeller: number
  /** Fixed number for standard variants; null shows "On request". */
  productNumber: string | null
  availability: ModelAvailability
  leadTime: string
}

/** Where a pump curve meets the system curve through the duty point. */
export type OperatingPoint = { flow: number; head: number }

/** One pump curve to draw: the curve, its scaling and where it runs. */
export type CurveSeries = {
  id: string
  name: string
  curve: HydraulicCurve
  scale: number
  /** Impeller / max impeller, for the efficiency curve. */
  trimRatio: number
  operatingPoint: OperatingPoint
}

/** A variant evaluated at a duty point. All money in EUR. */
export type SizingResult = {
  variant: PumpVariant
  /** 1 = lowest life cycle cost. */
  rank: number
  operatingPoint: OperatingPoint
  /** Pump efficiency at the operating point, %. */
  efficiency: number
  /** Shaft power, kW. */
  p2: number
  /** Standard motor rating, kW. */
  motorPower: number
  /** Motor efficiency at rating, %. */
  motorEfficiency: number
  /** Electrical input power, kW. */
  p1: number
  /** m. */
  npshr: number
  /** Operating flow / best-efficiency flow at this trim and speed. */
  bepRatio: number
  /** Pump + motor. */
  purchasePrice: number
  energyCostPerYear: number
  maintenanceCostPerYear: number
  lifeCycleCost: number
}

/** A filter group with its options and counts, as shown in a filter column. */
export type FilterGroup = {
  id: string
  label: string
  options: { value: string; label: string; count: number; selected: boolean }[]
}

/* ── Personal toolbar (Phase 3, P3) ────────────────────────────────────────── */

/** A bookmarked product or document, shown under Saved items. */
export type SavedItem = { kind: 'product' | 'document'; id: string }

export type UnitSystem = 'metric' | 'us'

/** Units & market panel. The market itself is fixed in config/demo.ts. */
export type PersonalPreferences = {
  units: UnitSystem
  /** Mains frequency: the Models tab opens on it. */
  frequency: 50 | 60
}

/** What the personal toolbar remembers for one persona. */
export type PersonalData = {
  saved: SavedItem[]
  /** Product ids, most recent first. */
  recent: string[]
  preferences: PersonalPreferences
}
