import { replacementGuidePage } from '../../data/replacementGuidePage'
import { replacementName, replacementSpecRows } from '../../lib/replacementGuide'
import type { GuideReplacement } from '../../types'
import { GuideAvailabilityChip } from './GuideAvailabilityChip'
import { GuideProductLinks } from './GuideProductLinks'
import { GuidePumpPhoto } from './GuidePumpPhoto'
import { GuideSpecList } from './GuideSpecList'

const copy = replacementGuidePage.replacement

/** "Sulzer replacement · tier": name, availability, photo, 16 specs, comments and links. */
export function GuideReplacementCard({ replacement }: { replacement: GuideReplacement }) {
  return (
    <article className="overflow-hidden rounded-lg border border-primary bg-white shadow-raised">
      <div aria-hidden className="h-1.5 bg-primary" />
      <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.1em] text-primary uppercase">
            {copy.label(replacement.tier)}
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-navy-900">
            {replacementName(replacement)}
          </h2>
          <div className="mt-3">
            <GuideAvailabilityChip availability={replacement.availability} />
          </div>
        </div>
        <GuidePumpPhoto
          image={replacement.image}
          label={copy.photo(replacement.range)}
          className="size-36"
        />
      </header>
      <div className="px-6 pt-5">
        <GuideSpecList rows={replacementSpecRows(replacement)} columns={2} />
        <p className="mt-4 flex gap-3 text-[13px] leading-relaxed">
          <span className="shrink-0 font-semibold text-text-muted">{copy.comments}</span>
          <span className="text-navy-500">{replacement.comment}</span>
        </p>
      </div>
      <GuideProductLinks className="px-6 pt-5 pb-6" />
    </article>
  )
}
