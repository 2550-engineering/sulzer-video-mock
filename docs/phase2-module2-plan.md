# Phase 2 · Module 2 — Product finder and product page

Plan only. No code has been written for this module yet.

## References

| Step                    | Reference                                                                |
| ----------------------- | ------------------------------------------------------------------------ |
| Nine-step flow          | `_reference/deck/05-product-finder.png`                                  |
| Search with suggestions | `_reference/grundfos/products/01-search-suggestions.png`, deck step 2    |
| Result list             | `_reference/grundfos/products/02-search-results.png`                     |
| Product header + Models | `_reference/grundfos/products/03-models-tab.png`, `1.png` (variant page) |
| Documentation           | `_reference/grundfos/products/04-documentation-tab.png`                  |
| BIM                     | `_reference/grundfos/products/05-bim-tab.png`                            |
| Services                | `_reference/grundfos/products/06-services-tab.png`                       |

We use these for layout only. All text, images, icons, document names and service names are
our own. The Grundfos Models tab shows an empty state ("No results…"), so our Models tab takes
its layout from the variant cards in `02-search-results.png` and `1.png` instead.

## What module 1 already gives us

- `ProductPage` with header (tag, name, Suitable for, standard, key spec strip, Size product),
  sticky `TabBar` + `useHashTab`, and a finished Explore tab.
- `ProductSearchPage` at `/products?q=` (Product Center hero + `ProductSearchForm` + list of
  `ProductListItem` rows) and `searchProducts()` in `lib/catalog.ts` (every word must appear).
- `SearchPanel`: the header search drop-down, with "Popular searches" chips. No suggestions.
- `ModelsTable` (5 columns), `DocumentList` (rows with a download button), `SparePartList`,
  `CatalogListRow` / `ProductListItem` / `ServiceListItem`, `HelpSection`, `SmartImage`.
- Data: 5 models (3 AHLSTAR), 7 documents (BIM and CAD mixed into `documents`), 9 services,
  `Product.serviceIds`.
- Tabs today: Explore · Models · Documentation · BIM · **Spare parts** · Services.

## Recording path

| #   | Deck step      | Route                             | What the viewer sees                                                                                                                                                                                                                                                                                                            |
| --- | -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Product search | any page, header search           | Presenter clicks the search icon. The panel drops down and the page dims (exists). They type `AHLSTAR`, one letter at a time.                                                                                                                                                                                                   |
| 2   | Suggestions    | same                              | From the 2nd letter a suggestion list opens under the input. Left: up to 6 search terms with the typed part in bold ("**AHL**STAR", "**AHL**STAR 100-80-250", …). Right: "Suggested products" with thumbnail, name and family tag. Footer: "See all results for "AHLSTAR"". Presenter presses Enter or clicks the first term.   |
| 3   | Result list    | `/products?q=ahlstar`             | Grey search band (breadcrumb Home › Search, search box keeps the query). Result type tabs with counts: All (25) · Products (1) · Models (14) · Documentation (10) · Services (0). Left: Filter list. Right: AHLSTAR product row first, then 3 model cards and "Show all 14 models", then 3 documents. Presenter clicks AHLSTAR. |
| 4   | Product page   | `/products/ahlstar`               | Existing header and Explore tab (module 1). Brief pause on the header: Suitable for, key specs.                                                                                                                                                                                                                                 |
| 5   | Models         | `/products/ahlstar#models`        | Filter row (Frequency 50 Hz / 60 Hz, Casing material, Shaft seal), "14 models", table. Presenter opens one row: it expands into a two-column spec list with a product image and "Size this model", "Data sheet", "CAD & BIM" buttons.                                                                                           |
| 6   | Documentation  | `/products/ahlstar#documentation` | "Service videos": a horizontal row of 4 video cards (thumbnail with play button, duration, title). Below on grey: Filter list (Document type, Language) and a document list with checkboxes. Presenter ticks two and the "Download selected (2)" bar appears.                                                                   |
| 7   | BIM            | `/products/ahlstar#bim`           | Grey band "Download BIM & CAD models". White panel: 3D preview image left; right, Model and Format selects, the matching file (name, version, LOD, size) and a Download button that runs Preparing… → Downloaded ✓. Below, a table of all CAD and BIM files.                                                                    |
| 8   | Services       | `/products/ahlstar#services`      | Grey band "Service offerings for AHLSTAR": 4 image cards (photo, title, text, "Explore" link). Then "How can we help you?" (the module 1 `HelpSection`), which closes every product tab as in the reference.                                                                                                                    |

