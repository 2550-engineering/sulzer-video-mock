# Phase 2 · Module 1 — Application finder

Plan only. No code has been written for this module yet.

## References

| Step                   | Reference                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Six-step flow          | `_reference/deck/Digital Journey Script Oct_21.pdf`, slide 4 (there is no separate `04-application-finder.png`)         |
| 1 Overview             | `_reference/grundfos/applications/ 01-overview.png` (the file name starts with a space; rename it to `01-overview.png`) |
| 2 Category             | Deck thumbnail only; there is no full screenshot                                                                        |
| 3–4 Hero + Explore     | `_reference/grundfos/applications/02-surface-water-explore.png`                                                         |
| 5 Products & solutions | `_reference/grundfos/applications/03-products-solutions.png`, `_reference/grundfos/application-product-page.png`        |
| 6 Product page         | `_reference/grundfos/applications/04-product-nkg.png`, `_reference/grundfos/individual-product-page.png`                |

We use these for layout only. All text, images and icons are our own.

## Recording path

| #   | Deck step                    | Route                                                       | What the viewer sees (layout taken from the reference)                                                                                                                                                                                                                                                                               |
| --- | ---------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Application overview         | `/applications`                                             | Hero photo with a dark text panel on the **right** (title and one line). Light grey page with the heading "Select area of interest or application" and a 3-column grid of category cards: image, then "Name (count)" in navy, then the child applications as small text links. Long lists stop at 7 and show "Show all". No tab bar. |
| 2   | Municipal water supply       | `/applications/municipal-water-supply`                      | Category hero, then a 3×2 grid of image tiles with the title below the image and a small arrow-circle button. No tab bar.                                                                                                                                                                                                            |
| 3   | Surface water intake         | `/applications/municipal-water-supply/surface-water-intake` | Hero photo with a dark text panel on the **left**: title, intro and a "Size application" button. Tab bar: Explore · Products & solutions · Learn.                                                                                                                                                                                    |
| 4   | Explore, scroll              | same, `#explore`                                            | (a) Grey band with a heading, paragraph and "Show more". (b) "Want to know more about this application?": 4 knowledge cards (image with a type tag, title, 2-line summary). (c) "How can we help you?": 3 centred columns, each with an illustration icon, title, text and a pill button.                                            |
| 5   | Products & solutions, scroll | same, `#products`                                           | Groups with a grey heading. Each row has an image, an optional family tag, a name, a 2-line summary, a 4-line spec table (pumps only) and buttons: "View", plus "Size range" for pumps. Services are rows in the same list. "View" fills blue on hover.                                                                              |
| 6   | Product page                 | `/products/ahlstar`                                         | Existing ProductPage header. The Explore tab is rebuilt to the reference layout (§3).                                                                                                                                                                                                                                                |

---

## 1. Type changes (`src/types.ts`)

### Shared

```ts
/** Opening block of an Explore tab: heading, lead paragraph and optional "Show more" text. */
export type ExploreIntro = {
  title: string
  text: string
  /** Extra paragraphs, shown when the user clicks "Show more". */
  more?: string[]
}

/** Card or button that links somewhere, e.g. the "How can we help you?" options. */
export type ActionItem = {
  title: string
  text: string
  icon: LucideIcon
  actionLabel: string
  to: string
}
```

The existing `ExploreContent` is no longer needed once the product and application Explore tabs have moved over. Remove it.

### Application

Layout follows tree position, so no `kind` field is needed: the root is the **overview**, a node with children is a **category**, and a node without children is a **detail** page.

```ts
export type Application = {
  id: string
  name: string
  parentId: string | null
  heroImage: ImageRef
  /** Image for cards and tiles. Falls back to heroImage. */
  tileImage?: ImageRef
  summary: string
  intro: string
  children: string[]
  explore?: ExploreIntro // was ExploreContent
  /** Ids from data/knowledge.ts, for the Explore cards and the Learn tab. */
  knowledgeIds?: string[]
  /** Products & solutions tab, in display order. */
  productGroups?: ProductGroup[]
}
```

The "How can we help you?" block is the same on every application, so it lives in `catalogPages.ts`, not on each `Application`.

