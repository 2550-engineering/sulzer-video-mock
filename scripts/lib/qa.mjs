/*
 * Shared helpers for the QA scripts (desktop baseline, desktop compare,
 * responsive audit): the route list, the dev server, signing in as a persona
 * and taking a stable full-page screenshot.
 *
 * Detail pages (an asset, an order, a variant…) are found by following the
 * first matching link on their list page, so no ids are hard-coded here.
 */
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** Signed out, and signed in as each persona (ids from src/types.ts `PersonaId`). */
export const STATES = ['signedOut', 'endUser', 'consultant', 'channelPartner']
/** Pages that look the same for every signed-in persona: signed out + one persona. */
const PUBLIC_STATES = ['signedOut', 'endUser']

const sizingQuery =
  'product=ahlstar&q=220&h=38&liquid=water&temp=20&application=surface-water-intake'

/** Real routes from src/App.tsx (placeholders are added below). */
const routes = [
  // ── Marketing / catalogue ───────────────────────────────────────────────
  { name: 'home', path: '/', states: PUBLIC_STATES },
  { name: 'applications', path: '/applications', states: PUBLIC_STATES },
  {
    name: 'application-area',
    discover: { from: '/applications', href: /^\/applications\/[^/?#]+$/ },
    states: PUBLIC_STATES,
  },
  {
    name: 'application',
    discover: { from: '@application-area', href: /^\/applications\/[^/?#]+\/[^/?#]+$/ },
    states: PUBLIC_STATES,
  },
  { name: 'products', path: '/products' },
  { name: 'products-search', path: '/products?q=ahlstar' },
  { name: 'product-ahlstar', path: '/products/ahlstar' },
  { name: 'product-ahlstar-models', path: '/products/ahlstar#models' },
  { name: 'product-ahlstar-documentation', path: '/products/ahlstar#documentation' },
  { name: 'product-ahlstar-bim', path: '/products/ahlstar#bim' },
  { name: 'product-ahlstar-spare-parts-tree', path: '/products/ahlstar#spare-parts' },
  { name: 'product-ahlstar-spare-parts-bom', path: '/products/ahlstar?view=bom#spare-parts' },
  { name: 'product-ahlstar-services', path: '/products/ahlstar#services' },
  { name: 'product-xfp', path: '/products/xfp' },
  { name: 'product-xfp-models', path: '/products/xfp#models' },
  { name: 'product-sulzer-connect', path: '/products/sulzer-connect' },
  { name: 'product-sulzer-connect-variants', path: '/products/sulzer-connect#variants' },
  {
    name: 'variant',
    discover: { from: '/products/xfp#models', href: /^\/products\/xfp\/\d+/ },
  },
  { name: 'variant-spare-parts', discover: { from: '@variant', suffix: '#spare-parts' } },
  { name: 'variant-print', discover: { from: '@variant', suffix: '/print' } },
  { name: 'variant-bom-print', discover: { from: '@variant', suffix: '/bom' } },
  { name: 'digital-solutions', path: '/digital-solutions' },
  { name: 'replacement', path: '/products/replacement' },
  { name: 'replacement-existing-pump', path: '/products/replacement/existing-pump' },
  { name: 'spare-parts', path: '/spare-parts' },
  // ── Sizing ──────────────────────────────────────────────────────────────
  { name: 'sizing', path: '/sizing' },
  { name: 'sizing-results', path: `/sizing/results?${sizingQuery}` },
  {
    name: 'sizing-compare',
    discover: { from: '@sizing-results', action: 'compare' },
  },
  {
    name: 'configured-product',
    discover: { from: '@sizing-results', href: /^\/products\/[^/]+\/config\/[^/?#]+/ },
  },
  { name: 'configured-print', discover: { from: '@configured-product', suffix: '/print' } },
  // ── Account ─────────────────────────────────────────────────────────────
  { name: 'my-sulzer', path: '/my-sulzer' },
  { name: 'my-pages', path: '/my-pages' },
  { name: 'my-pages-saved', path: '/my-pages/saved' },
  { name: 'my-pages-recently-viewed', path: '/my-pages/recently-viewed' },
  { name: 'my-projects', path: '/my-projects' },
  {
    name: 'my-project',
    discover: { from: '/my-projects', href: /^\/my-projects\/[^/?#]+$/ },
  },
  { name: 'my-project-report', discover: { from: '@my-project', suffix: '/report' } },
  { name: 'assets', path: '/assets' },
  { name: 'asset', discover: { from: '/assets', href: /^\/assets\/[^/?#]+$/ } },
  { name: 'partner-customers', path: '/partner/customers' },
  {
    name: 'partner-customer',
    discover: { from: '/partner/customers', href: /^\/partner\/customers\/[^/?#]+$/ },
  },
  { name: 'requests', path: '/self-service/requests' },
  { name: 'orders', path: '/self-service/orders' },
  {
    name: 'order',
    discover: { from: '/self-service/orders', href: /^\/self-service\/orders\/[^/?#]+$/ },
  },
  { name: 'quotations', path: '/self-service/quotations' },
  {
    name: 'quotation',
    discover: { from: '/self-service/quotations', href: /^\/self-service\/quotations\/[^/?#]+$/ },
  },
  // ── Sulzer Connect ──────────────────────────────────────────────────────
  { name: 'connect', path: '/connect' },
  { name: 'connect-dashboard', path: '/connect/dashboard' },
  { name: 'connect-assets', path: '/connect/assets' },
  {
    name: 'connect-asset',
    discover: { from: '/connect/assets', href: /^\/connect\/assets\/[^/?#]+$/ },
  },
  { name: 'connect-alerts', path: '/connect/alerts' },
  { name: 'connect-reports', path: '/connect/reports' },
  { name: 'connect-users', path: '/connect/users' },
  { name: 'connect-teams', path: '/connect/teams' },
  // ── eShop (the cart is filled first, see fillCart) ──────────────────────
  { name: 'cart', path: '/eshop/cart' },
  { name: 'checkout', path: '/eshop/checkout' },
  // Last: placing the order empties the cart.
  { name: 'order-confirmation', discover: { from: '/eshop/checkout', action: 'placeOrder' } },
  { name: 'not-found', path: '/this-page-does-not-exist', states: PUBLIC_STATES },
]

/** Placeholder ("Coming soon") pages, read from src/config/placeholderRoutes.ts. */
function placeholderRoutes() {
  const source = readFileSync(path.join(root, 'src/config/placeholderRoutes.ts'), 'utf8')
  const taken = new Set(routes.map((r) => r.path))
  return [...source.matchAll(/path: '([^']+)'/g)]
    .map((m) => m[1])
    .filter((p) => !taken.has(p))
    .map((p) => ({
      name: `placeholder${p.replaceAll('/', '-')}`,
      path: p,
      // Partner-only and account pages can differ per persona.
      states: p.startsWith('/partner') || p === '/settings' ? STATES : PUBLIC_STATES,
    }))
}

/** Every route, in visiting order (order-confirmation stays last of the real routes). */
export function allRoutes() {
  const list = [...routes]
  const at = list.findIndex((r) => r.name === 'not-found')
  list.splice(at, 0, ...placeholderRoutes())
  return list.map((r) => ({ states: STATES, ...r }))
}

// ── Dev server ────────────────────────────────────────────────────────────

/** Starts Vite on a fixed port (or uses QA_BASE_URL) and returns { baseUrl, stop }. */
export async function startServer() {
  if (process.env.QA_BASE_URL) return { baseUrl: process.env.QA_BASE_URL, stop: () => {} }
  const port = Number(process.env.QA_PORT ?? 5199)
  const baseUrl = `http://localhost:${port}`
  const child = spawn('npx', ['vite', '--port', String(port), '--strictPort'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, BROWSER: 'none' },
  })
  let log = ''
  child.stdout.on('data', (d) => (log += d))
  child.stderr.on('data', (d) => (log += d))
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    try {
      const res = await fetch(baseUrl)
      if (res.ok) return { baseUrl, stop: () => child.kill() }
    } catch {
      // not up yet
    }
    if (child.exitCode !== null) break
    await new Promise((r) => setTimeout(r, 300))
  }
  child.kill()
  throw new Error(`Vite did not start on ${baseUrl}\n${log}`)
}

// ── Browser helpers ───────────────────────────────────────────────────────

const freezeCss = `*,*::before,*::after{transition:none!important;animation:none!important;
  scroll-behavior:auto!important;caret-color:transparent!important}`

/** A fresh context with clean storage, signed in as `state` unless it is "signedOut". */
export async function openState(browser, baseUrl, state, viewport) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    locale: 'en-GB',
    timezoneId: 'Europe/Stockholm',
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(baseUrl + '/')
  await page.evaluate((s) => {
    localStorage.clear()
    sessionStorage.clear()
    if (s !== 'signedOut') {
      localStorage.setItem('sz-demo-signed-in', 'true')
      localStorage.setItem('sz-demo-persona', s)
    }
  }, state)
  return { context, page, errors }
}

/** Waits for network, fonts and lazy images, then freezes motion and scrolls to the top. */
export async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.addStyleTag({ content: freezeCss }).catch(() => {})
  await page.evaluate(() => document.fonts.ready)
  // Scroll through the page so lazy images load, then back to the top.
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle').catch(() => {})
  await page
    .waitForFunction(() => [...document.images].every((img) => img.complete), null, {
      timeout: 10_000,
    })
    .catch(() => {})
  // Sizing "calculating" runs 1 s; toasts and charts settle as well.
  await page.waitForTimeout(1200)
  await page.evaluate(() => window.scrollTo(0, 0))
}

/** Goes to `url` (relative) and waits until it has settled. */
export async function visit(page, baseUrl, url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.goto(baseUrl + url, { waitUntil: 'domcontentloaded' })
    await settle(page)
    // The dev server can reload the page while it optimises dependencies,
    // leaving an empty #root: try again.
    const rendered = await page.evaluate(
      () => (document.getElementById('root')?.innerText.trim().length ?? 0) > 0,
    )
    if (rendered) return
  }
  throw new Error(`${url} rendered nothing`)
}

const relative = (page) => {
  const u = new URL(page.url())
  return u.pathname + u.search + u.hash
}

/**
 * Resolves a route to a URL for this context (following its `discover` rule),
 * visits it and returns the URL, or null when it cannot be reached.
 * `resolved` caches each route's URL for `@name` references.
 */
export async function goToRoute(page, baseUrl, route, resolved) {
  if (route.path) {
    await visit(page, baseUrl, route.path)
    resolved[route.name] = route.path
    return route.path
  }
  const d = route.discover
  const from = d.from.startsWith('@') ? resolved[d.from.slice(1)] : d.from
  if (!from) return null
  if (d.suffix) {
    const [base, hash = ''] = from.split('#')
    const [p, q = ''] = base.split('?')
    const url = d.suffix.startsWith('#')
      ? `${p}${q ? `?${q}` : ''}${d.suffix}`
      : `${p}${d.suffix}${q ? `?${q}` : ''}${hash ? `#${hash}` : ''}`
    await visit(page, baseUrl, url)
    resolved[route.name] = url
    return url
  }
  await visit(page, baseUrl, from)
  if (d.href) {
    const href = await page.evaluate((source) => {
      const re = new RegExp(source)
      return (
        [...document.querySelectorAll('a[href]')]
          .map((a) => a.getAttribute('href'))
          .find((h) => re.test(h)) ?? null
      )
    }, d.href.source)
    if (!href) return null
    // Without the link's tab hash: the route shows the page's default view.
    await visit(page, baseUrl, href.split('#')[0])
  } else if (d.action === 'compare') {
    // The results table's row checkboxes ("Select <pump>"), then "Compare (3)".
    const boxes = page.getByRole('checkbox', { name: /^Select (?!all)/ })
    if ((await boxes.count()) < 2) return null
    for (let i = 0; i < Math.min(3, await boxes.count()); i++) await boxes.nth(i).check()
    await page
      .getByRole('button', { name: /^Compare \(\d\)/ })
      .first()
      .click()
    await page.waitForURL(/\/sizing\/compare/)
    await settle(page)
  } else if (d.action === 'placeOrder') {
    const button = page.getByRole('button', { name: /place order/i }).first()
    if (!(await button.count()) || !(await button.isEnabled())) return null
    await button.click()
    await page.waitForURL(/\/eshop\/order\//, { timeout: 5000 }).catch(() => {})
    if (!page.url().includes('/eshop/order/')) return null
    await settle(page)
  }
  resolved[route.name] = relative(page)
  return resolved[route.name]
}

/**
 * Puts the configured AHLSTAR from the sizing demo in the cart (signed-in
 * states), so the cart, checkout and order confirmation have content.
 * Returns true on success.
 */
export async function fillCart(page, baseUrl) {
  await visit(page, baseUrl, `/sizing/results?${sizingQuery}`)
  const href = await page.evaluate(
    () =>
      [...document.querySelectorAll('a[href]')]
        .map((a) => a.getAttribute('href'))
        .find((h) => /^\/products\/[^/]+\/config\//.test(h)) ?? null,
  )
  if (!href) return false
  await visit(page, baseUrl, href)
  const add = page.getByRole('button', { name: /^add to cart$/i }).first()
  if (!(await add.count())) return false
  await add.click()
  await page.waitForTimeout(300)
  return true
}

export async function launch() {
  return chromium.launch()
}

export async function writeJson(file, data) {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify(data, null, 2))
}

/** Runs `fn` over `items` with at most `limit` running at once. */
export async function pool(items, limit, fn) {
  const results = []
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        results[i] = await fn(items[i], i)
      }
    }),
  )
  return results
}
