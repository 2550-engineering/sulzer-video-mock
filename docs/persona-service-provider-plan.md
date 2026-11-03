# Persona — Service Provider Workshop

Plan only. No code has been written for this persona yet. Verification is `npm run build` and
`npm run lint` only: no tests, screenshots or videos.

## References

| What                    | Reference                                      | Used for                                                                                                                                                            |
| ----------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deck slide (main spec)  | `_reference/deck/service_provider.png`         | The seven steps, customer needs (product information, BOM, drawings, price and lead time, eCommerce), repairs and replacement.                                      |
| Variant result list     | `_reference/service_provider/product_list.png` | Step 2: one card per variant, a two-column spec table, the image on the right, a long filter list on the left.                                                      |
| Configured product page | `_reference/service_provider/products.png`     | Step 3: name, article number, price, stock dot, discount group, lead time in working days, order button, recommended parts strip, tab bar.                          |
| Curves tab              | `_reference/service_provider/curves.png`       | Step 4: performance curves with a settings column on the right.                                                                                                     |
| Spare parts tab         | `_reference/service_provider/spare_parts.png`  | Steps 5–7: tree on the left (Collapse / Expand / Clear, kits with their positions), drawing selector, selected-part strip, exploded drawing with position callouts. |

All four screenshots are Grundfos pages and are used for layout only. We copy no wording,
product codes, position numbers, drawing art or icons. The exploded drawing in particular is
their artwork, so it cannot be traced or reused (see §4).

## What exists

- **Search (module 2):** `lib/search.ts` indexes products, models (name and article number),
  documents, services and applications. A model hit counts as a product hit, so `/products?q=…`
  lists **products**, never individual models or variants. The header `SearchPanel` and the home
  `HeroSearch` share `useSearchSuggest`.
- **XFP data:** `products.ts` has `xfp`. `data/models/xfp.ts` has two sizes (XFP 100C, XFP 150E)
  with rated point, price and lead time. One image: `public/images/products/xfp-main.png`.
- **Product page:** `/products/:id` with tabs Explore, Models, Documentation, BIM, Spare parts
  (a `TabComingSoon`), Services. It uses `useHashTab`, `TabBar`, `TabPanel` and `ProductHeader`.
- **Spare parts:** `src/data/spareParts.ts` holds 5 flat parts (3 AHLSTAR, 2 XFP).
  `SparePartList` is a flat table and is **not used anywhere**. `sparePartsFor()` in
  `lib/catalog.ts` is likewise unused.
- **Curves (module 3):** `PerformanceCurve` (Models tab and Compare) and `SizingCurveChart`
  (H, η, P and NPSH for an AHLSTAR `PumpVariant`). Both are hand-made SVG.
- **Stubs:** `/spare-parts` and `/eshop` are placeholder routes. The "eShop" quick link points
  to `/eshop`.
- **State and shared UI:**
  - `AuthContext`: `signIn`, the demo user; prices are shown only when signed in.
  - `ProjectsContext`: `localStorage` with try/catch; the pattern to copy for the cart.
  - Toast with an action, `Modal`, `Drawer`, `FilterColumn` / `FilterGroup`, `lib/filters.ts`
    (generic faceted filters), `useUrlParams`, `useFileGeneration`, `AvailabilityBadge`,
    `formatPrice`.
- "Reset demo" (Shift+D) already clears all of `localStorage`, so it also empties the cart and
  orders.

## Demo path

Sign in before recording (Shift+D). Prices, lead times and the cart need an account.

