import { sectionNumber } from '../../lib/tenderText'
import type { TenderDocument } from '../../types'

/** A tender text as formatted, numbered sections (dialog and print view). */
export function TenderDocumentView({ document }: { document: TenderDocument }) {
  return (
    <article className="text-[15px] leading-relaxed text-text">
      <h2 className="text-xl font-bold tracking-tight text-navy-900">{document.title}</h2>
      {document.subtitle && <p className="mt-0.5 text-sm text-text-muted">{document.subtitle}</p>}
      {document.parts.map((part, p) => (
        <section key={part.heading ?? p} className="mt-6 break-inside-avoid-page">
          {part.heading && (
            <h3 className="mb-3 border-b-2 border-navy-900 pb-1.5 text-base font-bold text-navy-900">
              <span className="mr-2 tabular-nums">{p + 1}</span>
              {part.heading}
            </h3>
          )}
          {part.sections.map((section, i) => (
            <div key={section.title} className="mt-4 break-inside-avoid">
              <h4 className="font-bold text-navy-900">
                <span className="mr-2 text-primary tabular-nums">
                  {sectionNumber(document, p, i)}
                </span>
                {section.title}
              </h4>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-1">
                  {paragraph}
                </p>
              ))}
              {section.rows && (
                <dl className="mt-1.5 grid grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-x-6 gap-y-1">
                  {section.rows.map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="text-text-muted">{label}</dt>
                      <dd className="font-semibold text-navy-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {section.items && (
                <ul className="mt-1.5 space-y-0.5 pl-5 [list-style:disc] marker:text-primary">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      ))}
    </article>
  )
}