### ProductGroup (new)

A group can hold products, services or both. In the reference, "Digital services" and "Operation services" are groups in the same list.

```ts
export type ProductGroup = {
  id: string
  title: string
  productIds?: string[]
  serviceIds?: string[]
}
```

Applications with no `productGroups` keep the current fallback: products grouped by `category`.

### Product

```ts
export type Product = {
  // …existing fields…
  /** Pumps only. Sensors, controllers and software hide the spec strip and the "Size range" button. */
  keySpecs?: KeySpecs // was required
  /** One line under "Suitable for", e.g. the standard the pump is built to. */
  standard?: string
  tabs: {
    explore: ProductExplore // was ExploreContent
    serviceIds: string[] // was services: IconItem[]
  }
}

export type ProductExplore = {
  intro: ExploreIntro
  /** Large grey panel: product image on the right, headline and text on the left. */
  feature?: { title: string; text: string; image: ImageRef }
  /** Shown as 3 text columns under the feature panel. */
  highlights: IconItem[]
  /** Band with text, a button and a badge image. */
  promo?: { title: string; text: string; actionLabel: string; to: string; image: ImageRef }
  /** Knowledge items of type "Case story". */
  storyIds?: string[]
}
```

The `id` changes from `end-suction-pump` to `ahlstar` (see §2).

### KnowledgeItem (new)

```ts
export type KnowledgeType =
  'Engineering guide' | 'White paper' | 'Ask the expert' | 'Article' | 'Case story' | 'Course'

export type KnowledgeItem = {
  id: string
  type: KnowledgeType
  title: string
  summary: string
  image: ImageRef
  to: string
}
```

### Service (new)

Services are shown as rows in the Products & solutions list and as cards on the product Services tab.

```ts
export type Service = {
  id: string
  name: string
  summary: string
  icon: LucideIcon
  /** Thumbnail in list rows. */
  image: ImageRef
  to: string
}
```

---

## 2. Data files

All names marked _placeholder_ go through `config/demo.ts`, as in Phase 1.

### `src/config/demo.ts`

- Rename `products.mainEndSuctionPump` to `products.ahlstar`, with the value `'AHLSTAR'`. Do the same for `productSeries`; the model prefix needs confirming with Sulzer.
- Add the names of the other products below (_placeholders_).

### `src/data/applications.ts`

- **Root:** 8 categories, so the grid has 3 rows like the reference. Each category has 2–7 children (name, summary, tone) so the counts and link lists look realistic. Water treatment gets more than 7, so "Show all" appears.
  - Municipal water supply
  - Wastewater
  - Water treatment
  - Industrial processes
  - Building services
  - Pulp & paper
  - Oil & gas
  - Mining & minerals
- **Municipal water supply:** 6 children for the 3×2 tile grid: Surface water intake, Groundwater intake, Drinking water treatment, Water distribution, Desalination, Raw water transfer.
- **Surface water intake:**
  - New hero intro in Sulzer's voice. The current text follows the reference wording too closely.
  - `explore`: a heading, a 2-sentence lead, and 2 "more" paragraphs covering seasonal variation, debris and silt, fish protection, and energy as the largest lifetime cost.
  - `knowledgeIds`: 4 items.
  - `productGroups`: see the table below.
- **Other leaves:** hero and intro only. They keep today's "guide coming soon" state.

### `src/data/products.ts` (from 2 products to about 9)

Proposed `productGroups` for Surface water intake. This is Sulzer's own grouping, not a copy of the reference.

| Group                        | Items (_placeholder names_)                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Monitoring & protection      | condition-monitoring sensor, pump controller                                                                                       |
| Axially split pumps          | double-suction split case pump                                                                                                     |
| End suction pumps            | **AHLSTAR** (recording target, 2nd of 4), plus 3 sibling ranges or variants (e.g. bare shaft, close-coupled, frequency-controlled) |
| Vertical & submersible pumps | vertical column pump, submersible column pump                                                                                      |
| Digital services             | `iotOffering` (existing), remote monitoring service _(services)_                                                                   |
| Operation services           | Commissioning, Inspection, Installation, Thermal/vibration analysis _(services)_                                                   |

