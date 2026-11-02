import type { DrawingHotspot, DrawingShape } from '../types'

/* Geometry for the exploded drawing: outlines of the primitives and their bounds. */

export type Bounds = { x: number; y: number; w: number; h: number }

/** Every x, y pair in a path of absolute M, L, C and Z commands. */
function pathPoints(d: string) {
  const numbers = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)
  const points: [number, number][] = []
  for (let i = 0; i + 1 < numbers.length; i += 2) points.push([numbers[i], numbers[i + 1]])
  return points
}

const fromPoints = (points: [number, number][], pad = 0): Bounds => {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const x = Math.min(...xs) - pad
  const y = Math.min(...ys) - pad
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y }
}

/** Height of a bolt's hexagon head. */
export const boltHead = (d: number) => d * 0.7

export function shapeBounds(shape: DrawingShape): Bounds {
  switch (shape.kind) {
    case 'cylinder':
      return {
        x: shape.cx - shape.w / 2,
        y: shape.y - shape.ry,
        w: shape.w,
        h: shape.h + 2 * shape.ry,
      }
    case 'ring':
    case 'ellipse':
      return { x: shape.cx - shape.rx, y: shape.cy - shape.ry, w: 2 * shape.rx, h: 2 * shape.ry }
    case 'rect':
      return { x: shape.x, y: shape.y, w: shape.w, h: shape.h }
    case 'bolt':
      return {
        x: shape.cx - shape.d * 0.85,
        y: shape.y,
        w: shape.d * 1.7,
        h: boltHead(shape.d) + shape.length,
      }
    case 'hcylinder':
      return {
        x: shape.x - shape.rx,
        y: shape.cy - shape.d / 2,
        w: shape.l + 2 * shape.rx,
        h: shape.d,
      }
    case 'band':
      return { x: shape.cx - shape.w / 2, y: shape.y, w: shape.w, h: shape.ry }
    case 'hband':
      return { x: shape.x - shape.rx, y: shape.cy - shape.d / 2, w: shape.rx, h: shape.d }
    case 'tube':
      return fromPoints(pathPoints(shape.d), shape.w / 2)
    case 'path':
      return fromPoints(pathPoints(shape.d))
  }
}

export function union(bounds: Bounds[]): Bounds {
  return fromPoints(bounds.flatMap((b) => [[b.x, b.y] as [number, number], [b.x + b.w, b.y + b.h]]))
}

/** The part's outline bounds (not its callout). */
export const hotspotBounds = (hotspot: DrawingHotspot) => union(hotspot.shapes.map(shapeBounds))

/** Body of a cylinder: left side, bottom front arc, right side, back along the top ellipse. */
export function cylinderBody({ cx, y, w, h, ry }: Extract<DrawingShape, { kind: 'cylinder' }>) {
  const l = cx - w / 2
  const r = cx + w / 2
  const rx = w / 2
  return `M ${l} ${y} L ${l} ${y + h} A ${rx} ${ry} 0 0 0 ${r} ${y + h} L ${r} ${y} A ${rx} ${ry} 0 0 1 ${l} ${y} Z`
}

/** Body of a horizontal cylinder: top side, right end arc, bottom side, back along the left ellipse. */
export function hcylinderBody({ x, cy, l, d, rx }: Extract<DrawingShape, { kind: 'hcylinder' }>) {
  const top = cy - d / 2
  const bottom = cy + d / 2
  const ry = d / 2
  return `M ${x} ${top} L ${x + l} ${top} A ${rx} ${ry} 0 0 1 ${x + l} ${bottom} L ${x} ${bottom} A ${rx} ${ry} 0 0 0 ${x} ${top} Z`
}

const ellipsePath = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`

/** An O-ring as one shape with a hole (fill-rule evenodd). */
export function ringPath({ cx, cy, rx, ry, t }: Extract<DrawingShape, { kind: 'ring' }>) {
  const inner = { rx: rx - t, ry: Math.max(ry * 0.4, ry - t * 0.6) }
  return `${ellipsePath(cx, cy, rx, ry)} ${ellipsePath(cx, cy, inner.rx, inner.ry)}`
}

/** The front half of an ellipse: a flange edge or band around a cylinder. */
export const bandPath = ({ cx, y, w, ry }: Extract<DrawingShape, { kind: 'band' }>) =>
  `M ${cx - w / 2} ${y} A ${w / 2} ${ry} 0 0 0 ${cx + w / 2} ${y}`

/** The near half of an ellipse around a horizontal cylinder. */
export const hbandPath = ({ x, cy, d, rx }: Extract<DrawingShape, { kind: 'hband' }>) =>
  `M ${x} ${cy - d / 2} A ${rx} ${d / 2} 0 0 0 ${x} ${cy + d / 2}`

/** Thread lines on the lower 60 % of a bolt's shank. */
export function threadPath({ cx, y, length, d }: Extract<DrawingShape, { kind: 'bolt' }>) {
  const top = y + boltHead(d) + length * 0.4
  const bottom = y + boltHead(d) + length
  const segments: string[] = []
  for (let at = top; at < bottom - 1; at += d * 0.38) {
    segments.push(`M ${cx - d / 2} ${at} L ${cx + d / 2} ${at + d * 0.2}`)
  }
  return segments.join(' ')
}
