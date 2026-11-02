import { downloadText } from './bom'

/* Saving an on-screen SVG chart as a file that looks the same outside the page. */

const styled = [
  'fill',
  'stroke',
  'stroke-width',
  'stroke-dasharray',
  'stroke-opacity',
  'fill-opacity',
  'opacity',
  'font-size',
  'font-weight',
  'font-family',
] as const

/**
 * The SVG as a standalone file: every element's computed paint and font
 * copied onto it (the page's CSS classes and variables don't travel), then
 * downloaded.
 */
export function downloadSvg(svg: SVGSVGElement, fileName: string) {
  const copy = svg.cloneNode(true) as SVGSVGElement
  const source = [svg, ...svg.querySelectorAll('*')]
  const target = [copy, ...copy.querySelectorAll('*')]
  source.forEach((element, i) => {
    const computed = getComputedStyle(element)
    const out = target[i] as SVGElement
    for (const property of styled)
      out.style.setProperty(property, computed.getPropertyValue(property))
    out.removeAttribute('class')
  })
  copy.setAttribute('width', String(svg.viewBox.baseVal.width))
  copy.setAttribute('height', String(svg.viewBox.baseVal.height))
  downloadText(fileName, new XMLSerializer().serializeToString(copy), 'image/svg+xml;charset=utf-8')
}
