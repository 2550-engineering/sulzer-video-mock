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
   - The home hero and header search have the scopes Products, Part numbers and Documents.
     Applications are no longer a scope; they appear on the "Pages" results tab. Result tabs
     are All, Products, Documentation, Support & learn and Pages.
6. **Links that end on placeholder pages.** Not on the recording path, but clickable:
   - "Size product", "Size range" and "Size this model" go to `/sizing` ("Coming soon", naming
     the product or model).
   - "View my requests" after a service request goes to `/self-service/requests` ("Coming soon").
   - The toast after "Add to project" links to My projects, where the model does not appear.
   - Service "Learn more" links go to `/support`, `/support/service-portal` or `/connect`.
   - The Spare parts tab shows the interactive parts list for AHLSTAR and XFP; other products show "Coming soon".

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
- **Spare parts tab** shows the AHLSTAR parts list and exploded drawing (see "AHLSTAR spare parts").

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

## Consultant persona

Invented for the demo. **Placeholder, confirm with Sulzer.** All people, companies and
addresses are fictional; emails use `.example` domains.

- **Persona** (`consultantUser` in `src/config/demo.ts`): Anna Berg, Senior Consulting
  Engineer, Nordic Water Consulting AB, `anna.berg@nordicwater.example`, market Sweden.
  - The end user (Emma Lindqvist, Nordvatten Utilities AB) is unchanged and stays the default.
  - **Presenter panel (Shift+D):** "Sign in as end user", "Sign in as consultant", "Reset
    demo". The header's "Sign in" signs in the end user.
- **Project statuses (all projects):** Concept design, Detailed design, Tender, Ordered,
  Archived. Ordered and Archived projects count as no longer active.
  - The end user's Draft projects became Concept design; the Quoted one became Tender.
- **Projects per persona:** each persona has its own projects, saved separately in the browser
  (`sz-demo-projects-v4-<persona>`).
- **Consultant's projects** (`src/data/projects.ts`):
  - **Riverside raw water intake upgrade:** P-2026-0412, project ID 397140, Concept design,
    deadline 20 Jan 2027, budget EUR 420,000 (INVENTED).
    - Client: Älvstad Vatten AB (fictional municipal water utility), contact Maria Lund,
      `maria.lund@alvstadvatten.example`, Hamngatan 4, 652 24 Älvstad (fictional address).
    - Consultant firm: Nordic Water Consulting AB.
    - Description and key requirements (INVENTED):
      - 2 × 220 m³/h at 38 m, duty/assist, river water 2–20 °C.
      - Backwash at 150 m³/h at 55 m.
      - NPSH margin of at least 1.0 m.
      - IE3 motors suitable for VSD.
      - EN 1092-1 PN 16 flanges.
      - ISO 9906 grade 2B acceptance test.
    - Members:
      - Anna Berg (owner).
      - Erik Sandberg (Electrical Engineer, Nordic Water Consulting, `erik.sandberg@nordicwater.example`).
      - Mikael Ahonen (Application engineer, Sulzer, `mikael.ahonen@sulzer.example`).
      - Maria Lund (client, Viewer).
    - Products:
      - RW-P1/P2: alternatives A and B, the best and second-best sizing results for 2 pumps at 220 m³/h @ 38 m. A is chosen, "For review".
      - FW-P1 (150 m³/h @ 55 m), now position 30.
    - Comments:
      - Mikael: "both duty points checked against the lowest river level, 1.5 m extra suction
        lift".
      - Erik: "@Anna, variable speed drives for both intake pumps?".
      - Anna's reply: "Yes, let's go for drives. I'll add them to the tender text".
    - Activity from 2 Oct 2026 to "Today, 08:42".
    - Uploads: "P&ID rev B.pdf" (2.4 MB) and "Site layout.dwg" (5.8 MB).
  - **Mill Creek pump station renewal:** P-2026-0377, project ID 396902, Tender, Älvstad
    Vatten AB, Anna and Erik, 2 pumps at 500 m³/h @ 25 m, "Hydraulic report rev A.pdf"
    (1.7 MB).
  - **Kustby booster station study:** P-2026-0109, project ID 392215, Archived. Client: Kustby
    Vatten AB, contact Johanna Ek (`johanna.ek@kustbyvatten.example`). 3 pumps at 150 m³/h @
    55 m.
- **Uploads** are names and sizes only; there are no files behind them.

### Project collaboration (My projects)

- **Product statuses (INVENTED):** Proposed, For review, Approved, Quoted, Ordered. Older items
  show "Proposed".
- **Alternatives:**
  - Products saved together from the compare page form one group.
  - "Choose this alternative" marks one as selected. The others stay in the list, greyed, and
    are left out of the total, the project tender texts and the project package. The project
    report shows all of them.
- **Roles:**
  - Owner, Editor, Viewer. Only the owner can change roles; the owner's role is fixed.
  - Invites take the name from the email ("johan.berg@…" → Johan Berg) and show "Invited".
  - Role descriptions in the invite dialog are INVENTED.
