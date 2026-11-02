/*
 * Recording QA: full-page screenshots of every route, logged out and logged in,
 * plus console/network/layout checks. Starts its own Vite dev server (dev mode,
 * so React warnings show up) and reads the route list from the app's data.
 *
 *   npm run qa                       # 1920×1080 → _qa/screenshots/
 *   npm run qa -- --viewport=1440x900  # → _qa/screenshots-1440x900/
 *
 * Writes a summary to _qa/report.md and exits non-zero if any check fails.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const viewportArg = process.argv.find((arg) => arg.startsWith('--viewport='))
const [width, height] = (viewportArg?.split('=')[1] ?? '1920x1080').split('x').map(Number)
const outDir =
  width === 1920 && height === 1080 ? '_qa/screenshots' : `_qa/screenshots-${width}x${height}`

// Text that should never be on screen in a recording.
const suspectText =
  /lorem|ipsum|\bTODO\b|\bTBD\b|FIXME|\bundefined\b|\bNaN\b|\[object Object\]|placeholder/i

const server = await createServer({ server: { port: 5199, strictPort: true }, logLevel: 'error' })
await server.listen()
const base = 'http://localhost:5199'

const { placeholderRoutes } = await server.ssrLoadModule('/src/config/placeholderRoutes.ts')
const { applications, rootApplicationId } = await server.ssrLoadModule('/src/data/applications.ts')
const { products } = await server.ssrLoadModule('/src/data/products.ts')
const { applicationPath, productTabs } = await server.ssrLoadModule('/src/lib/catalog.ts')
const { assets } = await server.ssrLoadModule('/src/data/assets.ts')
const { assetPage } = await server.ssrLoadModule('/src/data/assetPages.ts')
const { orderSeeds } = await server.ssrLoadModule('/src/data/orders.ts')
const { quotations } = await server.ssrLoadModule('/src/data/quotations.ts')

const routes = [
  '/',
  '/my-sulzer',
  '/my-pages',
  '/applications',
  ...applications.filter((app) => app.id !== rootApplicationId).map(applicationPath),
  '/products',
  '/products?q=pump',
  '/products?q=ahlstar',
  '/products?q=ahlstar&tab=documents',
  '/products?q=water&tab=applications',
  '/products?category=submersible-pumps&flow=1000-5000',
  '/products?q=zzzz',
  ...products.flatMap((product) => [
    `/products/${product.id}`,
    ...productTabs(product)
      .slice(1)
      .map((tab) => `/products/${product.id}#${tab.id}`),
  ]),
  '/digital-solutions',
  '/my-pages/saved',
  '/my-pages/saved?kind=document',
  '/my-pages/recently-viewed',
  '/sizing',
  `/sizing?product=${products[0].id}`,
  '/sizing/results',
  '/my-projects',
  '/my-projects/riverside-intake',
  '/assets',
  '/assets?status=alarm&status=warning',
  '/assets?service=due',
  '/assets?view=sites',
  '/assets?q=zzzz',
  ...assets.map((asset) => `/assets/${asset.id}`),
  // RW-02 is the Video A unit: every tab. CD-01 is not connected, RS-02 has no documents yet.
  ...assetPage.tabs.slice(1).map((tab) => `/assets/rw-02#${tab.id}`),
  '/assets/p-211#condition',
  '/assets/cd-01#condition',
  '/assets/rs-02#documents',
  // Requests, orders and quotations, as the end user (QA signs in as endUser).
  '/self-service/requests',
  '/self-service/orders',
  '/self-service/orders?status=transit',
  '/self-service/orders?q=zzzz',
  ...orderSeeds.filter((o) => o.channel === 'direct').map((o) => `/self-service/orders/${o.id}`),
  '/self-service/quotations',
  '/self-service/quotations?status=open',
  ...quotations.filter((q) => q.issuer === 'sulzer').map((q) => `/self-service/quotations/${q.id}`),
  // Spare parts and eShop (P5). The cart is empty in QA, so checkout redirects to the cart.
  '/spare-parts',
  '/spare-parts?product=xfp&model=xfp-150-e&pos=433',
  '/spare-parts?by=part&q=bearing kit',
  '/spare-parts?by=part&q=zzzz',
  '/spare-parts?by=serial&serial=AH-1918-04512',
  '/spare-parts?by=serial&serial=AF-1811-05240',
  '/spare-parts?by=serial&serial=XX-0000',
  '/products/ahlstar?bom=ahlstar-150-125-315#spare-parts',
  '/eshop',
  '/eshop/cart',
  '/eshop/checkout',
  // Sulzer Connect: its own app outside SiteLayout. Signed out, every page but the welcome asks to sign in.
  '/connect',
  '/connect/dashboard',
  '/connect/assets',
  ...assets.filter((asset) => asset.connected).map((asset) => `/connect/assets/${asset.id}`),
  '/connect/assets/rw-02?range=24h',
  '/connect/assets/rw-02?range=30d',
  '/connect/assets/cd-01',
  '/connect/alerts',
  '/connect/reports',
  '/connect/users',
  '/connect/teams',
  ...placeholderRoutes.map((route) => route.path),
  '/this-page-does-not-exist',
]

/** The personal toolbar's panels, opened on the Sulzer Connect product page (signed in). */
const toolbarStates = [
  'Compare',
  'Saved items',
  'Sizing',
  'My projects',
  'Recently viewed',
  'Units & market',
].map((label) => ({
  name: `toolbar-${label.toLowerCase().replace(/\W+/g, '-')}`,
  path: '/products/sulzer-connect',
  signedInOnly: true,
  run: (page) =>
    page
      .getByRole('navigation', { name: 'Personal toolbar' })
      .getByRole('button', { name: label })
      .click(),
}))

