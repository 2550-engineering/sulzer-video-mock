/*
 * Desktop compare: takes the same screenshots as desktop-baseline.mjs into
 * _qa/desktop-current/ and compares each pixel by pixel (pixelmatch) with
 * _qa/desktop-baseline/. Every page that differs gets a diff image in
 * _qa/desktop-diff/ and is listed; the exit code is 1 when anything differs.
 *
 *   npm run qa:desktop-compare
 *   QA_ONLY=product npm run qa:desktop-compare
 */
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { captureDesktop } from './lib/desktop-capture.mjs'
import { root, writeJson } from './lib/qa.mjs'

const baselineDir = path.join(root, '_qa/desktop-baseline')
const currentDir = path.join(root, '_qa/desktop-current')
const diffDir = path.join(root, '_qa/desktop-diff')

if (!existsSync(path.join(baselineDir, 'manifest.json'))) {
  console.error('No baseline found. Run `npm run qa:desktop` first.')
  process.exit(2)
}

const baseline = JSON.parse(readFileSync(path.join(baselineDir, 'manifest.json'), 'utf8'))
const current = await captureDesktop(currentDir)
await rm(diffDir, { recursive: true, force: true })

const changed = []
const missing = []
const currentFiles = new Set(current.shots.map((s) => s.file))

for (const shot of current.shots) {
  const before = path.join(baselineDir, shot.file)
  if (!existsSync(before)) {
    changed.push({ ...shot, reason: 'new page (not in baseline)' })
    continue
  }
  const a = PNG.sync.read(readFileSync(before))
  const b = PNG.sync.read(readFileSync(path.join(currentDir, shot.file)))
  // Full-page shots can change height: compare on the larger canvas.
  const width = Math.max(a.width, b.width)
  const height = Math.max(a.height, b.height)
  const pad = (img) => {
    if (img.width === width && img.height === height) return img
    const out = new PNG({ width, height })
    out.data.fill(255)
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0)
    return out
  }
  const diff = new PNG({ width, height })
  const pixels = pixelmatch(pad(a).data, pad(b).data, diff.data, width, height, {
    threshold: 0.1,
  })
  const sizeChanged = a.width !== b.width || a.height !== b.height
  if (pixels > 0 || sizeChanged) {
    const out = path.join(diffDir, shot.file)
    await mkdir(path.dirname(out), { recursive: true })
    await writeFile(out, PNG.sync.write(diff))
    changed.push({
      ...shot,
      pixels,
      percent: +((pixels / (width * height)) * 100).toFixed(3),
      size: sizeChanged ? `${a.width}×${a.height} → ${b.width}×${b.height}` : undefined,
      diff: path.relative(root, out),
    })
  }
}
for (const shot of baseline.shots) {
  // With QA_ONLY only part of the routes is taken; don't report the rest as missing.
  if (process.env.QA_ONLY) continue
  if (!currentFiles.has(shot.file)) missing.push(shot)
}

await writeJson(path.join(diffDir, 'report.json'), { changed, missing })

if (!changed.length && !missing.length) {
  console.log(`\n✔ All ${current.shots.length} desktop screenshots match the baseline.`)
} else {
  console.log(`\n✘ ${changed.length} page(s) differ, ${missing.length} missing:`)
  for (const c of changed)
    console.log(
      `  ${c.viewport} ${c.state.padEnd(14)} ${c.route.padEnd(36)} ${
        c.reason ?? `${c.pixels} px (${c.percent} %)${c.size ? ` size ${c.size}` : ''}`
      }${c.diff ? `  → ${c.diff}` : ''}`,
    )
  for (const m of missing)
    console.log(`  ${m.viewport} ${m.state.padEnd(14)} ${m.route.padEnd(36)} missing now`)
  process.exitCode = 1
}
