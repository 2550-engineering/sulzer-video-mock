import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { KnowledgeItem } from '../types'
import { SmartImage } from './SmartImage'

type StoryCardProps = {
  story: KnowledgeItem
  /** Small tag above the headline, e.g. "Case". */
  label: string
}

/** Large portrait card: photo with the label and headline over a dark gradient. */
export function StoryCard({ story, label }: StoryCardProps) {
  return (
    <Link
      to={story.to}
      className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-navy-900"
    >
      <SmartImage
        src={story.image.src}
        alt=""
        className="transition-transform duration-250 ease-sz group-hover:scale-[1.03]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-navy-900/95 via-navy-900/40 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-7">
        <span className="text-xs font-semibold tracking-[0.12em] text-primary-on-dark uppercase">
          {label}
        </span>
        <h3 className="mt-2 text-[1.375rem] leading-snug font-bold tracking-tight text-white">
          {story.title}
        </h3>
        <span
          aria-hidden
          className="mt-5 flex size-10 items-center justify-center rounded-full border border-white/40 text-white transition-[transform,background-color,border-color] duration-200 group-hover:translate-x-1 group-hover:border-primary group-hover:bg-primary"
        >
          <ArrowRight className="size-[18px]" />
        </span>
      </div>
    </Link>
  )
}
