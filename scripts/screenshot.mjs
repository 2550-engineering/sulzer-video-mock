/*
 * Screenshots of a few routes while building a page, at 1920×1080 by default:
 * the first screen (<name>.png) and the full page (<name>-full.png).
 * Fails on console errors and failed requests. For the full recording QA use `npm run qa`.
 *
 *   npm run shot -- --out=_qa/screenshots/module1 /applications=overview
 *   npm run shot -- --viewport=1440x900 /applications=overview
 *   npm run shot -- "/products?q=pump=search-results"   # a route with "=" needs a name
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const option = (name, fallback) =>
  process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1] ?? fallback
const outDir = option('out', '_qa/screenshots/shots')
const [width, height] = option('viewport', '1920x1080').split('x').map(Number)
const shots = process.argv
  .slice(2)
  .filter((arg) => !arg.startsWith('--'))
  .map((arg) => {
    // The name follows the last "=", so query strings can stay in the route.
    const split = arg.lastIndexOf('=')
    const route = split === -1 ? arg : arg.slice(0, split)
    const name =
      split === -1
        ? route.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home'
        : arg.slice(split + 1)
    return { route, name }
  })

const server = await createServer({ server: { port: 5197, strictPort: true }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height } })
const problems = []
page.on('console', (msg) => msg.type() === 'error' && problems.push(`console: ${msg.text()}`))
page.on('pageerror', (err) => problems.push(`page error: ${err.message}`))
page.on('requestfailed', (req) => problems.push(`failed request: ${req.url()}`))
page.on('response', (res) => res.status() >= 400 && problems.push(`${res.status()}: ${res.url()}`))

await mkdir(outDir, { recursive: true })
for (const { route, name } of shots) {
  await page.goto(`http://localhost:5197${route}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400) // let fade-ins finish
  await page.screenshot({ path: `${outDir}/${name}.png` })
  await page.screenshot({ path: `${outDir}/${name}-full.png`, fullPage: true })
  console.log(`${route} → ${outDir}/${name}.png, ${name}-full.png`)
}

await browser.close()
await server.close()
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
