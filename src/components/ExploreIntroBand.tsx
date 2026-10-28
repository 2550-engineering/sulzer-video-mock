import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { exploreIntroBand as copy } from '../data/catalogPages'
import type { ExploreIntro } from '../types'

/** Full-width grey band opening an Explore tab: heading, lead and text behind "Show more". */
export function ExploreIntroBand({ intro }: { intro: ExploreIntro }) {
  const [expanded, setExpanded] = useState(false)
  const moreId = useId()

  return (
    <section className="bg-surface-sunken py-14 lg:py-16">
      <div className="site-container">
        <div className="max-w-3xl">
          <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">
            {intro.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-text-muted">{intro.text}</p>

          {intro.more.length > 0 && (
            <>
              {/* Rows animate 0fr → 1fr, so the text expands to its natural height. */}
              <div
                id={moreId}
                inert={!expanded}
                className={`grid transition-[grid-template-rows,opacity] duration-250 ease-sz ${
                  expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  {intro.more.map((paragraph) => (
                    <p key={paragraph} className="mt-4 text-lg leading-relaxed text-text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={moreId}
                onClick={() => setExpanded((open) => !open)}
                className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                <ChevronDown
                  className={`size-4 transition-transform duration-250 ease-sz ${expanded ? 'rotate-180' : ''}`}
                />
                {expanded ? copy.showLess : copy.showMore}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
