import type { CSSProperties } from 'react'
import { productPage as copy } from '../../data/catalogPages'
import type { ExploreStep } from '../../types'

type HowItWorksProps = {
  title: string
  text: string
  steps: ExploreStep[]
}

// A pulse travels along the steps, one after the other.
const pulseMs = 700
const pulse = (index: number): CSSProperties => ({
  animationDelay: `${index * pulseMs}ms`,
  animationDuration: '2.8s',
})

/**
 * "How it works": numbered steps as icon nodes on a line, with data flowing
 * along the line and a pulse moving from node to node (motion-safe only).
 */
export function HowItWorks({ title, text, steps }: HowItWorksProps) {
  // Node centres sit half a column in from each side.
  const inset = 50 / steps.length

  return (
    <section className="site-container py-20 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">{title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">{text}</p>
      </div>

      <ol
        className="relative mt-16 grid gap-12 md:grid-cols-[repeat(var(--steps),minmax(0,1fr))] md:gap-8"
        style={{ '--steps': steps.length } as CSSProperties}
      >
        {/* The line runs from the first node's centre to the last one's. */}
        <svg
          aria-hidden
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
          className="absolute top-[46px] hidden h-1 md:block"
          style={{ left: `${inset}%`, width: `${100 - 2 * inset}%` }}
        >
          <line
            x1="0"
            y1="2"
            x2="100"
            y2="2"
            className="stroke-primary-border"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="0"
            y1="2"
            x2="100"
            y2="2"
            className="stroke-primary motion-safe:animate-flow"
            strokeWidth="4"
            strokeDasharray="4 12"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {steps.map(({ label, text: stepText, icon: Icon }, i) => (
          <li key={label} className="relative text-center">
            <div className="relative mx-auto size-24">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-primary/15 motion-safe:animate-ping"
                style={pulse(i)}
              />
              <span className="relative flex size-24 items-center justify-center rounded-full bg-white text-primary shadow-card ring-1 ring-primary-border">
                <Icon aria-hidden className="size-10" strokeWidth={1.5} />
              </span>
              <span className="absolute -top-1 -right-1 flex size-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white ring-4 ring-white">
                {i + 1}
              </span>
            </div>
            <p className="mt-6 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
              {copy.howItWorksStep(i + 1)}
            </p>
            <h3 className="mt-1.5 text-xl font-bold tracking-tight text-brand">{label}</h3>
            <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-text-muted">
              {stepText}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
