import { tenderCopy as copy } from '../data/tenderTexts'
import type {
  TenderDocument,
  TenderOptions,
  TenderPart,
  TenderSection,
  TenderSubject,
} from '../types'
import { groupThousands } from './format'

/*
 * Tender (specification) texts for pumps. Pure and deterministic: the same
 * subject and options always give the same text. Wording lives in
 * data/tenderTexts.ts. Only English is written; other languages fall back to it.
 */

const num = (value: number, decimals = 0) => groupThousands(value, decimals)
const oneDecimal = (value: number) => num(value, value % 1 ? 1 : 0)

/** The sections for one pump, in order; "short" keeps the essentials. */
function sectionsFor(subject: TenderSubject, options: TenderOptions): TenderSection[] {
  const s = copy.sections
  const full = options.detail === 'full'
  const { hydraulic: h, motor: m } = subject

  const general: TenderSection = {
    title: s.general,
    paragraphs: [copy.general[subject.kind](subject.quantity)],
  }

  const duty: TenderSection | null = options.includeDuty
    ? {
        title: s.duty,
        paragraphs: [
          ...(subject.application ? [copy.application(subject.application)] : []),
          ...(subject.duty ? [] : [copy.ratedOnly]),
        ],
        rows: subject.duty
          ? [
              [copy.dutyRows.liquid, subject.duty.liquid],
              [copy.dutyRows.temperature, `${subject.duty.temperature} °C`],
              [copy.dutyRows.flow, `${oneDecimal(subject.duty.flow)} m³/h`],
              [copy.dutyRows.head, `${oneDecimal(subject.duty.head)} m`],
            ]
          : undefined,
      }
    : null

  const hydraulic: TenderSection = {
    title: s.hydraulic,
    paragraphs: full ? [copy.operatingRange] : [],
    rows: [
      [copy.hydraulicRows.flow, `${num(h.flow, 1)} m³/h`],
      [copy.hydraulicRows.head, `${num(h.head, 1)} m`],
      [copy.hydraulicRows.efficiency, `${num(h.efficiency, 1)} %`],
      ...(h.npshr !== undefined
        ? ([[copy.hydraulicRows.npshr, `${num(h.npshr, 1)} m`]] as [string, string][])
        : []),
      [copy.hydraulicRows.speed, `${num(h.speed)} rpm`],
      [copy.hydraulicRows.impeller, `${h.impeller} mm`],
    ],
  }

  const design: TenderSection = { title: s.design, paragraphs: copy.design[subject.kind] }

  const materials: TenderSection = {
    title: s.materials,
    paragraphs: [],
    rows: [
      [copy.materialRows.casing, subject.materials.casing],
      [copy.materialRows.impeller, subject.materials.impeller],
      [copy.materialRows.shaft, subject.materials.shaft],
      [copy.materialRows.wearParts, subject.materials.wearParts],
    ],
  }

  const seal: TenderSection = { title: s.seal, paragraphs: [copy.seals[subject.seal]] }

  const motor: TenderSection = {
    title: s.motor,
    paragraphs: [],
    rows: [
      [copy.motorRows.power, `${oneDecimal(m.power)} kW`],
      [copy.motorRows.supply, `${m.voltage}, ${m.frequency} Hz`],
      [copy.motorRows.poles, `${m.poles} / ${num(h.speed)} rpm`],
      [copy.motorRows.efficiencyClass, m.efficiencyClass],
      [copy.motorRows.enclosure, m.enclosure],
      ...(full
        ? ([
            [copy.motorRows.insulation, copy.insulation],
            [copy.motorRows.protection, copy.protection[subject.kind]],
          ] as [string, string][])
        : []),
      ...(subject.exApproved ? ([[copy.motorRows.ex, copy.exYes]] as [string, string][]) : []),
    ],
  }

  const connections: TenderSection = {
    title: s.connections,
    paragraphs: [],
    rows: [
      ...(subject.connections.suction !== undefined
        ? ([[copy.connectionRows.suction, `DN ${subject.connections.suction}`]] as [
            string,
            string,
          ][])
        : []),
      [copy.connectionRows.discharge, `DN ${subject.connections.discharge}`],
      [copy.connectionRows.flanges, copy.flanges],
    ],
  }

  const accessories: TenderSection = {
    title: s.accessories,
    paragraphs: [],
    items: [
      ...copy.accessories[subject.kind],
      ...(subject.cableLength ? [copy.cable(subject.cableLength)] : []),
    ],
  }

  const testing: TenderSection = { title: s.testing, paragraphs: [], items: copy.testing }
  const documentation: TenderSection = {
    title: s.documentation,
    paragraphs: [],
    items: copy.documentation,
  }
  const manufacturer: TenderSection = {
    title: s.manufacturer,
    paragraphs: [copy.manufacturer(subject.model, subject.productNumber, options.orEqual)],
  }

  const all = full
    ? [
        general,
        duty,
        hydraulic,
        design,
        materials,
        seal,
        motor,
        connections,
        accessories,
        testing,
        documentation,
        manufacturer,
      ]
    : [general, duty, hydraulic, materials, motor, manufacturer]
  return all.filter((section): section is TenderSection => section !== null)
}

/**
 * The tender text for one pump, or for several (a project), each then headed
 * by its position ("Pos. 10 – RW-01 – AHLSTAR …") in position order.
 */
export function tenderText(
  subjects: TenderSubject[],
  options: TenderOptions,
  title: string,
  subtitle?: string,
): TenderDocument {
  const sorted = [...subjects].sort((a, b) => (a.position?.number ?? 0) - (b.position?.number ?? 0))
  const parts: TenderPart[] = sorted.map((subject) => ({
    heading:
      subjects.length > 1 || subject.position
        ? copy.positionHeading(
            subject.position?.number ?? 0,
            subject.position?.tag ?? '',
            subject.model,
          )
        : undefined,
    sections: sectionsFor(subject, options),
  }))
  return { title, subtitle, parts }
}

/** "1", "1.1" …: section numbers, with the part number in front when there are headed parts. */
export const sectionNumber = (document: TenderDocument, part: number, section: number) =>
  document.parts.some((p) => p.heading) ? `${part + 1}.${section + 1}` : String(section + 1)

/** The document as plain text, for the clipboard. */
export function tenderPlainText(document: TenderDocument) {
  const lines: string[] = [document.title.toUpperCase()]
  if (document.subtitle) lines.push(document.subtitle)
  document.parts.forEach((part, p) => {
    lines.push('')
    if (part.heading) lines.push(`${p + 1}  ${part.heading.toUpperCase()}`, '')
    part.sections.forEach((section, i) => {
      lines.push(`${sectionNumber(document, p, i)}  ${section.title}`)
      for (const paragraph of section.paragraphs) lines.push(paragraph)
      for (const [label, value] of section.rows ?? []) lines.push(`${label}: ${value}`)
      for (const item of section.items ?? []) lines.push(`– ${item}`)
      lines.push('')
    })
  })
  return lines.join('\n').trimEnd() + '\n'
}