| #   | Deck step                     | Route                                                        | What the viewer sees                                                                                                                                                                                                                                                         |
| --- | ----------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Open Product Finder           | `/` (or any page, header search)                             | Presenter types `XFP 150E` (or the start of an article number, `2415`). Suggestions show a new **Variants** group: "XFP 150E · 12 variants" on top, then the first variants by name and article number.                                                                      |
| 2   | Filter selected model         | `/products?q=XFP%20150E&model=xfp-150e`                      | Products tab in **variant mode**: "12 variants of XFP 150E", one card per variant (name, article number, a two-column spec table, image) and a variant filter list on the left. Presenter ticks **Explosion proof: Yes** and **Motor: PE 22/4**; the list drops to 2.        |
| 3   | Select configured product     | `/products/xfp/24150231`                                     | Configured product page: "XFP 150E CB1.4 PE220/4 Ex", article number, "Suitable for", buy box (your price, stock dot, discount group, lead time in working days, quantity, **Add to cart**), a **Recommended service kits** strip.                                           |
| 4   | Overview of information areas | same, tab bar                                                | Tabs: Specifications · Curves · **Spare parts** · Drawings · Documentation · Services. A quick pass over Curves.                                                                                                                                                             |
| 5   | Spare part list               | `/products/xfp/24150231#spare-parts`                         | Parts tree on the left (Service kits, then the assemblies), the drawing selector and the full exploded drawing on the right.                                                                                                                                                 |
| 6   | Click on part list            | same, `?part=420`                                            | Presenter expands "Shaft seal kit" and clicks **420 Mechanical seal, lower**. The part lights up on the drawing, everything else dims and its callout turns solid. The detail strip above the drawing shows name, pos. no., part no., quantity in pump, price and lead time. |
| 7   | Click on drawing              | same, `?part=512`                                            | Presenter hovers the impeller (tooltip "512 · Impeller") and clicks it. The tree opens "Hydraulics", scrolls to **512 Impeller** and highlights it; the strip updates. **Add to cart** → toast "Added to cart" with **View cart**; the header cart badge shows 1.            |
| 8   | eCommerce                     | `/eshop` → `/eshop/checkout` → `/eshop/orders/SO-2026-04719` | Cart with both lines → **Checkout** (delivery address, method, PO number, payment on account, prefilled) → **Place order** (600 ms "Placing order…") → order confirmation with order number, estimated dispatch date and the lines.                                          |

The product numbers, positions and order number above are examples; the final values are set
in the data files and listed in `docs/content-to-confirm.md`.

---

## 1. Types (`src/types.ts`)

### `ProductVariant` (new)

An orderable, fixed article of a product: one model with one set of options. It is not the
module 3 `PumpVariant`, which is a sized AHLSTAR configuration with a trimmed impeller and is
rebuilt from the hydraulics. XFP variants are catalogue articles and are listed, not sized.

```ts
export type VariantSpec = { label: string; value: string }

export type ProductVariant = {
  /** The article number. Also the URL slug: /products/<productId>/<id>. */
  id: string
  productId: string
  /** ProductModel id, e.g. "xfp-150e". */
  modelId: string
  /** e.g. "XFP 150E CB1.4 PE220/4 Ex". */
  name: string
  /** Same as id; kept separate so the URL scheme can change later. */
  productNumber: string
  /** Filterable attributes; keys are the filter ids in §3. */
  attributes: {
    frequency: 50 | 60
    motor: string // "PE 22/4"
    power: number // P2, kW
    poles: 2 | 4 | 6
    voltage: string // "400 V"
    explosionProof: boolean
    impellerMaterial: 'Grey cast iron' | 'Duplex stainless steel'
    motorProtection: 'Thermistor' | 'Thermal switch'
    cableLength: number // m
    installation: 'Wet well, auto-coupling' | 'Dry, vertical'
  }
  /** The two-column spec table on the card and the Specifications tab, in order. */
  specs: VariantSpec[]
  /** Your price excl. VAT, in market.currency, signed-in only. */
  listPrice: number
  stock: StockStatus
  /** Working days from order to dispatch. */
  leadTimeDays: number
  /** Which exploded drawing and which BOM (§2). */
  drawingId: string
}

export type StockStatus = 'in-stock' | 'low-stock' | 'made-to-order' | 'on-request'
```

### `SparePart` (replace)

Part numbers belong to a model, so the same position can have different part numbers on
XFP 100C and 150E. The existing 5 flat parts are dropped. Nothing reads them today.

```ts
export type SparePart = {
  id: string
  partNumber: string
  name: string
  /** Material or grade line, e.g. "SiC/SiC, FKM" or "EN-GJL-250". */
  description?: string
  /** PartGroup id. */
  groupId: string
  listPrice: number
  stock: StockStatus
  leadTimeDays: number
  /** kg, shown in the detail strip and used for freight. */
  weight: number
}

/** An assembly in the tree: Cable and electrical, Motor, Shaft and bearings, Shaft seal, Hydraulics, Fasteners and O-rings. */
export type PartGroup = { id: string; name: string; order: number }

/** A set of parts sold under one article number, e.g. "Shaft seal kit". */
export type ServiceKit = {
  id: string
  partNumber: string
  name: string
  /** Positions on the drawing that the kit covers; selecting the kit lights them all. */
  positions: string[]
  listPrice: number
  stock: StockStatus
  leadTimeDays: number
  /** Shown in the Recommended service kits strip; kits with `recommended` come first. */
  recommended?: { order: number; reason: string } // reason: "Every 2 years", "Overhaul"
}

/** One line of a variant's bill of material: what sits at a position, and how many. */
export type BomLine = { position: string; partId: string; quantity: number }
```

