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

## Phases

- **Phase 1 (current):** site shell, branding, header/footer/nav, home, mySulzer landing, login, My Pages dashboard, Quick links, route stubs + mock data types.
- **Phase 2 (later):** Application finder, Product finder + product page, Sizing & configuration, Spare parts/drawings/eCommerce, My projects, Assets & condition monitoring.

## Conventions

- Components in `src/components`, pages in `src/pages`, one component per file.
- Run `npm run build` and `npm run lint` before saying a task is done.
