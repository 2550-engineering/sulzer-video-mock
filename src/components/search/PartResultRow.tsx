import { ArrowRight, Wrench } from 'lucide-react'
import { Link } from 'react-router'
import { searchPage } from '../../data/catalogPages'
import { partPath } from '../../lib/catalog'
import type { PartHit } from '../../types'
import { Highlight } from './Highlight'

const copy = searchPage.part

/** A spare part in the results; opens the configured product's Spare parts tab with it selected. */
export function PartResultRow({ hit, query }: { hit: PartHit; query: string }) {
  return (
    <Link
      to={partPath(hit)}
      className="group flex items-center gap-5 rounded-md border border-border bg-white px-6 py-4 transition-colors duration-200 hover:border-primary"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-primary-tint text-primary">
        <Wrench className="size-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-navy-900">
          <Highlight text={hit.part.name} query={query} />
        </span>
        <span className="mt-0.5 block text-sm text-text-muted tabular-nums">
          <Highlight text={copy.detail(hit.part.partNumber, hit.part.position)} query={query} />
        </span>
      </span>
      <span className="hidden text-sm text-text-muted md:block">
        {copy.forProduct(hit.owner.name)}
      </span>
      <ArrowRight className="size-4 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-1" />
    </Link>
  )
}