### `DrawingHotspot` and `ExplodedDrawing` (new)

```ts
/** A drawing primitive in drawing units (the SVG viewBox). See §4. */
export type DrawingShape =
  | { kind: 'cylinder'; x: number; y: number; w: number; h: number } // side view with elliptical caps
  | { kind: 'ring'; x: number; y: number; rx: number; ry: number; t: number } // O-ring, gasket
  | { kind: 'disc'; x: number; y: number; rx: number; ry: number; h: number } // flange, bearing, wear plate
  | { kind: 'bolt'; x: number; y: number; length: number; d: number }
  | { kind: 'path'; d: string } // impeller, volute, cable entry: anything the helpers can't draw

/** One clickable part on the drawing: its shapes and its position-number callout. */
export type DrawingHotspot = {
  /** Position number, e.g. "420" or "157a". Also the key into the BOM. */
  position: string
  shapes: DrawingShape[]
  /** Where the leader line starts on the part, and where the number sits. */
  callout: { from: [number, number]; to: [number, number] }
}

export type ExplodedDrawing = {
  id: string
  /** Drawing number in the selector, e.g. "TD-XFP150E-01". */
  number: string
  /** Selector label, e.g. "XFP 150E, 4-pole, PE3 motor". */
  title: string
  viewBox: [number, number, number, number]
  /** The vertical centre lines, drawn dash-dot like on a real drawing. */
  axes: { x: number; y1: number; y2: number }[]
  hotspots: DrawingHotspot[]
}
```

### `CartItem` and `Order` (new)

```ts
export type CartItemKind = 'part' | 'kit' | 'variant'

export type CartItem = {
  /** `${kind}:${partNumber}` – adding the same article again raises the quantity. */
  id: string
  kind: CartItemKind
  partNumber: string
  name: string
  /** Position on the drawing, for parts. */
  position?: string
  /** The pump it was ordered for: variant id, shown as "For XFP 150E … (24150231)". */
  forVariantId?: string
  quantity: number
  /** Copied when added, so a line keeps its price. */
  unitPrice: number
  stock: StockStatus
  leadTimeDays: number
  weight: number
}

export type DeliveryMethod = 'standard' | 'express'

export type Order = {
  /** e.g. "SO-2026-04719". */
  id: string
  placed: string // display date, from demo config (§7)
  placedBy: string
  lines: CartItem[]
  deliveryAddressId: string
  deliveryMethod: DeliveryMethod
  poNumber: string
  yourReference: string
  note?: string
  subtotal: number
  freight: number
  total: number
  /** Latest line lead time, plus 1 day for express or 3 for standard, as a display date. */
  estimatedDispatch: string
  status: 'Confirmed'
}
```

---

## 2. Data files

