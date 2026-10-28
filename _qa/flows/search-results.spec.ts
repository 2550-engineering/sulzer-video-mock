import { expect, type Page, test } from '@playwright/test'

/*
 * /products: search results and Products A–Z. Checks that tabs, filters and
 * sort live in the URL, so reload and Back keep them.
 * Run with `npm run flow -- search-results`.
 */

function watchForErrors(page: Page) {
  const problems: string[] = []
  page.on('console', (msg) => msg.type() === 'error' && problems.push(`console: ${msg.text()}`))
  page.on('pageerror', (err) => problems.push(`page error: ${err.message}`))
  page.on('requestfailed', (req) => problems.push(`failed request: ${req.url()}`))
  return problems
}

const heading = (page: Page) => page.getByRole('heading', { level: 1 })
const productRows = (page: Page) =>
  page.locator('[role=tabpanel] li, main section li').filter({
    has: page.getByRole('link', { name: 'View', exact: true }),
  })

test('search for AHLSTAR: heading, tabs and counts', async ({ page }) => {
  const problems = watchForErrors(page)
  await page.goto('/products?q=ahlstar')
  await expect(heading(page)).toHaveText('11 results for ‘AHLSTAR’')
  await expect(page.getByRole('combobox', { name: /Search products/ })).toHaveValue('ahlstar')
  await expect(page.getByRole('tab', { name: 'Products (1)' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.getByRole('tab', { name: 'Applications (0)' })).toBeVisible()

  await page.getByRole('tab', { name: 'Documents (10)' }).click()
  await expect(page).toHaveURL('/products?q=ahlstar&tab=documents')
  await expect(page.getByRole('tabpanel').getByRole('listitem')).toHaveCount(10)

  await page.getByRole('tab', { name: 'Applications (0)' }).click()
  await expect(page.getByText('No applications match ‘AHLSTAR’.')).toBeVisible()
  await page.getByRole('button', { name: 'Documents (10)' }).click()
  await expect(page).toHaveURL('/products?q=ahlstar&tab=documents')
  expect(problems).toEqual([])
})

test('filters and sort live in the URL: reload and Back keep them', async ({ page }) => {
  const problems = watchForErrors(page)
  await page.goto('/products')
  await expect(heading(page)).toHaveText('Products A–Z')
  await expect(productRows(page)).toHaveCount(12)
  // Without a query the list is alphabetical.
  await expect(productRows(page).first()).toContainText('AFP')

  await page.getByRole('checkbox', { name: /Submersible pumps/ }).check()
  await page.getByRole('checkbox', { name: /End suction pumps/ }).check()
  await page.getByRole('checkbox', { name: /1 000–5 000 m³\/h/ }).check()
  await expect(page).toHaveURL(
    '/products?category=submersible-pumps&category=end-suction-pumps&flow=1000-5000',
  )
  await expect(page.getByText('4 of 12 products')).toBeVisible()

  await page.reload()
  await expect(page.getByRole('checkbox', { name: /Submersible pumps/ })).toBeChecked()
  await expect(page.getByText('4 of 12 products')).toBeVisible()

  // Open a product, come Back: the same filtered list.
  await productRows(page).filter({ hasText: 'AHLSTAR' }).getByRole('link', { name: 'View' }).click()
  await expect(page).toHaveURL('/products/ahlstar')
  await page.goBack()
  await expect(page.getByRole('checkbox', { name: /1 000–5 000 m³\/h/ })).toBeChecked()
  await expect(page.getByText('4 of 12 products')).toBeVisible()

  // Options that would show nothing are hidden, so only an edited URL gets here. Then Reset.
  await page.goto('/products?category=digital-solutions&temp=above-120')
  await expect(page.getByText('No products match these filters')).toBeVisible()
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(page).toHaveURL('/products')
  await expect(page.getByText('12 products')).toBeVisible()

  // Sort: relevance is the default with a query, so only Name A–Z goes into the URL.
  await page.goto('/products?q=pump')
  await page.getByLabel('Sort by').selectOption('name')
  await expect(page).toHaveURL('/products?q=pump&sort=name')
  await page.reload()
  await expect(page.getByLabel('Sort by')).toHaveValue('name')
  expect(problems).toEqual([])
})

test('a new search from the results page, and no results', async ({ page }) => {
  await page.goto('/products?q=ahlstar&tab=documents')
  const field = page.getByRole('combobox', { name: /Search products/ })
  await field.fill('zzzz')
  await field.press('Enter')
  await expect(page).toHaveURL('/products?q=zzzz')
  await expect(heading(page)).toHaveText('No results for ‘zzzz’')
  await page.getByRole('link', { name: 'Submersible pumps' }).click()
  await expect(page).toHaveURL('/products?q=submersible%20pumps')
  await page.goBack()
  await page.goBack()
  await expect(page).toHaveURL('/products?q=ahlstar&tab=documents')
})

test('Products A–Z from the mega menu and the old URL', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Products & services' }).click()
  await page.locator('#mega-menu').getByRole('link', { name: 'Products A–Z' }).click()
  await expect(page).toHaveURL('/products')
  await page.goto('/products/a-z')
  await expect(page).toHaveURL('/products')
  await expect(heading(page)).toHaveText('Products A–Z')
})
