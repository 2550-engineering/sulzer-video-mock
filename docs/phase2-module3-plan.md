# Phase 2 · Module 3 — Sizing and configuration

Plan only. No code has been written for this module yet. Verification in this module is
`npm run build` and `npm run lint` only: no tests, screenshots or videos.

## References

| What                       | Reference                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Five-step flow (main spec) | `_reference/deck/_reference:deck:06-sizing.png`. The file name contains the full path; rename it to `_reference/deck/06-sizing.png`. |
| Grundfos sizing screens    | None: there is no `_reference/grundfos/sizing/` folder. Layout follows the deck slide only.                                          |

As before, the slide is for layout only. Wording, variant codes, colours and icons are our own.
On the slide the variant codes look like `AA2F2LESBQQEYW1`. We do not copy that scheme (§2).

## What exists

- `/sizing`: a "Coming soon" stub (`SizingPage`). It reads `?product=`, `?model=` and
  `?application=` from the "Size product", "Size this model", "Size range" and "Size application"
  buttons and names the subject.
- `/my-projects`: a "Coming soon" stub (`MyProjectsPage`), signed-in only (otherwise it
  redirects to `/my-sulzer`).
- `src/data/projects.ts`: 3 projects with `productIds`. Only `myPages.ts` (the count and the
  recent activity) and the stub read them.
- `src/data/models/`: 14 AHLSTAR and 2 XFP models with rated points.
- `lib/modelSpecs.ts`: `headAt` / `efficiencyAt` (a parabola through shut-off head and the
  rated point) and `niceAxis`.
- `PerformanceCurve`: a hand-made SVG curve, used on the Models tab and in Compare.
- Shared pieces to reuse:
  - `FilterColumn` / `FilterGroup` (results page)
  - `useUrlParams` (optimistic URL state that keeps the hash)
  - `Modal`, `SelectField`, `SegmentedToggle`
  - the toast
  - `useAuth`
- "Reset demo" (Shift+D) already clears all of `localStorage`.

## Demo path

| #   | Deck step               | Route                                         | What the viewer sees                                                                                                                                                                                                                                                                                                                   |
| --- | ----------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | –                       | `/products/ahlstar`                           | Presenter clicks "Size product" in the header (exists).                                                                                                                                                                                                                                                                                |
| 1   | Select product          | `/sizing?product=ahlstar`                     | Navy **Size product** band: "Size by" (Product family / Application), product family select (AHLSTAR preselected), action row "Load parameters", "Save parameters", "Reset to defaults", **Start sizing**.                                                                                                                             |
| 2   | Flow and head           | same, `&q=300&h=40` as it is typed            | **Select parameters** panel left (pumped liquid, liquid temperature *, flow with unit, head with unit, frequency). **Range chart** right: every AHLSTAR size as a translucent area on log–log axes, and a duty point marker labelled "Q = 300 m³/h · H = 40 m" that moves as the presenter types. Areas that cover the point light up. |
| 3   | Start sizing and result | `/sizing/results?product=ahlstar&q=300&h=40…` | Short "Sizing…" state (500 ms), then **"18 best matches"**, a duty point summary with "Change parameters", the filter list on the left and the results table: checkbox, curve thumbnail, product no. ("On request" for configured variants), variant name, efficiency, power, life cycle cost [EUR/15 years].                          |
| 4   | Configuration           | same, `&seal=double&poles=4`                  | The presenter narrows the list with filter groups: Size, Variant code, Shaft seal, Poles, Connection size, Material, Motor class. Counts update and the list shrinks. No separate configurator.                                                                                                                                        |
| 5   | Add to My projects      | dialog, then `/my-projects/riverside-intake`  | Presenter ticks a result, then the toolbar's **Add to project (1)** opens a dialog with "Riverside intake" preselected and an optional "Your position". **Add** goes to the project page, where the new row is highlighted, and a toast confirms.                                                                                      |

**Sign in before recording** (Shift+D), as for module 2:

- Adding to a project needs an account.
- List prices show only when signed in.
- Signed out, the Add-to-project dialog opens with a "Sign in to save" step instead.

---

