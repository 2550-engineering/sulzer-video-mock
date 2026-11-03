import { couplingOptions, materialOptions, sealOptions } from '../data/hydraulics'
import { getLiquid } from '../data/liquids'
import {
  genericTenderProduct,
  tenderMaterials,
  tenderProducts,
  tenderSeals,
  tenderText as copy,
} from '../data/tenderTexts'
import type { DutyPoint, ProductModel, ProjectItem, PumpVariant, ShaftSeal } from '../types'
import { groupThousands } from './format'
import { evaluateVariant } from './sizing'

/*
 * Tender (specification) texts, generated from the model or sized variant data. One
 * structured document, rendered in the dialog and written to plain text (Copy) or
 * RTF (Download, opens in Word). Deterministic: the same item always gives the same text.
 */

export type TenderSection = { heading: string; rows?: [string, string][]; paragraphs?: string[] }

export type TenderDocument = {
  /** e.g. "AHLSTAR 150-125-315". */
  title: string
  /** e.g. "Sulzer product no. 62801083". */
  reference: string
  /** Project items: position, your position, quantity. */
  position?: string
  sections: TenderSection[]
}

const rows = (pairs: [string, string | undefined][]) =>
  pairs.filter((pair): pair is [string, string] => pair[1] !== undefined)

const n = (value: number, decimals = 0) => groupThousands(value, decimals)
const polesFor = (speed: number, hz: number) => Math.round((120 * hz) / speed / 2) * 2

function productIntro(productId: string) {
  const product = tenderProducts[productId] ?? genericTenderProduct
  return {
    general: { heading: copy.sections.general, paragraphs: [product.description] },
    standards: { heading: copy.sections.standards, paragraphs: product.standards },
  }
}

function make(name: string, productNumber: string | null): TenderSection {
  return {
    heading: copy.sections.make,
    rows: [
      [copy.rows.manufacturer, copy.manufacturer],
      [copy.rows.type, name],
      [copy.rows.productNumber, productNumber ?? '–'],
    ],
    paragraphs: [copy.orEqual],
  }
}

/** Tender text for a model on the Models tab: rated data. */
export function modelTenderText(model: ProductModel): TenderDocument {
  const intro = productIntro(model.productId)
  const materials = tenderMaterials[model.casingMaterial]
  const poles = polesFor(model.speed, model.frequency)
  return {
    title: model.name,
    reference: copy.reference(model.productNumber),
    sections: [
      intro.general,
      {
        heading: copy.sections.hydraulics,
        rows: rows([
          [copy.rows.ratedFlow, `${n(model.flow)} m³/h`],
          [copy.rows.ratedHead, `${n(model.head)} m`],
          [copy.rows.ratedEfficiency, `${model.efficiency} %`],
          [copy.rows.speed, `${n(model.speed)} rpm`],
          [copy.rows.impeller, `${model.impeller} mm`],
          [
            copy.rows.suction,
            model.connection.suction ? `DN ${model.connection.suction}` : undefined,
          ],
          [copy.rows.discharge, `DN ${model.connection.discharge}`],
          [copy.rows.maxPressure, `${model.maxPressure} bar`],
          [copy.rows.weight, `${n(model.weight)} kg`],
        ]),
      },
      {
        heading: copy.sections.materials,
        rows: [
          [copy.rows.casing, materials.casing],
          [copy.rows.impellerMaterial, materials.impeller],
          [copy.rows.shaft, materials.shaft],
          [copy.rows.wearRings, materials.wearRings],
        ],
      },
      { heading: copy.sections.seal, paragraphs: [tenderSeals[model.shaftSeal]] },
      {
        heading: copy.sections.motor,
        rows: [
          [copy.rows.motorPower, `${model.power} kW`],
          [copy.rows.motorSpeed, `${poles}-pole, ${n(model.speed)} rpm`],
          [copy.rows.supply, copy.motorDefaults.supply(model.frequency)],
          [copy.rows.efficiencyClass, copy.motorDefaults.efficiencyClass],
          [copy.rows.enclosure, copy.motorDefaults.enclosure],
          [copy.rows.insulation, copy.motorDefaults.insulation],
        ],
      },
      intro.standards,
      make(model.name, model.productNumber),
    ],
  }
}

