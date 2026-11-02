import type { DrawingHotspot, DrawingShape } from '../../types'
import type { ExplodedDrawing } from '../../types'

/*
 * Exploded view of the AHLSTAR end-suction pump, drawn for this mock-up (not
 * a Sulzer drawing). Back pull-out design, exploded horizontally along the
 * shaft axis and seen slightly from the suction side: volute casing on the
 * left, then impeller, casing cover, shaft seal, the bearing unit with the
 * shaft, coupling and motor on the right, the base plate underneath. Screws,
 * nuts and plugs sit beside the part they fix. Parts nearer the viewer (to the
 * left) are drawn after the ones behind them.
 * Units: a 1900 × 820 drawing; the shaft axis is at y = 380. Hotspot ids match
 * `hotspot` in spareParts/ahlstar.ts.
 */

const axis = 380

const hcyl = (x: number, l: number, d: number, rx: number, cy = axis): DrawingShape => ({
  kind: 'hcylinder',
  x,
  cy,
  l,
  d,
  rx,
})
const hband = (x: number, d: number, rx: number): DrawingShape => ({
  kind: 'hband',
  x,
  cy: axis,
  d,
  rx,
})
const ring = (cx: number, rx: number, ry: number, t: number): DrawingShape => ({
  kind: 'ring',
  cx,
  cy: axis,
  rx,
  ry,
  t,
})
const cyl = (cx: number, y: number, w: number, h: number, ry: number): DrawingShape => ({
  kind: 'cylinder',
  cx,
  y,
  w,
  h,
  ry,
})
const bolt = (cx: number, y: number, length: number, d: number): DrawingShape => ({
  kind: 'bolt',
  cx,
  y,
  length,
  d,
})
const rect = (x: number, y: number, w: number, h: number): DrawingShape => ({
  kind: 'rect',
  x,
  y,
  w,
  h,
})
const lines = (d: string): DrawingShape => ({ kind: 'path', d, open: true })

/** Position circles sit in a row above and a row below the pump. */
const top = 60
const bottom = 740

