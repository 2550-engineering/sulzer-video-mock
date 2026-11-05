# Responsive plan (tablets and phones)

Goal: the mock-up works on tablets and phones, while the desktop layout (1280px and wider) stays pixel-identical.

- **Breakpoints:** phone below 768px (`max-md:`), tablet 768–1279px (`max-xl:`), desktop 1280px and up (untouched).
- **Rule:** only add styles for widths below 1280px (`max-xl:`, `max-lg:`, `max-md:`, or CSS inside `@media (max-width: 1279px)`). New elements that only exist below 1280px carry `xl:hidden`. See CLAUDE.md → Responsive.
- **Desktop guard:** `npm run qa:desktop-compare` after every step must report 0 differences against `_qa/desktop-baseline/` (542 screenshots: every route at 1440×900 and 1920×1080, signed out and as each persona).
- **Audit:** `npm run qa:responsive-audit` writes `_qa/responsive-audit/report.md` plus screenshots. `node scripts/responsive-audit.mjs --report-only` rebuilds the summary from `report.json`.

## How the audit was run

Every route was opened at **390×844** (phone) and **820×1180** (tablet), signed in as Emma (end user). Public pages were also checked signed out, partner pages as Lars (channel partner), and projects and compare as Anna (consultant).

The audit took these measurements:

- horizontal scroll
- elements past the right edge that are not inside a scrolling box
- tables wider than the screen, and whether they scroll or get clipped
- tap targets smaller than 24px (WCAG 2.2 AA) and smaller than 44px
- overlapping text and clipped text
- elements revealed only on hover (`group-hover:opacity-100` and similar)
- dialogs larger than the screen
- SVG charts wider than their box

Header menus and dialogs were opened where a trigger was visible. The automatic findings were then checked by eye against the screenshots. The overlap check is noisy: it also flags closed popovers and the fixed Connect tab bar. Only findings confirmed on the screenshots are listed below.

## Shared problems (every page)

| # | Problem | Phone | Tablet | Status |
|---|---|---|---|---|
| S1 | **Main nav row does not wrap.** The `<ul>` is 555px wide, plus the search button. The whole page scrolls sideways (scrollWidth 575 at 360–430px), so the chat button sits next to the content instead of over it. | ✗ | ok | **Fixed (step 2):** compact header below 1280px |
| S2 | Closed mega menu is still laid out (invisible). Its 12-column grid needs 383px, so the page is 383px wide below that. | ✗ | ok | **Fixed:** `max-xl:hidden` (its trigger only exists on desktop) |
| S3 | Utility row "Sweden / English" has 20px-high tap targets. | ✗ | ✗ | **Fixed:** hidden below 1280px, moved into the drawer |
| S4 | Quick links panel (392px), account menu (288px) and mini cart (352px) hang off the left edge on phones. | ✗ | ok | **Fixed:** quick links moved into the drawer; account menu and mini cart are full-width sheets on phones |
| S5 | Footer: 12-column grid with a 32px gap needs 352px of gaps alone, so the page is 8px too wide at 360px. Four link columns are cramped. | ✗ | cramped | **Fixed:** accordions on phones, 2 columns on tablets |
| S6 | Chat button (56px) covers the footer copyright line and would cover the sizing and compare bottom bars. | ✗ | ✗ | **Fixed:** 48px on phones, safe-area insets, lifts above open bottom bars |
| S7 | `--sz-header-height` (169px) drives sticky tab bars, scroll padding and toasts; the compact header is 65px. | ✗ | ✗ | **Fixed:** token is 65px below 1280px |
| S8 | Text links and "Show more" / "View more" / "Edit parameters" buttons are 17–23px high (tap target < 24px). Found on almost every page. | ✗ | ✗ | Open: add `max-xl:min-h-11` / padding per component |
| S9 | Icon-only toolbar buttons show their label only as a hover tooltip (`pointer-events-none … group-hover:opacity-100`): product compare, project report print, drawing zoom. On touch there is no label. | ✗ | ✗ | Open: keep `aria-label`; consider a visible label or long-press. Low priority. |
| S10 | Tables in `overflow-hidden` boxes are clipped instead of scrolling (AHLSTAR Models 1202px, XFP models 944px, Connect users 653px). | ✗ | ✗ (models) | Open: see per-page list |

