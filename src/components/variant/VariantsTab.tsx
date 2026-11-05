import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { variantPage } from '../../data/variantPages'
import { groupThousands } from '../../lib/format'
import { formatPrice } from '../../lib/modelSpecs'
import type { ResultArticle } from '../../types'
import { TabHeading } from '../TabHeading'
import { StockIndicator } from './StockIndicator'

const copy = variantPage.variants

type VariantsTabProps = {
  articles: ResultArticle[]
  current: ResultArticle
  productName: string
}

const head =
  'border-b border-border bg-surface-sunken px-4 py-3 text-left font-semibold whitespace-nowrap'
const cell = 'border-b border-border px-4 py-3'
const number = (v: number) => groupThousands(v, v % 1 ? 1 : 0)

/** Every variant or model of the product; the current one highlighted. A row opens it. */
export function VariantsTab({ articles, current, productName }: VariantsTabProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const c = copy.columns

  return (
    <>
      <TabHeading title={copy.title} />
      <p className="mt-3 text-text-muted">{copy.intro(articles.length, productName)}</p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-white max-md:overflow-visible max-md:rounded-none max-md:border-0 max-md:bg-transparent">
        <table className="table-cards w-full min-w-[56rem] border-separate border-spacing-0 text-[15px]">
          <thead className="text-sm text-navy-900">
            <tr>
              <th scope="col" className={head}>
                {c.code}
              </th>
              <th scope="col" className={head}>
                {c.number}
              </th>
              <th scope="col" className={`${head} text-right`}>
                {c.power}
              </th>
              <th scope="col" className={head}>
                {c.frequency}
              </th>
              <th scope="col" className={`${head} text-right`}>
                {c.outlet}
              </th>
              <th scope="col" className={`${head} text-right`}>
                {c.maxFlow}
              </th>
              <th scope="col" className={`${head} text-right`}>
                {c.maxHead}
              </th>
              <th scope="col" className={head}>
                {c.availability}
              </th>
              {user && (
                <th scope="col" className={`${head} text-right`}>
                  {c.price}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => {
              const isCurrent = article.id === current.id
              return (
                <tr
                  key={article.id}
                  aria-current={isCurrent || undefined}
                  onClick={() => !isCurrent && navigate(`${article.to}#variants`)}
                  className={`transition-colors duration-150 ${
                    isCurrent
                      ? 'bg-primary-tint shadow-[inset_4px_0_0_var(--sz-color-primary)]'
                      : 'cursor-pointer bg-white hover:bg-surface-subtle'
                  }`}
                >
                  <th
                    scope="row"
                    className={`${cell} text-left font-semibold whitespace-nowrap max-md:block max-md:border-0 max-md:px-0 max-md:py-1.5`}
                  >
                    {isCurrent ? (
                      <span className="text-navy-900">{article.code}</span>
                    ) : (
                      <Link
                        to={`${article.to}#variants`}
                        onClick={(event) => event.stopPropagation()}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {article.code}
                      </Link>
                    )}
                    {isCurrent && (
                      <span className="ml-2 rounded-pill bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                        {copy.current}
                      </span>
                    )}
                  </th>
                  <td className={`${cell} tabular-nums`}>{article.productNumber}</td>
                  <td className={`${cell} text-right whitespace-nowrap tabular-nums`}>
                    {number(article.power)} kW
                  </td>
                  <td className={cell}>{article.frequency} Hz</td>
                  <td className={`${cell} text-right whitespace-nowrap`}>DN {article.outlet}</td>
                  <td className={`${cell} text-right whitespace-nowrap tabular-nums`}>
                    {groupThousands(article.maxFlow)} m³/h
                  </td>
                  <td className={`${cell} text-right whitespace-nowrap tabular-nums`}>
                    {number(article.maxHead)} m
                  </td>
                  <td className={`${cell} whitespace-nowrap`}>
                    <StockIndicator status={article.availability.status} />
                  </td>
                  {user && (
                    <td
                      className={`${cell} text-right font-semibold whitespace-nowrap tabular-nums`}
                    >
                      {article.discontinued ? '–' : formatPrice(article.listPrice)}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
