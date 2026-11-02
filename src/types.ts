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

/** A recommended service interval, in years of operation. */
export type ServiceInterval = 2 | 5

/** One line of a variant's bill of material. */
export type SparePart = {
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
  | 'Service video'
  | 'Dimensional drawing'
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

export type ProjectStatus = 'Draft' | 'In progress' | 'Quoted'

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

export type ProjectMember = {
  name: string
  role: string
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
  client: { company: string; contact: string; site: string; email: string }
  items: ProjectItem[]
  sizings: SizingRecord[]
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