| File                               | Contents                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/config/demo.ts`               | `serviceProviderDemo`: query `XFP 150E`, model `xfp-150e`, variant `24150231`, the two demo positions (`420`, `512`), first order number. `customerAccount`: discount group label, customer number, payment terms, delivery addresses (2 sites of Nordvatten), `demoToday` (fixed date for dispatch dates).                                                                      |
| `src/data/variants/xfp.ts` (new)   | **Option rules**, not 20 hand-written rows: per model the allowed motors (100C: PE 7.5/4, PE 9/4; 150E: PE 18.5/4, PE 22/4, PE 30/4), × explosion proof (no / yes) × impeller material. Article numbers `24` + model code + a fixed index. Price factors and lead times per option.                                                                                              |
| `src/lib/productVariants.ts` (new) | Expands the rules into `ProductVariant[]` once (module scope, deterministic order): about 8 + 12 = **20 XFP variants**. `variantsFor(productId, modelId?)`, `getProductVariant(id)`, `variantFilterDefs` (§3).                                                                                                                                                                   |
| `src/data/partGroups.ts` (new)     | The 6 assemblies.                                                                                                                                                                                                                                                                                                                                                                |
| `src/data/spareParts.ts` (rewrite) | About **38 parts per model** (two models, so about 76 rows, written as one list with per-model part number and price columns, expanded by a helper). Position number ranges: 100s cable and electrical, 200s motor, 300s shaft and bearings, 400s shaft seal, 500s hydraulics, 900s fasteners and O-rings (letter suffixes for the same part at several places: `901a`, `901b`). |
| `src/data/serviceKits.ts` (new)    | About **8 kits per model**: Shaft seal kit, Bearing kit, Impeller kit, Wear plate kit, Cable entry kit, O-ring kit, Minor overhaul kit, Major overhaul kit. Each lists its positions. 4 are `recommended`.                                                                                                                                                                       |
| `src/data/boms.ts` (new)           | `bomFor(variant)`: the model's base BOM plus option overrides: Ex variants swap the cable entry (pos. 110) and cable (pos. 101); Duplex variants swap the impeller (512) and wear plate (520); motor power swaps stator and rotor (210, 220). So the Spare parts tab of each variant shows the parts that really fit it.                                                         |
| `src/data/drawings/xfp.ts` (new)   | One `ExplodedDrawing` geometry for the XFP family (`TD-XFP-01`). XFP 100C and 150E share the construction, so the drawing is the same and only part numbers differ. A second selector entry, "Dimensional drawing", is a later option, not this persona.                                                                                                                         |
| `src/data/eshopPages.ts` (new)     | All copy: cart, checkout, confirmation, buy box, detail strip, tree labels, toasts, "Sign in to see your price".                                                                                                                                                                                                                                                                 |
| `src/data/catalogPages.ts`         | `productPage.tabs`: the Spare parts tab gets real copy. New `variantPage` (tabs, breadcrumb, buy box labels) and `searchPage.variants` (result title, card labels, filter group labels).                                                                                                                                                                                         |
| `src/data/documents.ts`            | 3 new XFP documents with `variantIds`: "Spare parts list XFP 150E", "Exploded drawing TD-XFP-01" and "Service instructions XFP". The PDF preview reuses `DocumentPage`.                                                                                                                                                                                                          |

All prices, part numbers, positions, kit contents and lead times are invented and go into
`docs/content-to-confirm.md` under a new "Service Provider Workshop" section. So do the variant
name pattern and the motor codes (`PE220/4` follows Sulzer's public naming style, but the
exact codes must be confirmed).

---

## 3. Search and the variant result list (steps 1–2)

- **Index:** `lib/search.ts` gains a `variant` kind (`SearchKind`), matched on name, article
  number, motor code and model name. Variants rank below their model.
- **Suggestions:** `suggestGroups` returns a fourth group, **Variants** (max 4), only when the
  query matches a model or variant. The first row is the model itself ("XFP 150E · 12
  variants") and goes to `/products?q=…&model=xfp-150e`. Variant rows go straight to the
  configured product page. `SuggestionGroup` and `SuggestionRow` are reused as they are.
- **Results, Products tab:** when the query matches variants of exactly one product, or
  `?model=` is set, the tab switches to **variant mode**:
  - Title "12 variants of XFP 150E", with a link "Show all XFP products instead" that drops the
    `model` param.
  - `VariantResultCard` per variant: "Variant" tag, name (link), article number, a two-column
    spec table of the first 22 `specs` (as in the reference, but our own labels and units),
    and the product image on the right. Signed in, a price and stock line sits under the name.
  - The **filter column** reuses `FilterColumn` and `FilterGroup` with `lib/filters.ts`.
    `variantFilterDefs` cover: Model, Frequency, Motor, Power P2, Poles, Voltage, Explosion
    proof, Impeller material, Motor protection, Cable length and Installation. Counts and
    disabled zero options work the same as in module 3. Selections go into the URL through
    `useResultsParams` (filter ids in a `v.` namespace so they don't clash with the product
    filters).
  - Otherwise the Products tab is unchanged.
- Sort: "Article number", "Power ascending" and "Price ascending" (signed in).

---

## 4. The exploded drawing

### Recommendation: an original SVG, built from shape primitives

`_reference/service_provider` holds **no usable drawing**: the only exploded view is part of a
Grundfos screenshot, and it is their artwork. A hotspot map over that image is ruled out, and
we have no Sulzer drawing either. So the drawing is **original SVG**, and every part is its own
`<g>`. This is also the better demo:

- Highlight, dimming and hover states can be exact.
- It stays sharp at any zoom.
- It can't drift out of step with a hotspot map.
- It needs no image file.

If Sulzer later supplies a real exploded drawing, `DrawingHotspot.shapes` can be swapped for an
image underlay plus polygon outlines without touching the tree, the strip or the cart (§9).

### How it is drawn

- **Layout:** like a real service drawing, an XFP exploded along three vertical centre lines
  (dash-dot), each read top to bottom:
  - **Left, motor top:** cable (101), cable entry and gland (110–114), terminal board (120),
    top cover (130) and its O-ring (901a), bolts.
  - **Centre, rotating assembly:** upper bearing (310), rotor and shaft (220/300), stator in
    its housing (210/200), lower bearing (320), bearing bracket (330), circlips.
  - **Right, seal and hydraulics:** seal chamber cover, upper and lower mechanical seals
    (410, 420), oil plug (430), cooling jacket, impeller with key, washer and bolt (512–516),
    wear plate (520), volute (530), base stand (540), O-rings and bolts.
- **Line art:** white fill, navy-900 strokes of 1 px (0.75 px for hidden detail). Parts are
  side elevations with elliptical caps, so they read as 3-D like a technical illustration,
  with no shading. Helpers in `lib/drawingShapes.ts` turn each `DrawingShape` into path data:
  - `cylinder`, `ring` (two ellipses), `disc`, `bolt` (shank and hex head)
  - `path` for the few irregular parts: impeller vanes, volute scroll, cable gland, motor top
    This keeps the data file short (about 40 hotspots, mostly 1–4 primitives each) and the style
    consistent.
- **Callouts:** a thin leader line from `callout.from` on the part to a position number at
  `callout.to`, with the numbers lined up in a column to the right of each centre line, as on
  real drawings. The numbers are small text (11 px) in a rounded chip.
- **Size:** the viewBox is about 900 × 1200. Drawn at 100 % of the right column, which is about
  760 px wide at 1920 × 1080 and 560 px at 1440 × 900. At 1440 the drawing panel scrolls on its
  own (sticky, `max-height: calc(100vh - header)`), never the page.

### Interaction: one selection, two views

- **State:** a single selection `{ kind: 'part', position } | { kind: 'kit', kitId } | null`,
  held by `SparePartsTab` and mirrored to the URL (`?part=420` or `?kit=seal`) with
  `useUrlParams`. It keeps the hash, so `#spare-parts` stays. Reloads and recordings are
  therefore deterministic, and Back undoes a selection.
