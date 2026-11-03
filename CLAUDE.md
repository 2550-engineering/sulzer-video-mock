# Sulzer Digital Journey – demo mock-up

## Purpose

A high-fidelity, clickable **mock-up** of a future Sulzer customer self-service website ("mySulzer").

It will be screen-recorded for short marketing/leadership demo videos:

- 15–30 s general-experience clips
- 1–2 min persona clips

Goal: viewers should go "Wow!" It must look like a real, polished, production Sulzer website.

## Style direction

- **Layout, navigation patterns and page structure:** inspired by grundfos.com / myGrundfos:
  - utility bar
  - dark blue main nav
  - mega menu
  - Quick links panel
  - card-based My Pages dashboard
  - application pages with hero + tabs
  - product pages with tab bar
- **Branding:** Sulzer. Use the design tokens in `src/styles/tokens.css` (derived from sulzer-guide.netlify.app and the assets in `_asset-source/`).
- **NEVER copy Grundfos logos, images, icons or text.** Structure only.
- **Reference screenshots:** `_reference/grundfos`, `_reference/deck`. Look at these images when building related pages.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS (theme mapped to CSS variables in `tokens.css`)
- React Router
- `lucide-react` for icons
- No backend. All data is mock data in `src/data/*.ts`, typed in `src/types.ts`.
- Fake auth: a "Sign in" button logs in the demo user instantly (state in React context + `localStorage`, wrapped in try/catch).
- Deployed to Netlify as a static SPA (needs a `_redirects` file for client-side routing).

## Demo / recording rules

- **Viewport:** primary 1920×1080; must also look fine at 1440×900. Mobile is nice-to-have, not required.
- **Everything deterministic:** no random data, no real network calls, no cookie banners, no console errors.
- **Transitions:** smooth but subtle (150–250 ms).
- **Nothing that looks like a prototype:** no visible lorem ipsum on Phase 1 pages that are "done", no "TODO" text on screen.
- **Stub pages** for future flows show a tasteful "Coming soon" state inside the real layout.
- **Demo content** (user name, company, product names, market) lives in `src/config/demo.ts`.
- **Demo controls:** Shift+D opens a hidden presenter panel (Reset demo / Sign in as each persona). It renders nothing while closed.
- **No QA runs by default:** after a change, run only `npm run build` and `npm run lint`. Don't run `npm run qa`, Playwright flows or screenshot reviews, and don't add routes to the QA script, unless I explicitly ask. (`npm run qa` exists and screenshots every route to `_qa/screenshots/` if I want it.)

## Phases

- **Phase 1 (done):** site shell, branding, header/footer/nav, home, mySulzer landing, login, My Pages dashboard, Quick links, route stubs + mock data types.
- **Phase 2 (done):** Application finder, Product finder + product page, Sizing & configuration, My projects. Spare parts/drawings/eCommerce and Assets & condition monitoring moved to Phase 3.

## Phase 3 – Personas (current)

Deck slides 11 (end user / asset owner), 12 (end user IoT) and 13 (channel partner). Plan, assumptions and demo flows (Video A and B): `~/Documents/Claude/Projects/Sulzer/plans/persona-plan.md`.

- **P0 Foundations:** personas (`personas` in `src/config/demo.ts`), installed base (`src/data/assets.ts`), condition time series (`src/lib/conditionData.ts`).
- **P1 My assets:** `/assets` and `/assets/:id`.
- **P2 Sulzer Connect app:** `/connect/*` dashboard, Asset Monitor, condition monitoring, alerts, users, reports.
- **P3 Connect product page + digital solutions + personal toolbar.**
- **P4 Requests, orders and quotations.**
- **P5 Spare parts, sectional drawing and eShop.**
- **P6 Replacement finder and tender texts.**
- **P7 Channel partner:** partner My Pages, customers, partner prices.

P5 and P6 are also needed by the service provider (slide 9) and consultant (slide 10) videos. Build them persona-agnostic and reusable: no end-user or partner wording baked into the components, persona-specific bits (prices, "on behalf of" a customer) passed in as props or read from the signed-in persona.

Personas: `endUser` (Emma Lindqvist, Nordvatten Utilities) and `channelPartner` (Lars Ek, Aqua Pumpteknik). To add one (service provider, consultant), add an entry to `personas`; auth and the Shift+D panel pick it up.

## Images

- Images come from Sulzer's own media (sulzer.com, Sulzer PDFs in `_asset-source/pdfs`) or licensed stock. **Never Grundfos, KSB or Xylem.**
- Every image in `public/images` that came from the web is logged in `~/Documents/Claude/Projects/Sulzer/docs/image-sources.md` with its source URL.
- `npm run images:doc` lists every image path in `src/data` with its aspect, minimum size and what it should show (`docs/images-needed.md`). New image folders need a spec in `scripts/images-needed.mjs`.

## Documents and plans

- Plans (phase, module and persona plans) and other non-code documents (image source logs, notes) do **not** go in this repo.
- They live in the Sulzer project folder `~/Documents/Claude/Projects/Sulzer`: plans in `plans/`, other documents in `docs/`. See its `CLAUDE.md`.
- Start Claude Code with `claude --add-dir ~/Documents/Claude/Projects/Sulzer` so you can read and write there, and use absolute paths.
- Only code and files the code or scripts need (this file, generated reports like `docs/images-needed.md`, `docs/content-to-confirm.md`, tests) stay in the repo.
- **Build, don't re-plan:** prompts from the persona plan (`~/Documents/Claude/Projects/Sulzer/plans/persona-plan.md`) are already agreed. Build straight away without writing a separate plan or asking for confirmation. Only stop if something is truly blocked; otherwise make a sensible assumption and list it at the end.

## Conventions

- Components in `src/components`, pages in `src/pages`, one component per file.
- Run `npm run build` and `npm run lint` before saying a task is done.
