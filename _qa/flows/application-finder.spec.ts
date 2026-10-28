import { mkdir, rename, rm } from 'node:fs/promises'
import { expect, type Locator, type Page, test } from '@playwright/test'

/*
 * Application finder: rehearsal of the demo recording plus the checks that keep
 * it recording-ready. Run with `npm run flow` (or `npm run flow -- -g rehearsal`).
 *
 * Recording path:
 *   /applications → Municipal water supply → Surface water intake
 *   (Explore, scroll; Products & solutions, scroll) → View on AHLSTAR → /products/ahlstar
 */

const area = '/applications/municipal-water-supply'
const application = `${area}/surface-water-intake`
const product = '/products/ahlstar'
const shotDir = '_qa/screenshots/flows/application-finder'
const videoDir = '_qa/videos'

/** Short pause between steps, so the rehearsal video plays at demo pace. */
const beat = (page: Page, ms = 1200) => page.waitForTimeout(ms)

/** Scrolls in small wheel steps, like a presenter scrolling with a mouse. */
async function scrollBy(page: Page, distance: number) {
  for (let left = Math.abs(distance); left > 0; left -= 120) {
    await page.mouse.wheel(0, Math.sign(distance) * Math.min(120, left))
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(400)
}

/** Scrolls until `target` sits `gap` px below the sticky tab bar (or the header, if there is none). */
async function scrollToFrame(page: Page, target: Locator, gap = 40) {
  const distance = await target.evaluate((el, gap) => {
    const bar = document.querySelector('[role=tablist]') ?? document.querySelector('header')!
    return el.getBoundingClientRect().top - bar.getBoundingClientRect().bottom - gap
  }, gap)
  await scrollBy(page, Math.round(distance))
}

const heading = (page: Page, name: string) => page.getByRole('heading', { name })

/** Collects console errors, page errors and failed requests for the whole test. */
function watchForErrors(page: Page) {
  const problems: string[] = []
  page.on('console', (msg) => msg.type() === 'error' && problems.push(`console: ${msg.text()}`))
  page.on('pageerror', (err) => problems.push(`page error: ${err.message}`))
  page.on('requestfailed', (req) => problems.push(`failed request: ${req.url()}`))
  page.on(
    'response',
    (res) => res.status() >= 400 && problems.push(`${res.status()}: ${res.url()}`),
  )
  return problems
}

/** The fixed parts at the top of the page: site header bottom and tab bar box. */
async function stickyBoxes(page: Page) {
  return page.evaluate(() => {
    const header = document.querySelector('header')!.getBoundingClientRect()
    const tabBar = document.querySelector('[role=tablist]')!.parentElement!.parentElement!
    const bar = tabBar.getBoundingClientRect()
    const panel = document.querySelector('[role=tabpanel]')!.getBoundingClientRect()
    return {
      headerBottom: header.bottom,
      barTop: bar.top,
      barBottom: bar.bottom,
      panelTop: panel.top,
    }
  })
}

async function expectTabSelected(page: Page, name: string) {
  await expect(page.getByRole('tab', { name, exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
}

test('rehearsal: recording path at 1920×1080', async ({ browser }) => {
  await rm(shotDir, { recursive: true, force: true })
  await mkdir(shotDir, { recursive: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: videoDir, size: { width: 1920, height: 1080 } },
  })
  const page = await context.newPage()
  const problems = watchForErrors(page)
  let n = 0
  const shot = (name: string) =>
    page.screenshot({ path: `${shotDir}/${String(++n).padStart(2, '0')}-${name}.png` })

  // 1. Application overview
  await page.goto('/applications', { waitUntil: 'networkidle' })
  await beat(page)
  await shot('overview')

  // 2. Municipal water supply
  const municipal = page.getByRole('link', { name: /Municipal water supply \(6\)/ })
  await municipal.hover()
  await beat(page, 600)
  await municipal.click()
  await expect(page).toHaveURL(area)
  await beat(page)
  await shot('area-municipal-water-supply')

  // 3. Surface water intake
  const intakeCard = page.locator(`main a[href="${application}"]`)
  await intakeCard.hover()
  await beat(page, 600)
  await intakeCard.click()
  await expect(page).toHaveURL(application)
  await expectTabSelected(page, 'Explore')
  await beat(page, 1500)
  await shot('application-hero')

  // 4. Explore, scroll
  await scrollToFrame(page, heading(page, 'Raw water you can count on'))
  await page.getByRole('button', { name: 'Show more' }).click()
  await beat(page)
  await shot('explore-intro')
  await scrollToFrame(page, heading(page, 'Want to know more about this application?'))
  await beat(page)
  await shot('explore-knowledge')
  await scrollToFrame(page, heading(page, 'How can we help you?'))
  await beat(page)
  await shot('explore-help')

  // 5. Products & solutions, scroll
  await page.getByRole('tab', { name: 'Products & solutions' }).click()
  await expect(page).toHaveURL(`${application}#products`)
  await beat(page)
  await shot('products-top')
  const ahlstar = page.locator('[role=tabpanel] li', { hasText: 'AHLSTAR' }).first()
  await scrollToFrame(page, heading(page, 'End-suction single-stage pumps'), 24)
  await expect(ahlstar).toBeInViewport({ ratio: 1 })
  await beat(page)
  await shot('products-ahlstar')

  // 6. Product page
  const view = ahlstar.getByRole('link', { name: 'View' })
  await view.hover()
  await beat(page, 800)
  await view.click()
  await expect(page).toHaveURL(product)
  await beat(page, 1500)
  await shot('product-ahlstar')
  await scrollToFrame(page, heading(page, 'High efficiency'), 60)
  await beat(page)
  await shot('product-ahlstar-explore')

  const video = page.video()!
  await context.close()
  await rename(await video.path(), `${videoDir}/application-finder.webm`)
  expect(problems).toEqual([])
})

test('every link on the recording path resolves', async ({ page }) => {
  const problems = watchForErrors(page)
  const notFound = 'Page not found | Sulzer'

  // Home "Application finder" card
  await page.goto('/')
  await page.getByRole('link', { name: 'Find your application' }).click()
  await expect(page).toHaveURL('/applications')

  // Mega menu "Applications", and its "Municipal water supply" sub-link
  const megaMenu = page.locator('#mega-menu')
  await page.goto('/')
  await page.getByRole('button', { name: 'Products & services' }).click()
  await megaMenu.getByRole('link', { name: 'Applications', exact: true }).click()
  await expect(page).toHaveURL('/applications')
  await page.getByRole('button', { name: 'Products & services' }).click()
  await megaMenu.getByRole('link', { name: 'Applications', exact: true }).hover()
  await megaMenu.getByRole('link', { name: 'Municipal water supply' }).click()
  await expect(page).toHaveURL(area)

  // Main nav "Applications"
  await page.locator('header nav').getByRole('link', { name: 'Applications', exact: true }).click()
  await expect(page).toHaveURL('/applications')

  // Every link inside main on the path pages, plus the product page's links back.
  const pages = ['/applications', area, application, `${application}#products`, product]
  const hrefs = new Set<string>()
  for (const path of pages) {
    await page.goto(path)
    for (const href of await page
      .locator('main a[href^="/"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')!))) {
      hrefs.add(href)
    }
  }
  const broken: string[] = []
  for (const href of hrefs) {
    await page.goto(href)
    if ((await page.title()) === notFound) broken.push(href)
  }
  expect(broken, 'links that lead to the 404 page').toEqual([])

  // Product "Suitable for" goes back to the application.
  await page.goto(product)
  await page.getByRole('link', { name: 'Surface water intake', exact: true }).click()
  await expect(page).toHaveURL(application)
  expect(problems).toEqual([])
})

test('tab hashes survive reload and Back', async ({ page }) => {
  const problems = watchForErrors(page)

  await page.goto(`${application}#products`)
  await expectTabSelected(page, 'Products & solutions')
  await page.reload()
  await expectTabSelected(page, 'Products & solutions')

  await page.goto(`${application}#learn`)
  await expectTabSelected(page, 'Learn')

  // Explore → Products & solutions → product → Back lands on the products tab again.
  await page.goto(area)
  await page.locator(`main a[href="${application}"]`).click()
  await page.getByRole('tab', { name: 'Products & solutions' }).click()
  await page
    .locator('[role=tabpanel] li', { hasText: 'AHLSTAR' })
    .first()
    .getByRole('link', { name: 'View' })
    .click()
  await expect(page).toHaveURL(product)
  await page.goBack()
  await expect(page).toHaveURL(`${application}#products`)
  await expectTabSelected(page, 'Products & solutions')
  await page.goBack()
  await expect(page).toHaveURL(area)

  await page.goto(`${product}#models`)
  await expectTabSelected(page, 'Models')
  await page.reload()
  await expectTabSelected(page, 'Models')
  expect(problems).toEqual([])
})

for (const viewport of [
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
]) {
  test(`sticky tab bar never covers content at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    for (const [path, tabs] of [
      [application, ['Products & solutions', 'Learn', 'Explore']],
      [product, ['Models', 'Documentation', 'Services', 'Explore']],
    ] as const) {
      await page.goto(path)
      for (const tab of tabs) {
        await page.getByRole('tab', { name: tab, exact: true }).click()
        await page.waitForTimeout(900) // smooth scroll to the bar
        const box = await stickyBoxes(page)
        expect(
          Math.abs(box.barTop - box.headerBottom),
          `${path} ${tab}: bar under header`,
        ).toBeLessThan(0.5)
        expect(box.panelTop, `${path} ${tab}: panel starts below bar`).toBeGreaterThanOrEqual(
          box.barBottom - 1,
        )
      }
      // Deep in the page the bar stays glued to the header.
      await scrollBy(page, 1500)
      const box = await stickyBoxes(page)
      expect(Math.abs(box.barTop - box.headerBottom), `${path}: bar while scrolled`).toBeLessThan(
        0.5,
      )
    }
  })
}

test('no layout shift while pages and images load', async ({ page }) => {
  // Slow image responses, so any image without reserved space would visibly shift.
  await page.route('**/images/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    await route.continue()
  })
  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number }
    w.__cls = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as {
        value: number
        hadRecentInput: boolean
      }[]) {
        if (!entry.hadRecentInput) w.__cls += entry.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
  for (const path of ['/applications', area, application, `${application}#products`, product]) {
    await page.goto(path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls)
    expect(cls, `cumulative layout shift on ${path}`).toBeLessThan(0.01)
  }
})