The deck's step 4 "Areas" is the "Suitable for" list in the header, which is already built.

---

## 1. Types (`src/types.ts`)

### `ProductModel` (extend)

The Models tab, the model result cards and the BIM model select all read this. The fields
cover what the reference variant cards show, in our own selection and wording.

```ts
export type ProductModel = {
  id: string
  productId: string
  /** e.g. "AHLSTAR 100-80-250". */
  name: string
  /** Sulzer article number, shown as "Product no." */
  productNumber: string
  frequency: 50 | 60
  /** Best-efficiency flow, m³/h. */
  flow: number
  /** Head at best-efficiency flow, m. */
  head: number
  /** Rated motor power P2, kW. */
  power: number
  /** Nominal speed, rpm. */
  speed: number
  /** Impeller diameter, mm. */
  impeller: number
  /** Suction × discharge, e.g. "DN 100 × DN 80". */
  connection: string
  casingMaterial: 'Grey cast iron' | 'Ductile iron' | 'Duplex stainless steel'
  shaftSeal: 'Packing' | 'Single mechanical seal' | 'Double mechanical seal'
  /** Max. operating pressure, bar. */
  maxPressure: number
  /** Efficiency at best-efficiency point, %. */
  efficiency: number
  /** Pump on base frame with motor, kg. */
  weight: number
}
```

### `Document` (extend) and `DocumentType` (narrow)

BIM and CAD files move to `CadFile`, so `'BIM model' | 'CAD drawing'` leave `DocumentType` and
`isModelFile()` goes away. Service videos join, because the Documentation tab lists them and
they share the product link, number and date.

```ts
export type DocumentType =
  | 'Data sheet'
  | 'Installation & operating instructions'
  | 'Quick guide'
  | 'Brochure'
  | 'Spare parts list'
  | 'Certificate'
  | 'Service video'

export type Document = {
  id: string
  title: string
  type: DocumentType
  /** Sulzer document number. */
  number: string
  productIds: string[]
  /** Languages it is available in; the first is the one listed. */
  languages: string[]
  /** "PDF", or "MP4" for videos. */
  format: string
  size: string
  /** ISO date, e.g. "2026-03-12". */
  date: string
  /** Shown as "Rev. C". */
  revision?: string
  /** Service videos only. */
  video?: { duration: string; thumbnail: ImageSource }
}
```

`language: string` becomes `languages: string[]`. Only `DocumentList` and `lib/catalog.ts` read
documents today, so the change stays small.

### `CadFile` (new)

```ts
export type CadKind = 'BIM object' | '3D model' | '2D drawing'
export type CadFormat = 'Revit' | 'IFC' | 'STEP' | 'DWG' | 'DXF'

/** A downloadable BIM or CAD file on the product BIM tab. */
export type CadFile = {
  id: string
  productId: string
  /** Undefined: covers the whole range (e.g. one Revit family with all sizes). */
  modelId?: string
  kind: CadKind
  format: CadFormat
  /** e.g. "Revit 2024", "IFC 4", "AP242". */
  version: string
  /** BIM objects only, e.g. "LOD 300". */
  lod?: string
  /** Shown in the file card, e.g. "AHLSTAR_100-80-250.rfa". */
  fileName: string
  size: string
  date: string
}
```

### `ServiceOffering` (new), replacing `Product.serviceIds`

A product's Services tab shows a service with product-specific text, in a chosen order. The
name, photo and icon come from the existing `Service`, so nothing is written twice.
`Product.serviceIds` is removed; `ProductGroup.serviceIds` on applications stays.

```ts
/** A service as offered for one product, shown as a card on the product Services tab. */
export type ServiceOffering = {
  id: string
  productId: string
  /** Id from data/services.ts: gives the name, photo and icon. */
  serviceId: string
  /** One or two sentences about this service for this product. */
  text: string
  /** Where "Explore" goes. */
  to: string
}
```

### `SearchResult` (new)

A discriminated union that carries the matched object, so each result type renders with the
component that already shows that object (`ProductListItem`, `ServiceListItem`, …).