- **Share:**
  - The link is `https://my.sulzer.com/projects/<project ID>` (`shareLinkBase` in
    `src/config/demo.ts`). PLACEHOLDER: confirm the mySulzer URL.
  - Nothing is sent; settings are saved with the project.
- **Activity sentences:**
  - Written in `myProjectsPage.activity` with the actor's first name, e.g. "Anna added AHLSTAR
    … and 2 more to …".
  - New entries read "Just now", and "Today" after a reload.
- **Project report:** "Prepared by <consultant firm>". The footer note "Performance data are
  calculated for the duty point shown and are subject to confirmation by Sulzer" is INVENTED.
  "Print or save as PDF" adds "Project report – <name>.pdf" (2.1 MB) to the documents.
- **New project:** starts in Concept design, owned by the signed-in user. For the consultant, the
  consultant firm is preset.
- **My Pages:**
  - The "My projects" badge counts the persona's active projects.
  - Recent activity links the persona's own project; the consultant gets "Riverside raw water
    intake upgrade, updated by Erik Sandberg, Today 08:42".
- **Catalogue products in projects:** "Add to project" on a configured product or a Models-tab
  model adds it at its rated point (water, 20 °C).

### Tender texts (`src/data/tenderTexts.ts`, `src/lib/tenderText.ts`)

All wording is our own specification style, not Sulzer text. **Confirm or replace with a Sulzer
template.**

- **Sections (Full):** General description, Application and duty point, Hydraulic data,
  Design, Materials, Shaft seal, Motor, Connections, Accessories, Testing and standards,
  Documentation, Manufacturer.
  - **Short:** general, duty, hydraulic, materials, motor, manufacturer.
  - **Manufacturer line:** "Manufacturer: Sulzer, type <model> (product no. …), or equal."
- **Invented clauses (marked INVENTED in the data file):**
  - Operating point between 70 % and 120 % of best-efficiency flow.
  - **Design, end-suction:** integral feet, back pull-out, dimensions to ISO 2858 / EN 22858,
    bearings ≥ 25 000 h L10.
  - **Design, submersible:** S1 duty submerged, guide rails and auto-coupling, cooling jacket.
  - **Seal wording per seal type:** SiC/carbon, EPDM, EN 12756; double seal with barrier fluid;
    for XFP, two seals in an oil chamber with moisture sensor.
  - **Motor:** insulation class F with class B rise, PTC thermistors, ATEX "II 2G Ex db IIB T4
    Gb" for Ex variants.
  - **Defaults:** IE3 class and IP55 for AHLSTAR models; IP55 with the cooling method for sized
    pumps.
  - **Flanges:** EN 1092-2, PN 16.
  - **Accessories:** base plate, spacer coupling, guard to EN ISO 14120, foundation bolts; for
    XFP: auto-coupling, lifting chain, cable.
  - **Testing:** ISO 9906 grade 2B with certificate, hydrostatic test at 1.5 × the maximum
    working pressure, EN 10204 3.1 certificates on request, CE and the Machinery Directive.
  - **Documentation list.**
  - **Shaft:** 1.4021. **Wear parts:** bronze CuSn10 / duplex; XFP: 1.4460.
- **Languages:** only English is written. Swedish and German are shown as "coming soon".
- **Files:**
  - **.docx:** a real Word file built in the browser (Arial, A4).
  - **"Download PDF":** opens the browser's print dialog with only the tender text.
  - **Copy:** puts plain text on the clipboard.
- **In a project:** "Tender texts" makes one document with every product, numbered by
  position ("Pos. 10 – <tag> – <model>", sections 1.1, 1.2 …), with the quantity in the
  general description.

### Consultant: sizing entry and compare

- **Mega menu (Products & services):** Categories, Applications, Products A–Z, Sizing,
  Industries, Product replacement, Liquids, Spare parts, Digital solutions.
  - "Industries" (Municipal water, Wastewater, Industrial water, Energy, Fertilizers, Mining
    and metals, Pulp and paper) opens the matching application areas. Its own page and
    "Liquids" are "Coming soon" pages.
  - Card text: "Find the right pump solution for your installation requirements. Size,
    select and compare pumps and pump systems." Confirm the wording.
- **Compare (`/sizing/compare`):** pump unit weight is an estimate, 1.15 × (0.0045 ×
  impeller^1.9 + 8 × motor kW^0.85), rounded to 5 kg. Illustrative, not Sulzer data.
  - List price is the pump unit's purchase price used in sizing. Lead time is the
    variant's.
  - The best value is the lowest, except efficiency (highest). Speed, impeller and materials
    have no best.
- **"Save comparison to project":** saves every compared pump in a project as "Alternative
  A/B/C"; the selected one is also marked "Selected".

## My Projects (module 3)

Invented for the demo. **Placeholder, confirm with Sulzer.**

