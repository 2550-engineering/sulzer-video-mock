import { Maximize, Minimize, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { sparePartsTab } from '../../data/sparePartsPage'
import { hotspotBounds, union } from '../../lib/drawing'
import type { ExplodedDrawing as Drawing } from '../../types'
import { IconButton } from '../IconButton'
import { DrawingPart, type PartState } from './DrawingPart'

const copy = sparePartsTab.drawing

type ExplodedDrawingProps = {
  drawing: Drawing
  /** Position number and name per hotspot id. */
  labels: Map<string, { position: string; name: string }>
  /** Hotspot ids of the selected part (or every part of a selected kit). */
  selected: string[]
  onSelect: (hotspotId: string) => void
}

/** Centre and zoom of the view; zoom 1 shows the whole drawing. */
type View = { cx: number; cy: number; k: number }

const minZoom = 1
const maxZoom = 6
const zoomStep = 1.5
const animationMs = 200
/** Pointer travel before a press becomes a drag (and no longer a click). */
const dragThreshold = 4

const ease = (t: number) => 1 - (1 - t) ** 3

/**
 * The interactive exploded drawing: hover highlights a part and names it in a
 * tooltip, click (or Enter) selects it. Zoom with the buttons or the mouse
 * wheel, drag to pan, full screen for the recording. A selection outside the
 * view is panned into view.
 */
export function ExplodedDrawing({ drawing, labels, selected, onSelect }: ExplodedDrawingProps) {
  const { width: W, height: H } = drawing
  const frameRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const viewRef = useRef<View>({ cx: W / 2, cy: H / 2, k: 1 })
  const animation = useRef(0)
  const drag = useRef<{
    x: number
    y: number
    from: View
    scale: number
    moved: boolean
    pointer: number
  } | null>(null)
  const suppressClick = useRef(false)

  const [view, setView] = useState<View>(() => ({ cx: W / 2, cy: H / 2, k: 1 }))
  const [hover, setHover] = useState<{ id: string; left: number; top: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  /** Keeps the view inside the drawing and the zoom within limits. */
  const show = useCallback(
    (next: View) => {
      const k = Math.min(maxZoom, Math.max(minZoom, next.k))
      const halfW = W / k / 2
      const halfH = H / k / 2
      const clamped = {
        k,
        cx: Math.min(W - halfW, Math.max(halfW, next.cx)),
        cy: Math.min(H - halfH, Math.max(halfH, next.cy)),
      }
      viewRef.current = clamped
      setView(clamped)
    },
    [W, H],
  )

  const animateTo = useCallback(
    (target: View) => {
      cancelAnimationFrame(animation.current)
      const from = viewRef.current
      const start = performance.now()
      const step = (now: number) => {
        const t = ease(Math.min(1, (now - start) / animationMs))
        show({
          cx: from.cx + (target.cx - from.cx) * t,
          cy: from.cy + (target.cy - from.cy) * t,
          k: from.k + (target.k - from.k) * t,
        })
        if (t < 1) animation.current = requestAnimationFrame(step)
      }
      animation.current = requestAnimationFrame(step)
    },
    [show],
  )

  useEffect(() => () => cancelAnimationFrame(animation.current), [])

  // Wheel zoom around the pointer. A native listener, because React's is passive.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    function handleWheel(event: WheelEvent) {
      const ctm = svgRef.current?.getScreenCTM()
      if (!ctm) return
      event.preventDefault()
      cancelAnimationFrame(animation.current)
      const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse())
      const current = viewRef.current
      const k = Math.min(maxZoom, Math.max(minZoom, current.k * Math.exp(-event.deltaY * 0.0015)))
      show({
        k,
        cx: p.x + ((current.cx - p.x) * current.k) / k,
        cy: p.y + ((current.cy - p.y) * current.k) / k,
      })
      setHover(null)
    }
    svg.addEventListener('wheel', handleWheel, { passive: false })
    return () => svg.removeEventListener('wheel', handleWheel)
  }, [show])

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === frameRef.current)
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [])

  // Bring a new selection into view when it is (partly) outside it.
  const selectedKey = selected.join(',')
  useEffect(() => {
    if (!selectedKey) return
    const ids = selectedKey.split(',')
    const hotspots = drawing.hotspots.filter((h) => ids.includes(h.id))
    if (hotspots.length === 0) return
    const b = union(hotspots.map(hotspotBounds))
    const v = viewRef.current
    const vw = W / v.k
    const vh = H / v.k
    const margin = 24
    const inside =
      b.x - margin >= v.cx - vw / 2 &&
      b.x + b.w + margin <= v.cx + vw / 2 &&
      b.y - margin >= v.cy - vh / 2 &&
      b.y + b.h + margin <= v.cy + vh / 2
    if (inside) return
    const fit = Math.min(v.k, W / (b.w + 4 * margin), H / (b.h + 4 * margin))
    animateTo({ cx: b.x + b.w / 2, cy: b.y + b.h / 2, k: Math.max(minZoom, fit) })
  }, [selectedKey, drawing, W, H, animateTo])

  function placeTooltip(target: SVGGElement | null, id: string) {
    const frame = frameRef.current
    const ctm = svgRef.current?.getScreenCTM()
    const hotspot = drawing.hotspots.find((h) => h.id === id)
    if (!target || !frame || !ctm || !hotspot || drag.current?.moved) {
      setHover(null)
      return
    }
    const b = hotspotBounds(hotspot)
    const rect = frame.getBoundingClientRect()
    const left = ctm.a * (b.x + b.w / 2) + ctm.e - rect.left
    const top = ctm.d * b.y + ctm.f - rect.top
    setHover({
      id,
      left: Math.min(rect.width - 16, Math.max(16, left)),
      top: Math.max(44, top),
    })
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return
    suppressClick.current = false
    cancelAnimationFrame(animation.current)
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      from: viewRef.current,
      scale: svgRef.current?.getScreenCTM()?.a ?? 1,
      moved: false,
      pointer: event.pointerId,
    }
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    const d = drag.current
    if (!d) return
    const dx = event.clientX - d.x
    const dy = event.clientY - d.y
    if (!d.moved) {
      if (Math.hypot(dx, dy) < dragThreshold) return
      d.moved = true
      event.currentTarget.setPointerCapture(d.pointer)
      setDragging(true)
      setHover(null)
    }
    show({ k: d.from.k, cx: d.from.cx - dx / d.scale, cy: d.from.cy - dy / d.scale })
  }

  function handlePointerUp() {
    if (drag.current?.moved) suppressClick.current = true
    drag.current = null
    setDragging(false)
  }

  function toggleFullscreen() {
    const frame = frameRef.current
    if (!frame) return
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else frame.requestFullscreen?.().catch(() => {})
  }

  /** Title block in the bottom-left corner. */
  const titleTop = H - 58
  const vw = W / view.k
  const vh = H / view.k
  const anySelected = selected.length > 0
  const hovered = hover && labels.get(hover.id)

  return (
    <div
      ref={frameRef}
      // Keeps the drawing's proportions, so a wide drawing gets no empty band; tall ones are capped.
      style={fullscreen ? undefined : { aspectRatio: `${W} / ${H}` }}
      className={`relative overflow-hidden border border-border bg-white ${
        fullscreen ? 'h-screen w-screen rounded-none' : 'max-h-[min(66vh,660px)] w-full rounded-lg'
      }`}
    >
      <svg
        ref={svgRef}
        viewBox={`${view.cx - vw / 2} ${view.cy - vh / 2} ${vw} ${vh}`}
        role="group"
        aria-label={copy.label(drawing.number)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`size-full touch-none select-none ${
          dragging ? 'cursor-grabbing' : view.k > 1 ? 'cursor-grab' : ''
        }`}
      >
        {drawing.axes.map((axis, i) => (
          <line
            key={i}
            x1={axis.x1}
            x2={axis.x2}
            y1={axis.y1}
            y2={axis.y2}
            stroke="var(--sz-color-text-subtle)"
            strokeWidth={0.8}
            strokeDasharray="22 5 3 5"
          />
        ))}

        {drawing.hotspots.map((hotspot) => {
          const label = labels.get(hotspot.id)
          if (!label) return null
          const state: PartState = selected.includes(hotspot.id)
            ? 'selected'
            : hover?.id === hotspot.id
              ? 'hover'
              : anySelected
                ? 'dimmed'
                : 'idle'
          return (
            <DrawingPart
              key={hotspot.id}
              hotspot={hotspot}
              position={label.position}
              radius={drawing.calloutRadius ?? 14}
              label={sparePartsTab.showPart(label.position, label.name)}
              state={state}
              onSelect={() => {
                if (suppressClick.current) return
                onSelect(hotspot.id)
              }}
              onHover={(target) => placeTooltip(target, hotspot.id)}
            />
          )
        })}

        {/* Title block, as on a real drawing. */}
        <g pointerEvents="none" fontSize={11} fill="var(--sz-color-text)">
          <rect
            x={30}
            y={titleTop}
            width={300}
            height={42}
            fill="white"
            stroke="var(--sz-color-text)"
            strokeWidth={0.9}
          />
          <line
            x1={30}
            x2={330}
            y1={titleTop + 21}
            y2={titleTop + 21}
            stroke="var(--sz-color-text)"
            strokeWidth={0.6}
          />
          <text x={40} y={titleTop + 14} fontWeight={700}>
            {drawing.number}
          </text>
          <text x={40} y={titleTop + 35}>
            {drawing.title}
          </text>
        </g>
      </svg>

      {hovered && hover && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] animate-fade-in rounded-sm bg-navy-900 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-card"
          style={{ left: hover.left, top: hover.top }}
        >
          <span className="mr-1.5 text-accent-cyan tabular-nums">{hovered.position}</span>
          {hovered.name}
        </div>
      )}

      <p className="pointer-events-none absolute top-3 left-4 text-xs text-text-subtle">
        {copy.hint}
      </p>

      <div className="absolute right-3 bottom-3 flex items-center gap-0.5 rounded-md border border-border bg-white/95 p-1 shadow-card backdrop-blur-sm">
        <IconButton
          icon={ZoomIn}
          label={copy.zoomIn}
          onClick={() => animateTo({ ...viewRef.current, k: viewRef.current.k * zoomStep })}
          disabled={view.k >= maxZoom}
        />
        <IconButton
          icon={ZoomOut}
          label={copy.zoomOut}
          onClick={() => animateTo({ ...viewRef.current, k: viewRef.current.k / zoomStep })}
          disabled={view.k <= minZoom}
        />
        <span className="w-12 text-center text-xs font-semibold text-text-muted tabular-nums">
          {Math.round(view.k * 100)} %
        </span>
        <IconButton
          icon={RotateCcw}
          label={copy.reset}
          onClick={() => animateTo({ cx: W / 2, cy: H / 2, k: 1 })}
        />
        <IconButton
          icon={fullscreen ? Minimize : Maximize}
          label={fullscreen ? copy.exitFullscreen : copy.fullscreen}
          onClick={toggleFullscreen}
        />
      </div>
    </div>
  )
}