/** Overlays and interactive states worth checking (viewport-only shots), on the home page unless they name a `path`. */
const states = [
  {
    name: 'mega-menu',
    run: (page) => page.getByRole('button', { name: 'Products & services' }).click(),
  },
  { name: 'quick-links', run: (page) => page.getByRole('button', { name: 'Quick links' }).click() },
  {
    name: 'search',
    run: (page) =>
      page
        .getByRole('navigation', { name: 'Main' })
        .getByRole('button', { name: 'Search' })
        .click(),
  },
  { name: 'chat', run: (page) => page.getByRole('button', { name: 'Chat with Sulzer' }).click() },
  { name: 'demo-controls', run: (page) => page.keyboard.press('Shift+D') },
  {
    name: 'focus-ring',
    run: async (page) => {
      for (let i = 0; i < 4; i++) await page.keyboard.press('Tab')
    },
  },
  {
    name: 'account-menu',
    signedInOnly: true,
    run: (page) => page.getByRole('button', { name: /Lindqvist|Sign in/ }).click(),
  },
  {
    name: 'spare-parts-hotspot',
    path: '/products/ahlstar#spare-parts',
    run: async (page) => {
      await page.getByRole('figure').scrollIntoViewIfNeeded()
      await page.getByRole('button', { name: 'Position 321' }).click()
    },
  },
  {
    name: 'cart-drawer',
    path: '/products/ahlstar#spare-parts',
    signedInOnly: true,
    run: async (page) => {
      await page.getByRole('button', { name: /^Add Bearing kit/ }).click()
      await page.getByRole('button', { name: /^Cart/ }).click()
    },
  },
  ...toolbarStates,
]