- **Hover on the drawing:**
  - The part's strokes turn primary.
  - A tooltip shows "420 · Mechanical seal, lower", in the same style as the `RangeChart`
    tooltip.
  - The cursor becomes a pointer.
- **Hit area:** each part `<g>` has a transparent copy of its outline with an 8 px stroke
  underneath, so thin O-rings and bolts are easy to hit. The callout chip is clickable too.
- **Click on the drawing:**
  - Selects the part.
  - The tree expands that part's group and scrolls it into view. The scroll is computed inside
    the tree panel's own scroll container (`scrollTo` with smooth behaviour), never
    `scrollIntoView`, so the page doesn't jump.
  - The tree row gets the selected style and a 600 ms tint pulse so the eye finds it.
  - The detail strip fills in.
- **Click in the tree:**
  - On a part, selects it.
  - On a kit's name, selects the kit: all its positions light up together and the strip shows
    the kit.
  - On a kit's child part, selects that part.
- **Selected look** (all transitions 200 ms):
  - The part gets a primary/15 fill and a 2 px primary stroke, and its callout chip turns
    solid primary with white text.
  - Every other part drops to 30 % opacity.
  - If the drawing is zoomed and the part is outside the view, the view pans to it.
- **Clearing:** "Clear" in the tree, the ✕ in the strip, Esc, or a click on empty drawing
  space.
- **Zoom:** +, −, "Fit" buttons in the drawing toolbar, which change the `viewBox` animated over
  200 ms, plus dragging to pan when zoomed. There is no wheel zoom, so page scrolling is never
  hijacked during the recording.
- **Keyboard and screen readers:**
  - The tree is the accessible path: `role="tree"` with arrow keys.
  - Each drawing part is `role="button"` with an `aria-label`, focusable, Enter selects.
  - The strip is `aria-live="polite"`.

---

## 5. Components

### `components/spareparts/` (new folder)