- **Projects** (`src/data/projects.ts`, end user): Riverside intake (P-2026-0318, Concept
  design), North pump station upgrade (P-2026-0291, Tender) and Harbour district booster station
  (P-2026-0274, Concept design).
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

## Service Provider Workshop (persona)

Everything below is invented. Placeholder, confirm with Sulzer, or replace with real XFP data.

### Demo settings (`src/config/demo.ts`)

- Demo pump (`serviceProviderDemo.variantId`): 24150231, XFP 150E CB1.6 PE220/4-D01 *10-ST.
- Customer account (`customerAccount`): customer number 104572, discount group SP, 18 % off list
  price on spare parts and service kits. Net prices in the parts list are list price × 0.82,
  rounded to the cent.

### XFP variants (`src/data/xfp.ts`)

- **Category badge:** "Submersible wastewater pump".
- **Model code pattern:** `XFP <size> CB<hydraulic version> PE<P2 × 10>/<poles>-<supply>
*<cable length m>-<ST|EX>`. CB = closed two-channel impeller. Supply D01 = 400 V 50 Hz, D02 =
  690 V 50 Hz, D11 = 460 V 60 Hz. ST = standard, EX = explosion proof. Confirm against Sulzer's
  real XFP type key.
- **Shared by every variant:** 3-phase, IP68, pump housing grey cast iron EN-GJL-250, max.
  ambient temperature 40 °C. Suitable for Wastewater collection and transport, Stormwater and
  flood control, and Wastewater treatment.
- **Lead time wording:** "In stock – ships in <n> days", "<from>–<to> weeks". Up to 3 weeks
  counts as a normal lead time, longer as made to order (`src/lib/availability.ts`).

| Product no. | Code                               | Hz  | P2 kW | rpm  | Voltage | Impeller             | Inlet/outlet DN | Ex  | Cable m | kg  | List price EUR | Availability                            |
| ----------- | ---------------------------------- | --- | ----- | ---- | ------- | -------------------- | --------------- | --- | ------- | --- | -------------- | --------------------------------------- |
| 24140111    | XFP 100C CB1.5 PE75/4-D01 \*10-ST  | 50  | 7.5   | 1455 | 400 V   | Ø245, grey cast iron | 100/100         | No  | 10      | 210 | 7 900          | 2–3 weeks                               |
| 24140112    | XFP 100C CB1.5 PE75/4-D01 \*10-EX  | 50  | 7.5   | 1455 | 400 V   | Ø245, grey cast iron | 100/100         | Yes | 10      | 218 | 9 150          | 4–6 weeks                               |
| 24140121    | XFP 100C CB1.5 PE90/4-D01 \*20-ST  | 50  | 9     | 1460 | 400 V   | Ø260, grey cast iron | 100/100         | No  | 20      | 228 | 8 650          | 2–3 weeks                               |
| 24150211    | XFP 150E CB1.6 PE185/4-D01 \*10-ST | 50  | 18.5  | 1470 | 400 V   | Ø315, grey cast iron | 150/150         | No  | 10      | 455 | 14 900         | 6–8 weeks                               |
| 24150231    | XFP 150E CB1.6 PE220/4-D01 \*10-ST | 50  | 22    | 1470 | 400 V   | Ø330, grey cast iron | 150/150         | No  | 10      | 480 | 16 400         | In stock – ships in 3 days              |
| 24150232    | XFP 150E CB1.6 PE220/4-D01 \*10-EX | 50  | 22    | 1470 | 400 V   | Ø330, grey cast iron | 150/150         | Yes | 10      | 492 | 18 900         | 6–8 weeks                               |
| 24150241    | XFP 150E CB1.6 PE300/4-D02 \*20-ST | 50  | 30    | 1475 | 690 V   | Ø345, duplex 1.4470  | 150/150         | No  | 20      | 545 | 19 800         | 8–10 weeks                              |
| 24150261    | XFP 150E CB1.6 PE250/4-D11 \*10-ST | 60  | 25    | 1770 | 460 V   | Ø300, grey cast iron | 150/150         | No  | 10      | 490 | 17 300         | 8–10 weeks                              |
| 24130931    | XFP 150E CB1.6 PE200/4-D01 \*10-ST | 50  | 20    | 1465 | 400 V   | Ø325, grey cast iron | 150/150         | No  | 10      | 470 | 15 200 (last)  | Discontinued 2018, replaced by 24150231 |

All impellers are "Closed two-channel". These article numbers sit beside the model numbers in
`src/data/models/xfp.ts` (24140101, 24150205); confirm both schemes.

### Search (steps 1–2)

- Typing a model code without spaces ("XFP100") or the start of a product number ("2415")
  suggests configured products, and the Products tab then lists them as variant cards with
  the filter list (Product range, Discontinued products, Frequency, Phase, IP class, Pump
  housing material, Pump inlet size, Impeller type, Ex approval). "XFP" on its own still lists
  the XFP range.