Each product gets:

- name, family tag, category and `applications` (3+ for AHLSTAR, so "View more" shows)
- summary and `standard`
- `keySpecs` (pumps only)
- 1–2 images
- `tabs.explore` (`ProductExplore`)
- `serviceIds`

**AHLSTAR's key specs, family tag and standard must be confirmed by Sulzer.** Today's values were invented for a generic pump.

AHLSTAR's explore content:

- intro with "Show more"
- a feature panel, e.g. "High efficiency"
- 3 highlights
- a promo, e.g. a quick-delivery or configurator band (_needs a Sulzer-approved programme name_)
- 2–3 customer stories

### `src/data/services.ts` (new)

About 8 services: Commissioning, Inspection, Installation, Vibration analysis, Service agreements, Repair & overhaul, Remote monitoring, Energy audit. They link to existing placeholder routes such as `/support/service-portal` and `/digital-solutions`.

### `src/data/knowledge.ts` (new)

About 8 items:

- 4 for Surface water intake: an engineering guide, an "Ask the expert" video, a pump handbook and an article
- 3 case stories for AHLSTAR
- 1 more for the Learn tab

They link to `/learn` (placeholder) for now. Case stories are anonymised (e.g. "Municipal utility, Northern Europe") until Sulzer approves real ones.

### Rename `end-suction-pump` → `ahlstar`

Update `productModels.ts`, `spareParts.ts`, `documents.ts`, `projects.ts` and `assets.ts`.

### `src/data/catalogPages.ts`

New copy:

- overview heading and "Show all"
- knowledge section heading and lead
- the **help section**: heading, lead and 3 `ActionItem`s:
  - Ready to buy? → `/contact/quote`
  - Order online → `/eshop`
  - Need service? → `/self-service/requests`
- "Show more" / "Show less"
- "Size range"
- "View more" (Suitable for)
- spec-table labels (reuse `keySpecLabels`)
- product-story heading
- Learn tab heading

---

## 3. Components

One component per file. **New** = new file; **Extend** = change an existing one.

### Page

- **Extend `pages/ApplicationPage.tsx`.** Resolve the application from the nested path (§4), then render one of three views by tree position.

### `components/application/`

| Component                     | Status | Purpose                                                                                                                                                                                                                                                                                     |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ApplicationOverview.tsx`     | New    | Step 1: hero (panel on the right), then a grey section with a heading and a grid of `ApplicationCategoryCard`.                                                                                                                                                                              |
| `ApplicationCategoryCard.tsx` | New    | Image (4:3, subtle zoom on hover), then "Name (count)" and up to 7 child links, then "Show all" linking to the category page.                                                                                                                                                               |
| `ApplicationCategory.tsx`     | New    | Step 2: hero, intro and a grid of `ApplicationCard`.                                                                                                                                                                                                                                        |
| `ApplicationCard.tsx`         | New    | Image tile with the title below and an arrow-circle button. The home page's `ApplicationTile` stays unchanged.                                                                                                                                                                              |
| `ApplicationDetail.tsx`       | New    | Steps 3–5: hero, tab bar and three panels. The current tab logic moves here.                                                                                                                                                                                                                |
| `ApplicationHero.tsx`         | Extend | Swap the full-width gradient for a **floating dark panel**: semi-opaque navy with a slight gradient, inset from the edges. Add `panelSide: 'left' \| 'right'` (right for the overview, left for detail pages). The photo stays visible beside the panel. The breadcrumb stays on the photo. |
| `ApplicationExploreTab.tsx`   | New    | `ExploreIntroBand`, then `KnowledgeGrid`, then `HelpSection`.                                                                                                                                                                                                                               |
| `ApplicationProductsTab.tsx`  | New    | Renders `productGroups` through `ProductGroups`.                                                                                                                                                                                                                                            |

### `components/product/`

| Component               | Status | Purpose                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProductGroups.tsx`     | Extend | Take resolved groups `{ id, title, products, services }[]` instead of grouping by itself. Only `ApplicationPage` uses it.                                                                                                                                                                                                                                                   |
| `ProductListItem.tsx`   | Extend | 3 columns: image / tag + name + summary / spec table + buttons. **The whole card can no longer be one `<Link>`**, because it now contains two links. Make the name a link with a stretched-link overlay so a click anywhere still opens the product. "View" and "Size range" sit above the overlay as real links. With no `keySpecs`, hide the spec table and "Size range". |
| `ServiceListItem.tsx`   | New    | Same row shell for a service: thumbnail, name, summary, "View".                                                                                                                                                                                                                                                                                                             |
| `ProductHeader.tsx`     | Extend | Show the first 3 "Suitable for" links with a "View more" toggle, then the `standard` line. Hide `KeySpecStrip` when `keySpecs` is missing.                                                                                                                                                                                                                                  |
| `ProductExploreTab.tsx` | New    | `ExploreIntroBand`, then `FeaturePanel` and the highlight columns, then `PromoBand`, then a stories grid (`KnowledgeGrid`, 2 columns, captions on the image). Replaces `ExploreSection` + `TabCallout` on the product page.                                                                                                                                                 |
| `FeaturePanel.tsx`      | New    | Large grey panel with a headline and text on the left and the product image on the right, followed by 3 text columns.                                                                                                                                                                                                                                                       |
| `PromoBand.tsx`         | New    | White band: title, text and a pill button on the left, badge image on the right.                                                                                                                                                                                                                                                                                            |