| Component         | What it does                                                                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SparePartsTab`   | Owns the selection and the URL sync. Two columns: `PartTree` (about 380 px, sticky) and the drawing panel (`DrawingSelect`, `PartDetailStrip`, `ExplodedDrawing`).                                                                                                                                     |
| `PartTree`        | Header "Service parts" with Collapse all, Expand all, Clear and a small "Find part" field that filters rows by name, position or part number. Top node **Service kits** (kit → its positions), then one node per `PartGroup` with "<pos> <name>" rows, sorted by position. Exposes `scrollToPosition`. |
| `PartTreeNode`    | One expandable row (chevron, plus/minus as in a classic parts catalogue, smooth `grid-rows` open like `OptionalParameters`).                                                                                                                                                                           |
| `DrawingSelect`   | The drawing selector ("TD-XFP-01 · XFP 150E, 4-pole, PE3 motor"). One option now; it is there because a real catalogue has one per build year.                                                                                                                                                         |
| `PartDetailStrip` | The selected part or kit: name, pos. no., part no., quantity in pump, description, weight; `PriceAndLeadTime`; quantity stepper; **Add to cart**; "Also in: Shaft seal kit" chips that select the kit; ✕.                                                                                              |
| `ExplodedDrawing` | The SVG: axes, hotspots, callouts, hover tooltip, zoom and pan. Props: `drawing`, `bom`, `selectedPositions`, `onSelect`, `onHover`.                                                                                                                                                                   |
| `DrawingPart`     | One hotspot `<g>`: shapes from `drawingShapes`, the hit outline, the callout.                                                                                                                                                                                                                          |
| `PartThumbnail`   | A small SVG of one hotspot's shapes, cropped to its bounding box. Used in the cart, kit cards and order lines, so parts get "images" without any photography.                                                                                                                                          |
| `RecommendedKits` | The strip on the configured product page: up to 4 kit cards (thumbnail of its main part, name, part number, reason, price, **Add to cart**). "Show on drawing" opens the Spare parts tab with `?kit=`.                                                                                                 |

### `components/eshop/` (new folder)

| Component          | What it does                                                                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PriceAndLeadTime` | The one place prices and lead times are shown (§6). Variants `buybox`, `strip`, `row`.                                                                                     |
| `StockIndicator`   | Dot plus label: In stock (green) · Low stock (amber) · Made to order (navy) · On request (grey).                                                                           |
| `QuantityStepper`  | − / number / + (min 1, max 99), compact like the module 3 form inputs.                                                                                                     |
| `AddToCartButton`  | Signed out, it opens the sign-in prompt (a `Modal`, like the module 3 save dialog). Signed in, it adds to the cart and shows the toast. A brief check-mark state (600 ms). |
| `CartButton`       | Header utility-bar button with a count badge that bumps on add. It links to `/eshop`.                                                                                      |
| `CartLines`        | The line table: thumbnail, name, part no., "For <variant>", stock and lead time, quantity, unit price, line total, remove.                                                 |
| `OrderSummary`     | Subtotal, freight, total excl. VAT, estimated dispatch, the primary action. Sticky on cart and checkout.                                                                   |
| `CheckoutSection`  | A numbered section card (reuses `NumberedStep` from module 2).                                                                                                             |
| `AddressOption`    | A radio card for a delivery address.                                                                                                                                       |

### `components/product/` (configured product page)

| Component            | What it does                                                                                                                                                                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VariantHeader`      | Breadcrumb (… › XFP › XFP 150E › variant), "Variant" tag, name, article number, "Suitable for" (from the product), image, the icon row (compare, save, add to project, share), and the buy box on the right: `PriceAndLeadTime` (`buybox`), discount group, quantity, **Add to cart**, "Download data sheet". |
| `VariantResultCard`  | Step 2's result card (§3).                                                                                                                                                                                                                                                                                    |
| `VariantSpecTable`   | The two-column spec table; reused on the card and the Specifications tab (all specs, grouped: Hydraulics, Motor, Electrical, Materials, Approvals).                                                                                                                                                           |
| `VariantCurvesTab`   | Curves for the variant's model at its motor's speed, plus a settings column (operating point on/off, curve types), as in the reference layout. It reuses `PerformanceCurve`.                                                                                                                                  |
| `VariantDrawingsTab` | Dimensional drawing and exploded drawing as `DocumentRow`s with preview and download (reuses `DocumentList` and `useFileGeneration`).                                                                                                                                                                         |

### Pages

- `pages/VariantPage.tsx`: `/products/:productId/:variantId`. Tabs (via `useHashTab`):
  Specifications, Curves, Spare parts, Drawings, Documentation, Services. Spare parts is the
  default in the demo URL. Below the header comes the Recommended service kits strip.
- `pages/CartPage.tsx`: `/eshop`.
- `pages/CheckoutPage.tsx`: `/eshop/checkout`.
- `pages/OrderConfirmationPage.tsx`: `/eshop/orders/:orderId`.
- `pages/ProductPage.tsx`: on `/products/xfp`, the Spare parts tab shows "Spare parts depend on
  the exact pump. Pick your variant or enter its article number", plus a variant picker
  (model select, then variant select, then **Show spare parts**). It goes to
  `/products/xfp/<id>#spare-parts`. Products without variants keep `TabComingSoon`.