- A search for exactly one part number in the Part numbers scope goes straight to the part.
- Part links open `/products/xfp/<variantId>?part=<part id>#spare-parts`.

### Spare parts of the demo pump (`src/data/spareParts/xfp.ts`)

- **Parts list:** 34 positions in 9 groups. Position number ranges: 100s cable entry, 200s
  motor, 300s bearings, 400s shaft seal, 500s hydraulics, 600s cooling jacket, 700s lifting and
  fixing, 800s sensors, 900s O-rings and gaskets.
- **Part numbers:** 8 digits, 615 + group digit + 4 digits.
- **Drawing:** drawing id `td-xfp150e-01`. Every part has a drawing hotspot id, e.g.
  `impeller` or `seal-primary`.
- **Bearing designations** (6310-2Z/C3, 3312-2Z/C3) are generic standard sizes, not checked
  against a real XFP.

| Pos. | Part                                                       | Part no. | Qty | Material                           | List EUR | Lead time | Service |
| ---- | ---------------------------------------------------------- | -------- | --- | ---------------------------------- | -------- | --------- | ------- |
| 101  | Power cable, 10 m, 4G6 + 2×1.5                             | 61510110 | 1   | Copper, chloroprene rubber sheath  | 412.00   | In stock  |         |
| 110  | Cable gland, M40×1.5                                       | 61511024 | 1   | Brass, nickel-plated               | 86.50    | In stock  |         |
| 111  | Cable entry grommet                                        | 61511131 | 1   | NBR                                | 24.80    | In stock  | 2 years |
| 120  | Terminal board, 6-pole, spring terminals                   | 61512046 | 1   | PA66, glass-fibre reinforced       | 148.00   | 2–3 weeks |         |
| 201  | Stator housing with stator, PE220/4, 400 V                 | 61520117 | 1   | EN-GJL-250, copper winding class H | 4 860.00 | 6–8 weeks |         |
| 210  | Rotor, PE220/4                                             | 61521009 | 1   | Electrical steel, aluminium cage   | 1 940.00 | 4–6 weeks |         |
| 220  | Shaft                                                      | 61522013 | 1   | Stainless steel 1.4021             | 690.00   | 2–3 weeks |         |
| 301  | Upper bearing, 6310-2Z/C3                                  | 61530110 | 1   | Bearing steel                      | 78.40    | In stock  | 5 years |
| 302  | Lower bearing, 3312-2Z/C3                                  | 61530212 | 1   | Bearing steel                      | 196.00   | In stock  | 5 years |
| 310  | Bearing housing, lower                                     | 61531005 | 1   | EN-GJL-250                         | 640.00   | 2–3 weeks |         |
| 311  | Retaining ring, DIN 471, 60×2                              | 61531160 | 1   | Spring steel                       | 6.20     | In stock  | 5 years |
| 401  | Mechanical seal, primary (liquid side)                     | 61540143 | 1   | SiC/SiC, FKM                       | 685.00   | In stock  | 5 years |
| 402  | Mechanical seal, secondary (motor side)                    | 61540238 | 1   | Carbon/chrome steel, NBR           | 298.00   | In stock  | 5 years |
| 410  | Seal housing                                               | 61541007 | 1   | EN-GJL-250                         | 720.00   | 2–3 weeks |         |
| 420  | Oil chamber plug, G 1/2                                    | 61542012 | 1   | Stainless steel 1.4401             | 14.60    | In stock  |         |
| 501  | Impeller, closed two-channel, Ø330                         | 61550133 | 1   | EN-GJL-250                         | 1 620.00 | 2–3 weeks |         |
| 502  | Impeller key, 10×8×40                                      | 61550210 | 1   | Stainless steel 1.4401             | 9.80     | In stock  | 5 years |
| 510  | Wear ring, suction side                                    | 61551015 | 1   | Stainless steel 1.4460             | 214.00   | In stock  | 2 years |
| 520  | Volute, DN 150                                             | 61552015 | 1   | EN-GJL-250                         | 2 950.00 | 6–8 weeks |         |
| 530  | Suction cover, DN 150                                      | 61553015 | 1   | EN-GJL-250                         | 1 160.00 | 4–6 weeks |         |
| 601  | Cooling jacket                                             | 61560122 | 1   | Stainless steel 1.4301             | 1 380.00 | 4–6 weeks |         |
| 605  | Vent screw with seal, G 1/4                                | 61560514 | 1   | Stainless steel 1.4401, NBR        | 18.90    | In stock  |         |
| 701  | Lifting hoop                                               | 61570122 | 1   | Stainless steel 1.4401             | 168.00   | In stock  |         |
| 710  | Hexagon screw, M16×50, volute                              | 61571050 | 8   | A4-70                              | 4.90     | In stock  |         |
| 711  | Hexagon screw, M12×40, suction cover                       | 61571140 | 6   | A4-70                              | 2.80     | In stock  |         |
| 712  | Washer, M16                                                | 61571216 | 8   | A4                                 | 0.90     | In stock  |         |
| 714  | Impeller screw, M16×45, with wedge-locking washers         | 61571445 | 1   | A4-80                              | 21.50    | In stock  | 2 years |
| 801  | Moisture sensor, seal chamber                              | 61580136 | 1   | Stainless steel 1.4401, PEEK       | 236.00   | In stock  | 5 years |
| 802  | Temperature sensors, stator winding, PTC 140 °C (set of 3) | 61580214 | 1   | PTC thermistor, PTFE leads         | 164.00   | 2–3 weeks |         |
| 901  | O-ring, 290×5, stator housing / seal housing               | 61590129 | 1   | NBR                                | 32.40    | In stock  | 2 years |
| 902  | O-ring, 240×5, seal housing / volute                       | 61590224 | 1   | NBR                                | 28.60    | In stock  | 2 years |
| 903  | O-ring, 310×4, cooling jacket                              | 61590331 | 2   | NBR                                | 30.20    | In stock  | 2 years |
| 904  | Gasket, cable entry cover                                  | 61590412 | 1   | NBR                                | 12.40    | In stock  | 2 years |
| 905  | Sealing washer, G 1/2, oil chamber plug                    | 61590505 | 1   | Copper                             | 1.80     | In stock  | 2 years |