### Shared (`components/`)

| Component              | Status | Purpose                                                                                                                                                                 |
| ---------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ExploreIntroBand.tsx` | New    | Full-width grey band with a navy heading and a lead. "Show more" expands the extra paragraphs with a 200 ms height/opacity transition. Used by both Explore tabs.       |
| `KnowledgeCard.tsx`    | New    | Image with a type tag in the bottom-left corner, title in blue, 2-line summary. A `variant="overlay"` prop puts the caption on the image instead, for customer stories. |
| `KnowledgeGrid.tsx`    | New    | Section heading, lead and a 3-column (or 2-column) grid of `KnowledgeCard`.                                                                                             |
| `HelpSection.tsx`      | New    | Centred heading and lead, then 3 `ActionItem` columns, each with a large line icon (lucide, `strokeWidth` 1.25, ~64 px), title, text and a pill button.                 |
| `ServiceCard.tsx`      | New    | Used on the product Services tab instead of `IconCardGrid`.                                                                                                             |
| `ExploreSection.tsx`   | Remove | Once both Explore tabs have moved over and nothing else imports it.                                                                                                     |

### `lib/catalog.ts`

Add:

- `getApplicationByPath(segments)`
- `applicationPath` (now builds the nested path)
- `descendantCount(app)`
- `resolveProductGroups(app)`
- `getService` / `servicesFor(ids)`
- `knowledgeFor(ids)`

`navigation.ts` and `home.ts` call `applicationPath`, so they pick up the nested URLs automatically.

---

## 4. Routes

| Route                                                                                           | View             |
| ----------------------------------------------------------------------------------------------- | ---------------- |
| `/applications`                                                                                 | Overview         |
| `/applications/municipal-water-supply`                                                          | Category         |
| `/applications/municipal-water-supply/surface-water-intake` (`#explore`, `#products`, `#learn`) | Detail with tabs |
| `/products/ahlstar` (`#explore`, `#models`, …) and the other product ids                        | Product page     |

- In `App.tsx`, replace `/applications/:slug` with `/applications/*`. `ApplicationPage` checks each segment against the tree; a wrong nesting renders `NotFoundPage`.
- "Size range" links to `/sizing?product=<id>`. "Size application" links to `/sizing?application=<id>` (existing stub).
- **QA script** (`scripts/qa-screenshots.mjs`):
  - Build nested application URLs.
  - Drop the root `#tab` variants.
  - Add `#products` and `#learn` for detail applications that have content.
  - Add a state shot with "Show more" expanded.
  - Products are picked up automatically.
- No new placeholder routes.

---

## 5. Images

`_asset-source/images/` **does not exist yet**, so every file below is missing and would render as the gradient placeholder. The only Sulzer photos in the repo are the corporate stills (`_asset-source/video/sulzer-dynamical-corporate-poster.jpg` and `src/assets/images/sulzer-dynamical-still.jpg`).