```ts
export type SearchKind = 'product' | 'model' | 'document' | 'service' | 'application'

export type SearchResult = { score: number } & (
  | { kind: 'product'; product: Product }
  | { kind: 'model'; model: ProductModel; product: Product }
  | { kind: 'document'; document: Document }
  | { kind: 'service'; service: Service }
  | { kind: 'application'; application: Application }
)

/** A search term in the header suggestions. `ranges` are the parts to show in bold. */
export type SearchSuggestion = {
  label: string
  /** What goes into ?q= when chosen. */
  query: string
  ranges: [start: number, end: number][]
}
```

---

## 2. Data files

| File                                 | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/models/ahlstar.ts`         | AHLSTAR from 3 to **14 models** (10 at 50 Hz, 4 at 60 Hz; sizes 40-25-160 up to 250-200-500; all three casing materials and seal types present, so every filter has hits). XFP stays at 2, gets the new fields. Values rise smoothly with size. Fixed, no randomness.                                                                                                                                                                                                                                                |
| `src/data/documents.ts`              | AHLSTAR: 7 documents (IOM, quick guide, data sheet 50 Hz, data sheet 60 Hz, spare parts list, ATEX certificate, brochure) plus **4 service videos**. BIM/CAD entries move out. Languages so the filter has a few options (English, German, Finnish, Swedish, Spanish).                                                                                                                                                                                                                                               |
| `src/data/cadFiles.ts` (new)         | AHLSTAR: one Revit family and one IFC for the whole range, plus STEP 3D and DWG 2D per model for the 50 Hz models. About 20 files, all generated by a small helper from the model list (like `images()` in `applications.ts`), so they stay in step with the models.                                                                                                                                                                                                                                                 |
| `src/data/serviceOfferings.ts` (new) | AHLSTAR: Commissioning, Vibration analysis, Repair & overhaul, Service agreements, each with AHLSTAR-specific text. The other products get offerings made from their current `serviceIds`, so their Services tabs keep working.                                                                                                                                                                                                                                                                                      |
| `src/data/products.ts`               | Remove `serviceIds`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `src/data/catalogPages.ts`           | `productPage.tabs` drops Spare parts (see open question 1). New copy: Models filters and labels, expand-row buttons, Documentation (videos title, filter labels, "Download selected (n)", "Clear selection"), BIM (band title, select labels, download states), Services ("Service offerings for {product}", "Explore"), `productPage.help`. `searchPage`: tab labels, filter labels, "Show all {n} models", empty states, suggestion headings, "See all results for …". `productSearchPage` copy is merged into it. |
| `src/config/demo.ts`                 | Add `searchDemoQuery: 'AHLSTAR'`, used by the rehearsal and as the first "Popular search" chip.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `src/config/navigation.ts`           | `popularSearches` starts with `products.ahlstar`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

Help cards: the three cards on Surface water intake move to a shared `defaultHelpCards` in
`data/catalogPages.ts`. The application uses them unless it defines its own, and every product
tab ends with them.

---

## 3. Search (`src/lib/search.ts`, new)

Pure functions over `src/data`, no state, no debounce timers, no network. The same input always
gives the same output in the same order. `searchProducts()` moves here from `lib/catalog.ts`.

**Normalise.** Lowercase, trim, collapse spaces, strip accents (`NFD`), drop quotes. Tokens
split on spaces only, so `100-80-250` stays one token.

**Index.** Built once at module load. Every entry has a kind, the object, and three weighted
field groups:

| Kind        | Name (weight 3) | Secondary (weight 2)                 | Body (weight 1)       |
| ----------- | --------------- | ------------------------------------ | --------------------- |
| product     | name            | family, category, standard           | summary               |
| model       | model name      | product number, product name         | connection, materials |
| document    | title           | document number, product names, type | —                     |
| service     | name            | —                                    | summary               |
| application | name            | parent area name                     | summary               |

**Match.** An entry matches when every token appears as a substring in one of its fields.

**Score.** For each token, take the best of:

- 30 if a word in the name starts with the token
- 20 if the name contains it
- 10 if a secondary field contains it
- 4 if the body contains it

Add 50 when the whole query equals the name and 25 when the name starts with it.

**Order.** Score descending, then kind (product, model, document, service, application), then
name with `localeCompare(…, 'en')`. No fuzzy matching, by design: a typo returns nothing, and
the "no results" state already exists.

**API.**

```ts
normalizeQuery(q: string): string
search(q: string): { results: SearchResult[]; counts: Record<SearchKind | 'all', number> }
suggest(q: string): { terms: SearchSuggestion[]; products: Product[] } // terms ≤ 6, products ≤ 3; empty under 2 chars
matchRanges(text: string, q: string): [number, number][]               // for bold highlights
```

`suggest` draws terms from product names, model names, families and categories (no documents:
too long for a suggestion line). Prefix matches come first, then shorter labels, then
alphabetical. For `AHLSTAR` that gives: AHLSTAR, AHLSTAR 40-25-160, AHLSTAR 50-32-200, … and
the suggested product AHLSTAR.

**Expected counts for `ahlstar`** (checked in the rehearsal): Products 1, Models 14,
Documentation 10 (service videos are listed separately and not searched), Services 0, Applications 0. Service and application
texts don't name products, so their tabs show 0, like "Documentation (0)" in the reference.
That's fine. Mega menu links such as `/products?q=Submersible%20pumps` keep working, because
categories are indexed.

---

## 4. Components

### Search (`components/search/`, new folder)

| Component           | Notes                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SearchCombobox`    | Input plus suggestion popover. ARIA combobox: ↑/↓ moves through terms and products, Enter picks the highlighted one or searches the typed text, Esc closes. Sizes `lg` (header panel, results band) and `md`. Replaces `ProductSearchForm`, which is deleted. |
| `SuggestionList`    | Two columns: terms (with `Highlight`) and "Suggested products" (thumbnail 64 px via `SmartImage`, name, family tag). Footer row "See all results for "…"". Opens with a 150 ms fade, the same as the other popovers.                                          |
| `Highlight`         | Renders text with `ranges` in bold.                                                                                                                                                                                                                           |
| `SearchBand`        | Grey band at the top of the results page: breadcrumb Home › Search, then `SearchCombobox` centred, about 800 px wide (layout from `02-search-results.png`).                                                                                                   |
| `FilterList`        | White sidebar: "Filter list" + "Reset", collapsible groups of checkboxes with counts, "Show more" after 5 options, active filters as removable chips at the top. Generic, so the Documentation tab reuses it.                                                 |
| `SearchResultList`  | On the All tab: one section per kind with a small heading, at most 3 items, and "Show all {n} {kind}" (switches the tab). On other tabs: the full list. Renders each kind with the components below.                                                          |
| `ModelResultCard`   | The variant card from the reference in our style: "Model" tag, name, `ModelSpecList` (2 columns), product image on the right. Links to `/products/<id>?model=<modelId>#models`, which opens that row.                                                         |
| `DocumentResultRow` | One `DocumentList` row plus the product name it belongs to.                                                                                                                                                                                                   |

