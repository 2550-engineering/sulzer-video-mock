import type { ReactNode } from 'react'
import { productPage } from '../../data/catalogPages'

const copy = productPage.bim

type NumberedStepProps = {
  number: number
  title: string
  children: ReactNode
}

/** Numbered step in a short flow, e.g. the BIM tab's choose → choose → generate. */
export function NumberedStep({ number, title, children }: NumberedStepProps) {
  return (
    <section>
      <h3 className="flex items-center gap-3 font-semibold text-navy-900">
        <span
          aria-hidden
          className="flex size-7 items-center justify-center rounded-full bg-navy-900 text-sm text-white"
        >
          {number}
        </span>
        <span>
          <span className="sr-only">{copy.step(number)}: </span>
          {title}
        </span>
      </h3>
      <div className="mt-4 pl-10">{children}</div>
    </section>
  )
}
