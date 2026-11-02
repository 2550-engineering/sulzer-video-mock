import { useId } from 'react'

/** Lamination lines across a stator or rotor block. */
function Laminations({ x, y, width, height }: Record<'x' | 'y' | 'width' | 'height', number>) {
  return (
    <g className="stroke-white/25" strokeWidth={1}>
      {Array.from({ length: Math.floor(height / 9) }, (_, i) => (
        <line key={i} x1={x + 3} x2={x + width - 3} y1={y + 6 + i * 9} y2={y + 6 + i * 9} />
      ))}
    </g>
  )
}

/** A bearing either side of the shaft: outer ring, balls, inner ring. */
function Bearing({ y, size }: { y: number; size: number }) {
  return (
    <g>
      {[300 - 12 - size, 312].map((x) => (
        <g key={x}>
          <rect x={x} y={y} width={size} height={size} rx={3} className="fill-navy-700" />
          <circle cx={x + size / 2} cy={y + size / 2} r={size / 3.2} className="fill-[#c9d3dd]" />
        </g>
      ))}
    </g>
  )
}

/** Mechanical seal around the shaft: rotating and stationary faces. */
function Seal({ y }: { y: number }) {
  return (
    <g>
      {[262, 312].map((x) => (
        <g key={x}>
          <rect x={x} y={y} width={26} height={22} rx={3} className="fill-accent-yellow" />
          <rect x={x} y={y + 9} width={26} height={4} className="fill-navy-900/30" />
        </g>
      ))}
    </g>
  )
}

/** O-ring in section: a small dark circle. */
const ORing = ({ x, y }: { x: number; y: number }) => (
  <circle cx={x} cy={y} r={5} className="fill-navy-900" />
)

/**
 * Simplified section of an XFP submersible wastewater pump, in Sulzer colours: cut walls
 * hatched, shaft blue, seals yellow like the AHLSTAR cut-away. 600 × 760; hotspots for
 * it are in data/sectionalDrawings.ts.
 */
