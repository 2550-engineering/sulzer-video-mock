import type { TenderDocument } from '../types'
import { sectionNumber } from './tenderText'
import { zipStore } from './zip'

/*
 * A Word document (.docx) for a tender text, built in the browser: three XML
 * parts in a zip. Arial, A4, headings in bold, label–value rows on a tab stop.
 */

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type Run = { text: string; bold?: boolean; size?: number; tab?: boolean }

/** One paragraph; size in points; `after` spacing in points. */
function paragraph(runs: Run[], { after = 6, tabStop = false, indent = 0 } = {}) {
  const pPr = [
    `<w:spacing w:after="${after * 20}"/>`,
    tabStop ? '<w:tabs><w:tab w:val="left" w:pos="3969"/></w:tabs>' : '',
    indent ? `<w:ind w:left="${indent}" w:hanging="284"/>` : '',
  ].join('')
  const body = runs
    .map(({ text, bold, size = 10, tab }) => {
      const rPr = `<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>${bold ? '<w:b/>' : ''}<w:sz w:val="${size * 2}"/></w:rPr>`
      return `${tab ? `<w:r>${rPr}<w:tab/></w:r>` : ''}<w:r>${rPr}<w:t xml:space="preserve">${escape(text)}</w:t></w:r>`
    })
    .join('')
  return `<w:p><w:pPr>${pPr}</w:pPr>${body}</w:p>`
}

function documentXml(document: TenderDocument) {
  const body: string[] = [paragraph([{ text: document.title, bold: true, size: 16 }], { after: 4 })]
  if (document.subtitle)
    body.push(paragraph([{ text: document.subtitle, size: 10 }], { after: 12 }))
  document.parts.forEach((part, p) => {
    if (part.heading) {
      body.push(
        paragraph([{ text: `${p + 1}  ${part.heading}`, bold: true, size: 13 }], { after: 8 }),
      )
    }
    part.sections.forEach((section, i) => {
      body.push(
        paragraph(
          [{ text: `${sectionNumber(document, p, i)}  ${section.title}`, bold: true, size: 11 }],
          {
            after: 4,
          },
        ),
      )
      for (const text of section.paragraphs) body.push(paragraph([{ text }]))
      for (const [label, value] of section.rows ?? []) {
        body.push(
          paragraph([{ text: label }, { text: value, tab: true }], { after: 2, tabStop: true }),
        )
      }
      for (const item of section.items ?? []) {
        body.push(paragraph([{ text: `–  ${item}` }], { after: 2, indent: 284 }))
      }
      body.push(paragraph([{ text: '' }], { after: 4 }))
    })
  })
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`
}

/** The tender text as a .docx file. */
export function tenderDocx(document: TenderDocument): Blob {
  const bytes = zipStore([
    {
      name: '[Content_Types].xml',
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
    },
    {
      name: '_rels/.rels',
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
    },
    { name: 'word/document.xml', content: documentXml(document) },
  ])
  return new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
}