Sources must be Sulzer media (sulzer.com, the media bank, product photography) or licensed stock. **Nothing from Grundfos.**

### Priority 1: visible in the recording

| File                                                                                                                                                                                               | Used on                            | Notes                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `applications-hero.jpg`                                                                                                                                                                            | Overview hero                      | Wide, at least 2400×900. Subject on the left (the panel covers the right).                            |
| `app-municipal-water.jpg`, `app-wastewater.jpg`, `app-water-treatment.jpg`, `app-industrial-processes.jpg`, `app-building-services.jpg`, `app-pulp-paper.jpg`, `app-oil-gas.jpg`, `app-mining.jpg` | Overview cards, category heroes    | 8 images, 4:3 crop must work                                                                          |
| `app-surface-water-intake.jpg`                                                                                                                                                                     | Category tile, detail hero         | Intake pump station or river intake. Subject on the right (the panel covers the left).                |
| `app-groundwater-intake.jpg`, `app-drinking-water-treatment.jpg`, `app-water-distribution.jpg`, `app-desalination.jpg`, `app-raw-water-transfer.jpg`                                               | Category tiles                     | 5 images                                                                                              |
| `knowledge-intake-guide.jpg`, `knowledge-expert-video.jpg`, `knowledge-pump-handbook.jpg`, `knowledge-intake-article.jpg`                                                                          | Explore knowledge cards            | 4:3                                                                                                   |
| `product-ahlstar.png`                                                                                                                                                                              | Products row, product header       | Cut-out on white or transparent                                                                       |
| `product-<id>.png` × about 8                                                                                                                                                                       | Products & solutions rows          | Cut-outs: sensor, controller, split case, 3 end-suction siblings, vertical column, submersible column |
| `service-<id>.jpg` × 6                                                                                                                                                                             | Digital and operation service rows | Small thumbnails of people working on site                                                            |

### Priority 2: product page below the fold and other tabs

| File                                                                        | Used on                                                                             |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `product-ahlstar-feature.png`                                               | Feature panel (second angle or cut-away)                                            |
| `promo-badge.png`, or build it in SVG                                       | Promo band. Recommended: an SVG/CSS badge in Sulzer colours, so no image is needed. |
| `story-*.jpg` × 3                                                           | Customer story cards                                                                |
| `knowledge-*.jpg` for the Learn tab, `app-<child>.jpg` for other categories | The overview only shows those children as text, so gradients are fine               |

Icons for "How can we help you?" come from lucide in Sulzer blue. We don't use illustrations.

---

## Open questions

1. **AHLSTAR:** is it the right pump to feature for surface water intake? Please confirm its family tag, standard, key specs and model prefix, and its three sibling ranges in the "End suction pumps" group.
2. **Other names:** the Sulzer product and service names for the other groups.
3. **Optional extra.** The reference Explore tab is fairly plain. Should we add one Sulzer-only "wow" block between the intro and the knowledge cards, such as an animated intake process diagram (source → screens → pump station → treatment) that links each stage to its product group? It adds no images, about 1 component and a few seconds of scroll in the clip.
4. **Category page:** there's still no full screenshot. Is the deck thumbnail layout (image tiles with title and arrow below) enough?
5. **Product promo band:** which Sulzer programme (delivery, configurator, energy audit) should it promote, if any?

## Build order (once approved)

1. Types, the `ahlstar` rename, `services.ts`, `knowledge.ts` and the `catalog.ts` helpers.
2. Nested routes and the three-view `ApplicationPage`, with the current content still rendering.
3. Overview: hero panel and category cards (step 1).
4. Category: tile grid (step 2).
5. Detail: hero panel, `ExploreIntroBand`, `KnowledgeGrid` and `HelpSection` (steps 3–4).
6. Products & solutions: new `ProductListItem`, `ServiceListItem` and groups (step 5).
7. Product page: header tweaks and the new Explore tab (step 6).
8. Learn tab, QA script update, then `npm run build`, `npm run lint` and `npm run qa` at 1920×1080 and 1440×900.
