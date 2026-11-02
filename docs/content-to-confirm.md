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

## Before recording the Sizing video

Demo path: `/products/ahlstar` → "Size product" → `/sizing?product=ahlstar` (set parameters;
"Number of hits" counts down from 586) → Start sizing → `/sizing/results` (18 best matches of 38) → tick a result → "Save as project" → `/my-projects/project-4` → "Open sizing" → change
something → Start sizing → "Update project".

1. **Parameters page (`/sizing`):**
   - The dark "Size Product" band and the action row: Load parameters, Save parameters, Reset
     to defaults, Start sizing.
   - The dense "Select parameters" form: 36 rows from `src/data/sizingParameters.ts`.
   - The optional sizing parameters, collapsed by default.
   - The sticky range chart with 60 coverage shapes.
   - Every value is in the URL.
2. **Sign in first** (Shift+D). Signed out, results show no prices or lead times, and "Add to
   project" asks you to sign in.
3. **Reset demo before each take** (Shift+D), so projects return to their seed state.
4. **Entry points into sizing:**
   - "Size product" on product pages and "Size range" on product rows (Products & solutions,
     search results) go to `/sizing?product=<id>`.
   - "Size this model" on the Models tab goes to `/sizing?product=<id>&model=<model id>`.
   - "Size application" on application pages goes to `/sizing?application=<slug>`.
   - Mega menu "Sizing", the mega menu "Size your product" card, the home "Sizing" card, Quick
     links "Sizing" and the account menu "Size a pump" go to `/sizing`.
5. **Entry points into My Projects:** My Pages "My projects", the account menu "My projects" and
   the "View" link after "Add to project" on the Models tab go to `/my-projects`, which opens the
   most recently changed project. The My Pages activity row "Project ‘Riverside intake’" opens
   that project.
6. **No images needed:** sizing and My Projects charts and thumbnails are SVG.

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

## Before recording Video A: My assets (steps 1–4)

Recording path: `/my-pages` (cursor on **My assets: 2 need attention**) → click it →
`/assets?status=alarm&status=warning` (2 rows: P-211 alarm, RW-02 warning) → RW-02 →
`/assets/rw-02` → Overview, Condition, Documents, Spare parts, Service history → "AHLSTAR
150-125-315" → `/products/ahlstar` (optional).

1. **Sign in as the end user** (Shift+D). `/assets` and `/assets/:id` are signed-in only.
2. **Images:** the 6 site photos are still missing (marked "my assets" in
   [images-needed.md](images-needed.md)). They show in the list's site column, the "By site" cards
   and the asset page header, which crops them to a wide band.
3. **Placeholder labels:** set `showPlaceholderLabels = false` in `src/config/demo.ts`.
4. **Links that end on placeholder pages** (not on the recording path):
   - "Open in Sulzer Connect" and "Open full monitoring in Sulzer Connect" open the asset's
     condition page `/connect/assets/:id`; "Open Sulzer Connect" opens `/connect/dashboard`.
   - "Find replacement" goes to `/products/replacement?serial=…` ("Coming soon" until P6).
   - "Order spare parts" opens the Spare parts tab; the tab's own "Order spare parts" goes to
     `/spare-parts` ("Coming soon" until P5), "Request a quotation" to `/contact/quote`.
   - "Get it connected" and "How it works" on the "Connect this asset" card go to
     `/products/sulzer-connect`.
   - "View my requests" after sending a service request goes to `/self-service/requests` (P4).
   - "Service report" only shows a toast; no file is downloaded.

## Before recording Video A: Sulzer Connect (steps 5–10)

Recording path: header → Quick links → Sulzer Connect → `/connect` (welcome, "Go to dashboard")
→ `/connect/assets` (Asset Monitor, assets by site) → RW-02 → `/connect/assets/rw-02` (health
score 62, vibration crossing 7.1 mm/s at 03:12, recommended action) → "Request service" →
SR-2026-0142.

1. **Sign in as the end user** (Shift+D). Every Connect page except the welcome screen asks you to
   sign in first.
2. **Time range:** the condition page opens on 7 days (the rising trend). `?range=24h` shows the
   03:12 crossing mid-chart; `?range=30d` the whole month.
3. **Acknowledging alerts** is local state: it resets when you leave Connect or reload. The header
   bell counts the alerts nobody has acknowledged.
