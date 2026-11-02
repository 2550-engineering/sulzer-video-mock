import type { SectionalDrawing } from '../types'

/*
 * Sectional drawings per product, with a numbered hotspot per part position (data/
 * spareParts.ts). x and y are % of the drawing, measured on these exact files: move the
 * hotspots if a drawing changes. A position can have several hotspots, and parts
 * without one (couplings, kits for the whole pump) are only in the list.
 */

export const sectionalDrawings: Record<string, SectionalDrawing> = {
  ahlstar: {
    kind: 'image',
    // Cut-away from the AHLSTAR brochure (E10083), without its feature callouts.
    image: {
      src: '/images/spare-parts/drawings/ahlstar-cutaway.png',
      alt: 'Cut-away of an AHLSTAR end-suction pump: volute casing, impeller, seal chamber, shaft and bearing unit',
    },
    aspect: '845 / 929',
    hotspots: [
      { position: 102, x: 36, y: 72 },
      { position: 135, x: 13, y: 27 },
      { position: 161, x: 36.5, y: 22 },
      { position: 183, x: 80.5, y: 66 },
      { position: 210, x: 72, y: 41.5 },
      { position: 230, x: 27, y: 33 },
      { position: 321, x: 74.5, y: 35 },
      { position: 322, x: 60, y: 39.5 },
      { position: 330, x: 66, y: 55 },
      { position: 360, x: 85, y: 30.5 },
      { position: 400, x: 23.5, y: 60 },
      { position: 412, x: 55.5, y: 49 },
      { position: 421, x: 88.5, y: 45.5 },
      { position: 433, x: 44.5, y: 36.5 },
      { position: 461, x: 44.5, y: 36.5 },
      { position: 502, x: 15.5, y: 44 },
      { position: 524, x: 39, y: 49.5 },
      { position: 922, x: 22, y: 51.5 },
    ],
  },
  xfp: {
    kind: 'svg',
    svg: 'xfp',
    title:
      'Section of an XFP submersible pump: motor housing, rotor, bearings, oil chamber with two mechanical seals, volute, impeller and bottom plate',
    aspect: '600 / 760',
    hotspots: [
      { position: 571, x: 50, y: 4.5 },
      { position: 824, x: 18, y: 7 },
      { position: 826, x: 36.5, y: 11 },
      { position: 321, x: 50, y: 18.5 },
      { position: 818, x: 50, y: 33 },
      { position: 811, x: 70.5, y: 30 },
      { position: 322, x: 50, y: 47.5 },
      { position: 817, x: 36.5, y: 59.5 },
      { position: 434, x: 50, y: 58 },
      { position: 903, x: 68.5, y: 62 },
      { position: 433, x: 50, y: 66.5 },
      { position: 412, x: 31.5, y: 68.5 },
      { position: 230, x: 39, y: 79 },
      { position: 922, x: 50, y: 80.5 },
      { position: 102, x: 80, y: 77 },
      { position: 400, x: 30, y: 84.5 },
      { position: 135, x: 64, y: 86.5 },
    ],
  },
}