const hotspots: DrawingHotspot[] = [
  // ── Behind everything ─────────────────────────────────────────────────────
  {
    id: 'base-plate',
    shapes: [
      { kind: 'path', d: 'M 1000 640 L 1860 640 L 1880 620 L 1020 620 Z' },
      { kind: 'path', d: 'M 1000 640 L 1860 640 L 1860 664 L 1000 664 Z' },
      lines('M 1880 620 L 1880 644 L 1860 664'),
    ],
    callout: { from: [1868, 652], to: [1850, bottom] },
  },
  {
    id: 'shaft',
    shapes: [hcyl(1000, 540, 34, 5), lines('M 1515 366 L 1535 366 L 1535 372 L 1515 372')],
    callout: { from: [1530, 364], to: [1330, top] },
  },

  // ── Drive ─────────────────────────────────────────────────────────────────
  {
    id: 'motor',
    shapes: [
      hcyl(1665, 26, 34, 5),
      rect(1710, 505, 120, 14),
      rect(1740, 228, 60, 30),
      hcyl(1690, 150, 250, 32),
      hband(1725, 250, 32),
      hband(1755, 250, 32),
      hband(1785, 250, 32),
      hband(1815, 250, 32),
    ],
    callout: { from: [1830, 262], to: [1800, top] },
  },
  {
    id: 'coupling-guard',
    shapes: [
      { kind: 'path', d: 'M 1540 250 L 1660 250 L 1660 300 L 1540 300 Z' },
      lines(
        'M 1560 262 L 1560 288 M 1580 262 L 1580 288 M 1600 262 L 1600 288 M 1620 262 L 1620 288 M 1640 262 L 1640 288',
      ),
    ],
    callout: { from: [1600, 250], to: [1560, top] },
  },
  {
    id: 'coupling',
    shapes: [hcyl(1606, 40, 130, 17), hcyl(1560, 40, 130, 17)],
    callout: { from: [1600, 445], to: [1560, bottom] },
  },

  // ── Bearing unit (outboard side first: it is behind) ──────────────────────
  {
    id: 'oil-seal-outboard',
    shapes: [ring(1490, 5, 22, 4)],
    callout: { from: [1490, 402], to: [1460, bottom] },
  },
  {
    id: 'bearing-cover-outboard',
    shapes: [hcyl(1440, 14, 160, 21)],
    callout: { from: [1447, 460], to: [1380, bottom] },
  },
  {
    id: 'bearing-outboard',
    shapes: [hcyl(1378, 28, 104, 14), { kind: 'ellipse', cx: 1378, cy: axis, rx: 5, ry: 20 }],
    callout: { from: [1392, 432], to: [1290, bottom] },
  },
  {
    id: 'bearing-housing',
    shapes: [hcyl(1128, 210, 220, 28), hband(1160, 220, 28), hband(1310, 220, 28)],
    callout: { from: [1200, 272], to: [1060, top] },
  },
  {
    id: 'support-foot',
    shapes: [
      { kind: 'path', d: 'M 1180 490 L 1300 490 L 1320 560 L 1160 560 Z' },
      rect(1150, 560, 180, 14),
    ],
    callout: { from: [1240, 574], to: [1080, bottom] },
  },
  {
    id: 'oil-level',
    shapes: [cyl(1235, 244, 24, 28, 5), { kind: 'ellipse', cx: 1235, cy: 260, rx: 6, ry: 8 }],
    callout: { from: [1235, 240], to: [1150, top] },
  },
  {
    id: 'bearing-inboard',
    shapes: [hcyl(1078, 30, 116, 15), { kind: 'ellipse', cx: 1078, cy: axis, rx: 5, ry: 20 }],
    callout: { from: [1100, 322], to: [980, top] },
  },
  {
    id: 'bearing-cover-inboard',
    shapes: [hcyl(1040, 14, 170, 22)],
    callout: { from: [1046, 295], to: [880, top] },
  },
  {
    id: 'oil-seal-inboard',
    shapes: [ring(1030, 5, 24, 4)],
    callout: { from: [1030, 404], to: [920, bottom] },
  },

  // ── Shaft seal ────────────────────────────────────────────────────────────
  {
    id: 'shaft-sleeve',
    shapes: [hcyl(912, 64, 46, 7)],
    callout: { from: [930, 357], to: [800, top] },
  },
  {
    id: 'seal-cover',
    shapes: [hcyl(856, 22, 150, 20), { kind: 'ellipse', cx: 856, cy: axis, rx: 8, ry: 30 }],
    callout: { from: [867, 455], to: [840, bottom] },
  },
  {
    id: 'o-ring-seal-cover',
    shapes: [ring(836, 6, 62, 3)],
    callout: { from: [836, 318], to: [720, top] },
  },
  {
    id: 'mechanical-seal',
    shapes: [
      hcyl(752, 54, 96, 13),
      lines('M 764 340 L 770 420 L 776 340 L 782 420 L 788 340 L 794 420 L 800 340 L 806 420'),
    ],
    callout: { from: [780, 428], to: [760, bottom] },
  },
  {
    id: 'o-ring-sleeve',
    shapes: [ring(735, 5, 26, 3)],
    callout: { from: [735, 354], to: [640, top] },
  },
  {
    id: 'throttle-bushing',
    shapes: [hcyl(700, 16, 76, 10)],
    callout: { from: [708, 418], to: [680, bottom] },
  },

  // ── Casing cover and impeller ─────────────────────────────────────────────
  {
    id: 'casing-cover',
    shapes: [hcyl(616, 44, 160, 20), hcyl(580, 36, 340, 44)],
    callout: { from: [600, 212], to: [560, top] },
  },
  {
    id: 'casing-gasket',
    shapes: [ring(525, 12, 160, 5)],
    callout: { from: [525, 220], to: [490, top] },
  },
  {
    id: 'screws',
    shapes: [bolt(560, 575, 36, 14), bolt(586, 575, 36, 14)],
    callout: { from: [573, 611], to: [520, bottom] },
  },
  {
    id: 'nuts',
    shapes: [
      rect(612, 600, 18, 12),
      rect(636, 600, 18, 12),
      lines('M 618 600 L 618 612 M 624 600 L 624 612 M 642 600 L 642 612 M 648 600 L 648 612'),
    ],
    callout: { from: [630, 612], to: [600, bottom] },
  },
  {
    id: 'wear-ring-back',
    shapes: [ring(500, 8, 64, 5)],
    callout: { from: [500, 444], to: [420, bottom] },
  },
  {
    id: 'impeller',
    shapes: [
      hcyl(436, 36, 92, 12),
      hcyl(372, 64, 250, 34),
      lines('M 362 300 C 348 330, 348 365, 358 380 M 382 460 C 396 430, 396 395, 386 380'),
      { kind: 'ellipse', cx: 372, cy: axis, rx: 12, ry: 50 },
    ],
    callout: { from: [425, 258], to: [425, top] },
  },
  {
    id: 'impeller-nut',
    shapes: [hcyl(342, 16, 48, 7), lines('M 342 364 L 358 364 M 342 396 L 358 396')],
    callout: { from: [345, 404], to: [250, bottom] },
  },
  {
    id: 'wear-ring-front',
    shapes: [ring(322, 8, 64, 5)],
    callout: { from: [322, 316], to: [360, top] },
  },

  // ── Volute casing (nearest the viewer) ────────────────────────────────────
  {
    id: 'volute-casing',
    shapes: [
      cyl(205, 150, 96, 110, 16),
      cyl(205, 136, 150, 14, 22),
      hcyl(134, 118, 330, 42),
      hband(200, 330, 42),
      hcyl(58, 76, 126, 16),
      hcyl(40, 18, 190, 24),
      rect(140, 558, 120, 16),
      lines('M 165 545 L 165 558 M 235 545 L 235 558'),
    ],
    callout: { from: [150, 240], to: [130, top] },
  },
  {
    id: 'vent-plug',
    shapes: [bolt(270, 180, 16, 12)],
    callout: { from: [278, 186], to: [300, top] },
  },
  {
    id: 'drain-plug',
    shapes: [bolt(110, 556, 14, 12)],
    callout: { from: [110, 580], to: [100, bottom] },
  },
]

export const ahlstarDrawing: ExplodedDrawing = {
  id: 'ga-ahlstar-01',
  number: 'GA-AHLSTAR-01',
  title: 'AHLSTAR · Exploded view, back pull-out',
  width: 1900,
  height: 820,
  calloutRadius: 20,
  axes: [{ x1: 20, y1: axis, x2: 1885, y2: axis }],
  hotspots,
}
