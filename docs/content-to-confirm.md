# Content to confirm with Sulzer

Every product name, spec value and claim below was written for the mock-up. Each one is a
**placeholder; confirm with Sulzer** before a video is published. Where a value lives in
`src/config/demo.ts`, change it there; everything else is in the data file named.

## Before recording the Application finder video

Rehearse with `npm run flow`. It walks the recording path, saves a screenshot per step to
`_qa/screenshots/flows/application-finder/` and a video to `_qa/videos/application-finder.webm`,
and checks links, tab hashes, the sticky tab bar and layout shift.

1. **Images:** all 122 images are still missing. The 38 that appear on the recording path are
   marked "1 · application finder" in [images-needed.md](images-needed.md):
   - 3 heroes (overview, Municipal water supply, Surface water intake)
   - 8 area cards and 6 Municipal water supply tiles
   - 4 knowledge cards
   - 8 product cut-outs (including `ahlstar-feature.png`)
   - 6 service thumbnails
   - 3 customer story photos
2. **Placeholder labels:** set `showPlaceholderLabels = false` in `src/config/demo.ts`.
3. **Content:** confirm the items in the sections below. Most visible in the video:
   - the AHLSTAR key specs and standard line
   - the "Fast delivery programme" promo and its "2 weeks" badge
   - the three customer stories
4. **Links that end on placeholder pages.** These are not on the recording path but are
   clickable. Placeholder, confirm with Sulzer where they should go:
   - The "Products & services" and "Products A–Z" breadcrumbs both go to Products A–Z
     (`/products`), the search results page without a query.
   - "Download brochure" goes to `/support/documentation`, and no file is downloaded.
   - Knowledge cards and customer stories go to `/learn` (Sulzer Academy, "Coming soon").
   - Help cards go to `/contact/quote`, `/eshop` and `/self-service/requests`, all "Coming soon".
   - Service rows go to `/support` or `/support/service-portal`, both "Coming soon".

## Before recording the Product finder video

Recording path: header search → type "AHLSTAR" → suggestions → Enter → `/products?q=ahlstar` →
AHLSTAR → `/products/ahlstar` → Models, Documentation, BIM and Services tabs. There is no
rehearsal script for this path yet; `npm run flow` covers the search suggestions and the
results page.

1. **Sign in first** (Shift+D → "Sign in as demo user"). Signed out, the Models tab shows
   "Sign in to see prices" instead of prices and availability, and the service request form is
   empty instead of prefilled.
2. **Images:** 8 of the images in [images-needed.md](images-needed.md) appear on this path
   (marked "product finder"): `ahlstar-main.png`, `ahlstar-bim-preview.png` and the 6 AHLSTAR
   service photos. 5 of them are shared with the application finder. The 4 service-video
   thumbnails are in the data but not shown on any page yet.
3. **Placeholder labels:** set `showPlaceholderLabels = false` in `src/config/demo.ts`.
4. **Content:** confirm the items in the "Product finder (module 2)" section below. Most visible
   in the video: AHLSTAR model names, figures, list prices and lead times; document titles and
   numbers; BIM formats; the six services; "within one working day" and the reference
   `SR-2026-0142`.
5. **Navigation changed in module 2.** Placeholder, confirm with Sulzer:
   - The mega menu "Categories" now lists the 8 categories that have products in the mock-up,
     each opening Products A–Z filtered to it. Multistage pumps, Mixers and agitators, Aeration
     systems and Turbocompressors were removed because no product in the mock-up belongs to them
     (they ended on "No results"). Add products to bring them back.
   - Popular searches are now AHLSTAR, Submersible pumps, Vertical turbine, Condition
     monitoring and Raw water (header and "No results"), and AHLSTAR, Submersible pumps, Raw water
     and Wastewater (home hero). Each finds something.
   - The home hero scopes Products, Applications and Documentation open the matching tab of the
     search results. "Spare parts" still goes to its "Coming soon" page.