## 1. Types (`src/types.ts`)

```ts
export type LiquidId = 'water' | 'seawater' | 'glycol-30'

/** What the customer asks for. Canonical units: m³/h, m, °C. */
export type DutyPoint = {
  flow: number
  head: number
  liquid: LiquidId
  temperature: number
  frequency: 50 | 60
}

/**
 * One pump size (casing + impeller pattern) as sizing sees it: its curve at
 * full impeller and 4-pole speed, and the trim range. Other speeds and trims
 * follow from the affinity laws.
 */
export type Hydraulic = {
  id: string // 'ahlstar-150-125-315'
  productId: string
  size: string // '150-125-315'
  connection: { suction?: number; discharge: number }
  impellerMax: number // mm
  impellerMin: number // mm, smallest allowed trim
  /** Best-efficiency point at impellerMax, 1450 rpm (50 Hz, 4 poles). */
  bep: { flow: number; head: number; efficiency: number }
  /** Speeds this size is sold with. */
  poles: (2 | 4)[]
  materials: CasingMaterial[]
  seals: ShaftSeal[]
  /** Base for list prices: grey cast iron, single seal, IE3, 4 poles. */
  basePrice: number
  weight: number
}

export type MotorClass = 'IE3' | 'IE4'

/** A configurable pump: hydraulic × poles × trimmed impeller × material × seal × motor. */
export type PumpVariant = {
  /** Encodes every choice, so any variant can be rebuilt from its id (§2). */
  id: string
  hydraulicId: string
  productId: string
  /** 'AHLSTAR 150-125-315/302 GS4-E3' */
  name: string
  /** 'GS4-E3': the "Variant code" filter group */
  code: string
  poles: 2 | 4
  speed: number // rpm
  impeller: number // trimmed diameter, mm
  casingMaterial: CasingMaterial
  shaftSeal: ShaftSeal
  motorClass: MotorClass
  motorPower: number // standard IEC rating, kW
  /** Standard variants have a number; the rest show "On request". */
  productNumber: string | null
  listPrice: number
  availability: ModelAvailability
  leadTime: string
}

/** A variant evaluated at a duty point. */
export type SizingResult = {
  variant: PumpVariant
  rank: number // 1 = best match
  /** Duty point as the pump delivers it (equals the request after trimming). */
  flow: number
  head: number
  efficiency: number // pump, % at duty
  shaftPower: number // P2, kW
  inputPower: number // P1 incl. motor losses, kW
  /** Duty flow as a share of best-efficiency flow, e.g. 0.94. Drives the "fit" badge. */
  bepRatio: number
  energyCostPerYear: number // EUR
  lifeCycleCost: number // EUR over 15 years: price + energy
}

/** A filter group with counts. Replaces the results page's `Facet`, so both pages share one type. */
export type FilterGroup = {
  id: string
  label: string
  options: { value: string; label: string; count: number; selected: boolean }[]
}

export type ProjectItem = {
  id: string // 'riverside-intake-30'
  /** 10, 20, 30 … like an order position. */
  position: number
  /** The customer's own tag, e.g. 'RW-03'. */
  customerPosition?: string
  productId: string
  /** Exactly one of these: a sized variant or a catalogue model. */
  variantId?: string
  modelId?: string
  /** For sized variants: the duty point they were sized for. */
  dutyPoint?: DutyPoint
  quantity: number
  /** Pre-formatted, e.g. "Today, 07:58" or "Just now". */
  added: string
}

/** Replaces the current Project: `productIds` gives way to `items`. */
export type Project = {
  id: string
  refNo: string // 'P-2026-0318'
  name: string
  applicationId: string
  status: ProjectStatus
  owner: string
  members: { name: string; role: string }[]
  created: string
  updated: string
  deadline?: string
  client?: { company: string; site: string }
  items: ProjectItem[]
}
```

`Facet` in `lib/productFilters.ts` becomes `FilterGroup` (same shape), so `FilterColumn` and
`FilterGroup` (the component) serve both the product results and the sizing results unchanged.

---

## 2. Data, variant generator and sizing engine

### Data

