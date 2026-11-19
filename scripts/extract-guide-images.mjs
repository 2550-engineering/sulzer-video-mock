/*
 * One-off: writes the pump photos embedded in the standalone Pump Replacement Guide
 * (_reference/sulzer-guide/image-slots.state.json) to public/images/replacement-guide/.
 *
 *   simg-exist-<brand-model-slug> → existing/<brand-model-slug>.webp
 *   simg-rep-<replacement-id>     → sulzer/<replacement-id>.webp
 *
 * Other slots (the guide's hero) are skipped. Run from the repo root:
 *
 *   node scripts/extract-guide-images.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const source = '_reference/sulzer-guide/image-slots.state.json'
const target = 'public/images/replacement-guide'
const folders = { 'simg-exist-': 'existing', 'simg-rep-': 'sulzer' }

const slots = JSON.parse(await readFile(source, 'utf8'))
let written = 0

for (const [key, slot] of Object.entries(slots)) {
  const prefix = Object.keys(folders).find((p) => key.startsWith(p))
  if (!prefix) continue
  const match = /^data:image\/webp;base64,(.+)$/.exec(slot?.u ?? '')
  if (!match) throw new Error(`${key}: expected a WebP data URI`)
  const folder = `${target}/${folders[prefix]}`
  await mkdir(folder, { recursive: true })
  await writeFile(`${folder}/${key.slice(prefix.length)}.webp`, Buffer.from(match[1], 'base64'))
  written++
}

console.log(`${written} images written to ${target}/`)
