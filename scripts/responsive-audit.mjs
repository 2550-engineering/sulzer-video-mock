/*
 * Responsive audit: opens every route at a phone and a tablet viewport and
 * measures the usual problems: horizontal scroll, elements and tables wider
 * than the screen, small tap targets, overlapping or clipped text, hover-only
 * reveals, dialogs and menus larger than the screen, and charts cut off.
 *
 * Writes _qa/responsive-audit/report.json, report.md and a full-page
 * screenshot per page (plus the opened menus/dialogs) for a visual pass.
 *
 *   npm run qa:responsive-audit
 *   QA_VIEWPORTS=390x844 QA_ONLY=home npm run qa:responsive-audit
 */
import { readFileSync } from 'node:fs'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  allRoutes,
  fillCart,
  goToRoute,
  launch,
  openState,
  pool,
  root,
  startServer,
  visit,
  writeJson,
} from './lib/qa.mjs'

const outDir = path.join(root, '_qa/responsive-audit')
const viewports = (process.env.QA_VIEWPORTS ?? '390x844,820x1180').split(',').map((v) => {
  const [width, height] = v.split('x').map(Number)
  return { width, height, name: v }
})
const only = process.env.QA_ONLY?.split(',').filter(Boolean)

/**
 * Which sign-in states to audit a route in: signed in as the end user for
 * everything, signed out for public pages, the partner for partner pages and
 * the consultant for projects (they own the big comparison project).
 */
function auditStates(route) {
  const states = new Set()
  if (route.states.includes('signedOut') && route.states.length === 2) states.add('signedOut')
  states.add('endUser')
  if (/partner|cart|checkout|order-confirmation/.test(route.name)) states.add('channelPartner')
  if (/my-project|sizing-compare/.test(route.name)) states.add('consultant')
  return [...states]
}

/** Interactions that open a menu or dialog, measured after opening. */
const interactions = [
  { route: 'home', label: 'mega-menu', button: /^Products & services/ },
  { route: 'home', label: 'quick-links', button: /^Quick links/ },
  { route: 'home', label: 'search', button: /^Search$/ },
  { route: 'home', label: 'account-menu', button: /Emma Lindqvist|^Sign in/ },
  { route: 'product-ahlstar', label: 'request-quotation', button: /^Request quotation/ },
  { route: 'configured-product', label: 'where-to-buy', button: /where to buy/i },
  { route: 'my-project', label: 'share-project', button: /^Share/ },
  { route: 'my-project', label: 'tender-text', button: /tender text/i },
  { route: 'sizing-results', label: 'curve', button: /^Open .* curve|curve/i },
  { route: 'connect-dashboard', label: 'connect-menu', button: /menu|navigation/i },
]