| File                             | Content                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/hydraulics.ts` (new)   | AHLSTAR: 10 sizes, matching the model sizes (40-25-160 … 250-200-500). The 4-pole BEP at full impeller comes from the model figures, scaled to the full impeller where the model is a trim. Small sizes also run at 2 poles. The plan also adds SNS (4 sizes) and SMD (4 sizes), so "Size by application" can mix families (open question 1). |
| `src/data/liquids.ts` (new)      | Water (998 kg/m³), Seawater (1 025 kg/m³), Water–glycol 30 % (1 040 kg/m³, −3 % efficiency for viscosity). Each with its allowed temperature range.                                                                                                                                                                                           |
| `src/data/sizingPages.ts` (new)  | All copy for /sizing and /sizing/results. `catalogPages.ts` is already long.                                                                                                                                                                                                                                                                  |
| `src/data/projectPages.ts` (new) | Copy for /my-projects.                                                                                                                                                                                                                                                                                                                        |
| `src/data/projects.ts`           | Same 3 projects in the new shape:<br>- **Riverside intake:** gets 2 existing items (a catalogue AHLSTAR model and a sized variant), members and a client.<br>- **North pump station upgrade:** gets an XFP item.<br>- **Harbour district booster station:** gets an AHLSTAR item.                                                             |
| `src/config/demo.ts`             | `sizingDefaults`: product `ahlstar`, Q 300 m³/h, H 40 m, water, 20 °C, 50 Hz. `lifeCycle`: 6 000 h/year, 0.12 EUR/kWh, 15 years. `maxSizingResults: 18`. The default duty point is checked during the build to give at least 18 matches.                                                                                                      |

### Variant generator (`src/lib/variants.ts`)

Pure, no randomness. For a hydraulic it enumerates

```
poles (2 | 4, as sold) × casing material × shaft seal × motor class (IE3, IE4)
```

which gives up to 2 × 3 × 3 × 2 = 36 variants per size. The impeller trim isn't enumerated:
the engine works it out per duty point (below).

- **Variant code** (our own scheme, readable on screen):
  - material: G grey cast iron, D ductile iron, X duplex
  - seal: P packing, S single mechanical, D double mechanical
  - poles: 2 or 4
  - motor: E3 or E4

  For example `GS4-E3` is grey iron, single seal, 4 poles, IE3. The full name is
  `AHLSTAR 150-125-315/302 GS4-E3` (size / trimmed impeller, then code).

- **Id** = `ahlstar-150-125-315-302-gs4-e3`. `variantFromId(id)` parses it back, so projects
  store only the id (plus the duty point).
- **Product number:** variants with code `GS4-E3` or `GS2-E3` and an impeller trimmed to a
  10 mm step get a fixed 8-digit number. It comes from the size's base number plus the trim,
  the same scheme as the models. All other variants are "On request", as on the slide.
- **Price** = `basePrice × material factor (1 / 1.15 / 1.6) × seal factor (0.95 / 1 / 1.25) ×
motor factor (IE4 1.08) × poles factor`, rounded to 10 EUR.
- **Availability:**
  - standard number and grey iron: Fast delivery, 2 weeks
  - other numbered variants: Made to order, 6–8 weeks
  - "On request": Made to order, 10–12 weeks

### Sizing engine (`src/lib/sizing.ts`)

Pure function `size(duty: DutyPoint, scope: { productIds: string[] }): SizingResult[]`.

1. **Curves** (`src/lib/pumpCurves.ts`, shared with the Models tab):
   - Head is a parabola through shut-off head and the BEP: `H(Q) = H0 − (H0 − Hb)(Q/Qb)²` with
     `H0 = 1.25 Hb`. This is the same formula `modelSpecs.ts` uses today; it moves here.
   - Efficiency is `ηb · (2x − x²)` with `x = Q/Qb`.
   - Affinity laws for speed n and trim D:
     - `Q ∝ n·D`
     - `H ∝ n²·D²`
     - efficiency loses 0.5 points per 5 % trim
   - 60 Hz scales speed by 1.2.
2. **Per hydraulic and pole count:**
   - Scale the full-impeller curve to the speed.
   - The duty point is reachable when it lies between the min-trim and max-trim curves, and its
     flow is within 0.5–1.2 × the trimmed BEP flow (the allowed operating range).
   - Solve for the trim D where `H_D(Q) = H` by bisection: 40 fixed iterations, then round up to
     the next whole mm.
3. **Per variant:**
   - Efficiency at duty (minus the liquid's correction).
   - `P2 = ρ·g·Q·H / η`.
   - Motor: the next IEC rating ≥ 1.1 × P2, from a fixed list of 0.75 … 315 kW.
   - `P1 = P2 / η_motor`, with motor efficiency from the class and rating (small fixed table).
   - Energy cost per year = `P1 × hours × price`.
   - LCC = list price + 15 × energy cost. Discounting is left out on purpose: it is easier to
     explain on screen.
4. **Ranking:**
   - Sort by LCC.
   - Ties go to the better BEP ratio (closest to 1), then to the variant id.
   - Keep the best `maxSizingResults` (18). With 18 or more matches the heading reads
     "18 best matches"; with fewer, it shows the real count.
5. **Liquid temperature:** outside the liquid's range or the product's (`keySpecs.liquidTemp`)
   gives a field error and no sizing.

Everything is plain arithmetic on fixed data, so the same URL always gives the same 18 rows in
the same order.

### Configuration = filter groups (`src/lib/sizingFilters.ts`)

The same faceted logic as `productFilters.ts`: options within a group are OR'ed, groups are
AND'ed, and each option's count reflects the other groups. Option values go in the URL. Groups,
in slide order:

| Group (label)   | URL param  | Values                                     |
| --------------- | ---------- | ------------------------------------------ |
| Size            | `size`     | `150-125-315` …                            |
| Variant code    | `code`     | `GS4-E3` … ("Name continued" on the slide) |
| Shaft seal      | `seal`     | `packing`, `single`, `double`              |
| Poles           | `poles`    | `2`, `4`                                   |
| Connection size | `dn`       | suction DN ("Con size inlet")              |
| Material        | `material` | `grey`, `ductile`, `duplex`                |
| Motor class     | `motor`    | `IE3`, `IE4`                               |

Filtering applies to the 18 best matches, not to all candidates, so the list only ever narrows.
That makes it read as "configuring" the result. The generic part (OR within, AND across,
counts) moves into `src/lib/filters.ts`, which both `productFilters.ts` and `sizingFilters.ts`
use.

---

## 3. Charts: recommendation is hand-made SVG

**Recommendation: keep drawing charts by hand in SVG, as `PerformanceCurve` already does. Don't
add Recharts.**

- **Range chart fit:** the range chart is log–log, and each size is an irregular filled area
  between two curves, bounded by flow limits. In SVG that is one `<path>` per area. Recharts
  can do log axes, but filled areas between two arbitrary curves need workarounds.
- **One look:** it matches what's already built. One visual language for the Models tab,
  Compare, the range chart, thumbnails and the result detail, and no second styling system.
- **Determinism:** no default mount animations or measured containers that can render
  differently between takes. `viewBox` scaling stays crisp at 1920 and 1440.
- **Weight:** Recharts plus d3 adds roughly 100 kB gzipped for 3 chart types.

New shared helpers in `src/lib/chartScale.ts`:

- `linearScale` and `logScale`
- `niceAxis` (moves here from `modelSpecs.ts`)
- `logTicks` (1-2-5 steps)
- `pathFrom(points)`

### Range chart (`components/sizing/RangeChart.tsx`)

- **Axes:** log–log, Q [m³/h] and H [m], fitted to the selected family.
- **Areas:** one per hydraulic × pole count. The outline is the max-trim curve from 0.5 to 1.2
  × BEP flow, then back along the min-trim curve.
  - Fill `primary/12`, stroke `primary/35`.
  - Areas that cover the duty point: fill `primary/35`, stroke `primary`, drawn last so they
    sit on top.
- **Duty point:** a yellow dot with a navy ring, guide lines to both axes, and a label
  "Q = 300 m³/h · H = 40 m". The label flips to the left near the right edge.
- **Hover:** hovering an area shows the size name in a small HTML tooltip.
- **Click:** clicking the chart sets the duty point, rounded to 2 significant figures, and
  updates the inputs and the URL. This is optional but is a strong demo moment.
- **Accessibility:** `role="img"` with a text summary: "8 sizes; 3 cover 300 m³/h at 40 m".

### Curve thumbnail (`components/sizing/CurveThumbnail.tsx`)

- 72 × 44 px. Draws the variant's head curve at its trim, with the duty point dot.
- No axes or text. It's decorative (`aria-hidden`); the row says the same in text.

### Result detail

- Opening a row reuses `PerformanceCurve`, extended in two ways:
  - It accepts a curve spec instead of a `ProductModel`: an adapter from `ProductModel` keeps
    the Models tab unchanged.
  - New optional props: a duty point marker, the max-trim curve as a dashed line, and the
    operating range drawn as a light band.

---

## 4. Routes and URL state

| Route                        | State in the URL                                                                                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/sizing`                    | `by` (`product` / `application`), `product`, `application`, `q`, `h`, `liquid`, `temp`, `hz`, `qu` (flow unit `m3h` / `ls`), `hu` (head unit `m` / `ft`). Missing values come from `sizingDefaults`.          |
| `/sizing?product=ahlstar`    | Entry from "Size product" / "Size range" (exists).                                                                                                                                                            |
| `/sizing?model=<id>`         | Entry from "Size this model": that model's product, with its rated point as the duty point.                                                                                                                   |
| `/sizing?application=<slug>` | Entry from "Size application": Size by Application; products are those suitable for it that have hydraulics.                                                                                                  |
| `/sizing/results?…`          | All the `/sizing` params, plus the filters (`size`, `code`, `seal`, `poles`, `dn`, `material`, `motor`, repeatable), `sort` (`lcc` default, `efficiency`, `price`) and `open` (an expanded row's variant id). |
| `/my-projects`               | Redirects to the most recently updated project (open question 3).                                                                                                                                             |
| `/my-projects/:projectId`    | `?added=<itemId>,<itemId>` highlights the rows just added (fades after 2 s), `?tab=details                                                                                                                    | members | documents` for the side panel. |

**History behaviour:**

- **Replace:** typing in a parameter field updates the URL with replace (via `useUrlParams`),
  so the chart, reload and Back all agree. Filter and sort changes also replace.
- **Push:** "Start sizing" pushes `/sizing/results` with the same parameters, so Back returns
  to the parameters exactly as they were. "Add to project" pushes the project page.

The Size product panel's "Save parameters" and "Load parameters":

- **Save** stores the current params in `localStorage` (try/catch) and shows a toast.
- **Load** restores them. With nothing saved, it loads a fixed demo set (Q 220, H 30).

---

## 5. Components

### `components/sizing/` (new)

| Component            | Notes                                                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SizeProductPanel`   | Navy band: title, "Size by" toggle, product family or application select, action row (Load, Save, Reset to defaults, **Start sizing**). Reuses `SegmentedToggle` and `SelectField` (with a dark variant).                                                                                                           |
| `SizingParameters`   | Pumped liquid, temperature (required, range hint), flow + unit, head + unit, frequency toggle. Field errors inline.                                                                                                                                                                                                 |
| `UnitInput`          | Number input with a unit select glued on the right, as on the slide. Converts to canonical units for the URL.                                                                                                                                                                                                       |
| `RangeChart`         | §3.                                                                                                                                                                                                                                                                                                                 |
| `SizingProgress`     | The 500 ms "Sizing…" overlay between Start sizing and the results (fixed duration).                                                                                                                                                                                                                                 |
| `DutyPointSummary`   | Chip row on the results page: Q, H, liquid, temperature, frequency, then "Change parameters" (back to `/sizing` with the same params).                                                                                                                                                                              |
| `SizingResultsTable` | Columns: checkbox, Curve, Product no., Product name (variant), Efficiency %, P2 kW, Motor, LCC [EUR/15 years], and, when signed in, List price and Availability. Sortable headers, zebra rows, sticky header, expandable rows: the same patterns as `ModelsTable`.                                                  |
| `CurveThumbnail`     | §3.                                                                                                                                                                                                                                                                                                                 |
| `SizingResultDetail` | Expanded row: `PerformanceCurve` with the duty point, a key figures list (trim, speed, BEP ratio, P1, energy cost per year, NPSH note), and buttons "Add to project" and "Data sheet" (toast).                                                                                                                      |
| `ResultsToolbar`     | Above the table, as on the slide: select-all checkbox with count, **Add to project (n)**, Compare (reuses `ComparePanel` once it accepts variants), Download data sheets (toast).                                                                                                                                   |
| `AddToProjectDialog` | `Modal`. Signed out: a "Sign in to save to My projects" step (calls `signIn()`, then continues in place). Signed in: project select (default: the project whose application matches, else the most recent), or "New project" with a name field; optional "Your position" per item; **Add** → `addItems` → navigate. |
| `FitBadge`           | Small label from the BEP ratio: "Best fit" (0.9–1.1), "Good fit", "Part load".                                                                                                                                                                                                                                      |

Reused unchanged: `FilterColumn` and `FilterGroup` (once on the `FilterGroup` type), `Modal`,
`SelectField`, `SegmentedToggle`, `Breadcrumb`, the toast and `AvailabilityBadge`.

### `components/projects/` (new)

| Component             | Notes                                                                                                                                                                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProjectList`         | Left column: search field, "Active projects" and "By date" selects, list of projects (name, product count, status chip, updated), "+ New project".                                                                                                                     |
| `ProjectHeader`       | Project name, status chip, ref no., icon actions (print, export, edit, share; each shows a toast), "Add product" (→ `/products`) and "Size a pump" (→ `/sizing?application=<project application>`).                                                                    |
| `ProjectItemsTable`   | Sulzer products table: checkbox, Position, Your position (inline editable), Curve thumbnail, Product (name + product no. / "On request"), Duty point, Qty (stepper), List price and line total when signed in, remove. Rows from `?added` are highlighted.             |
| `ProjectDetailsPanel` | Right column with tabs Project details, Members and Documents. Details: ref no., project ID, status, deadline, created, created by, last modified, client. Members: avatars and roles. Documents: one data sheet per item, plus project-level PDFs (download → toast). |
| `ProjectEmptyState`   | "No products yet" with "Size a pump" and "Find a product".                                                                                                                                                                                                             |

### State: `src/projects/` (new, like `src/auth/` and `src/toast/`)

- **Files:** `ProjectsContext.ts`, `ProjectsProvider.tsx`, `useProjects.ts`.
- **Seeding and storage:** seeded from `data/projects.ts` and stored in `localStorage` under
  `sz-demo-projects` (try/catch, falls back to memory). "Reset demo" already clears it.
- **Actions:**
  - `addItems(projectId, items)` returns the new item ids. Positions continue in steps of 10.
  - `createProject(name, applicationId)` uses ids `project-4`, `project-5` …: sequential, never
    random.
  - `updateItem` and `removeItems`.
- **Times:** item times read "Just now", so nothing depends on the clock.
- **Other readers:** `myPages.ts` reads the project count and recent activity. The My Pages card
  reads the count from the context so it stays in step.

### Pages

- `SizingPage` (rewrite): `SizeProductPanel`, then a two-column `SizingParameters` and
  `RangeChart`.
- `SizingResultsPage` (new): breadcrumb Home › Products & services › Sizing › Results, the
  heading "18 best matches", `DutyPointSummary`, and then `FilterColumn` beside `ResultsToolbar`
  and `SizingResultsTable`.
- `MyProjectsPage` (rewrite): signed-in only. Redirects to the latest project.
- `ProjectPage` (new): breadcrumb Home › My Pages › My projects › <name>, then the three columns.

### `lib/`

| File               | Role                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| `pumpCurves.ts`    | Curve formulas, affinity laws, trim solver. `modelSpecs.ts` imports it. |
| `variants.ts`      | Generator, codes, ids, `variantFromId`, prices, product numbers.        |
| `sizing.ts`        | The engine (§2).                                                        |
| `filters.ts`       | Generic faceted filtering, used by product and sizing filters.          |
| `sizingFilters.ts` | The seven sizing filter groups.                                         |
| `chartScale.ts`    | Scales, ticks, path helper.                                             |
| `units.ts`         | m³/h ↔ l/s, m ↔ ft, display rounding.                                   |

---

## 6. My Projects page layout

At 1920 × 1080, inside `site-container` (1440):

```
Breadcrumb: Home › My Pages › My projects › Riverside intake
┌────────────────┬──────────────────────────────────────────────┬──────────────────────┐
│ Project list   │ Riverside intake        [In progress] P-…    │ Project details │ …  │
│ [Search…]      │ ⎙ ⇩ ✎ ⇪            [Add product] [Size a pump] │ Ref no.    P-2026-… │
│ Active ▾ Date ▾│──────────────────────────────────────────────│ Project ID 396088   │
│ ▌Riverside …   │ Sulzer products (3)                          │ Status     In prog. │
│   3 products   │ ☐ Pos Your pos Curve Product      Duty  Qty  │ Deadline   …        │
│ North pump …   │ ☐ 10  RW-01   ⌇    AHLSTAR 100…   …     2    │ Created    …        │
│ Harbour …      │ ☐ 20  RW-02   ⌇    AHLSTAR 150…   …     1    │ Created by …        │
│ + New project  │ ☐ 30  RW-03   ⌇    AHLSTAR 150…/302 (new)    │ Client     Nordv…   │
│ (w 18rem)      │ (flex)                                       │ (w 20rem)           │
└────────────────┴──────────────────────────────────────────────┴──────────────────────┘
```

- **At 1440:** the right panel moves under the table. Below `lg`, the project list becomes a
  select.
- **Sticky columns:** the list and details columns stick under the header.
- **New rows:** rows added by the demo slide in (fade, 200 ms) with a tinted background that
  fades out after 2 s.

---

## 7. Content to confirm (for `docs/content-to-confirm.md` once built)

- Hydraulic data and the curve model: illustrative, not Sulzer curves.
- The variant code scheme (`GS4-E3`) and the "On request" rule.
- The life cycle cost assumptions: 6 000 h/year, 0.12 EUR/kWh, 15 years, no discounting.
- Motor ratings and efficiencies.
- The default duty point.
- Project names, ref numbers, members and client data.

No new images: thumbnails and charts are SVG, and project rows use existing product cut-outs.

## Open questions

1. **Which products can be sized?** I'd add hydraulics for AHLSTAR, SNS and SMD, so "Size by
   application" can show a mixed result list. The alternative is AHLSTAR only, which makes the
   product select a single option.
2. **Prices signed out.** I'd show life cycle cost to everyone (it's a calculation) and list
   price and availability only when signed in, as on the Models tab.
3. **`/my-projects` without an id.** I'd redirect to the latest project, which matches the
   slide's list + detail layout. The alternative is an overview page with project cards.
4. **Persisting added items.** I'd use `localStorage`, so the result survives a reload during a
   take; "Reset demo" clears it. The alternative is memory only, which is lost on reload.
5. **Click-to-set on the range chart.** I'd include it, because it's a good on-screen moment.
6. **Reference file name.** I'd rename `_reference/deck/_reference:deck:06-sizing.png` to
   `06-sizing.png`.

## Build order (once approved)

1. Types, `pumpCurves`, `chartScale`, `units`, `hydraulics`, `liquids`, `variants`, the sizing
   engine, and `filters` (with `productFilters` moved onto it). Check that the default duty
   point gives at least 18 matches. Build and lint.
2. Projects state (`src/projects/`), the new `projects.ts` shape, and the My Pages count.
3. `/sizing`: Size product panel, parameters, range chart, URL state, entries from product,
   model and application.
4. `/sizing/results`: table, thumbnails, filter groups, toolbar, row detail.
5. Add-to-project dialog and `/my-projects/:projectId`.
6. Docs: content to confirm, CLAUDE.md phase note, QA routes list. Build and lint.