### State: `src/cart/` (new, like `src/projects/`)

- `CartContext.ts`, `CartProvider.tsx` and `useCart.ts`, mounted inside `AuthProvider`.
- **State:** `items`, `count`, `subtotal`.
- **Actions:**
  - `add(item, qty)` merges the same article.
  - `setQuantity`, `remove`, `clear`.
  - `placeOrder(details)` builds the `Order`, appends it to `orders`, clears the cart and
    returns the id.
- **Storage:** `localStorage` keys `sz-demo-cart-v1` and `sz-demo-orders-v1`, with try/catch.
- **Order numbers:** `SO-2026-${04718 + n}`, deterministic.
- Signing out keeps the cart, as a shop would, but hides prices.

---

## 6. Price and lead time

- **Signed out:** no figures. Each `PriceAndLeadTime` shows "Sign in to see your price and lead
  time", with a link that opens the existing sign-in, as on the Models tab. Stock status
  (in stock / made to order) is still shown, as the reference does.
- **Signed in:**
  - **Your price** is large on the buy box and medium in the strip, from `formatPrice` in
    `market.currency` (EUR), excl. VAT.
  - Under it, smaller and struck through, the list price, and "Discount group SP" from
    `customerAccount`. Demo prices are net of one fixed discount per group (parts 18 %, pumps
    12 %), so the discount is visible but the maths stays simple.
  - The `StockIndicator` dot and label.
  - **Lead time: "<n> working days"** (the reference's unit). "In stock" shows "Ships in 2
    working days".
  - On the variant buy box and in the order summary, an **estimated dispatch date** computed
    from `demoToday` plus working days (weekends skipped). It is deterministic because
    `demoToday` is fixed in config, not `new Date()`.
- **Mixed cart:** the order summary shows the latest dispatch date across lines, and a note
  "Ship complete" vs "Ship available items first" (a toggle in checkout, standard = ship
  complete).
- **Freight:** a flat 45 EUR standard or 120 EUR express, and free above 2 500 EUR. All three
  figures are in config.

---

## 7. Cart and checkout

- **Add to cart:**
  - From the strip, the kit cards, the variant buy box or the result card (signed in).
  - The toast reads "Added to cart: 420 Mechanical seal, lower × 1" with **View cart**, and
    the header badge bumps.
  - The cart opens on its own page; there is no mini drawer, to keep the recording calm.
    Open question: a drawer instead.
- **Cart (`/eshop`):**
  - Title "Cart (2)", `CartLines` and `OrderSummary` with **Proceed to checkout**.
  - "Continue shopping" goes back to the last variant.
  - Empty state: "Your cart is empty", with links to Product Center and Spare parts.
- **Checkout (`/eshop/checkout`):** one page, four numbered sections, all prefilled so the
  presenter only clicks **Place order**:
  1. **Delivery address:** two `AddressOption` cards (Nordvatten main workshop, Riverside
     pumping station). The first is preselected.
  2. **Delivery:** Standard / Express (`SegmentedToggle`), plus the ship-complete toggle and
     the resulting dispatch date.
  3. **Your references:** PO number (prefilled `PO-88412`), your reference (demo user), and a
     note.
  4. **Payment:** "On account: invoice, 30 days net" (read-only, from `customerAccount`).

  The right column holds a sticky `OrderSummary` with the lines collapsed, and "I accept the
  terms of sale" linking to `/terms-of-sale`. **Place order** shows 600 ms "Placing order…",
  then navigates.

- **Confirmation (`/eshop/orders/:orderId`):**
  - A success band: check icon, "Thank you, your order is confirmed", the order number, and
    "A confirmation has been sent to `demoUser.email`".
  - The order lines with thumbnails, the estimated dispatch, the delivery address and the
    references.
  - Actions:
    - **Download order confirmation (PDF)** (`useFileGeneration`, as for documents)
    - **Track order** (→ `/self-service/orders`, a stub for now)
    - **Back to XFP 150E …**
  - An unknown order id shows `NotFoundPage`.
- **Signed out at checkout:** `/eshop/checkout` shows a sign-in card in the layout instead of
  the form; the cart page itself works signed out (without prices).

---

## 8. Routes and URL state

| Route                                | Page                    | Notes                                                                                                                   |
| ------------------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/products?q=…&model=…&v.<filter>=…` | `ProductSearchPage`     | Variant mode (§3).                                                                                                      |
| `/products/:productId/:variantId`    | `VariantPage` (new)     | `#specifications`, `#curves`, `#spare-parts` …; `?part=` / `?kit=` on the Spare parts tab. Unknown id → `NotFoundPage`. |
| `/eshop`                             | `CartPage` (new)        | Removed from `placeholderRoutes`; quick link label stays "eShop".                                                       |
| `/eshop/checkout`                    | `CheckoutPage` (new)    |                                                                                                                         |
| `/eshop/orders/:orderId`             | `OrderConfirmationPage` |                                                                                                                         |
| `/spare-parts`                       | stays a stub            | Open question: make it a "Find spare parts by article number" entry page.                                               |

`scripts/qa-screenshots.mjs` gets the new pages in its list, even though QA is not run in
this persona.

---

## 9. Reused from earlier modules

- **Search:** `useSearchSuggest`, `SearchSuggestions`, `SuggestionGroup`, `SuggestionRow`,
  `Highlight`.
- **Results:** `ProductResults`, `useResultsParams`, `FilterColumn`, `FilterGroup`,
  `ActiveFilterChips`, `SortSelect`, `lib/filters.ts` (`applyFilters`, `filterGroups`).
- **Page structure:** `TabBar`, `TabPanel`, `useHashTab`, `Breadcrumb`, `ProductHeader`
  patterns (copied into `VariantHeader`, not forked), `SmartImage`.
- **Curves and documents:** `PerformanceCurve`, `DocumentList`, `DocumentRow`,
  `DocumentPreview`, `useFileGeneration`, `NumberedStep`.
- **State:** `useAuth`, the toast (with action), `Modal`, `SegmentedToggle`, `useUrlParams`.
- **Formatting:** `formatPrice`, `groupThousands`; `AvailabilityBadge`'s colours, moved into
  `StockIndicator`.
- **Projects:** the module 3 `AddToProjectDialog` from the variant page's icon row is an
  **open question**. `ProjectItem` is built from a sized AHLSTAR variant, so adding an XFP
  article needs a second item kind.
- `SparePartList` (the unused flat table) is deleted. Its role is taken by `PartTree` and
  `CartLines`.

---

## 10. Content to confirm (for `docs/content-to-confirm.md` once built)

- The XFP variant naming pattern and motor codes, article numbers, all variant spec values.
- Position numbering scheme (100s–900s) and every part name, part number, weight, price and
  lead time.
- Kit names, contents and the "Every 2 years" / "Overhaul" recommendations.
- Discount groups and percentages, freight rules, payment terms, the two delivery addresses,
  the PO number.
- The drawing is an illustrative original, not a Sulzer service drawing; confirm this is
  acceptable on camera or supply a real one.

## Open questions

1. **Drawing:** is an original illustrative exploded view acceptable, or can Sulzer supply a
   real XFP exploded drawing? If one arrives, it goes in as an image underlay with polygon
   hotspots, and only `ExplodedDrawing` and the data file change.
2. **Mini cart:** a drawer that slides in on Add to cart, or only toast plus badge
   (recommended: toast and badge, calmer on camera)?
3. **Whole pump in the cart:** should the variant buy box add the pump itself to the cart
   (replacement of products, deck bullet 2), or show "Request quote" for pumps and allow the
   cart for parts only? The plan assumes the pump can be added.
4. **`/spare-parts`:** keep the stub, or build an entry page with "Find by article number"
   that lands on the variant's Spare parts tab?
5. **AHLSTAR:** spare parts only for XFP in this persona (recommended), or a drawing for
   AHLSTAR too later?
6. **Add to project** for XFP articles (§9)?

## Build order (once approved)

1. Types, `config/demo.ts` additions, XFP variant rules and `lib/productVariants.ts`.
2. Part groups, spare parts, kits, BOMs; `eshopPages.ts` copy.
3. Drawing data and `lib/drawingShapes.ts`; `ExplodedDrawing` and `DrawingPart` on their own.
4. `PartTree`, `PartDetailStrip` and `SparePartsTab` with the two-way selection.
5. `VariantPage` (header, buy box, tabs, recommended kits), route.
6. Search: variant kind, suggestions group, variant mode on the results page with filters.
7. `src/cart/`, `CartButton`, Add to cart everywhere.
8. Cart, checkout and confirmation pages; remove `/eshop` from placeholder routes.
9. Product page Spare parts tab (variant picker); delete `SparePartList`.
10. `content-to-confirm.md`, QA route list. Build and lint after each step.