4. **No images needed:** every chart and gauge is drawn in code.
5. **Links that end on other pages:** "Connect device" and "Learn more" go to
   `/products/sulzer-connect` (the P3 page); "Order bearing kit" opens the asset's Spare parts tab
   on the website; "View asset in mySulzer" opens `/assets/:id`. "Settings", "Manage users",
   "Invite user", "Invite to Sulzer Connect" and "Download PDF" only show a toast.
6. **Partner persona:** `/connect/assets` shows the accounts table (Name, Contact person, Invite and
   manage users, Customer number, Actions). Only Nordvatten has assets; the three other customers
   show "Not on Sulzer Connect yet" with "Invite to Sulzer Connect".

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
| IoT offering in copy   | Sulzer Connect                         | Placeholder, confirm with Sulzer. Was "Sulzer Smart Monitoring" in Phase 1; now the same name as the IoT product, so there is one name everywhere.                                                   |
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

## Sizing (module 3)

Everything below is invented so that sizing looks and behaves like a real configurator, with
repeatable results. None of it is Sulzer data. **Placeholder, confirm with Sulzer** before a video
shows numbers from sizing.

### Defaults and life cycle cost (`src/config/demo.ts` → `sizingDemo`, `src/data/sizingParameters.ts`)

- **Demo duty point:** 150 m³/h at 30 m, water at 20 °C, 50 Hz. Earlier versions used 300 m³/h
  at 45 m, but in the current range only 6 configurations reach it.
  - 38 configurations qualify, and the best 18 by life cycle cost are shown.
  - **Best match:** `AHLSTAR A24-200-315/325 C1-SD-4P-F` (product no. 63244325), about
    207 000 EUR over 15 years.
  - Narrowing to a handful takes more than Shaft seal + Poles. With this range, SD + 4 poles
    still leaves many results; add Material code C1 and a coupling type.
- **Form defaults:**
  - Pumped liquid: Water
  - Variable speed: Yes, external
  - Impeller size: Energy optimised
  - Maximum frequency: 105 %
  - Flow rate margin: from 0 m³/h to the end of the curve (used as 0.2–1.25 × BEP flow)
  - Application: Surface water intake
- **Read-only values:**
  - Mechanical seal: Single (Double when only DD is selected)
  - Shaft seal designation: Mechanical seal
  - Bearing design: Standard
  - Base frame: EN/ISO
  - IE efficiency class: IE4
  - Language on pump plate: GB
- **Optional sizing parameters (defaults):**
  - Load profile: water supply (100/75/50 %)
  - Operating hours and energy price: 6 000 h/year, 0.12 EUR/kWh
  - Control mode: constant speed; reduced night-time duty: no
  - System: 1 pump, 1 duty, no parallel operation
  - Suction conditions: NPSH available 6 m, suction pressure 0 bar, altitude 50 m
  - Liquid properties: density 998 kg/m³, viscosity 1 mm²/s, solids 0 %
  - Tolerances: ISO 9906 grade 2B, no test certificate

  Only operating hours and energy price change the results, through the life cycle cost.

- **Life cycle cost:** purchase price (pump + motor) + 15 × (energy + maintenance). No
  discounting. Maintenance per year = 1.5 % of the purchase price + seal service: 280 EUR
  single, 460 EUR double.

### Hydraulic sizes and range chart (`src/data/hydraulics.ts`)

- **Sizes:** 28 AHLSTAR sizes (A01 `50-32-125` to A28 `300-250-500`), sold with 2, 4 and/or 6
  poles. That gives 60 coverage areas on the range chart, about 2–800 m³/h and 2–180 m.
- **How the curves are derived:** from the impeller diameter (1.05 × nominal; smallest trim
  0.78 × nominal) and the discharge size.
  - BEP head = 0.9 · u²/2g at 1 475 rpm.
  - BEP flow from 2.4 m/s in the discharge nozzle.
  - Efficiency 48 + 14·log₁₀(Q), capped at 86 %.
  - NPSHr 1.2 + 0.5·Q^0.35.
  - Base price 2 200 EUR × (impeller/200)^1.2 × (discharge/32)^0.55.
- **Catalogue rules:**
  - The largest sizes (discharge DN 200+) come in cast iron only, with a spacer coupling.
  - Super duplex is not offered for 400–500 mm impellers.
  - Sizes up to 160 mm have no spacer coupling.

### Configurations, hits and filters (`src/lib/variants.ts`, `src/lib/sizingFilters.ts`)

- **Hits:** a configuration is size × poles × material code × shaft seal × coupling. There are
  586 for AHLSTAR, which is the "Number of hits" with only the product group set.