export function XfpSectionDrawing({ title }: { title: string }) {
  const id = useId()
  const hatch = `${id}-hatch`
  const oil = `${id}-oil`

  return (
    <svg viewBox="0 0 600 760" role="img" aria-label={title} className="absolute inset-0 size-full">
      <defs>
        <pattern
          id={hatch}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="8" height="8" className="fill-[#dfe5ec]" />
          <line x1="0" y1="0" x2="0" y2="8" strokeWidth="1.5" className="stroke-[#b3bfcb]" />
        </pattern>
        <linearGradient id={oil} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf4e6" />
          <stop offset="1" stopColor="#f6e2bd" />
        </linearGradient>
      </defs>

      {/* Lifting hoop */}
      <path
        d="M252 92 V62 a48 48 0 0 1 96 0 V92"
        fill="none"
        strokeWidth={12}
        strokeLinecap="round"
        className="stroke-[#a9b6c3]"
      />

      {/* Power cable and cable entry */}
      <path
        d="M218 74 C 200 40, 150 22, 70 30"
        fill="none"
        strokeWidth={14}
        strokeLinecap="round"
        className="stroke-navy-800"
      />
      <rect x={198} y={66} width={40} height={30} rx={5} className="fill-navy-600" />

      {/* Motor housing: hatched walls around the motor cavity, with cooling ribs */}
      <rect x={168} y={88} width={264} height={336} rx={24} fill={`url(#${hatch})`} />
      <rect
        x={168}
        y={88}
        width={264}
        height={336}
        rx={24}
        fill="none"
        strokeWidth={2}
        className="stroke-[#8a97a5]"
      />
      {[150, 190, 230, 270, 310, 350].map((y) => (
        <g key={y} className="fill-[#c4ced8]">
          <rect x={156} y={y} width={12} height={22} rx={3} />
          <rect x={432} y={y} width={12} height={22} rx={3} />
        </g>
      ))}
      <rect x={188} y={108} width={224} height={296} rx={10} className="fill-surface-subtle" />

      {/* Stator, both sides, with winding heads */}
      {[196, 350].map((x) => (
        <g key={x}>
          <rect x={x} y={168} width={54} height={164} rx={4} className="fill-navy-600" />
          <Laminations x={x} y={168} width={54} height={164} />
          <rect x={x + 6} y={152} width={42} height={18} rx={9} className="fill-primary/70" />
          <rect x={x + 6} y={330} width={42} height={18} rx={9} className="fill-primary/70" />
        </g>
      ))}

      {/* Rotor */}
      <rect x={262} y={172} width={76} height={156} rx={4} className="fill-[#8a97a5]" />
      <Laminations x={262} y={172} width={76} height={156} />

      {/* Bearing brackets */}
      <rect x={188} y={156} width={74} height={6} className="fill-[#c4ced8]" />
      <rect x={338} y={156} width={74} height={6} className="fill-[#c4ced8]" />

      {/* Oil chamber: hatched walls, oil inside */}
      <rect x={196} y={404} width={208} height={124} rx={6} fill={`url(#${hatch})`} />
      <rect
        x={196}
        y={404}
        width={208}
        height={124}
        rx={6}
        fill="none"
        strokeWidth={2}
        className="stroke-[#8a97a5]"
      />
      <rect x={214} y={424} width={172} height={86} rx={4} fill={`url(#${oil})`} />

      {/* Moisture sensor */}
      <rect x={214} y={430} width={14} height={36} rx={4} className="fill-navy-700" />
      <circle cx={221} cy={468} r={5} className="fill-accent-cyan" />

      {/* Oil plug */}
      <rect x={398} y={462} width={20} height={20} rx={3} className="fill-navy-600" />

      {/* Volute: hatched casing with discharge flange on the right */}
      <path
        d="M120 576 Q120 528 168 528 H470 Q520 528 520 578 V600 H556 V560 H574 V650 H556 V620 H520 V630 Q520 664 486 664 H168 Q120 664 120 616 Z"
        fill={`url(#${hatch})`}
      />
      <path
        d="M120 576 Q120 528 168 528 H470 Q520 528 520 578 V600 H556 V560 H574 V650 H556 V620 H520 V630 Q520 664 486 664 H168 Q120 664 120 616 Z"
        fill="none"
        strokeWidth={2}
        className="stroke-[#8a97a5]"
      />
      {/* Volute channel */}
      <path
        d="M146 584 Q146 550 180 550 H462 Q500 550 500 586 V600 H560 V620 H500 V622 Q500 642 480 642 H180 Q146 642 146 610 Z"
        className="fill-primary-tint"
      />

      {/* Shaft */}
      <rect x={288} y={116} width={24} height={500} rx={4} className="fill-primary" />
      <rect x={293} y={116} width={5} height={500} className="fill-white/25" />

      {/* Bearings: upper and the larger lower pair */}
      <Bearing y={128} size={20} />
      <Bearing y={348} size={26} />

      {/* Upper and lower mechanical seals */}
      <Seal y={432} />
      <Seal y={494} />

      {/* Impeller: shrouds and vanes */}
      <g>
        <rect x={204} y={566} width={192} height={10} rx={4} className="fill-[#6f7d8c]" />
        <rect x={204} y={622} width={80} height={10} rx={4} className="fill-[#6f7d8c]" />
        <rect x={316} y={622} width={80} height={10} rx={4} className="fill-[#6f7d8c]" />
        {[214, 244, 334, 364].map((x) => (
          <rect key={x} x={x} y={576} width={18} height={46} rx={3} className="fill-[#8a97a5]" />
        ))}
      </g>

      {/* Impeller screw */}
      <path d="M288 612 h24 l4 8 l-4 8 h-24 l-4 -8 Z" className="fill-navy-800" />

      {/* Volute gasket and bottom plate with the inlet in the middle */}
      <rect x={150} y={664} width={104} height={4} className="fill-navy-900" />
      <rect x={346} y={664} width={104} height={4} className="fill-navy-900" />
      <rect x={150} y={668} width={104} height={20} rx={3} className="fill-[#a9b6c3]" />
      <rect x={346} y={668} width={104} height={20} rx={3} className="fill-[#a9b6c3]" />
      {[164, 184, 204, 224, 360, 380, 400, 420].map((x) => (
        <rect key={x} x={x} y={668} width={8} height={5} className="fill-[#6f7d8c]" />
      ))}

      {/* O-rings at the housing joints */}
      <ORing x={196} y={528} />
      <ORing x={404} y={528} />
      <ORing x={196} y={404} />
      <ORing x={404} y={404} />

      {/* Flow: in at the bottom, out of the discharge */}
      <g className="fill-primary/35">
        <path d="M300 700 l-14 22 h9 v26 h10 v-26 h9 Z" />
        <path d="M592 605 l-16 -12 v7 h-10 v10 h10 v7 Z" />
      </g>
    </svg>
  )
}