"In stock" is "In stock – ships in 2 days". "2 years" or "5 years" is when the part is first
recommended for replacement.

### Service kits

- **"Recommended service parts – 2 years of operation"** (61599002): the 8 parts marked
  "2 years", in their fitted quantities. List price EUR 395.90.
- **"Recommended service parts – 5 years of operation"** (61599005): the 2-year parts plus the 7
  parts marked "5 years", 15 lines. List price EUR 1 905.30.
- Kit prices are the sum of their parts with no kit discount, and a kit's lead time is that of
  its slowest part. Confirm whether Sulzer sells these as kits under their own numbers.

### Production versions

- **"Produced after 2018 (production year and week number)":** production code (YYWW) 1801 or
  later. This is the parts list above.
- **"Produced before 2018":** production code up to 1752. Five parts differ:

| Pos. | Before 2018                                         | Part no. | Material                     | List EUR | Lead time |
| ---- | --------------------------------------------------- | -------- | ---------------------------- | -------- | --------- |
| 110  | Cable gland, M40×1.5, with strain relief clamp      | 61511017 | Brass, nickel-plated         | 92.00    | 2–3 weeks |
| 120  | Terminal board, 6-pole, screw terminals             | 61512031 | PA6, glass-fibre reinforced  | 132.00   | 4–6 weeks |
| 401  | Mechanical seal, primary (liquid side)              | 61540128 | SiC/SiC, NBR                 | 640.00   | In stock  |
| 601  | Cooling jacket                                      | 61560108 | Steel S235, epoxy-coated     | 1 240.00 | 6–8 weeks |
| 801  | Moisture sensor, seal chamber, conductive electrode | 61580111 | Stainless steel 1.4401, PTFE | 198.00   | 2–3 weeks |

The discontinued variant 24130931 (built until 2017) is a "before 2018" pump.

### Spare parts tab and exploded drawing

- **The exploded drawing is an original illustration made for this mock-up**
  (`src/data/drawings/xfp150e.ts`, drawing number TD-XFP150E-01). It is not a Sulzer service
  drawing and is not to scale. `_reference/service_provider` holds no Sulzer drawing, only
  Grundfos screenshots, so nothing was traced. Confirm it may be shown, or supply a real XFP
  exploded view; it can then be placed under the same hotspots.
- **Wording:** "Year and week of production are on the rating plate" is assumed; confirm
  where XFP pumps show their production code.
- **Set prices:** the price of a recommended set is the sum of its parts in the chosen
  production version.

### Product page layout (`/products/xfp/<variant>`, `/products/ahlstar/<model>`)

- **Shared page:** XFP variants and AHLSTAR models use the same page. AHLSTAR models now
  have their own page; model links, Spare parts links and part search open it.
- **Opens on Curves.** The icons under the image are Compare and Share (toasts only).
  Bookmark and Add to project were removed from the page.
- **Price status wording:** "In stock" (green), "Lead time <n>" (blue) and "To be confirmed in
  sales order" (orange, for made to order). Then "Discount group: SP"
  (`customerAccount.discountGroup`).
- **Recommended spare parts (named kits, invented):**
  - XFP 150E: Impeller 61550133, and kits for impeller (61599501), lower bearing
    (61599302), O-ring for motor (61599901), overhaul (61599400) and plug (61599420).
  - AHLSTAR, per model: impeller, and kits for impeller, bearings, shaft seal, gaskets and
    O-rings, overhaul and plugs. Numbers are 6299 + size code + 23 / 32 / 43 / 40 / 99 / 90.
  - Kit prices are the sum of their parts. The kits are listed under "Service kits" in the
    parts tree.