- **Material codes:**
  - C1: cast iron impeller, cast iron EN-GJL-250 housing
  - S2: duplex impeller, stainless EN 1.4408 housing
  - D3: super duplex impeller, duplex EN 1.4517 housing
- **Seals and couplings:** seals SD (single) and DD (double); couplings F (without spacer) and
  FS (with spacer).
- **Motor per configuration:** IE4, the next standard rating at least 1.25 × shaft power at full
  impeller.
  - Its efficiency is the IE3 table + 0.8 points; its price is the IE3 price × 1.25 (× 1.3 for
    6 poles).
  - Motor numbers look like `MT-40550`.
  - U is 230/400 V up to 3 kW, otherwise 400/690 V.
  - Enclosure: IC410 up to 1.5 kW, IC416 from 110 kW, otherwise IC411.
- **Supported options per configuration:**
  - Mains 3×690 V above 3 kW, 3×460 V up to 90 kW.
  - IP56 from 11 kW, IP65 up to 30 kW.
  - Integrated variable speed up to 22 kW; customer motor from 11 kW.
  - Semi-open impeller for impellers up to 315 mm, not in D3.
  - Liquids: sea water needs S2 or D3; raw water with solids needs a semi-open impeller; light
    oil needs a double seal and no D3.
  - Seal temperature range: SD −20 to 120 °C, DD −40 to 180 °C.
- **Variants and names:** a variant is a configuration with a trimmed impeller (5 mm steps).
  - Name pattern: `AHLSTAR <code>-<inlet DN>-<nominal impeller>/<trim> <material>-<seal>-<poles>P-<coupling>`,
    e.g. `AHLSTAR A24-200-315/325 C1-SD-4P-F`.
  - Standard variants (C1, SD, F) get a fixed number: `63` + size position + poles + trim. They
    show "Fast delivery, 2 weeks"; the rest are "On request", 10–12 weeks.
- **Price factors:** S2 × 1.55, D3 × 2.1, double seal × 1.22, spacer coupling × 1.06.

### Curve model (`src/lib/pumpCurves.ts`, `src/lib/sizing.ts`)

- **Head:** H = H0 − k·Q², with H0 = 1.25 × the BEP head. Trim and speed follow the affinity
  laws.
- **Efficiency:** parabolic around the BEP, minus 0.5 points per 5 % trim, times the liquid's
  factor.
- **NPSHr:** NPSHr at BEP × (0.5 + 0.5·(Q/Q_BEP)²), scaling with speed².
- **Operating point:** on a friction-only system curve through the duty point.
- **Qualifying:** the smallest allowed trim that reaches the duty head, within the flow rate
  margin, and a motor with 10 % margin over shaft power. "Max impeller" uses the full impeller
  only; "Fixed trim" uses 10 mm steps.

### Liquids (`src/data/liquids.ts`)

| Liquid                | Density    | Efficiency factor | Temperature range |
| --------------------- | ---------- | ----------------- | ----------------- |
| Water                 | 998 kg/m³  | 1                 | 0 to 120 °C       |
| Sea water             | 1025 kg/m³ | 1                 | 0 to 50 °C        |
| Raw water with solids | 1050 kg/m³ | 0.96              | 0 to 40 °C        |
| Glycol mix            | 1040 kg/m³ | 0.97              | −20 to 90 °C      |
| Light oil             | 850 kg/m³  | 0.94              | −10 to 120 °C     |

Head in bar or kPa is converted with the liquid's density.

## My Projects (module 3)

Invented for the demo. **Placeholder, confirm with Sulzer.**

- **Projects** (`src/data/projects.ts`): Riverside intake (P-2026-0318, Draft), North pump
  station upgrade (P-2026-0291, Quoted) and Harbour district booster station (P-2026-0274, Draft).
  Their ref numbers, project IDs, dates, deadlines and members (Johan Berg, Sara Nyström, Lars
  Holm, and Mikael Ahonen as the Sulzer application engineer) are fictional. Each product in them
  is the best sizing result for an invented duty point.
- **Client data:** the demo company, the demo user and `emma.lindqvist@nordvatten.example`.
- **Actions that only show a toast:** print, download, edit, copy, delete, "Sale price and profit
  margins", "Customize columns", and project document downloads. "Advanced My Projects" is a
  visual switch only.
- **Saving:** projects, sizings and products are saved in the browser (`localStorage`), as are
  saved parameter sets. "Reset demo" (Shift+D) clears them.