Product, service and application results reuse `ProductListItem`, `ServiceListItem` and
`CatalogListRow` (cover image) unchanged.

### Product tabs (`components/product/`)

| Component             | New / change | Notes                                                                                                                                                                                                  |
| --------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ModelsTab`           | new          | Filter row (segmented 50 Hz / 60 Hz; selects for casing material and shaft seal), "14 models", `ModelsTable`.                                                                                          |
| `ModelsTable`         | change       | Columns: Model, Product no., Flow, Head, P2, Speed, Connection. Rows expand (chevron, 200 ms height transition) into `ModelDetails`. Only one row open at a time.                                      |
| `ModelDetails`        | new          | `ModelSpecList` + product image + buttons "Size this model" (`/sizing?product=ahlstar&model=<id>`), "Data sheet" (Documentation tab, type filter set), "CAD & BIM" (BIM tab with that model selected). |
| `ModelSpecList`       | new          | Two-column label/value list (`dl`). Shared by `ModelDetails` and `ModelResultCard`.                                                                                                                    |
| `DocumentationTab`    | new          | `ServiceVideoRow`, then on grey: `FilterList` (Document type, Language) + `DocumentList` + `BulkDownloadBar`.                                                                                          |
| `ServiceVideoRow`     | new          | Horizontal row of `ServiceVideoCard`s with a round next/previous arrow (scroll-snap, smooth). Cards don't play; clicking shows a play-state overlay only.                                              |
| `ServiceVideoCard`    | new          | 16:9 thumbnail (`SmartImage`), play button, duration, title, document number.                                                                                                                          |
| `DocumentList`        | change       | Optional checkbox per row, "+3 languages" after the language, revision, `DownloadButton` instead of the static button.                                                                                 |
| `BulkDownloadBar`     | new          | Sticky to the bottom of the list when anything is ticked: "{n} selected", "Clear", "Download selected". Slides up in 200 ms.                                                                           |
| `BimTab`              | new          | Grey band + `BimDownloadPanel` + `CadFileTable`.                                                                                                                                                       |
| `BimDownloadPanel`    | new          | 3D preview image (4:3), selects Model (All sizes + each model) and Format, the matching `CadFile` card (file name, version, LOD, size), `DownloadButton`.                                              |
| `CadFileTable`        | new          | All files: Model, Type, Format, Version, Size, small download icon button.                                                                                                                             |
| `ServicesTab`         | new          | Grey band, heading, 3–4 column grid of `ServiceOfferingCard`. Replaces the `IconCardGrid` used today.                                                                                                  |
| `ServiceOfferingCard` | new          | White card: photo (4:3, the service's existing image), title, text centred, "Explore" link. Image zooms to 1.03 on hover, like the application cards.                                                  |
| `ProductPage`         | change       | 5 tabs, each tab is one component, `HelpSection` under every tab, "Back to results" link above the breadcrumb when arriving from search (router `state`).                                              |

### Shared (`components/`)

- `DownloadButton` (new): idle → "Preparing…" with a spinner (600 ms) → "Downloaded ✓"
  (1.5 s) → idle. Fixed timings and no real file, so the recording is the same every time
  and nothing hits the network.
- `TabBar` (reuse): the results page uses it for the result type tabs, with counts in the
  labels. It is driven by `?type=` instead of the hash, through the same `active` /
  `onSelect` props. Not sticky there (prop `sticky={false}`, new).
- `SearchPanel` (change): the input becomes `SearchCombobox`. Popular search chips stay while
  fewer than 2 letters are typed.

### Pages

- `ProductSearchPage` (change):
  - Without `q` it stays the Product Center landing (hero + `SearchCombobox`).
  - With `q` it becomes the results layout: `SearchBand`, `TabBar`, then `FilterList` and
    `SearchResultList` side by side.

### Hooks and lib

- `useSearchParam(key)` (new hook): reads one query param and writes it with `replace`,
  **keeping the hash**. React Router's `setSearchParams` drops `#models`, which would switch
  the tab. Used by every filter on the product tabs and the results page.
