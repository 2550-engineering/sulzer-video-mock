# Content to confirm with Sulzer

Every product name, spec value and claim below was written for the mock-up. Each one is a
**placeholder; confirm with Sulzer** before a video is published. Where a value lives in
`src/config/demo.ts`, change it there; everything else is in the data file named.

## Before recording the Application finder video

Rehearse with `npm run flow`. It walks the recording path, saves a screenshot per step to
`_qa/screenshots/flows/application-finder/` and a video to `_qa/videos/application-finder.webm`,
and checks links, tab hashes, the sticky tab bar and layout shift.

1. **Images:** all 112 images are still missing. The 38 that appear on the recording path are
   marked "1 · recording" in [images-needed.md](images-needed.md):
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
   - The "Products & services" breadcrumb goes to Product Center (`/products`).
   - The "Products A–Z" breadcrumb goes to a "Coming soon" page.
   - "Download brochure" goes to `/support/documentation`, and no file is downloaded.
   - Knowledge cards and customer stories go to `/learn` (Sulzer Academy, "Coming soon").
   - Help cards go to `/contact/quote`, `/eshop` and `/self-service/requests`, all "Coming soon".
   - Service rows go to `/support` or `/support/service-portal`, both "Coming soon".

## Product names (`src/config/demo.ts` → `products`, `productSeries`)

| Item                   | Value in the mock-up                   | Note                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero product           | AHLSTAR                                | Placeholder, confirm with Sulzer. Confirm that it is the right pump to feature for surface water intake; it is mainly marketed as a process pump.                                                    |
| End-suction pump       | SNS                                    | Placeholder, confirm with Sulzer.                                                                                                                                                                    |
| Split case pump        | SMD                                    | Placeholder, confirm with Sulzer.                                                                                                                                                                    |
| Vertical turbine pump  | SJT                                    | Placeholder, confirm with Sulzer.                                                                                                                                                                    |
| Submersible pump       | XFP                                    | Placeholder, confirm with Sulzer. Confirm whether it should be shown as "ABS XFP". It replaces the Phase 1 "Sulzer Submersible Wastewater Pump" everywhere, including My Pages, assets and projects. |
| IoT product            | Sulzer Connect                         | Placeholder, confirm with Sulzer. Also the name of the `/connect` app in the mock-up.                                                                                                                |
| Motor protection relay | "Motor protection relay" (generic)     | Placeholder, confirm with Sulzer. Does Sulzer offer one, and under what name?                                                                                                                        |
| IoT offering in copy   | Sulzer Smart Monitoring                | Placeholder from Phase 1, confirm with Sulzer.                                                                                                                                                       |
| Model prefixes         | `AHLSTAR 100-80-250`, `XFP 100C` style | Placeholder, confirm with Sulzer. Models, sizes and figures in `src/data/productModels.ts` are invented.                                                                                             |

## Product data (`src/data/products.ts`)

All key specs are invented, typical-looking values. **Placeholder, confirm with Sulzer.**

| Product | Family tag                    | Liquid temp   | Max. flow   | Max. head | Max. pressure |
| ------- | ----------------------------- | ------------- | ----------- | --------- | ------------- |
| AHLSTAR | End-suction single-stage      | -40 .. 180 °C | 5 000 m³/h  | 160 m     | 25 bar        |
| SNS     | End-suction single-stage      | -20 .. 120 °C | 1 400 m³/h  | 150 m     | 16 bar        |
| SMD     | Axially split, double-suction | 0 .. 120 °C   | 12 000 m³/h | 200 m     | 25 bar        |
| SJT     | Vertical turbine              | 0 .. 60 °C    | 15 000 m³/h | 120 m     | 16 bar        |
| XFP     | Submersible, non-clogging     | 0 .. 40 °C    | 2 700 m³/h  | 75 m      | 10 bar        |

Sulzer Connect and the motor protection relay have no key specs.

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
