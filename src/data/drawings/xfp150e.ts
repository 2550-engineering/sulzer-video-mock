import type { DrawingHotspot, DrawingShape, ExplodedDrawing } from '../../types'

/*
 * Exploded view of the XFP 150E, drawn for this mock-up (not a Sulzer
 * drawing). Two columns, read top to bottom: on the left the cable entry,
 * motor housing with stator, rotor, shaft and bearings; on the right the seal
 * housing, mechanical seals, cooling jacket and hydraulics. Small parts
 * (screws, washers, sensors) sit beside the part they belong to.
 * Units: a 1000 × 1000 drawing. Hotspot ids match `hotspot` in spareParts/xfp.ts.
 */

const cyl = (cx: number, y: number, w: number, h: number, ry: number): DrawingShape => ({
  kind: 'cylinder',
  cx,
  y,
  w,
  h,
  ry,
})
const ring = (cx: number, cy: number, rx: number, ry: number, t: number): DrawingShape => ({
  kind: 'ring',
  cx,
  cy,
  rx,
  ry,
  t,
})
const band = (cx: number, y: number, w: number, ry: number): DrawingShape => ({
  kind: 'band',
  cx,
  y,
  w,
  ry,
})
const bolt = (cx: number, y: number, length: number, d: number): DrawingShape => ({
  kind: 'bolt',
  cx,
  y,
  length,
  d,
})
const lines = (d: string): DrawingShape => ({ kind: 'path', d, open: true })

/** Left column: cable entry, motor and rotating parts. */
const left = 300
/** Right column: seal, cooling and hydraulics. */
const right = 720