- `lib/catalog.ts`:
  - Add `cadFilesFor`, `videosFor`, `serviceOfferingsFor`.
  - `documentsFor` leaves out videos.
  - Remove `isModelFile` and `searchProducts`.

---

## 5. Routes and URL params

No new routes. All state that shows on screen is in the URL, so reloads and Back reproduce it.

| URL                                                             | Shows                                                                                                                                                                                                                      |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/products`                                                     | Product Center landing (unchanged layout).                                                                                                                                                                                 |
| `/products?q=ahlstar`                                           | Results, All tab. The header search writes the **normalised** query, so typing "AHLSTAR" gives `?q=ahlstar`. The heading shows the product's own casing when the query equals a product name ("25 results for "AHLSTAR""). |
| `&type=products\|models\|documentation\|services\|applications` | Result type tab. Missing or unknown: All.                                                                                                                                                                                  |
| `&category=…&application=…&doctype=…&lang=…`                    | Results filters. Repeatable for several ticks (`&doctype=Brochure&doctype=Data%20sheet`).                                                                                                                                  |
| `/products/ahlstar#models`                                      | Tab, as today (`useHashTab`).                                                                                                                                                                                              |
| `?hz=60&material=…&seal=…#models`                               | Models filters. Default `hz=50`.                                                                                                                                                                                           |
| `?model=<id>#models`                                            | That model's row is open and scrolled into view.                                                                                                                                                                           |
| `?doctype=…&lang=…#documentation`                               | Documentation filters. Ticked checkboxes stay local state (a selection, not a view).                                                                                                                                       |
| `?model=<id>&format=IFC#bim`                                    | BIM panel selection. Defaults: All sizes, Revit.                                                                                                                                                                           |
| `/products/ahlstar#spare-parts`                                 | Falls back to Explore once the tab is removed (`useHashTab` already does this).                                                                                                                                            |