/** Tender text for a sized variant at its duty point (project items, replacement finder). */
export function variantTenderText(variant: PumpVariant, duty: DutyPoint): TenderDocument {
  const intro = productIntro(variant.productId)
  const result = evaluateVariant(variant, duty)
  const material = materialOptions.find((m) => m.code === variant.material)!
  const seal = sealOptions.find((s) => s.code === variant.seal)!
  const coupling = couplingOptions.find((c) => c.code === variant.coupling)!
  const liquid = getLiquid(duty.liquid)
  const speed = variant.speed * (duty.frequency === 60 ? 1.2 : 1)
  return {
    title: variant.name,
    reference: copy.reference(variant.productNumber),
    sections: [
      intro.general,
      {
        heading: copy.sections.hydraulics,
        rows: rows([
          [copy.rows.dutyFlow, `${n(duty.flow, duty.flow % 1 ? 1 : 0)} m³/h`],
          [copy.rows.dutyHead, `${n(duty.head, duty.head % 1 ? 1 : 0)} m`],
          [
            copy.rows.operatingPoint,
            result &&
              `${n(result.operatingPoint.flow, 1)} m³/h at ${n(result.operatingPoint.head, 1)} m`,
          ],
          [copy.rows.efficiency, result && `${n(result.efficiency, 1)} %`],
          [copy.rows.npshr, result && `${n(result.npshr, 1)} m`],
          [copy.rows.liquid, `${liquid.label}, ${duty.temperature} °C`],
          [copy.rows.speed, `${n(speed)} rpm`],
          [copy.rows.impeller, `${variant.impeller} mm (trimmed)`],
          [copy.rows.suction, `DN ${variant.connection.suction}`],
          [copy.rows.discharge, `DN ${variant.connection.discharge}`],
        ]),
      },
      {
        heading: copy.sections.materials,
        rows: [
          [copy.rows.casing, `${variant.housingMaterial} ${variant.housingGrade}`],
          [copy.rows.impellerMaterial, variant.impellerMaterial],
          [
            copy.rows.shaft,
            material.code === 'C1' ? 'Stainless steel EN 1.4021' : 'Duplex EN 1.4462',
          ],
        ],
      },
      {
        heading: copy.sections.seal,
        paragraphs: [tenderSeals[seal.label as ShaftSeal] ?? seal.label],
        rows: [[copy.rows.coupling, coupling.label]],
      },
      {
        heading: copy.sections.motor,
        rows: [
          [copy.rows.motorPower, `${variant.motorPower} kW`],
          [copy.rows.motorSpeed, `${variant.poles}-pole, ${n(speed)} rpm`],
          [copy.rows.supply, `${variant.motorVoltage}, 3~, ${duty.frequency} Hz`],
          [copy.rows.efficiencyClass, variant.motorClass],
          [copy.rows.motorEfficiency, `${n(variant.motorEfficiency, 1)} %`],
          [copy.rows.enclosure, `IP55, ${variant.motorEnclosure}`],
          [copy.rows.insulation, copy.motorDefaults.insulation],
        ],
      },
      intro.standards,
      make(variant.name, variant.productNumber),
    ],
  }
}

/** A project item's tender text, with its position line. Undefined if the variant is unknown. */
export function itemTenderText(item: ProjectItem, variant: PumpVariant | undefined) {
  if (!variant) return undefined
  return {
    ...variantTenderText(variant, item.dutyPoint),
    position: copy.position(item.position, item.customerPosition, item.quantity),
  }
}

/* ── Plain text (Copy) ─────────────────────────────────────────────────────── */

export function tenderPlainText(doc: TenderDocument) {
  const width = Math.max(...doc.sections.flatMap((s) => (s.rows ?? []).map(([l]) => l.length)))
  const lines = [doc.title, ...(doc.position ? [doc.position] : []), doc.reference, '']
  doc.sections.forEach((section, i) => {
    lines.push(`${i + 1}. ${section.heading.toUpperCase()}`)
    for (const paragraph of section.paragraphs ?? []) lines.push(paragraph)
    for (const [label, value] of section.rows ?? []) lines.push(`${label.padEnd(width)}  ${value}`)
    lines.push('')
  })
  return lines.join('\n')
}

/* ── RTF (Download; Word opens it) ─────────────────────────────────────────── */

/** Escapes RTF control characters and writes everything outside ASCII as \uN?. */
const rtf = (text: string) =>
  [...text]
    .map((char) => {
      const code = char.codePointAt(0)!
      if (char === '\\' || char === '{' || char === '}') return `\\${char}`
      return code > 127 ? `\\u${code > 32767 ? code - 65536 : code}?` : char
    })
    .join('')

function rtfDocument(doc: TenderDocument) {
  const parts = [
    `{\\pard\\sb0\\sa60\\b\\fs32\\cf1 ${rtf(doc.title)}\\par}`,
    ...(doc.position ? [`{\\pard\\sa40\\fs20 ${rtf(doc.position)}\\par}`] : []),
    `{\\pard\\sa240\\fs20\\cf2 ${rtf(doc.reference)}\\par}`,
  ]
  doc.sections.forEach((section, i) => {
    parts.push(`{\\pard\\sb200\\sa80\\b\\fs24\\cf1 ${i + 1}. ${rtf(section.heading)}\\par}`)
    for (const paragraph of section.paragraphs ?? []) {
      parts.push(`{\\pard\\sa80\\fs20 ${rtf(paragraph)}\\par}`)
    }
    for (const [label, value] of section.rows ?? []) {
      parts.push(`{\\pard\\tx3800\\sa40\\fs20 ${rtf(label)}\\tab ${rtf(value)}\\par}`)
    }
  })
  return parts.join('\n')
}

/** One RTF file with every document, each on its own page. */
export function tenderRtf(docs: TenderDocument[]) {
  return [
    '{\\rtf1\\ansi\\ansicpg1252\\deff0',
    '{\\fonttbl{\\f0\\fswiss Arial;}}',
    '{\\colortbl;\\red0\\green53\\blue113;\\red90\\green100\\blue115;}',
    '\\paperw11906\\paperh16838\\margl1134\\margr1134\\margt1134\\margb1134\\f0',
    docs.map(rtfDocument).join('\n\\page\n'),
    '}',
  ].join('\n')
}