- **Saved sizings:** a sizing stores every parameter, unit, optional parameter and result
  filter, the duty point, the chosen variants and the hit count.
  - New projects get ids `project-4` and up, ref numbers `P-2026-0143` and up, and project IDs
    `396092` and up.
  - Their dates read "Today" or "Just now", so recordings don't depend on the clock.
- **Seed sizing:** Riverside intake holds one, "Surface water intake – 220 m³/h @ 38 m", which
  position 10 came from.
- **Models tab:** "Add to project" there still shows a toast only. Project items are sized
  variants, and catalogue models aren't one.

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

## Personas (Phase 3, `src/config/demo.ts` → `personas`)

| Item                      | Value in the mock-up                                                   | Note                                                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| End user                  | Emma Lindqvist, Maintenance Manager, Nordvatten Utilities AB, Västerås | Placeholder, fictional. Unchanged from Phase 1.                                                                                           |
| Channel partner           | Lars Ek, Sales Engineer, Aqua Pumpteknik AB                            | Placeholder, fictional company and person.                                                                                                |
| Partner status and region | Authorised Sulzer distributor, Region Mälardalen                       | Placeholder, confirm how Sulzer names its partner tiers and regions. Mälardalen so that Nordvatten (Västerås) is in the partner's region. |
| E-mail addresses          | `…@nordvatten.example`, `…@aquapumpteknik.example`                     | Reserved example domains on purpose.                                                                                                      |

## Partner pricing (`src/config/demo.ts` → `partnerPricing`)

| Item             | Value in the mock-up                                                              | Note                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Partner discount | 32% off list price                                                                | Placeholder, confirm with Sulzer. Used for spare parts and partner net prices only.                                       |
| Lead-time labels | "In stock – ships in 2 days", "Fast delivery – 1 week", "Made to order – 3 weeks" | Placeholder. Spare parts and partner prices only; the Models tab keeps its own lead times (`src/data/models/ahlstar.ts`). |

## Installed base (`src/data/assets.ts`)

| Item                | Value in the mock-up                                                                                                                               | Note                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Assets              | 24 units on 6 sites, 18 connected to Sulzer Connect                                                                                                | Invented. Tags, serial numbers, install dates, warranties, run hours and service dates are fictional. |
| Sites               | Riverside intake, Norra water treatment plant, Ekbacken reservoir, Södra and Hamnen pump stations, Östra wastewater treatment plant (all Västerås) | Fictional site names.                                                                                 |
| Partner's customers | Nordvatten Utilities AB, Mälarbruk Paper AB (Köping), Sörby Livsmedel AB (Eskilstuna), Västmalm Energi AB (Sala)                                   | Fictional companies, contacts and customer numbers.                                                   |
| Products on site    | AHLSTAR, XFP, AFP (return sludge), J dewatering pump (drainage)                                                                                    | Confirm these products fit those duties.                                                              |
| Warranty            | 2 years; 3 years for units installed since 2024                                                                                                    | Placeholder, confirm Sulzer's standard warranty terms.                                                |

## Condition monitoring (`src/config/demo.ts` → `conditionLimits`, `src/lib/conditionData.ts`)

| Item                       | Value in the mock-up                                                                        | Note                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Demo date                  | Today is Wed 28 Oct 2026, last sync 08:42                                                   | `demoClock`. Matches the dates already in Recent activity and orders. |
| Vibration limits           | ISO 10816-3-style zones (A/B 2.8, B/C 4.5, C/D 7.1 mm/s RMS), warning 7.1, alarm 11 mm/s    | Placeholder, confirm with Sulzer.                                     |
| Bearing temperature limits | Warning 85 °C, alarm 95 °C                                                                  | Placeholder.                                                          |
| Motor temperature limits   | Warning 105 °C, alarm 115 °C                                                                | Placeholder.                                                          |
| RW-02 story                | Bearing wear: vibration rises over 9 days and crosses 7.1 mm/s today at 03:12, now 7.4 mm/s | Invented.                                                             |
| P-211 story                | Motor temperature climbs overnight to 118 °C (alarm)                                        | Invented.                                                             |
| Data                       | Hourly vibration, bearing and motor temperature and run status for 30 days                  | Generated from a seeded function, the same on every run.              |

## My assets (P1, `src/data/assetPages.ts`, `src/data/assets.ts`, `src/lib/serviceHistory.ts`)

