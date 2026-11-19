import { replacementGuidePage } from '../../data/replacementGuidePage'
import { existingSpecRows } from '../../lib/replacementGuide'
import type { GuideExistingPump } from '../../types'
import { GuidePumpPhoto } from './GuidePumpPhoto'
import { GuideSpecList } from './GuideSpecList'

const copy = replacementGuidePage.existing

/** "Your existing pump": name, photo and its seven specs. */
export function GuideExistingCard({ pump }: { pump: GuideExistingPump }) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-white">
      <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.1em] text-text-subtle uppercase">
            {copy.label}
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-navy-900">
            {pump.brand} {pump.model}
          </h2>
        </div>
        <GuidePumpPhoto image={pump.image} label={copy.photo(pump.brand)} className="size-28" />
      </header>
      <div className="px-6 pt-5 pb-6">
        <GuideSpecList rows={existingSpecRows(pump)} />
      </div>
    </article>
  )
}