const hotspots: DrawingHotspot[] = [
  // ── Left column ───────────────────────────────────────────────────────────
  {
    id: 'cable',
    shapes: [{ kind: 'tube', d: 'M 40 70 C 140 64, 300 34, 300 86', w: 13 }],
    callout: { from: [110, 60], to: [70, 120] },
  },
  {
    id: 'cable-gland',
    shapes: [
      cyl(left, 84, 36, 24, 7),
      lines('M 288 91 L 288 106 M 300 92 L 300 108 M 312 91 L 312 106'),
    ],
    callout: { from: [318, 98], to: [400, 80] },
  },
  {
    id: 'cable-grommet',
    shapes: [cyl(left, 121, 28, 12, 5)],
    callout: { from: [314, 128], to: [400, 120] },
  },
  {
    id: 'cable-entry-gasket',
    shapes: [ring(left, 151, 58, 11, 5)],
    callout: { from: [358, 152], to: [432, 160] },
  },
  {
    id: 'terminal-board',
    shapes: [
      cyl(left, 172, 96, 20, 14),
      { kind: 'ellipse', cx: 270, cy: 172, rx: 4, ry: 2.5 },
      { kind: 'ellipse', cx: 285, cy: 167, rx: 4, ry: 2.5 },
      { kind: 'ellipse', cx: 300, cy: 165, rx: 4, ry: 2.5 },
      { kind: 'ellipse', cx: 315, cy: 167, rx: 4, ry: 2.5 },
      { kind: 'ellipse', cx: 330, cy: 172, rx: 4, ry: 2.5 },
    ],
    callout: { from: [254, 182], to: [212, 152] },
  },
  {
    id: 'stator-housing',
    shapes: [
      cyl(left, 222, 210, 228, 30),
      band(left, 244, 210, 30),
      band(left, 424, 210, 30),
      { kind: 'rect', x: 334, y: 300, w: 44, h: 30 },
      lines('M 340 309 L 372 309 M 340 316 L 366 316 M 340 323 L 370 323'),
    ],
    callout: { from: [196, 336], to: [110, 336] },
  },
  {
    id: 'lifting-hoop',
    shapes: [
      { kind: 'tube', d: 'M 150 268 L 150 232 C 150 200, 206 200, 206 232 L 206 268', w: 9 },
    ],
    callout: { from: [146, 246], to: [100, 214] },
  },
  {
    id: 'temperature-sensor',
    shapes: [
      { kind: 'rect', x: 466, y: 232, w: 16, h: 13 },
      { kind: 'tube', d: 'M 452 300 C 452 278, 474 266, 474 245', w: 3 },
      { kind: 'tube', d: 'M 474 300 L 474 245', w: 3 },
      { kind: 'tube', d: 'M 496 300 C 496 278, 474 266, 474 245', w: 3 },
      cyl(452, 300, 10, 26, 3),
      cyl(474, 300, 10, 26, 3),
      cyl(496, 300, 10, 26, 3),
    ],
    callout: { from: [502, 312], to: [532, 286] },
  },
  {
    id: 'o-ring-stator',
    shapes: [ring(left, 486, 106, 19, 5)],
    callout: { from: [406, 488], to: [460, 474] },
  },
  {
    id: 'shaft',
    shapes: [cyl(left, 508, 22, 384, 4), lines('M 291 870 L 309 868 M 291 878 L 309 876')],
    callout: { from: [289, 872], to: [140, 872] },
  },
  {
    id: 'upper-bearing',
    shapes: [cyl(left, 528, 58, 18, 8), { kind: 'ellipse', cx: left, cy: 528, rx: 14, ry: 3 }],
    callout: { from: [329, 538], to: [430, 532] },
  },
  {
    id: 'rotor',
    shapes: [
      cyl(left, 574, 130, 116, 18),
      band(left, 604, 130, 18),
      band(left, 634, 130, 18),
      band(left, 664, 130, 18),
    ],
    callout: { from: [235, 632], to: [140, 632] },
  },
  {
    id: 'lower-bearing',
    shapes: [cyl(left, 718, 66, 24, 9), { kind: 'ellipse', cx: left, cy: 718, rx: 14, ry: 3 }],
    callout: { from: [333, 730], to: [430, 722] },
  },
  {
    id: 'retaining-ring',
    shapes: [ring(left, 762, 22, 5, 3)],
    callout: { from: [322, 762], to: [430, 768] },
  },
  {
    id: 'bearing-housing',
    shapes: [cyl(left, 786, 160, 44, 22), band(left, 800, 160, 22)],
    callout: { from: [220, 806], to: [140, 806] },
  },
  {
    id: 'impeller-key',
    shapes: [{ kind: 'rect', x: 330, y: 846, w: 10, h: 34 }],
    callout: { from: [340, 864], to: [430, 884] },
  },

  // ── Right column ──────────────────────────────────────────────────────────
  {
    id: 'seal-housing',
    shapes: [
      cyl(right, 58, 190, 70, 26),
      band(right, 78, 190, 26),
      { kind: 'ellipse', cx: right, cy: 58, rx: 20, ry: 6 },
    ],
    callout: { from: [815, 104], to: [905, 160] },
  },
  {
    id: 'moisture-sensor',
    shapes: [
      { kind: 'tube', d: 'M 885 46 C 885 26, 920 20, 960 22', w: 4 },
      { kind: 'rect', x: 875, y: 46, w: 20, h: 15 },
      lines('M 881 46 L 881 61 M 889 46 L 889 61'),
      cyl(885, 61, 12, 42, 3),
    ],
    callout: { from: [892, 96], to: [950, 112] },
  },
  {
    id: 'oil-plug',
    shapes: [bolt(575, 66, 18, 12)],
    callout: { from: [568, 80], to: [520, 64] },
  },
  {
    id: 'sealing-washer',
    shapes: [ring(575, 110, 10, 3.5, 3)],
    callout: { from: [565, 110], to: [520, 114] },
  },
  {
    id: 'seal-secondary',
    shapes: [cyl(right, 152, 70, 20, 10), cyl(right, 174, 56, 10, 8)],
    callout: { from: [755, 166], to: [905, 204] },
  },
  {
    id: 'seal-primary',
    shapes: [
      cyl(right, 208, 80, 28, 11),
      lines(
        'M 688 214 L 694 230 L 700 214 L 706 230 L 712 214 L 718 230 L 724 214 L 730 230 L 736 214 L 742 230 L 748 214',
      ),
    ],
    callout: { from: [760, 222], to: [905, 246] },
  },
  {
    id: 'o-ring-volute',
    shapes: [ring(right, 270, 98, 17, 5)],
    callout: { from: [818, 271], to: [905, 290] },
  },
  {
    id: 'cooling-jacket',
    shapes: [cyl(right, 304, 244, 168, 36), band(right, 322, 244, 36), band(right, 454, 244, 36)],
    callout: { from: [842, 392], to: [905, 392] },
  },
  {
    id: 'vent-screw',
    shapes: [bolt(575, 330, 22, 10)],
    callout: { from: [569, 350], to: [520, 346] },
  },
  {
    id: 'o-ring-cooling-jacket',
    shapes: [ring(right, 510, 120, 20, 5), ring(right, 528, 120, 20, 5)],
    callout: { from: [840, 520], to: [905, 522] },
  },
  {
    id: 'impeller',
    shapes: [
      cyl(right, 572, 176, 44, 28),
      cyl(right, 550, 56, 22, 9),
      {
        kind: 'path',
        d: 'M 650 596 C 668 610, 694 612, 712 604 L 710 594 C 694 600, 670 598, 654 588 Z',
      },
      {
        kind: 'path',
        d: 'M 790 596 C 772 610, 746 612, 728 604 L 730 594 C 746 600, 770 598, 786 588 Z',
      },
    ],
    callout: { from: [808, 596], to: [905, 584] },
  },
  {
    id: 'impeller-screw',
    shapes: [bolt(575, 552, 40, 14)],
    callout: { from: [568, 584], to: [520, 572] },
  },
  {
    id: 'wear-ring',
    shapes: [cyl(right, 648, 118, 14, 18)],
    callout: { from: [779, 658], to: [905, 648] },
  },
  {
    id: 'volute',
    shapes: [
      { kind: 'path', d: 'M 812 706 L 900 706 L 900 766 L 812 766 Z' },
      cyl(right, 690, 236, 112, 36),
      band(right, 706, 236, 36),
      { kind: 'ellipse', cx: 900, cy: 736, rx: 12, ry: 42 },
      { kind: 'ellipse', cx: 900, cy: 736, rx: 7, ry: 26 },
    ],
    callout: { from: [838, 780], to: [905, 812] },
  },
  {
    id: 'washers',
    shapes: [ring(575, 676, 11, 3.5, 3), ring(600, 676, 11, 3.5, 3)],
    callout: { from: [564, 676], to: [520, 674] },
  },
  {
    id: 'volute-screws',
    shapes: [bolt(575, 690, 46, 12), bolt(600, 690, 46, 12)],
    callout: { from: [569, 724], to: [520, 724] },
  },
  {
    id: 'suction-cover',
    shapes: [
      cyl(right, 894, 120, 50, 17),
      cyl(right, 938, 150, 12, 21),
      cyl(right, 858, 206, 36, 30),
    ],
    callout: { from: [823, 876], to: [905, 878] },
  },
  {
    id: 'suction-cover-screws',
    shapes: [bolt(575, 852, 34, 10), bolt(600, 852, 34, 10)],
    callout: { from: [569, 878], to: [520, 878] },
  },
]

export const xfp150eDrawing: ExplodedDrawing = {
  id: 'td-xfp150e-01',
  number: 'TD-XFP150E-01',
  title: 'XFP 150E · Exploded view',
  width: 1000,
  height: 1000,
  axes: [
    { x1: left, y1: 70, x2: left, y2: 905 },
    { x1: right, y1: 36, x2: right, y2: 975 },
  ],
  hotspots,
}
