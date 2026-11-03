import { mkdir } from 'node:fs/promises'
import { expect, type Page, test } from '@playwright/test'

/*
 * Video A step 10: Request service on RW-02 in Sulzer Connect → toast → the request on
 * /self-service/requests, then My Pages counts it. Saves screenshots to
 * _qa/screenshots/flows/service-request/. Run with `npm run flow -- service-request`.
 */

const shotDir = '_qa/screenshots/flows/service-request'

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

test('request service on RW-02 and follow it', async ({ page }) => {
  const problems = watchForErrors(page)
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('flow-started')) {
      localStorage.clear()
      localStorage.setItem('sz-demo-persona', 'endUser')
      sessionStorage.setItem('flow-started', '1')
    }
  })

  await page.goto('/my-pages', { waitUntil: 'networkidle' })
  await expect(page.getByRole('link', { name: /Requests/ })).toContainText('1 open')

  await page.goto('/connect/assets/rw-02', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Request service' }).first().click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${shotDir}/01-dialog.png` })

  await dialog.getByRole('button', { name: 'Send request' }).click()
  const toast = page.getByRole('status').filter({ hasText: 'SR-2026-0142' })
  await expect(toast).toBeVisible()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${shotDir}/02-toast.png` })

  await toast.getByRole('link', { name: 'View request' }).click()
  await expect(page).toHaveURL(/\/self-service\/requests$/)
  const first = page.locator('article').first()
  await expect(first).toContainText('SR-2026-0142')
  await expect(first).toContainText('RW-02')
  await expect(first).toContainText('Received')
  await expect(first).toContainText('Today, 09:26')
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${shotDir}/03-requests.png` })

  await page.goto('/my-pages', { waitUntil: 'networkidle' })
  await expect(page.getByRole('link', { name: /Requests/ })).toContainText('2 open')
  await page.screenshot({ path: `${shotDir}/04-my-pages.png` })

  expect(problems).toEqual([])
})