6. **Links that end on placeholder pages.** Not on the recording path, but clickable:
   - "Size product", "Size range" and "Size this model" go to `/sizing` ("Coming soon", naming
     the product or model).
   - "View my requests" after a service request goes to `/self-service/requests` ("Coming soon").
   - The toast after "Add to project" links to My projects, where the model does not appear.
   - Service "Learn more" links go to `/support`, `/support/service-portal` or `/connect`.
   - The Spare parts tab shows "Coming soon".

## Product names (`src/config/demo.ts` → `products`, `productSeries`)

| Item                   | Value in the mock-up                   | Note                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero product           | AHLSTAR                                | Placeholder, confirm with Sulzer. Confirm that it is the right pump to feature for surface water intake; it is mainly marketed as a process pump.                                                    |
| End-suction pump       | SNS                                    | Placeholder, confirm with Sulzer.                                                                                                                                                                    |
| Split case pump        | SMD                                    | Placeholder, confirm with Sulzer.                                                                                                                                                                    |
| Vertical turbine pump  | SJT                                    | Placeholder, confirm with Sulzer.                                                                                                                                                                    |
| Submersible pump       | XFP                                    | Placeholder, confirm with Sulzer. Confirm whether it should be shown as "ABS XFP". It replaces the Phase 1 "Sulzer Submersible Wastewater Pump" everywhere, including My Pages, assets and projects. |
| Vertical mixed-flow    | SJM                                    | Placeholder, confirm with Sulzer.                                                                                                                                                                    |
| Submersible sewage     | AFP                                    | Placeholder, confirm with Sulzer. Confirm whether it should be shown as "ABS AFP".                                                                                                                   |
| Dewatering pump        | "J dewatering pump"                    | Placeholder, confirm with Sulzer: the name of the submersible dewatering range.                                                                                                                      |
| Pump controller        | "PC 441 pump controller"               | Placeholder, confirm with Sulzer: name and whether it is the right controller to show.                                                                                                               |
| Digital product        | BLUE BOX                               | Placeholder, confirm with Sulzer: name, spelling and how Sulzer describes it.                                                                                                                        |
| IoT product            | Sulzer Connect                         | Placeholder, confirm with Sulzer. Also the name of the `/connect` app in the mock-up.                                                                                                                |
| Motor protection relay | "Motor protection relay" (generic)     | Placeholder, confirm with Sulzer. Does Sulzer offer one, and under what name?                                                                                                                        |
| IoT offering in copy   | Sulzer Smart Monitoring                | Placeholder from Phase 1, confirm with Sulzer.                                                                                                                                                       |
| Model prefixes         | `AHLSTAR 100-80-250`, `XFP 100C` style | Placeholder, confirm with Sulzer. Models, sizes and figures in `src/data/productModels.ts` are invented.                                                                                             |

## Product data (`src/data/products.ts`)

All key specs are invented, typical-looking values. **Placeholder, confirm with Sulzer.**

| Product           | Family tag                    | Liquid temp   | Max. flow   | Max. head | Max. pressure |
| ----------------- | ----------------------------- | ------------- | ----------- | --------- | ------------- |
| AHLSTAR           | End-suction single-stage      | -40 .. 180 °C | 5 000 m³/h  | 160 m     | 25 bar        |
| SNS               | End-suction single-stage      | -20 .. 120 °C | 1 400 m³/h  | 150 m     | 16 bar        |
| SMD               | Axially split, double-suction | 0 .. 120 °C   | 12 000 m³/h | 200 m     | 25 bar        |
| SJT               | Vertical turbine              | 0 .. 60 °C    | 15 000 m³/h | 120 m     | 16 bar        |
| XFP               | Submersible, non-clogging     | 0 .. 40 °C    | 2 700 m³/h  | 75 m      | 10 bar        |
| SJM               | Vertical mixed-flow           | 0 .. 50 °C    | 30 000 m³/h | 60 m      | 10 bar        |
| AFP               | Submersible, solids-handling  | 0 .. 40 °C    | 1 200 m³/h  | 60 m      | 6 bar         |
| J dewatering pump | Submersible dewatering        | 0 .. 40 °C    | 600 m³/h    | 110 m     | 11 bar        |

Sulzer Connect, the motor protection relay, the pump controller and BLUE BOX have no key specs.

Claims in summaries and Explore highlights. **Placeholder, confirm with Sulzer.**