| Item                        | Value in the mock-up                                                                                                                      | Note                                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| RW-02 recommended action    | "Bearing wear pattern detected – inspect within 14 days", recommends the bearing kit (pos. 321, 62016308)                                 | Invented, `conditionFindings`. Also what the Connect app (P2) shows.                                |
| P-211 recommended action    | "Motor running hot under continuous load – check the inflow and motor cooling today"                                                      | Invented.                                                                                           |
| Service center              | Sulzer Service Center Västerås                                                                                                            | Placeholder, confirm the nearest real Sulzer service center for the region.                         |
| Technicians                 | Mikael Sjöberg, Anna Forsell, Jonas Wikström, Elin Bergqvist                                                                              | Fictional names.                                                                                    |
| Service history             | Commissioning, a repair or inspection, the Sulzer Connect sensor retrofit (8 Oct 2024) and the last two annual services, with work orders | Generated from each asset's dates. Work descriptions are plausible, not Sulzer's service checklist. |
| "Connect this asset" claims | "Retrofit in under an hour", "No changes to the pump", "Alerts by e-mail and app"                                                         | Placeholder, confirm with Sulzer.                                                                   |
| Service request message     | Prefilled with the tag, serial number and the active alert, e.g. "vibration above warning limit since today 03:12"                        | Same fixed reference SR-2026-0142 as on the product page.                                           |
| Documents per unit          | The product's documents, labelled "For serial no. …" (brochures are not labelled)                                                         | In a real portal these would be the unit's own as-built documents.                                  |
| Spare parts per unit        | The product's spare parts list                                                                                                            | P5 replaces this with the sectional drawing and the unit's BOM.                                     |

## Sulzer Connect app (P2, `src/data/connect.ts`, `src/lib/connect.ts`)

| Item            | Value in the mock-up                                                                                                                                                                                 | Note                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Health score    | 100 minus penalties for vibration (steeper in each ISO zone) and for bearing and motor temperature near their limits. Good 80+, Fair 60–79, Poor below 60. RW-02 = 62, P-211 = 55                    | Invented formula, not Sulzer's. Confirm whether Sulzer Connect shows a health score and how it is named. |
| Vibration zones | ISO 10816-3-style A/B/C/D bands on the vibration chart                                                                                                                                               | Uses `conditionLimits` (already listed above).                                                           |
| Alerts          | Active: RW-02 warning (today 03:12), P-211 alarm (today 07:41). History: zone C entry, escalations and five resolved alerts (high level, low battery, unexpected stop, gateway offline, service due) | Invented. Resolved alerts are in `alertHistory`.                                                         |
| P-211 finding   | "High inflow has kept the pump running non-stop since last night … P-210 and P-212 can share the load"                                                                                               | Invented.                                                                                                |
| Users           | Johan Berg, Sofia Ahlgren, Erik Nordin, Karin Holmqvist (pending) at Nordvatten; Mikael Sjöberg (Sulzer) and Lars Ek (partner) as service partners                                                   | Fictional people and `.example` addresses. Roles: Admin, Operator, Viewer, Service partner.              |
| Teams           | Raw and drinking water, Wastewater network, Sulzer Service Västerås, with their alert channels                                                                                                       | Invented.                                                                                                |
| Monthly report  | "Monthly condition report", October 2026, sent on the 1st of every month; figures computed from the condition data                                                                                   | Confirm whether Sulzer Connect sends a report like this.                                                 |
| App sections    | Dashboard, Assets, Alerts, Reports, Users, Teams, Settings, Exit                                                                                                                                     | Teams added from the deck's slide 11 rail.                                                               |

## Before recording Video A: Sulzer Connect product page (step 7)

Recording path: `/connect` → "Learn more" → `/products/sulzer-connect#explore` (hero, How it works,
benefits, "See it live", customer story, CTA band). The personal toolbar sits on the right edge.

1. **Sign in as the end user** (Shift+D). The personal toolbar and the bookmark on the product
   header are signed-in only. **Reset demo** first, so Saved items and Recently viewed return to
   their seeds.
2. **Images:** `remote-pump-station.jpg` (Explore hero), `story-connect-pump-stations.jpg`
   (customer story) and `digital-solutions-hero.jpg` (`/digital-solutions`) are still missing; see
   [images-needed.md](images-needed.md), marked "connect product page". The devices image
   `sulzer-connect-devices.png` is generated: rebuild it with `npm run connect:devices` after any
   change to the Connect app.
3. **Toolbar at 1440 px:** product, application and search content moves 48 px left so the toolbar
   never covers it; at 1920 px the page margin is wide enough and nothing moves.