- **Curves** (`src/lib/performance.ts`), illustrative:
  - Motor efficiency is about IE3: 0.84 + 0.05 × log10(kW), at most 0.96.
  - Total efficiency is pump × motor, and P1 = P2 / motor efficiency.
  - Liquid density and the liquid's efficiency factor apply. "2 pumps in parallel" doubles
    the flow at the same head.
  - Advanced options: speed 50–100 % and impeller trimmed down to 80 %.
  - "Show duty point" uses the rated point.
- **Drawings tab** (`src/data/drawingDocuments.ts`): DD-<size>-01 dimensional drawing, the
  exploded view (TD-XFP150E-01 or GA-AHLSTAR-01) and WD-<supply> wiring diagram. All
  invented.

### Search results: variants and models (`src/lib/articles.ts`, `searchArticles` in `src/lib/search.ts`)

- **What lists variants:**
  - Searching a product with many sizes by name ("XFP", "AHLSTAR") lists every variant or
    model, 10 per page.
  - So does a model code or product number ("XFP100", "100-80-250", "2415").
  - Broader searches ("pump", "Submersible pumps") keep the product rows.
- **This changes the Product finder recording:** searching "AHLSTAR" now shows "14
  variants of AHLSTAR" instead of the single AHLSTAR row.
- **Values invented for AHLSTAR cards** (the models have no such data): IP55, impeller type
  "Closed", Ex approval "No", 3-phase.
- **Max. flow and max. head:** the end of the drawn curve (1.4 × rated flow) and the shut-off
  head (1.25 × rated head, scaled by speed and impeller for XFP). Illustrative.
- **P2 filter buckets:** up to 10 kW, 10–30 kW, 30–100 kW, above 100 kW.

### Service provider entry points

- **Mega menu:** "Spare parts" goes to `/spare-parts` and "Product replacement" to
  `/products/replacement`. Quick links "eShop" and the "Looking for our eShop?" help card go to
  `/eshop/cart`. My Pages "Spare parts" and "Replace pump", and the mySulzer tool cards, link
  to the same pages.
- **`/spare-parts` ("Find spare parts for your pump"):**
  - Finds pumps by product number or model code: all 9 XFP variants and the 14 AHLSTAR
    models. Spaces are ignored, so "XFP150E" works. Each pump opens its Spare parts tab.
  - Finds parts by number or name; each opens the tab with the part selected (`?part=<id>`).
  - Enter on an exact number goes straight there.
  - XFP variants other than 24150231 show "Parts list not online yet".
- **Wording to confirm:** "The product number is on the rating plate", assumed for both
  pump ranges.

### AHLSTAR spare parts (`src/data/spareParts/ahlstar.ts`, `src/data/drawings/ahlstar.ts`)

- **Drawing:** the exploded view GA-AHLSTAR-01 (back pull-out, exploded along the shaft) is an
  original illustration made for this mock-up, not a Sulzer drawing and not to scale.
- **One parts list per model,** on `/products/ahlstar?model=<model>#spare-parts`. The tab
  opens on AHLSTAR 100-80-250 (`serviceProviderDemo.ahlstarModelId`).
- **Position numbers** follow the common pump nomenclature (102 volute casing, 230 impeller,
  321 bearing …), with .1/.2 for pairs. Confirm Sulzer uses these.
- **Size-dependent parts:** volute casing, impeller, wear rings, casing cover, casing gasket,
  coupling and base plate.
  - Part number: 62 + position digits + size code (01–10 in Models tab order), padded to 8
    digits.
  - Price: the 100-80-250 price × (impeller / 250)^1.6 × ((discharge DN + 20) / 100)^0.4.
- **Motor:** "Motor, <kW> kW, <2|4>-pole, <Hz> Hz, IE3", part number 6280 + kW × 10, price
  EUR 900 + 128 per kW.
- **Seal follows the model:**
  - Single seal: pos. 433, EUR 545.
  - Double cartridge: pos. 433, EUR 1 480.
  - Gland packing models: pos. 461 "Gland packing set", EUR 96.
- **Shared parts:** the bearing unit, shaft and small parts are the same for all models. That
  is not true across real AHLSTAR bearing frame sizes; confirm or supply real BOMs.
- **Service sets:**
  - 2 years: wear rings, impeller nut, oil seals, casing gasket, O-rings.
  - 5 years: those plus the shaft sleeve, seal, throttle bushing and both bearings.
  - Part numbers 6299 + size code + 02 / 05.
- **Search:** finds each part number once. Shared numbers link to the demo model.