/** Runs in the page: measures layout problems at the current viewport. */
function measure() {
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const short = (el) => {
    const cls = typeof el.className === 'string' ? el.className : ''
    const text = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ')
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${
      cls ? `.${cls.split(/\s+/).slice(0, 4).join('.')}` : ''
    }${text ? ` "${text.slice(0, 50)}"` : ''}`
  }
  const visible = (el) => {
    const s = getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }
  const inert = (el) => el.closest('[inert],[aria-hidden="true"]')
  /** The nearest ancestor that clips or scrolls horizontally. */
  const clipper = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX
      if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return p
    }
    return null
  }

  const all = [...document.body.querySelectorAll('*')].filter((el) => !inert(el))
  const shown = all.filter(visible)

  // 1. Horizontal scroll of the page.
  const pageWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
  const horizontalScroll = pageWidth > vw + 1 ? pageWidth - vw : 0

  // 2. Elements sticking out of the viewport, not inside a clipping/scrolling box.
  const outside = shown.filter((el) => {
    const r = el.getBoundingClientRect()
    return (r.right > vw + 1 || r.left < -1) && !clipper(el)
  })
  const outsideSet = new Set(outside)
  const overflowing = outside
    .filter((el) => !outsideSet.has(el.parentElement))
    .slice(0, 15)
    .map((el) => {
      const r = el.getBoundingClientRect()
      return { el: short(el), left: Math.round(r.left), right: Math.round(r.right) }
    })

  // 3. Tables: wider than the screen, and whether they scroll sideways.
  const tables = shown
    .filter((el) => el.tagName === 'TABLE' || el.getAttribute('role') === 'table')
    .map((t) => {
      const r = t.getBoundingClientRect()
      const box = clipper(t)
      const scrolls = box && ['auto', 'scroll'].includes(getComputedStyle(box).overflowX)
      return {
        el: short(t).slice(0, 80),
        width: Math.round(r.width),
        columns: t.querySelector('tr')?.children.length ?? 0,
        state: r.width <= vw + 1 ? 'fits' : scrolls ? 'scrolls sideways' : 'overflows/clipped',
      }
    })
    .filter((t) => t.state !== 'fits')

  // 4. Tap targets smaller than 24×24 (WCAG 2.2 AA) and smaller than 44×44.
  const targets = shown.filter((el) =>
    el.matches(
      'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=tab],[role=checkbox],[role=switch],[tabindex="0"]',
    ),
  )
  const sizes = targets.map((el) => ({ el, r: el.getBoundingClientRect() }))
  // Inline text links in running text are exempt from the target size rule.
  const isInlineLink = (el) =>
    el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p,li')
  const tiny = sizes.filter(
    ({ el, r }) => (r.width < 24 || r.height < 24) && !isInlineLink(el) && el.type !== 'checkbox',
  )
  const tinyCheckboxes = sizes.filter(
    ({ el, r }) =>
      (el.type === 'checkbox' || el.type === 'radio') &&
      (r.width < 24 || r.height < 24) &&
      !el.closest('label'),
  )
  const under44 = sizes.filter(({ el, r }) => (r.width < 44 || r.height < 44) && !isInlineLink(el))

  // 5. Overlapping text: leaf text boxes that intersect each other.
  const textBoxes = shown
    .filter((el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1),
    )
    .map((el) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      return { el, r: range.getBoundingClientRect() }
    })
    .filter(({ r }) => r.width > 0 && r.height > 0)
    .sort((a, b) => a.r.top - b.r.top)
  const overlaps = []
  for (let i = 0; i < textBoxes.length && overlaps.length < 10; i++) {
    const a = textBoxes[i]
    for (let j = i + 1; j < textBoxes.length; j++) {
      const b = textBoxes[j]
      if (b.r.top >= a.r.bottom) break
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue
      const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
      const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
      if (w <= 2 || h <= 2) continue
      const smaller = Math.min(a.r.width * a.r.height, b.r.width * b.r.height)
      if ((w * h) / smaller < 0.25) continue
      // Stacked layers (badges on images, sticky bars) are usually on purpose.
      const pa = getComputedStyle(a.el).position
      const pb = getComputedStyle(b.el).position
      if (pa === 'absolute' || pb === 'absolute') continue
      overlaps.push(`${short(a.el).slice(0, 70)}  ×  ${short(b.el).slice(0, 70)}`)
      break
    }
  }

  // 6. Clipped text: single-line text cut off (ellipsis or hidden overflow).
  const clipped = textBoxes
    .map(({ el }) => el)
    .filter((el) => el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0)
    .filter((el) => getComputedStyle(el).overflowX !== 'visible')
    .slice(0, 8)
    .map((el) => short(el).slice(0, 90))

  // 7. Hover-only reveals: content hidden until hover (group-hover / hover: opacity, visible…).
  const hoverOnly = all
    .filter((el) => {
      const cls = typeof el.className === 'string' ? el.className : ''
      return /(group-hover|peer-hover|hover):(opacity-100|visible|block|flex|inline|translate|scale-100)/.test(
        cls,
      )
    })
    .filter((el) => {
      const s = getComputedStyle(el)
      return +s.opacity === 0 || s.visibility === 'hidden' || s.display === 'none'
    })
    .slice(0, 8)
    .map((el) => short(el).slice(0, 90))
  const titleOnly = shown.filter((el) => el.hasAttribute('title') && !el.textContent.trim()).length

  // 8. Dialogs / popovers / menus larger than the screen or off-screen.
  const dialogs = shown
    .filter((el) => el.matches('[role=dialog],[role=menu],[role=listbox],dialog[open]'))
    .map((el) => {
      const r = el.getBoundingClientRect()
      const s = getComputedStyle(el)
      const scrollsY =
        ['auto', 'scroll'].includes(s.overflowY) || el.scrollHeight <= el.clientHeight
      return {
        el: short(el).slice(0, 80),
        width: Math.round(r.width),
        height: Math.round(r.height),
        tooWide: r.right > vw + 1 || r.left < -1,
        tooTall: r.height > vh && !scrollsY && s.position === 'fixed',
      }
    })
    .filter((d) => d.tooWide || d.tooTall)

  // 9. Charts (SVG/canvas) wider than their box or the screen.
  const charts = shown
    .filter(
      (el) =>
        (el.tagName === 'svg' || el.tagName === 'CANVAS') && el.getBoundingClientRect().width > 120,
    )
    .filter((el) => {
      const r = el.getBoundingClientRect()
      const parent = el.parentElement.getBoundingClientRect()
      return r.right > vw + 1 || r.width > parent.width + 2
    })
    .slice(0, 8)
    .map((el) => {
      const r = el.getBoundingClientRect()
      return `${short(el).slice(0, 60)} ${Math.round(r.width)}px wide, right edge ${Math.round(r.right)}`
    })

  // 10. Small text (below 12 px) that is hard to read on a phone.
  const smallText = textBoxes.filter(
    ({ el }) => parseFloat(getComputedStyle(el).fontSize) < 12,
  ).length

  return {
    measuredAt: `${vw}×${vh}`,
    pageHeight: document.documentElement.scrollHeight,
    horizontalScroll,
    overflowing,
    tables,
    tapTargets: {
      under24: tiny.length,
      under24Examples: tiny
        .slice(0, 6)
        .map(
          ({ el, r }) => `${short(el).slice(0, 60)} ${Math.round(r.width)}×${Math.round(r.height)}`,
        ),
      bareCheckboxes: tinyCheckboxes.length,
      under44: under44.length,
      total: targets.length,
    },
    overlaps,
    clipped,
    hoverOnly,
    titleOnly,
    dialogs,
    charts,
    smallText,
  }
}

const routes = allRoutes().filter(
  (r) =>
    !only ||
    only.some((o) => r.name.includes(o)) ||
    interactions.some((i) => i.route === r.name && only.includes(i.label)),
)
const byName = new Map(allRoutes().map((r) => [r.name, r]))

/** Routes to visit for this state, with the `@route`s discovery depends on. */
function plan(state) {
  const names = new Set()
  const add = (name) => {
    const r = byName.get(name)
    if (!r || names.has(name)) return
    const from = r.discover?.from
    if (from?.startsWith('@')) add(from.slice(1))
    names.add(name)
  }
  for (const r of routes) if (auditStates(r).includes(state)) add(r.name)
  return allRoutes().filter((r) => names.has(r.name))
}

const reportOnly = process.argv.includes('--report-only')
let findings = []

if (reportOnly) {
  // Rebuild report.md from an existing report.json.
  findings = JSON.parse(readFileSync(path.join(outDir, 'report.json'), 'utf8'))
} else {
  await rm(outDir, { recursive: true, force: true })
  await runAudit()
  findings.sort((a, b) =>
    `${a.viewport}${a.route}${a.state}${a.interaction ?? ''}`.localeCompare(
      `${b.viewport}${b.route}${b.state}${b.interaction ?? ''}`,
    ),
  )
  await writeJson(path.join(outDir, 'report.json'), findings)
}

async function runAudit() {
  const server = await startServer()
  const browser = await launch()
  const states = ['signedOut', 'endUser', 'consultant', 'channelPartner']
  const jobs = viewports.flatMap((viewport) => states.map((state) => ({ viewport, state })))

  try {
    await pool(jobs, Number(process.env.QA_WORKERS ?? 4), async ({ viewport, state }) => {
      const list = plan(state)
      if (!list.length) return
      const { context, page, errors } = await openState(browser, server.baseUrl, state, viewport)
      const resolved = {}
      try {
        if (state !== 'signedOut') await fillCart(page, server.baseUrl).catch(() => false)
        for (const route of list) {
          errors.length = 0
          let url = null
          try {
            url = await goToRoute(page, server.baseUrl, route, resolved)
          } catch {
            url = null
          }
          const audited = auditStates(route).includes(state)
          if (!url || !audited) continue
          const shot = path.join(viewport.name, state, `${route.name}.png`)
          await mkdir(path.join(outDir, path.dirname(shot)), { recursive: true })
          await page.screenshot({ path: path.join(outDir, shot), fullPage: true })
          const result = await page.evaluate(measure)
          findings.push({
            route: route.name,
            url,
            state,
            viewport: viewport.name,
            shot,
            ...result,
            consoleErrors: [...errors],
          })

          for (const i of interactions.filter((x) => x.route === route.name)) {
            const button = page.getByRole('button', { name: i.button }).first()
            if (!(await button.count()) || !(await button.isVisible().catch(() => false))) {
              findings.push({
                route: route.name,
                interaction: i.label,
                state,
                viewport: viewport.name,
                note: 'trigger not visible at this width',
              })
              continue
            }
            try {
              await button.scrollIntoViewIfNeeded()
              await button.click({ timeout: 3000 })
              await page.waitForTimeout(400)
              const ishot = path.join(viewport.name, state, `${route.name}--${i.label}.png`)
              await page.screenshot({ path: path.join(outDir, ishot) })
              const r = await page.evaluate(measure)
              findings.push({
                route: route.name,
                interaction: i.label,
                state,
                viewport: viewport.name,
                shot: ishot,
                ...r,
              })
            } catch (e) {
              findings.push({
                route: route.name,
                interaction: i.label,
                state,
                viewport: viewport.name,
                note: `could not open: ${e.message.split('\n')[0]}`,
              })
            }
            await page.keyboard.press('Escape').catch(() => {})
            // Back to a clean page for the next interaction.
            await visit(page, server.baseUrl, url)
          }
        }
      } finally {
        await context.close()
      }
      console.log(`  ${viewport.name} ${state}: done`)
    })
  } finally {
    await browser.close()
    server.stop()
  }
}

// A compact Markdown summary: one line per page with its problems.
const lines = ['# Responsive audit (generated)', '']
for (const vp of viewports) {
  lines.push(`## ${vp.name}`, '')
  for (const f of findings.filter((x) => x.viewport === vp.name)) {
    const name = `${f.route}${f.interaction ? ` → ${f.interaction}` : ''} (${f.state})`
    if (f.note) {
      lines.push(`- **${name}**: ${f.note}`)
      continue
    }
    const p = []
    if (f.horizontalScroll) p.push(`horizontal scroll +${f.horizontalScroll}px`)
    if (f.overflowing.length)
      p.push(
        `off-screen: ${f.overflowing
          .slice(0, 3)
          .map((o) => `${o.el} (→${o.right})`)
          .join('; ')}`,
      )
    for (const t of f.tables) p.push(`table ${t.width}px/${t.columns} cols ${t.state}`)
    if (f.tapTargets.under24)
      p.push(
        `${f.tapTargets.under24} tap targets <24px (e.g. ${f.tapTargets.under24Examples.slice(0, 2).join('; ')})`,
      )
    if (f.overlaps.length) p.push(`overlapping text: ${f.overlaps.slice(0, 2).join(' | ')}`)
    if (f.clipped.length) p.push(`${f.clipped.length} clipped text`)
    if (f.hoverOnly.length) p.push(`${f.hoverOnly.length} hover-only reveals`)
    for (const d of f.dialogs)
      p.push(
        `dialog ${d.el} ${d.width}×${d.height}${d.tooWide ? ' too wide' : ''}${d.tooTall ? ' too tall' : ''}`,
      )
    if (f.charts.length) p.push(`charts cut off: ${f.charts.join('; ')}`)
    if (f.consoleErrors?.length) p.push(`console errors: ${f.consoleErrors.length}`)
    lines.push(`- **${name}**: ${p.length ? p.join(' · ') : 'no automatic findings'}`)
  }
  lines.push('')
}
await writeFile(path.join(outDir, 'report.md'), lines.join('\n'))
console.log(`${findings.length} results → ${path.relative(root, outDir)}/report.md`)
