import { mkdir } from 'node:fs/promises'
import { expect, type Page, test } from '@playwright/test'

/*
 * P5: AHLSTAR → Spare parts tab → hotspot 321 → add the bearing kit to the cart → cart
 * drawer → checkout → confirmation → the order on /self-service/orders. Saves screenshots
 * to _qa/screenshots/flows/spare-parts-checkout/. Run with `npm run flow -- spare-parts`.
 */

const shotDir = '_qa/screenshots/flows/spare-parts-checkout'

function watchForErrors(page: Page) {
  const problems: string[] = []
  page.on('console', (msg) => msg.type() === 'error' && problems.push(`console: ${msg.text()}`))
  page.on('pageerror', (err) => problems.push(`page error: ${err.message}`))
  page.on('requestfailed', (req) => problems.push(`failed request: ${req.url()}`))
  return problems
}

test.beforeAll(async () => {
  await mkdir(shotDir, { recursive: true })
})

test('order a bearing kit from the AHLSTAR sectional drawing', async ({ page }) => {
  const problems = watchForErrors(page)
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('flow-started')) {
      localStorage.clear()
      localStorage.setItem('sz-demo-persona', 'endUser')
      sessionStorage.setItem('flow-started', '1')
    }
  })

  await page.goto('/products/ahlstar#spare-parts', { waitUntil: 'networkidle' })
  const drawing = page.getByRole('figure')
  await drawing.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${shotDir}/01-spare-parts-tab.png` })

  // Hotspot 321 lights up the bearing and the kits that hold it.
  await page.getByRole('button', { name: 'Position 321' }).click()
  const active = page.locator('tbody[data-active]')
  await expect(active.first()).toBeVisible()
  await expect(active.filter({ hasText: /^.*Bearing kit/ })).toHaveCount(1)
  await expect(drawing).toContainText('Pos. 321')
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${shotDir}/02-hotspot-321.png` })

  await page.getByRole('button', { name: /^Add Bearing kit/ }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Added to cart' })).toBeVisible()
  await expect(page.getByTestId('cart-count')).toHaveText('1')
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${shotDir}/03-added-to-cart.png` })

  await page.getByRole('button', { name: /^Cart/ }).click()
  const cart = page.getByRole('dialog', { name: 'Your cart' })
  await expect(cart).toContainText('Bearing kit')
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${shotDir}/04-cart-drawer.png` })

  await cart.getByRole('link', { name: 'Go to checkout' }).click()
  await expect(page).toHaveURL(/\/eshop\/checkout$/)
  await page.getByLabel('Purchase order number').fill('PO 2026-1203')
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${shotDir}/05-checkout.png` })

  await page.getByRole('button', { name: 'Place order' }).click()
  await expect(page).toHaveURL(/\/eshop\/confirmation\/SO-104400$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Thank you, Emma')
  await expect(page.getByTestId('cart-count')).toHaveCount(0)
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${shotDir}/06-confirmation.png` })

  await page.getByRole('link', { name: 'Track order' }).click()
  await expect(page).toHaveURL(/\/self-service\/orders\/SO-104400$/)
  await expect(page.getByRole('main')).toContainText('PO 2026-1203')
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${shotDir}/07-order.png` })

  await page.goto('/self-service/orders', { waitUntil: 'networkidle' })
  const first = page.getByRole('row').nth(1)
  await expect(first).toContainText('SO-104400')
  await expect(first).toContainText('Confirmed')
  await page.screenshot({ path: `${shotDir}/08-orders.png` })

  expect(problems).toEqual([])
})
