/*
 * Finds horizontal overflow on every route at phone and tablet widths.
 *
 * Every route in the router (signed out and as each persona where pages
 * differ, see scripts/lib/qa.mjs) is opened once per sign-in state and then
 * measured at each viewport width. Listed per page:
 *   - whether document.scrollWidth > innerWidth (the page scrolls sideways)
 *   - every element whose right edge is beyond the viewport
 *   - every element that sticks out of its parent on the right
 * Elements inside a box that scrolls sideways on purpose (overflow-x: auto)
 * are fine and not listed; content cut off by an overflow-hidden box is.
 *
 * Writes _qa/overflow-report.md (and .json). No screenshots.
 *
 *   npm run qa:overflow
 *   QA_ONLY=sizing,connect npm run qa:overflow
 *   QA_VIEWPORTS=390x844 npm run qa:overflow
 *   QA_PORT=5191 QA_REPORT=_qa/overflow-connect.md QA_ONLY=connect npm run qa:overflow
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  allRoutes,
  fillCart,
  goToRoute,
  launch,
  openState,
  pool,
  root,
  STATES,
  startServer,
  writeJson,
} from './lib/qa.mjs'

const viewports = (process.env.QA_VIEWPORTS ?? '375x667,390x844,427x952,768x1024,820x1180')
  .split(',')
  .map((v) => {
    const [width, height] = v.split('x').map(Number)
    return { width, height, name: v }
  })
const only = process.env.QA_ONLY?.split(',').filter(Boolean)
/** QA_REPORT=_qa/my-report.md writes elsewhere (e.g. for parallel runs). */
const reportFile = path.resolve(root, process.env.QA_REPORT ?? '_qa/overflow-report.md')

/** Runs in the page: every overflowing element at the current width. */
function measure() {
  const vw = document.documentElement.clientWidth
  const style = (el) => getComputedStyle(el)
  const selector = (el) => {
    const part = (e) => {
      const cls = typeof e.className === 'string' ? e.className.trim().split(/\s+/) : []
      // Skip state and colour classes; keep the layout ones that identify the element.
      const keep = cls
        .filter(
          (c) =>
            c &&
            !/^(hover|focus|group-hover|text-|bg-|transition|duration|ease|animate|after|before|ring|shadow|font-|tracking|leading)/.test(
              c,
            ),
        )
        .slice(0, 4)
      return `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ''}${keep.length ? `.${keep.join('.')}` : ''}`
    }
    const chain = [part(el)]
    let p = el.parentElement
    for (let i = 0; i < 2 && p && p !== document.body; i++, p = p.parentElement)
      chain.unshift(part(p))
    const text = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ')
    return `${chain.join(' > ')}${text ? ` "${text.slice(0, 40)}"` : ''}`
  }

  /** Not shown: display none / visibility hidden, or inside an inert or closed fixed layer. */
  const hidden = (el) => {
    const s = style(el)
    if (s.display === 'none' || s.visibility === 'hidden') return true
    const r = el.getBoundingClientRect()
    return r.width === 0 || r.height === 0
  }
  /** Inside a box that scrolls sideways: overflow there is on purpose. */
  const inScroller = (el) => {
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const o = style(p).overflowX
      if (o === 'auto' || o === 'scroll') return p
    }
    return null
  }
  /** In a fixed layer (drawers, bars, dialogs): those never widen the page. */
  const inFixed = (el) => {
    for (let p = el; p && p !== document.body; p = p.parentElement)
      if (style(p).position === 'fixed') return p
    return null
  }
  const clipper = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = style(p).overflowX
      if (o === 'hidden' || o === 'clip') return p
    }
    return null
  }

  /** The nearest ancestor with a box of its own (skips display: contents). */
  const box = (el) => {
    let p = el.parentElement
    while (p && style(p).display === 'contents') p = p.parentElement
    return p
  }

  const items = []
  const seen = new Set()
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('[inert]') || hidden(el)) continue
    // Card tables on phones keep their headers for screen readers only (clipped).
    if (vw < 768 && el.closest('table.table-cards > thead')) continue
    if (
      el.matches('script,style,br,.sr-only') ||
      (el.closest('svg') !== null && el.tagName !== 'svg')
    )
      continue
    const r = el.getBoundingClientRect()
    const scroller = inScroller(el)
    // In a sideways-scrolling box that itself fits: fine.
    if (scroller && scroller.getBoundingClientRect().right <= vw + 1) continue
    const fixed = inFixed(el)
    const s = style(el)
    const abs = s.position === 'absolute' || s.position === 'fixed'
    let reason = null
    if (r.right > vw + 1) {
      const clip = clipper(el)
      // Cut off by an overflow-hidden box that itself fits: only report real content.
      if (clip && clip.getBoundingClientRect().right <= vw + 1) {
        // Truncated with an ellipsis on purpose: not a problem.
        if (style(clip).textOverflow === 'ellipsis') continue
        if (
          el.matches('table,[role=table],form,section,article,input,select,textarea,button,a') ||
          /\S/.test(
            [...el.childNodes]
              .filter((n) => n.nodeType === 3)
              .map((n) => n.textContent)
              .join(''),
          )
        )
          reason = 'cut off'
      } else reason = fixed ? 'off-screen (fixed layer)' : 'beyond viewport'
    } else if (!abs && !fixed && box(el) && box(el) !== document.body) {
      const parent = box(el)
      const pr = parent.getBoundingClientRect()
      const ps = style(parent)
      // A few px (focus-ring padding with a negative margin) is on purpose.
      if (r.right > pr.right + 8 && ps.overflowX === 'visible' && !inScroller(parent)) {
        // Content box of the parent, so padding counts as inside.
        reason = 'wider than parent'
      }
    }
    if (!reason) continue
    // Report the outermost element only: skip children of an already listed one.
    let listed = false
    for (let p = el.parentElement; p; p = p.parentElement)
      if (seen.has(p)) {
        listed = true
        break
      }
    seen.add(el)
    if (listed) continue
    items.push({
      selector: selector(el),
      reason,
      width: Math.round(r.width),
      right: Math.round(r.right),
    })
  }
  const scrollWidth = document.documentElement.scrollWidth
  return { vw, scrollWidth, scrolls: scrollWidth > window.innerWidth, items }
}

