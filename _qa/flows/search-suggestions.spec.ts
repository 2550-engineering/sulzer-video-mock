import { mkdir } from 'node:fs/promises'
import { expect, type Page, test } from '@playwright/test'

/*
 * Search suggestions in the header search and the home hero search.
 * Saves screenshots with "ahl" typed to _qa/screenshots/module2/.
 * Run with `npm run flow -- search-suggestions`.
 */

const shotDir = '_qa/screenshots/module2'

/** Collects console errors, page errors and failed requests for the whole test. */
function watchForErrors(page: Page) {
  const problems: string[] = []
  page.on('console', (msg) => msg.type() === 'error' && problems.push(`console: ${msg.text()}`))
  page.on('pageerror', (err) => problems.push(`page error: ${err.message}`))
  page.on('requestfailed', (req) => problems.push(`failed request: ${req.url()}`))
  return problems
}

async function openHeaderSearch(page: Page) {
  await page.locator('header button[aria-controls="site-search"]').click()
  const input = page.locator('#site-search').getByRole('combobox')
  await expect(input).toBeFocused()
  return input
}

/** Types like a presenter, then waits for the debounce and the 150 ms fade. */
async function typeSlowly(page: Page, text: string) {
  await page.keyboard.type(text, { delay: 120 })
  await page.waitForTimeout(400)
}

const listbox = (page: Page) => page.getByRole('listbox', { name: 'Search suggestions' })

test.beforeAll(async () => {
  await mkdir(shotDir, { recursive: true })
})

test('header search: "ahl" shows grouped suggestions', async ({ page }) => {
  const problems = watchForErrors(page)
  await page.goto('/', { waitUntil: 'networkidle' })
  const input = await openHeaderSearch(page)

  await page.keyboard.type('a')
  await page.waitForTimeout(400)
  await expect(input, 'nothing under 2 characters').toHaveAttribute('aria-expanded', 'false')

  await typeSlowly(page, 'hl')
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  const panel = listbox(page).first()
  await expect(panel.getByRole('group', { name: 'Products' })).toContainText('AHLSTAR')
  await expect(panel.getByRole('group', { name: 'Documents' }).getByRole('option')).toHaveCount(4)
  await expect(panel.getByRole('group', { name: 'Applications' })).toHaveCount(0)
  await expect(panel.locator('b').first()).toHaveText('AHL')
  await expect(panel.getByRole('option').last()).toHaveText(/See all results for ‘ahl’/)

  await page.screenshot({ path: `${shotDir}/header-search-ahl.png` })
  expect(problems).toEqual([])
})

test('home hero search: "ahl" shows stacked suggestions', async ({ page }) => {
  const problems = watchForErrors(page)
  await page.goto('/', { waitUntil: 'networkidle' })
  const input = page.getByRole('combobox', { name: 'Find a Sulzer product' })
  await input.click()
  await typeSlowly(page, 'ahl')
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  await page.screenshot({ path: `${shotDir}/home-hero-search-ahl.png` })
  expect(problems).toEqual([])
})

test('keyboard: arrows, Enter on a row, Enter without one, Esc', async ({ page }) => {
  await page.goto('/')
  let input = await openHeaderSearch(page)
  await typeSlowly(page, 'ahl')

  // ↓ highlights the first row, ↑ from there returns to the field, ↑ again wraps to the footer.
  await page.keyboard.press('ArrowDown')
  const first = listbox(page).first().getByRole('option').first()
  await expect(first).toHaveAttribute('aria-selected', 'true')
  await expect(input).toHaveAttribute('aria-activedescendant', (await first.getAttribute('id'))!)
  await page.keyboard.press('ArrowUp')
  await expect(input).not.toHaveAttribute('aria-activedescendant')
  await page.keyboard.press('ArrowUp')
  await expect(listbox(page).first().getByRole('option').last()).toHaveAttribute(
    'aria-selected',
    'true',
  )

  // Enter on the highlighted footer goes to the results page.
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/products?q=ahl')

  // Enter on the first row opens the product.
  await page.goto('/')
  await openHeaderSearch(page)
  await typeSlowly(page, 'AHL')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/products/ahlstar')

  // Enter with nothing highlighted searches for the typed text.
  await page.goto('/')
  await openHeaderSearch(page)
  await typeSlowly(page, 'AHLSTAR')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/products?q=ahlstar')

  // Esc closes the suggestions first, then the search panel.
  await page.goto('/')
  input = await openHeaderSearch(page)
  await typeSlowly(page, 'ahl')
  await page.keyboard.press('Escape')
  await expect(input).toHaveAttribute('aria-expanded', 'false')
  await expect(input).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(input).toBeHidden()
})

test('clicking a row and the footer', async ({ page }) => {
  await page.goto('/')
  await openHeaderSearch(page)
  await typeSlowly(page, 'surface')
  await listbox(page)
    .first()
    .getByRole('option', { name: /Surface water intake/ })
    .click()
  await expect(page).toHaveURL('/applications/municipal-water-supply/surface-water-intake')

  await page.goto('/')
  await page.getByRole('combobox', { name: 'Find a Sulzer product' }).click()
  await typeSlowly(page, 'ahl')
  await listbox(page)
    .getByRole('option', { name: /See all results/ })
    .click()
  await expect(page).toHaveURL('/products?q=ahl')
})

test('same suggestions every time, and no layout shift', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const input = page.getByRole('combobox', { name: 'Find a Sulzer product' })
  const marker = page.getByRole('heading', { level: 1 })
  const before = await marker.boundingBox()
  const height = await page.evaluate(() => document.documentElement.scrollHeight)

  const runs: string[][] = []
  for (let i = 0; i < 3; i++) {
    await input.fill('')
    await input.click()
    await typeSlowly(page, 'ahl')
    runs.push(await listbox(page).getByRole('option').allTextContents())
  }
  expect(runs[1]).toEqual(runs[0])
  expect(runs[2]).toEqual(runs[0])

  expect(await marker.boundingBox()).toEqual(before)
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(height)
})