- **AHLSTAR:**
  - "clean and slightly contaminated liquids"
  - high efficiency across a wide operating range
  - back pull-out design
  - modular construction with shared parts across sizes
  - suitable for surface water intake, raw water transfer, industrial water supply, process liquid transfer and stock preparation
  - standard line: "Process pumps according to ISO 2858 / ISO 5199". **Placeholder, confirm with Sulzer** which standards apply.
- **SNS:**
  - for clean water supply, irrigation and building services
  - built to standard dimensions
  - premium-efficiency motors
- **SMD:**
  - low NPSH requirements
  - double-suction impeller balances axial forces
  - axially split casing gives rotor access without disconnecting pipework
- **SJT:**
  - motor above water, bowl assembly in the sump
  - column length matched to the lowest water level
  - wear-resistant materials for sand and silt
- **XFP:**
  - clog-resistant, self-cleaning impeller
  - premium-efficiency motor
  - double mechanical seals
  - suitable for raw water, sewage and stormwater
- **Sulzer Connect:**
  - clip-on wireless vibration and temperature sensors plus a gateway
  - retrofits to other brands' pumps
  - no changes to the pump needed
- **Motor protection relay:**
  - protects against overload, phase loss, imbalance and dry running
  - trip history on the display
  - standard fieldbus to SCADA

- **SJM:** very large flows at low to medium head, compact vertical station, flat efficiency curve at part load.
- **AFP:** solids-handling impeller, premium-efficiency motor sealed against water, "cooling-jacket-free design", guide rail installation.
- **J dewatering pump:** portable, hard-metal wear parts for abrasive water, motor protection against overheating.
- **Pump controller:** level control, alternation and pipe cleaning, alarms by text message and SCADA, runs pumps at their most efficient points.
- **BLUE BOX:** analytics on the plant's own data, predicts load and adjusts aeration in real time to cut energy use.

## Product finder (module 2)

Everything below is invented for the Product finder. **Placeholder, confirm with Sulzer.**

### AHLSTAR models (`src/data/models/ahlstar.ts`)

The size code is suction DN - discharge DN - impeller diameter (ISO 2858 style). Confirm the
real sizes, the article numbers and that the figures are in a realistic range. Max. pressure
follows the casing: 16 bar for grey cast iron, 25 bar for ductile iron and duplex.

| Model       | Hz  | Product no. | Flow m³/h | Head m | P2 kW | rpm  | Eff. % | Casing                 | Shaft seal             | kg   | List price (EUR) | Availability  |
| ----------- | --- | ----------- | --------- | ------ | ----- | ---- | ------ | ---------------------- | ---------------------- | ---- | ---------------- | ------------- |
| 40-25-160   | 50  | 62801016    | 12        | 32     | 3     | 2900 | 55     | Grey cast iron         | Single mechanical seal | 95   | 3 850            | Fast delivery |
| 50-32-200   | 50  | 62801024    | 25        | 50     | 7.5   | 2900 | 60     | Grey cast iron         | Single mechanical seal | 150  | 5 420            | Fast delivery |
| 65-40-250   | 50  | 62801032    | 50        | 80     | 22    | 2910 | 68     | Duplex stainless steel | Double mechanical seal | 310  | 14 900           | Made to order |
| 80-50-200   | 50  | 62801040    | 50        | 12     | 3     | 1450 | 70     | Grey cast iron         | Packing                | 120  | 4 600            | In stock      |
| 80-65-160   | 50  | 62801059    | 100       | 32     | 15    | 2930 | 75     | Grey cast iron         | Single mechanical seal | 240  | 8 750            | Fast delivery |
| 100-80-250  | 50  | 62801067    | 120       | 18     | 11    | 1460 | 78     | Grey cast iron         | Single mechanical seal | 330  | 9 980            | In stock      |
| 125-100-315 | 50  | 62801075    | 220       | 30     | 30    | 1475 | 80     | Ductile iron           | Double mechanical seal | 590  | 19 800           | Made to order |
| 150-125-315 | 50  | 62801083    | 320       | 32     | 37    | 1480 | 82     | Grey cast iron         | Single mechanical seal | 760  | 24 600           | Fast delivery |
| 200-150-400 | 50  | 62801091    | 560       | 48     | 110   | 1485 | 83     | Ductile iron           | Double mechanical seal | 1650 | 52 300           | Made to order |
| 250-200-500 | 50  | 62801105    | 950       | 72     | 250   | 1485 | 85     | Ductile iron           | Packing                | 3400 | 118 000          | Made to order |
| 50-32-200   | 60  | 62806014    | 30        | 72     | 11    | 3500 | 60     | Grey cast iron         | Single mechanical seal | 190  | 6 950            | Fast delivery |
| 80-65-160   | 60  | 62806022    | 120       | 46     | 22    | 3530 | 76     | Grey cast iron         | Single mechanical seal | 290  | 12 400           | Made to order |
| 100-80-250  | 60  | 62806030    | 145       | 26     | 18.5  | 1760 | 79     | Duplex stainless steel | Double mechanical seal | 430  | 17 900           | Made to order |
| 150-125-315 | 60  | 62806049    | 385       | 46     | 75    | 1780 | 83     | Ductile iron           | Single mechanical seal | 1100 | 41 800           | Made to order |