const routes = allRoutes()
const byName = new Map(routes.map((r) => [r.name, r]))
/** Routes for this state (QA_ONLY matches plus the `@route`s they are discovered from). */
function plan(state) {
  const names = new Set()
  const add = (name) => {
    const r = byName.get(name)
    if (!r || names.has(name)) return
    const from = r.discover?.from
    if (from?.startsWith('@')) add(from.slice(1))
    names.add(name)
  }
  for (const r of routes)
    if (r.states.includes(state) && (!only || only.some((o) => r.name.includes(o)))) add(r.name)
  return routes.filter((r) => names.has(r.name))
}

const server = await startServer()
const browser = await launch()
const results = []
const started = Date.now()
try {
  await pool(STATES, STATES.length, async (state) => {
    const first = viewports[0]
    const { context, page } = await openState(browser, server.baseUrl, state, first)
    const resolved = {}
    try {
      if (state !== 'signedOut') await fillCart(page, server.baseUrl).catch(() => false)
      for (const route of plan(state)) {
        await page.setViewportSize(first)
        let url = null
        try {
          url = await goToRoute(page, server.baseUrl, route, resolved)
        } catch {
          url = null
        }
        const wanted = !only || only.some((o) => route.name.includes(o))
        if (!url || !wanted || !route.states.includes(state)) continue
        for (const viewport of viewports) {
          await page.setViewportSize(viewport)
          await page.waitForTimeout(150)
          const m = await page.evaluate(measure)
          results.push({ route: route.name, url, state, viewport: viewport.name, ...m })
        }
      }
    } finally {
      await context.close()
    }
    console.log(`  ${state}: done`)
  })
} finally {
  await browser.close()
  server.stop()
}

const order = (r) =>
  `${routes.findIndex((x) => x.name === r.route)}`.padStart(3, '0') + STATES.indexOf(r.state)
results.sort((a, b) => order(a).localeCompare(order(b)) || a.vw - b.vw)
await writeJson(reportFile.replace(/\.md$/, '.json'), results)

// Markdown: per route, the widths where it scrolls and each element with its widths.
// Sign-in states with the same findings are merged into one entry.
const pages = new Map()
for (const r of results) {
  const key = `${r.route}|${r.state}`
  if (!pages.has(key)) pages.set(key, { route: r.route, state: r.state, url: r.url, rows: [] })
  pages.get(key).rows.push(r)
}
const entries = new Map()
for (const { route, state, url, rows } of pages.values()) {
  const out = []
  const scrolls = rows.filter((r) => r.scrolls)
  if (scrolls.length)
    out.push(
      `- **page scrolls sideways** at ${scrolls.map((r) => `${r.vw} (${r.scrollWidth}px)`).join(', ')}`,
    )
  const elements = new Map()
  for (const r of rows)
    for (const item of r.items) {
      const k = `${item.reason}: ${item.selector}`
      if (!elements.has(k)) elements.set(k, [])
      elements.get(k).push(`${r.vw}: ${item.width}px→${item.right}`)
    }
  for (const [k, at] of elements) out.push(`- ${k} — ${at.join(', ')}`)
  if (!out.length) continue
  const key = `${route}|${out.join('\n')}`
  if (!entries.has(key)) entries.set(key, { route, url, states: [], out })
  entries.get(key).states.push(state)
}
const lines = [
  '# Overflow report',
  '',
  `Generated by \`npm run qa:overflow\` at ${viewports.map((v) => v.name).join(', ')}.`,
  '',
]
const problemPages = new Set([...entries.values()].map((e) => e.route)).size
const routeCount = new Set(results.map((r) => r.route)).size
lines.push(`${problemPages} of ${routeCount} routes with overflow.`, '')
for (const { route, url, states, out } of entries.values())
  lines.push(`## ${route} (${states.join(', ')})`, '', `\`${url}\``, '', ...out, '')
if (!problemPages) lines.push('No overflow found.')
await writeFile(reportFile, lines.join('\n'))
console.log(
  `${problemPages} of ${routeCount} routes with overflow (${Math.round((Date.now() - started) / 1000)} s) → _qa/overflow-report.md`,
)
