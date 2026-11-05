/*
 * Full-page screenshots of every route at the desktop viewports, per sign-in
 * state, into `<outDir>/<viewport>/<state>/<route>.png` plus manifest.json.
 * Used by desktop-baseline.mjs and desktop-compare.mjs.
 */
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import {
  allRoutes,
  fillCart,
  goToRoute,
  launch,
  openState,
  pool,
  STATES,
  startServer,
  writeJson,
} from './qa.mjs'

export const DESKTOP_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]

const vpName = (vp) => `${vp.width}x${vp.height}`

/** Only routes whose name contains one of these (comma-separated) when QA_ONLY is set. */
const only = process.env.QA_ONLY?.split(',').filter(Boolean)

/** Route names to visit: the QA_ONLY matches plus the `@route`s they are discovered from. */
function neededRoutes(routes) {
  const byName = new Map(routes.map((r) => [r.name, r]))
  const needed = new Set()
  const add = (name) => {
    if (needed.has(name)) return
    needed.add(name)
    const from = byName.get(name)?.discover?.from
    if (from?.startsWith('@')) add(from.slice(1))
  }
  for (const r of routes) if (!only || only.some((o) => r.name.includes(o))) add(r.name)
  return needed
}

/** With QA_ONLY: the previous manifest with this run's shots replacing their old entries. */
function merged(outDir, manifest) {
  const file = path.join(outDir, 'manifest.json')
  if (!only || !existsSync(file)) return manifest
  const previous = JSON.parse(readFileSync(file, 'utf8'))
  const taken = new Set(manifest.shots.map((s) => s.file))
  return {
    ...manifest,
    shots: [...previous.shots.filter((s) => !taken.has(s.file)), ...manifest.shots],
    skipped: previous.skipped,
  }
}

/** Takes the screenshots; returns the manifest of this run only. */
export async function captureDesktop(outDir) {
  // A full run starts clean; QA_ONLY retakes some pages and keeps the rest.
  if (!only) await rm(outDir, { recursive: true, force: true })
  const server = await startServer()
  const browser = await launch()
  const routes = allRoutes()
  const needed = neededRoutes(routes)
  const jobs = DESKTOP_VIEWPORTS.flatMap((viewport) => STATES.map((state) => ({ viewport, state })))
  const started = Date.now()
  try {
    const results = await pool(jobs, Number(process.env.QA_WORKERS ?? 4), async (job) => {
      const { viewport, state } = job
      const { context, page, errors } = await openState(browser, server.baseUrl, state, viewport)
      const shots = []
      const skipped = []
      const resolved = {}
      try {
        if (state !== 'signedOut' && !(await fillCart(page, server.baseUrl)))
          skipped.push({ route: 'cart-fill', reason: 'no "Add to cart" button found' })
        for (const route of routes) {
          if (!route.states.includes(state)) continue
          const wanted = !only || only.some((o) => route.name.includes(o))
          if (!needed.has(route.name)) continue
          errors.length = 0
          let url
          try {
            url = await goToRoute(page, server.baseUrl, route, resolved)
          } catch (e) {
            skipped.push({ route: route.name, reason: e.message.split('\n')[0] })
            continue
          }
          if (!url) {
            skipped.push({ route: route.name, reason: 'could not be reached' })
            continue
          }
          if (!wanted) continue
          const file = path.join(vpName(viewport), state, `${route.name}.png`)
          await mkdir(path.join(outDir, path.dirname(file)), { recursive: true })
          await page.screenshot({ path: path.join(outDir, file), fullPage: true })
          shots.push({ file, route: route.name, url, state, viewport: vpName(viewport) })
          if (errors.length) shots.at(-1).consoleErrors = [...errors]
        }
      } finally {
        await context.close()
      }
      console.log(`  ${vpName(viewport)} ${state}: ${shots.length} pages`)
      return { shots, skipped: skipped.map((s) => ({ ...s, state, viewport: vpName(viewport) })) }
    })
    const manifest = {
      created: new Date().toISOString(),
      baseUrl: server.baseUrl,
      shots: results.flatMap((r) => r.shots),
      skipped: results.flatMap((r) => r.skipped),
    }
    await writeJson(path.join(outDir, 'manifest.json'), merged(outDir, manifest))
    const seconds = Math.round((Date.now() - started) / 1000)
    console.log(`${manifest.shots.length} screenshots in ${seconds} s → ${outDir}`)
    for (const s of manifest.skipped)
      console.warn(`  skipped ${s.viewport} ${s.state} ${s.route}: ${s.reason}`)
    return manifest
  } finally {
    await browser.close()
    server.stop()
  }
}