- **Prices and availability** show to signed-in users only. Confirm whether a video may show list
  prices at all; if not, hide them or replace them with "Request a quote". The currency (EUR,
  excl. VAT) is `market.currency` in `src/config/demo.ts`.
- **Lead times:** In stock "3 working days", Fast delivery "2 weeks" (matches the "Fast delivery
  programme" promo), Made to order "10–12 weeks".
- **Models tab, computed figures** (`src/lib/modelSpecs.ts`): the performance curves (a
  parabola from 1.25 × rated head at zero flow through the rated point, plus an efficiency curve
  peaking there) and the dimensions (overall length, width and height estimated from impeller
  size and motor power) are illustrative, not Sulzer data. Replace them with real curves and
  dimensional drawings, or label them as typical, before publishing.
- **"Add to project"** only shows a toast ("Added to My projects"); nothing is saved.
- **XFP models** (`src/data/models/xfp.ts`): XFP 100C (24140101, EUR 7 900, Fast delivery) and
  XFP 150E (24150205, EUR 16 400, Made to order, 8–10 weeks), 6 bar, grey cast iron, double
  mechanical seal.

### Documents (`src/data/documents.ts`)

Titles, document numbers (E10318–E10342, E00318, E00412, E20541), revisions, sizes, dates and
languages are invented. There is no file behind any of them: `href` is `null` until a sample
PDF is added to `public/docs` (set `sampleFile` in `documents.ts`).

- AHLSTAR: installation, operating and maintenance instructions; quick guide; data sheets for
  50 Hz and 60 Hz; performance curves; spare parts list; EU declaration of conformity;
  **ATEX certificate** (confirm that AHLSTAR is available in an ATEX version); product brochure
  "AHLSTAR end-suction process pumps".
- Shared with XFP: brochure "Pumping solutions for water and wastewater".
- **Service videos** (V10351–V10354, durations invented): replacing the mechanical seal,
  back pull-out, shaft alignment, impeller clearance. Confirm whether Sulzer has service videos
  for AHLSTAR, or swap in real ones.

### CAD and BIM (`src/data/cad.ts`)

Every model offers Revit (RFA, Revit 2024, LOD 300), IFC (IFC 4, LOD 300), STEP (AP242), DWG
and DXF (AutoCAD 2018) and a PDF dimensional drawing. File sizes are calculated from the pump
weight. Confirm which formats, versions and LODs Sulzer really publishes, and whether per model
or per range.

### BIM and Services tabs

- **"Generate file"** always takes 2 seconds and then offers the file from `src/data/cad.ts`;
  nothing is generated and the download only shows a toast. Confirm that Sulzer can offer
  per-model BIM/CAD files in these formats before the video suggests it.
- **AHLSTAR services** (`serviceIds` in `src/data/products.ts`): Commissioning, Inspection,
  Vibration analysis, Repair & overhaul, Service agreements and Sulzer Connect asset monitoring.
  Placeholder, confirm with Sulzer.
- **Service request:** the band promises that "a Sulzer service coordinator confirms the visit
  within one working day". Placeholder, confirm with Sulzer. The reference number after sending
  is always `SR-2026-0142` (`serviceRequestReference` in `src/config/demo.ts`); nothing is sent.
- **Spare parts tab** shows "Coming soon" until the spare parts module.

## AHLSTAR product page (`src/data/products.ts` → `ahlstar.tabs.explore`)

Everything below is invented for the Explore tab. **Placeholder, confirm with Sulzer.**

- **"Show more" paragraph:** the range shares a small set of bearing units, shaft seals and wear parts across dozens of sizes.
- **Feature panel, "High efficiency":** hydraulics designed for real duty points, premium-efficiency motors, energy as the biggest share of lifetime cost.
- **Feature columns:**
  - Robust design: heavy-duty casing and bearing unit for continuous operation.
  - Sealing options: packing, single or double mechanical seals.
  - Easy maintenance: back pull-out design.
- **Promo, "Fast delivery programme":**
  - "Hundreds of the most popular AHLSTAR configurations are built from stock components"
  - the badge says "2 weeks from order"

  Confirm whether Sulzer has a delivery programme, its name and the lead time. If there is none, change the promo to something Sulzer does offer, such as a brochure or the configurator. The badge is an original SVG drawing (`PromoBadgeGraphic`), not a Sulzer or third-party logo.

- **"Download brochure"** goes to `/support/documentation` (placeholder page). There is no real file behind it.
- **Customer stories** (`src/data/knowledge.ts`, `story-*`). All three are fictional and anonymised, and the first two contain figures:
  - "A Nordic water utility cuts raw water pumping energy by a fifth"
  - "Paper mill doubles time between overhauls on its process pumps"
  - "Coastal desalination plant secures its seawater supply"

  Replace them with approved Sulzer references or remove the figures before publishing.

## Applications (`src/data/applications.ts`)

- **The tree itself:** 8 categories and their sub-applications. Confirm that Sulzer wants to present each market, especially Building services and Mining & minerals. Placeholder, confirm with Sulzer.
- **Surface water intake intro:**
  - "Sulzer covers the whole intake"
  - "low-velocity designs that are gentle on fish and aquatic life"
  - "connected monitoring that flags wear before it puts supply at risk"

  Placeholder, confirm with Sulzer.

- **Which products appear for which application** (`applications` on each product, `productGroups` on Surface water intake). Placeholder, confirm with Sulzer.
- **One-line summaries of every application,** e.g. "High-pressure and seawater intake pumps for reverse osmosis plants" for Desalination. Placeholder, confirm with Sulzer.

## Services (`src/data/services.ts`)

Confirm that Sulzer offers each service under this name and scope. Placeholder, confirm with Sulzer.

- Sulzer Connect asset monitoring: live vibration, temperature and run-time data, with alerts.
- Remote expert support: shares live data with an application engineer for remote diagnosis.
- Commissioning: done by certified Sulzer technicians.
- Inspection: on-site check with a written report.
- Installation: mechanical and electrical, by Sulzer crews.
- Vibration analysis: on-site measurements with expert interpretation.
- Service agreements: planned maintenance at a fixed annual cost.
- Repair & overhaul: workshop repairs with genuine parts, back to as-new performance.
- Energy audit: measures how pumps really run and where upgrades pay back fastest.

## Knowledge items (`src/data/knowledge.ts`)

All four are invented publications. Placeholder, confirm with Sulzer, or swap in real Sulzer material.

- Engineering manual: raw water intake design
- Ask the expert: why pump sump design matters (video)
- The Sulzer centrifugal pump handbook. Sulzer has published a centrifugal pump handbook; confirm the title and whether to show it.
- A river intake that runs leaner, all year round (customer story). This is anonymised and contains no figures; confirm before showing a customer story at all.

## Help cards (`src/data/applications.ts`)

- "Ready to buy?" → Contact sales, `/contact/quote`
- "Looking for our eShop?" → claims ordering "with your own prices and delivery times"
- "Need service?" → claims "remote help from a Sulzer expert"

Placeholder, confirm with Sulzer.