function fileName(route) {
  const name = route
    .replace(/^\//, '')
    .replace(/[/?#=&]+/g, '_')
    .replace(/_$/, '')
  return `${name || 'home'}.png`
}

async function settle(page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
}

/** Layout problems visible in the DOM: overflow, broken images, suspect text. */
function inspectPage(pattern) {
  const viewportWidth = document.documentElement.clientWidth
  const overflowing = [...document.querySelectorAll('body *')]
    .filter((el) => {
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      return (
        rect.width > 0 &&
        rect.right > viewportWidth + 1 &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        !el.closest('[inert]')
      )
    })
    .slice(0, 5)
    .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`)

  const brokenImages = [...document.images]
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => img.currentSrc || img.src)

  // Images without a sized box can shift the layout while they load.
  const unsizedImages = [...document.images]
    .filter((img) => {
      const style = getComputedStyle(img)
      const sizedByCss = style.position === 'absolute' || style.aspectRatio !== 'auto'
      return !sizedByCss && !(img.getAttribute('width') && img.getAttribute('height'))
    })
    .map((img) => img.currentSrc || img.src)

  const text = document.body.innerText
  const suspect = [...new Set(text.match(new RegExp(pattern, 'gi')) ?? [])]

  return {
    title: document.title,
    path: location.pathname + location.search,
    horizontalScroll: document.documentElement.scrollWidth > viewportWidth,
    overflowing,
    brokenImages,
    unsizedImages,
    suspect,
  }
}

await rm(outDir, { recursive: true, force: true })
const browser = await chromium.launch()
const results = []

for (const auth of ['logged-out', 'logged-in']) {
  await mkdir(`${outDir}/${auth}/states`, { recursive: true })
  const context = await browser.newContext({ viewport: { width, height } })
  await context.addInitScript((signedIn) => {
    if (signedIn && !sessionStorage.getItem('qa-init')) {
      localStorage.setItem('sz-demo-persona', 'endUser')
      sessionStorage.setItem('qa-init', '1')
    }
  }, auth === 'logged-in')
  const page = await context.newPage()

  let messages = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning')
      messages.push(`${msg.type()}: ${msg.text()}`)
  })
  page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`))
  page.on('requestfailed', (req) => messages.push(`requestfailed: ${req.url()}`))
  page.on('response', (res) => {
    if (res.status() >= 400) messages.push(`http ${res.status()}: ${res.url()}`)
  })

  for (const route of routes) {
    messages = []
    await page.goto(base + route)
    await settle(page)
    const checks = await page.evaluate(inspectPage, suspectText.source)
    await page.screenshot({
      path: `${outDir}/${auth}/${fileName(route)}`,
      fullPage: true,
      animations: 'disabled',
    })
    results.push({ auth, route, ...checks, messages })
  }

  for (const state of states) {
    if (state.signedInOnly && auth !== 'logged-in') continue
    messages = []
    await page.goto(base + (state.path ?? '/'))
    await settle(page)
    await state.run(page)
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${outDir}/${auth}/states/${state.name}.png` })
    results.push({
      auth,
      route: `${state.path ?? '/'} [${state.name}]`,
      title: '',
      messages,
      overflowing: [],
      brokenImages: [],
      unsizedImages: [],
      suspect: [],
    })
  }

  await context.close()
}

await browser.close()
await server.close()

const problems = results.filter(
  (r) =>
    r.messages.length ||
    r.horizontalScroll ||
    r.overflowing.length ||
    r.brokenImages.length ||
    r.unsizedImages.length ||
    r.suspect.length,
)

const lines = [
  `# Recording QA — ${width}×${height}`,
  '',
  `${results.length} captures, ${problems.length} with issues. Screenshots in \`${outDir}/\`.`,
  '',
  '| Auth | Route | Lands on | Title |',
  '| --- | --- | --- | --- |',
  ...results
    .filter((r) => r.title)
    .map((r) => `| ${r.auth} | \`${r.route}\` | \`${r.path}\` | ${r.title} |`),
  '',
  '## Issues',
  '',
  ...(problems.length
    ? problems.map((r) =>
        [
          `### ${r.auth} \`${r.route}\``,
          ...r.messages.map((m) => `- ${m}`),
          r.horizontalScroll ? '- horizontal scroll' : '',
          ...r.overflowing.map((o) => `- overflows viewport: \`${o}\``),
          ...r.brokenImages.map((src) => `- broken image: ${src}`),
          ...r.unsizedImages.map((src) => `- image without fixed size: ${src}`),
          r.suspect.length ? `- suspect text: ${r.suspect.join(', ')}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      )
    : ['None.']),
  '',
]
await writeFile(
  `_qa/report${outDir === '_qa/screenshots' ? '' : `-${width}x${height}`}.md`,
  lines.join('\n'),
)

console.log(`${results.length} captures, ${problems.length} with issues → ${outDir}/`)
process.exit(problems.length ? 1 : 0)