## Per page

✗ = confirmed problem. Tablet (820) is fine unless noted.

**Home** (`/`)
- Hero headline at 64px is cramped on phones, and the search box with "Search" button squeezes the input. **Fixed in step 2.**
- Popular chips: **fixed** (one row, scrolls sideways).

**My Sulzer** (`/my-sulzer`)
- Portal preview cards (`-left-8 w-80`, `-right-6 w-[22rem]`) stick out by 8px on phones. **Fixed.**
- Price card overlaps the order card on phones. Open (small).

**Applications** (`/applications…`), **Digital solutions**, **placeholders**, **404**
- Shell only. Fine once S1–S8 are done.

**Product search** (`/products`, `?q=`)
- Filter sidebar stacks above the results on phones (very long scroll before the first result).
- Spec list (`dd whitespace-nowrap`) collides with the description.
- Fix: filters in a bottom sheet / drawer with a "Filters (n)" button; spec list wraps.

**Product page AHLSTAR** (`/products/ahlstar`)
- Hero: price box and buttons fine. The tab bar (Explore, Models, Documentation, BIM, Spare parts, Services) is cut off on phones: needs sideways scroll with a fade.
- **Models tab:** table 1202px wide, clipped, cannot scroll. Needs `overflow-x-auto` with a sticky first column, or cards on phones. Tablet clipped too.
- **Documentation tab:** Preview/Download buttons stick out (→395px) and overlap the document title on phones. Put the actions under the title.
- **Spare parts – Tree:** tree, drawing and part panel stack. Drawing hotspot labels overlap at phone scale, and 17 targets are < 24px. Drawing needs pinch/zoom controls visible and bigger hotspots on touch.
- **Spare parts – BOM:** the BOM panel (`aside max-h-[44rem]`) is 906px wide on phones and 922px on tablets: the whole page scrolls sideways. The table is 888px. Make the panel `max-xl:w-full min-w-0` and let the table scroll inside it; on phones consider a card list.
- **Fast delivery badge:** SVG text-on-path overlaps "2 weeks" at small sizes. Cosmetic.

**XFP / variant / configured product** (`/products/xfp…`, `/products/:id/config/…`)
- Models table 944px, clipped (as AHLSTAR).
- Curves tab: P1/P2/NPSH chart labels overlap on phones.
- "Compare", "Print" and other icon actions are hover-tooltip only (S9).
- Where to buy and Request quotation triggers were not reachable at phone/tablet width in the audit. Check that the buttons still render in the stacked price box.

**Variant print / BOM print** (`…/print`, `…/bom`)
- Print layouts, 779–837px tables. Low priority: these are for printing. Allow sideways scroll.

**Sizing** (`/sizing`)
- Parameter form (label + field + unit grid) is 472px wide: the page scrolls sideways (scrollWidth 488 on phones). Unit selects are 18×32px.
- Duty-point chart SVG 438px wide, cut off.
- Fix: label above field on phones, unit select inline at a usable size, chart `w-full`.

**Sizing results** (`/sizing/results`)
- Filter column (around 20 filter groups) stacks above the results: the results start several screens down. Needs a filter drawer/bottom sheet.
- Results table is 1636px and scrolls sideways (ok, it has a sticky first column). On phones consider a card list with the key figures.
- The "Select at least one product" hint sticks out (→410px).
- The selection bar (fixed bottom) wraps to 2–3 rows on phones. Chat now lifts above it (S6).
- The curve popover could not be opened in the audit (trigger covered). Check the tap target.

**Sizing compare** (`/sizing/compare`)
- 768px table scrolls sideways on phones (ok). Buy hint is hover-only.
- Console error, also on desktop: duplicate React key in the compare table. Fix separately (does not change layout).

