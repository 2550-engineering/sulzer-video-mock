import {
  bandPath,
  boltHead,
  cylinderBody,
  hbandPath,
  hcylinderBody,
  ringPath,
  threadPath,
} from '../../lib/drawing'
import type { DrawingShape } from '../../types'

/*
 * Colours come from CSS variables set on the part's <g>: --pf (fill), --ps
 * (stroke) and --sw (stroke width), so hover and selection restyle every
 * shape of a part at once, with a transition.
 */
const body =
  'fill-(--pf) stroke-(--ps) [stroke-width:var(--sw)] [stroke-linejoin:round] transition-[fill,stroke,stroke-width] duration-150'
const line =
  'fill-none stroke-(--ps) [stroke-width:calc(var(--sw)*0.75)] [stroke-linecap:round] transition-[stroke] duration-150'

/** The outlines of one part of the exploded drawing. */
export function DrawingShapes({ shapes }: { shapes: DrawingShape[] }) {
  return shapes.map((shape, i) => {
    switch (shape.kind) {
      case 'cylinder':
        return (
          <g key={i}>
            <path d={cylinderBody(shape)} className={body} />
            <ellipse cx={shape.cx} cy={shape.y} rx={shape.w / 2} ry={shape.ry} className={body} />
          </g>
        )
      case 'hcylinder':
        return (
          <g key={i}>
            <path d={hcylinderBody(shape)} className={body} />
            <ellipse cx={shape.x} cy={shape.cy} rx={shape.rx} ry={shape.d / 2} className={body} />
          </g>
        )
      case 'hband':
        return <path key={i} d={hbandPath(shape)} className={line} />
      case 'ring':
        return <path key={i} d={ringPath(shape)} fillRule="evenodd" className={body} />
      case 'ellipse':
        return (
          <ellipse
            key={i}
            cx={shape.cx}
            cy={shape.cy}
            rx={shape.rx}
            ry={shape.ry}
            className={body}
          />
        )
      case 'rect':
        return (
          <rect key={i} x={shape.x} y={shape.y} width={shape.w} height={shape.h} className={body} />
        )
      case 'band':
        return <path key={i} d={bandPath(shape)} className={line} />
      case 'path':
        return <path key={i} d={shape.d} className={shape.open ? line : body} />
      case 'tube':
        return (
          <g key={i}>
            <path
              d={shape.d}
              fill="none"
              strokeWidth={shape.w}
              strokeLinecap="round"
              className="stroke-(--ps) transition-[stroke] duration-150"
            />
            <path
              d={shape.d}
              fill="none"
              strokeWidth={Math.max(1, shape.w - 2.5)}
              strokeLinecap="round"
              className="stroke-(--pf) transition-[stroke] duration-150"
            />
          </g>
        )
      case 'bolt': {
        const head = boltHead(shape.d)
        const half = shape.d * 0.85
        return (
          <g key={i}>
            <rect
              x={shape.cx - shape.d / 2}
              y={shape.y + head}
              width={shape.d}
              height={shape.length}
              className={body}
            />
            <path d={threadPath(shape)} className={line} />
            <rect x={shape.cx - half} y={shape.y} width={half * 2} height={head} className={body} />
            <path
              d={`M ${shape.cx - half / 3} ${shape.y} L ${shape.cx - half / 3} ${shape.y + head} M ${shape.cx + half / 3} ${shape.y} L ${shape.cx + half / 3} ${shape.y + head}`}
              className={line}
            />
          </g>
        )
      }
    }
  })
}