| Pos.  | Part (AHLSTAR 100-80-250)                                      | Part no. | Qty | List EUR | Lead time |
| ----- | -------------------------------------------------------------- | -------- | --- | -------- | --------- |
| 102   | Volute casing, DN 100 / DN 80                                  | 62102060 | 1   | 2 680    | 6–8 weeks |
| 230   | Impeller, closed, Ø250                                         | 62230060 | 1   | 1 240    | 2–3 weeks |
| 922   | Impeller nut, M24, self-locking                                | 62092224 | 1   | 38       | In stock  |
| 502.1 | Wear ring, front (suction side)                                | 62502106 | 1   | 168      | In stock  |
| 502.2 | Wear ring, back (casing cover)                                 | 62502206 | 1   | 154      | In stock  |
| 161   | Casing cover                                                   | 62161060 | 1   | 1 120    | 4–6 weeks |
| 210   | Shaft                                                          | 62021045 | 1   | 760      | 2–3 weeks |
| 524   | Shaft sleeve                                                   | 62052445 | 1   | 236      | In stock  |
| 433   | Mechanical seal, single, balanced                              | 62043341 | 1   | 545      | In stock  |
| 471   | Seal cover                                                     | 62047145 | 1   | 312      | 2–3 weeks |
| 456   | Throttle bushing                                               | 62045645 | 1   | 88       | In stock  |
| 330   | Bearing housing                                                | 62033045 | 1   | 1 460    | 4–6 weeks |
| 321.1 | Inboard bearing, deep groove ball bearing 6309-C3              | 62032109 | 1   | 64       | In stock  |
| 321.2 | Outboard bearing, angular contact ball bearing pair 7309-BECBM | 62032209 | 1   | 248      | In stock  |
| 360.1 | Bearing cover, inboard                                         | 62036145 | 1   | 142      | 2–3 weeks |
| 360.2 | Bearing cover, outboard                                        | 62036245 | 1   | 138      | 2–3 weeks |
| 421.1 | Oil seal, inboard, 45×62×8                                     | 62042145 | 1   | 18.50    | In stock  |
| 421.2 | Oil seal, outboard, 40×55×7                                    | 62042240 | 1   | 16.90    | In stock  |
| 638   | Oil level indicator, constant level oiler                      | 62063801 | 1   | 74       | In stock  |
| 840   | Coupling, flexible with spacer                                 | 62840060 | 1   | 420      | 2–3 weeks |
| 681   | Coupling guard                                                 | 62068145 | 1   | 186      | 2–3 weeks |
| 800   | Motor, 11 kW, 4-pole, 50 Hz, IE3                               | 62800110 | 1   | 2 308    | 2–3 weeks |
| 890   | Base plate                                                     | 62890060 | 1   | 980      | 4–6 weeks |
| 183   | Support foot                                                   | 62018345 | 1   | 164      | 2–3 weeks |
| 901   | Hexagon screw, M16×60, casing cover                            | 62090116 | 12  | 2.40     | In stock  |
| 920   | Hexagon nut, M16                                               | 62092016 | 12  | 0.80     | In stock  |
| 400   | Casing gasket                                                  | 62400060 | 1   | 42       | In stock  |
| 412.1 | O-ring, 45×3, shaft sleeve                                     | 62041245 | 1   | 6.40     | In stock  |
| 412.2 | O-ring, 135×4, seal cover                                      | 62041235 | 1   | 9.80     | In stock  |
| 903.1 | Drain plug, G 1/2, with sealing ring                           | 62090312 | 1   | 12.60    | In stock  |
| 903.2 | Vent plug, G 3/8, with sealing ring                            | 62090338 | 1   | 10.40    | In stock  |

### Bill of material and product replacement

- **BOM export:** a CSV made in the browser, named e.g.
  `BOM_XFP_150E_CB1.6_PE220_4_D01_10_ST_after-2018.csv`. It has prices only when signed in.
  The print view is at `/products/xfp/<id>/bom`.
- **Replacement** (`xfpReplacements` in `src/data/xfp.ts`): XFP 150E … PE200/4 (24130931,
  discontinued 2018) is replaced by 24150231.
  - Adapter kit 61599150, "Adapter kit, auto-coupling claw DN 150 (built before 2018 to
    current)", EUR 286, in stock. It is invented.
  - Fit notes from the data, all invented: different bolt pattern of the pre-2018 claw, the new
    moisture sensor, and the same guide rails and base elbow. The other notes (connections,
    supply, motor power, cable, weight) are worked out from the specs.
  - Search on the page finds product numbers and model codes of the XFP variants only.

### eShop: cart, checkout and order confirmation (`eshop` in `src/config/demo.ts`)

- **Prices:** cart prices are list prices. The customer's 18 % parts discount (`netPrice`) is
  not applied yet; confirm whether the cart should show net prices.
- **Freight:** EUR 45 per order, free from EUR 2 500. **VAT:** 25 % (Sweden), added to
  subtotal plus freight.
- **Delivery dates:** counted in working days from a fixed "today", 3 Nov 2026, so recordings
  always show the same dates. Lead time plus 2 days transport. The earliest date uses the
  shortest lead time in the cart and the latest uses the longest. Checkout offers "all
  together" (the default) or "as soon as possible".
- **Delivery addresses:** fictional addresses of Nordvatten Utilities AB in Karlstad: Central
  workshop, Verkstadsvägen 12, and Riverside intake pumping station, Älvkanten 3.