**My projects / project** (`/my-projects`, `/my-projects/:id`)
- Project tab bar (Products, Discussion, Documents) cut off on phones (→453px).
- The project info column (client, site, deadline) wraps word by word. Six action buttons stack as a long list. Use a 2-column action grid or an overflow menu.
- Sizings and products tables (705–748px) scroll sideways. Products table: the product name is cut off. Phones need a card layout for project items.
- 11–18 tap targets < 24px ("Change status", link icons 14×14).
- Share and tender text dialogs: fit the width. On tablets, the dialog radio labels overlap the project name (check).

**Project report** (`/my-projects/:id/report`)
- Print view. Allow sideways scroll on phones.

**My assets / asset** (`/assets`, `/assets/:id`)
- Asset list: the site name (truncate) overlaps the vibration values (1.4 mm/s) on phones and tablets: grid columns are too narrow. Stack the values under the name.
- Asset page: condition charts fit; small link targets.

**Requests / orders / order / quotations / quotation**
- Orders table 1025px and quotations table 960px scroll sideways on phones *and* tablets. The order line text overlaps the status pill. Phones: card list per order/quotation. Tablets: hide less important columns.
- Quotation: "Delivery terms" `dt`/`dd` inline pair overlaps. Stack them.

**Cart / checkout / order confirmation**
- Cart table 782px and checkout table 768px scroll sideways on phones. A cart needs a phone card layout (image, name, qty stepper, price).
- Checkout: delivery option radios and checkboxes are 16×16 without a big label hit area (up to 9). Make the whole option card the label.
- Partner "order on behalf of customer" works but is crowded.

**My Pages** (`/my-pages`, saved, recently viewed)
- Partner dashboard: card grid items are 742px wide on phones and 774px at 744px (`md:col-span-2` grid without phone columns). The page scrolls sideways. High priority for the partner video.
- Activity feed: the time stamp overlaps the truncated text. Small.

**Partner customers / customer** (`/partner/customers…`)
- Customer page: alert rows overlap the "View" link. Small tap targets ("All requests").

**Sulzer Connect** (`/connect/*`)
- Has its own shell with a phone bottom tab bar (fine).
- **Dashboard:** panels are 619px wide on phones (fleet health, alerts, sites, run hours): the page scrolls sideways. The run hours chart is 529px. The fixed tab bar covers content: needs bottom padding.
- **Reports:** report preview `max-w-[860px]` article sticks out (→490px). Scale the report preview to fit, or allow pinch.
- **Users:** table 653px, clipped (cannot scroll).
- **Alerts / assets / teams:** fine apart from the tab bar covering the last row (needs `pb` for the bar).
- Connect header menu: no hamburger at tablet width. The audit found no menu trigger between 640px (bottom bar hides at `sm`) and 1279px. Check that the Connect nav is reachable on tablets.

## Fix order

The order follows what the demo videos show first, then how far each fix reaches (shared before per page).

1. **Shell** (done in step 2): compact header + drawer, hero, footer, chat, header height token, mega menu, popovers. All pages now start at scrollWidth = viewport, unless page content overflows.
2. **Shared primitives:** TabBar (sideways scroll with fade, shared by product, project and Connect pages), table wrapper (`overflow-x-auto` + sticky first column instead of `overflow-hidden`), small text-link targets (S8), dialog sizing (full-screen sheet on phones).
3. **My Pages + partner dashboard + Connect dashboard:** the persona video openers; both currently scroll sideways.
4. **Product page AHLSTAR:** models table, documentation rows, spare parts Tree/BOM (BOM panel overflow is severe), drawing touch controls.
5. **Sizing → results → compare → configured product:** form layout, filter drawer, results cards, curves chart labels.
6. **Projects:** tab bar, actions, items as cards, report.
7. **eShop:** cart cards, checkout option cards, order confirmation.
8. **Self-service tables:** orders, quotations, requests, order and quotation detail (card lists on phones).
9. **Assets, partner customers, remaining Connect pages** (reports preview, users table, tab bar padding).
10. **Polish:** hover-only tooltips (S9), product search filters drawer, print views, small overlaps.

Each step: build + lint + `npm run qa:desktop-compare` (0 differences), then re-run `npm run qa:responsive-audit` for the pages touched.