4. **Links that end on placeholder pages:** "Talk to an expert" goes to `/contact`; "Request a
   quote" (Variants tab, other digital products) and "Request a demo" (BLUE BOX) go to
   `/contact/quote`; Learn cards and "Read the story" go to `/learn`. All "Coming soon".

## Sulzer Connect product page and digital solutions (P3, `src/data/products.ts`, `src/data/digitalSolutions.ts`)

| Item                          | Value in the mock-up                                                                                                                                                                           | Note                                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Benefit figures               | "50 % less unplanned downtime", "30 % fewer site visits", "25 % lower maintenance cost", "< 1 h to connect a pump"                                                                             | **Placeholders.** Invented; confirm real figures (and their source) with Sulzer or remove them.             |
| How it works                  | Sensors on the pump → gateway on site (mobile network) → analysis in the cloud (ISO limits and baseline) → alerts on your phone                                                                | Confirm the architecture: sensor types, gateway, connectivity and how alerts are sent.                      |
| Hero readouts                 | "Pump station 7 · Pump 2 – Running normally", "Bearing vibration 2.4 mm/s"                                                                                                                     | Decorative, fictional.                                                                                      |
| Customer story                | "A municipal utility watches 42 remote pump stations from one screen", quote by Henrik Dahl, Operations Manager; "42", "−60 % night-time call-outs"                                            | **Fictional** person, utility and figures. Replace with a real Sulzer Connect reference or keep it unnamed. |
| Packages (Variants tab)       | Starter (sensors and app), Professional (gateway, alerts, reports; "Most popular"), Enterprise (expert remote support), 12 features                                                            | Invented packaging. Confirm whether Sulzer sells Connect in tiers, their names and contents.                |
| Pricing note                  | "Priced per connected asset. Your Sulzer sales contact sends a quote within two working days."                                                                                                 | Placeholder.                                                                                                |
| Documents                     | Data sheet E40112, installation guide E40113, quick guide E40114, data privacy sheet E40120 (also on BLUE BOX), EU declaration E40125                                                          | Invented numbers and dates. "Data privacy sheet" is a new document type.                                    |
| Other digital products        | Data sheets and instructions for the pump controller and motor protection relay, a BLUE BOX brochure; their Variants tabs say "on its way"                                                     | Invented. Header buttons: "Request a quote" (BLUE BOX: "Request a demo").                                   |
| Learn tab items               | "Engineering manual: condition monitoring for pump stations", "Ask the expert: reading a vibration trend", "Getting started with Sulzer Connect"                                               | Invented titles, `src/data/knowledge.ts`.                                                                   |
| `/digital-solutions`          | Hero, the home Sulzer Connect promo, 4 product cards, 4 mySulzer tool cards, "Not sure where to start?" band                                                                                   | Confirm the digital portfolio to show.                                                                      |
| Links now on the product page | Home promo "Discover Sulzer Connect", mega menu "Digital solutions › Sulzer Connect", the "Sulzer Connect asset monitoring" service, search and Product Finder open `/products/sulzer-connect` | Quick links "Sulzer Connect" and My Pages "Portals" still open the app (`/connect`).                        |

## Personal toolbar, saved items and recently viewed (P3, `src/data/personal.ts`)

| Item                 | Value in the mock-up                                                                                                | Note                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Where it shows       | Signed in, on `/products`, `/products/:id` and `/applications/*`; hidden below 1024 px                              | Slide 12 layout.                                                                        |
| Buttons              | Compare (red count), Saved items, Sizing, My projects, Recently viewed, Units & market ("Sweden / 50 Hz")           |                                                                                         |
| Emma's saved items   | AHLSTAR, its IOM manual and 50 Hz data sheet, XFP, the XFP IOM manual, SJT (6; the My Pages badge counts them)      | Seed. Was a fixed "12" on My Pages.                                                     |
| Lars's saved items   | AHLSTAR, AFP, J dewatering pump, the water and wastewater brochure                                                  |                                                                                         |
| Recently viewed seed | Emma: AHLSTAR, XFP, SNS, SMD. Lars: AHLSTAR, AFP, XFP. Every product page visit while signed in moves it to the top | Kept per persona in localStorage; "Reset demo" clears it.                               |
| Compare              | Shared with the Models tab: up to 3 models of one product; a model of another product starts a new comparison       | In memory only.                                                                         |
| Units & market       | Market (Sweden, English, EUR) is read-only; Units (Metric / US customary) and mains frequency (50 / 60 Hz)          | Only the frequency changes anything: the Models tab opens on it. Units are stored only. |