- **Payment:** "Invoice on account, 30 days net" is the only method, charged to customer
  account 104572.
- **Numbers:**
  - Orders: SO-104390 first, then SO-104391 and so on.
  - Saved quotations: Q-10243 first, then Q-10244 and so on.
  - "Reset demo" starts both again.
- **Toast wording:** "Save as quotation" promises a reply "within one working day".
- **Links that end on "Coming soon" pages:** "Track order" (`/self-service/orders`) and "View
  quotations" (`/self-service/quotations`).

### Configured product page (`/products/xfp/<variantId>`)

- **Where to buy** (`serviceCentre` in `src/config/demo.ts`): "Sulzer Service Centre
  Mälardalen", Verkstadsgatan 8, 721 30 Västerås, 14 km from the demo company. It is fictional.
  The phone number +46 70 174 06 42 is in the range Sweden reserves for fiction, and the email
  uses `sulzer.example`. Replace it with a real Sulzer site, or keep it clearly fictional.
- **Quotation:** fixed reference Q-10242 (`quotationReference`). "A Sulzer sales engineer
  replies within one working day" is a service promise to confirm.
- **Price box:** signed in, it shows the variant's list price, stock status and lead time. A
  discontinued variant shows no price.
- **Specifications** (`xfpDetails` in `src/data/xfp.ts`):
  - Liquids: wastewater, stormwater and raw water, 0–40 °C, max. density 1 100 kg/m³, pH 6–11.
  - Free passage: 76 mm (100C) and 100 mm (150E).
  - Shaft 1.4021. Shaft seals SiC/SiC and carbon/chrome steel. NBR O-rings, A4 fasteners.
  - Installation: wet well on auto-coupling, max. immersion depth 20 m.
  - Electrical: insulation class H, S1 duty. Starting: D01 and D11 direct on line, D02
    star-delta. Motor protection: PTC thermistors and a moisture sensor.
- **Curves** (`src/lib/variantCurves.ts`): illustrative. Each model's rated point is taken as
  its best-efficiency point, with shut-off head at 1.25 × rated head. Variants are scaled by
  speed and impeller diameter. Water at 20 °C. P2 is calculated as ρ·g·Q·H / η. Replace with
  Sulzer curves before publishing.
- **Drawings** (`xfpDrawings`): DD-XFP150E-01 (dimensional, rev. B), TD-XFP150E-01 (exploded
  view, rev. B) and WD-PE-D01 (wiring diagram, rev. C). Sizes and dates are invented. There
  are no files; preview shows the designed cover.
- **Toasts:** "Documentation package … (ZIP, 14.2 MB, 9 files)". Export file names are the
  model code with underscores, e.g. `XFP_150E_CB1.6_PE220_4_D01_10_ST.xlsx`.

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

### Project files and package (`src/data/projectFiles.ts`, `src/lib/projectPackage.ts`)

- **Files drawer per project product (INVENTED):**
  - CAD/BIM file names and sizes. Sizes use the BIM tab formula with an estimated unit weight for sized pumps: 150 kg plus 12 kg per motor kW.
  - Drawing and document numbers: `DD-`, `SD-`, `WD-`, `DS-`, `IOM-…-EN`, `DoC-`, `PC-`.
  - Sizes: data sheet 1.1 MB, manual 2.4 MB, declaration of conformity 0.3 MB, curve 0.8 MB; dimensional, sectional and wiring drawings 0.6, 0.9 and 0.3 MB.
  - Dates and revisions.
  - New document type "Sectional drawing".
- **Project package:**
  - The size adds up the files above. Defaults are CAD STEP and BIM Revit, everything ticked.
  - For "Riverside raw water intake upgrade" the defaults give 21 files, 48 MB.
  - The package's "Project files" are the team's uploads only.
- **Documents section:** generated files are shown as by "mySulzer", dated "Today". Uploads keep only the file name and size; the file is not read or stored.

### Discontinued AHLSTAR model (`src/data/models/ahlstar.ts`)

- **AHLSTAR A-series 100-80-250 (INVENTED):**
  - Product no. 62701067. Built until 2019 and replaced by AHLSTAR 100-80-250 (62801067).
  - Rated 110 m³/h at 17 m, 11 kW, 1455 rpm, grey cast iron, gland packing, 345 kg.
  - The old list price (EUR 9,450) is not shown anywhere.
  - Its spare parts list is generated like the other sizes, with its own size code, so the part numbers differ from the successor's. Prices are scaled the same way.
- **Replacement notes (INVENTED):**
  - Same flange sizes and shaft centre height, so the base plate, coupling guard and pipework stay.
  - A mechanical seal instead of gland packing.
- **Banner text:** "This product is discontinued. Spare parts are still available." It now shows on every discontinued variant and model, including the XFP one.
- **Replacement page quick picks:** "Recently discontinued products", newest first.