Navigation details:

- Search submissions **push** a history entry, so Back from the results returns to the page
  the search started on.
- Tab and filter changes **replace**, as tabs do today.
- Clicking a result passes `state: { from: '/products?q=…' }` for "Back to results".

---

## 6. Images

Product thumbnails in the suggestions and results (`ahlstar-main.png` etc.) are already listed.
New files for this module:

| Priority      | File                                   | Folder                    | Aspect | Shows                                                                           |
| ------------- | -------------------------------------- | ------------------------- | ------ | ------------------------------------------------------------------------------- |
| 1 · recording | `ahlstar-bim-preview.png`              | `public/images/products/` | 4:3    | Grey-shaded 3D CAD render of an AHLSTAR pump on its base frame, isometric       |
| 1 · recording | `ahlstar-video-seal-replacement.jpg`   | `public/images/videos/`   | 16:9   | Technician fitting a mechanical seal on an end-suction pump in a workshop       |
| 1 · recording | `ahlstar-video-back-pull-out.jpg`      | `public/images/videos/`   | 16:9   | Bearing unit and impeller being pulled out of a pump casing                     |
| 1 · recording | `ahlstar-video-shaft-alignment.jpg`    | `public/images/videos/`   | 16:9   | Laser alignment tool mounted on a pump-motor coupling                           |
| 1 · recording | `ahlstar-video-impeller-clearance.jpg` | `public/images/videos/`   | 16:9   | Close-up of a feeler gauge measuring impeller clearance                         |
| 2             | `product-center-hero.jpg`              | `public/images/pages/`    | 21:9   | Engineer with a tablet in a pump hall (Product Center landing, not on the path) |

The service photos `commissioning.jpg`, `vibration-analysis.jpg`, `repair-overhaul.jpg` and
`service-agreements.jpg` already exist in the list. They move to priority 1, because the
Services tab is on this recording path.

`scripts/images-needed.mjs` changes:

- New specs for `/images/videos/` (16:9, 1280 × 720) and `/images/pages/` (21:9).
- Read `documents.ts` for video thumbnails.
- The priority column names the recording ("1 · application finder", "1 · product finder").

These rows are listed by hand at the end of `docs/images-needed.md` until the data exists.
After that, the next `npm run images:doc` writes them.

---

## 7. Recording readiness

Same pattern as module 1:

- `_qa/flows/product-finder.spec.ts`:
  - Rehearsal at 1920×1080: types `AHLSTAR` with 120 ms per key, with screenshots and a video.
  - Every link on the path resolves.
  - `?q=`, `?type=`, filters and tab hashes survive reload and Back.
  - Sticky bar check on all 5 tabs.
  - CLS with delayed images.
  - Expected result counts (§3).
- `scripts/qa-screenshots.mjs`: add `/products?q=ahlstar` and the product tab hashes.
- `docs/content-to-confirm.md`: new "Product finder" section covering:
  - model names and figures
  - article and document numbers
  - video titles
  - BIM formats and versions
  - service offering texts

---

## Open questions

1. **Spare parts tab.** The deck shows 5 tabs: Explore, Models, Documentation, BIM, Services.
   I'd remove Spare parts from the bar now and bring it back with module 4 (Spare parts /
   eCommerce). `SparePartList` and its data stay.
2. **Downloads.** I'd keep them visual only (Preparing → Downloaded). The alternative is one
   real stub PDF in `public/` that every button downloads, which would show a browser download
   bar in the video.
3. **Product Center landing** (`/products` without a query) isn't on the path. Keep it as is,
   or give it a photo hero now (priority 2 image above)?
4. **Search scope.** Applications and services are indexed, so a search like "intake" also
   finds Surface water intake. Part numbers (`spareParts.ts`) wait for module 4.

## Build order (once approved)

1. Types, data files, `lib/search.ts`, catalog helpers. Build and lint.
2. `SearchCombobox` + suggestions in the header `SearchPanel`.
3. Results page: `SearchBand`, result type tabs, `FilterList`, `SearchResultList`, `ModelResultCard`.
4. Models tab.
5. Documentation tab.
6. BIM tab.
7. Services tab, `HelpSection` under every tab, "Back to results".
8. Rehearsal script, QA routes, docs. Build, lint, `npm run flow`.
