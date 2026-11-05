import { Check, Minus } from 'lucide-react'
import { productPage } from '../../data/catalogPages'
import type { ProductVariants } from '../../types'
import { TabHeading } from '../TabHeading'
import { PackageCard } from './PackageCard'

const copy = productPage.variants

/**
 * Variants tab of a digital product: the packages as comparison cards, each
 * adding to the one before, then a table of every feature by package.
 */
export function VariantsTab({ variants }: { variants: ProductVariants }) {
  const { packages } = variants
  // Each feature, with the index of the first package that has it.
  const features = packages.flatMap((pkg, tier) => pkg.features.map((label) => ({ label, tier })))

  return (
    <>
      <TabHeading title={variants.title} />
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-text-muted">{variants.text}</p>

      <ul className="mt-12 grid gap-6 lg:grid-cols-3">
        {packages.map((pkg, i) => (
          <li key={pkg.id}>
            <PackageCard pkg={pkg} previous={packages[i - 1]} />
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-text-muted">{copy.priceNote}</p>

      <h3 className="mt-20 text-2xl font-bold tracking-tight text-brand">{copy.compareTitle}</h3>
      <div className="mt-6 overflow-x-auto rounded-lg ring-1 ring-border">
        <table className="w-full min-w-[640px] text-left text-[15px] max-md:min-w-0 max-md:text-sm">
          <thead className="bg-surface-muted">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold text-navy-900 max-md:px-3">
                {copy.feature}
              </th>
              {packages.map((pkg) => (
                <th
                  key={pkg.id}
                  scope="col"
                  className="w-44 px-6 py-4 text-center font-semibold text-navy-900 max-md:w-auto max-md:px-2"
                >
                  {pkg.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(({ label, tier }) => (
              <tr key={label} className="border-t border-border">
                <th scope="row" className="px-6 py-3.5 font-normal text-text max-md:px-3">
                  {label}
                </th>
                {packages.map((pkg, i) => (
                  <td key={pkg.id} className="px-6 py-3.5 text-center max-md:px-2">
                    {i >= tier ? (
                      <Check
                        aria-label={copy.included}
                        className="mx-auto size-5 text-success"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <Minus
                        aria-label={copy.notIncluded}
                        className="mx-auto size-5 text-text-subtle"
                        strokeWidth={2}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
