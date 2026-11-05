import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { replacementPage as copy } from '../../data/replacementPage'
import { articleById } from '../../lib/articles'
import { discontinuedArticles } from '../../lib/replacement'

/** Quick picks: every discontinued variant or model, most recently discontinued first, with its replacement. */
export function DiscontinuedList() {
  const articles = discontinuedArticles()
  return (
    <section>
      <h2 className="text-lg font-bold tracking-tight text-navy-900">{copy.pick.title}</h2>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              to={`/products/replacement?from=${article.id}`}
              className="group flex items-center gap-4 rounded-md border border-border bg-white px-5 py-4 transition-colors hover:border-primary"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy-900">{article.code}</span>
                <span className="block text-sm text-text-muted tabular-nums">
                  {copy.productNumber(article.productNumber)}
                  {article.discontinued &&
                    ` · ${copy.pick.discontinued(article.discontinued.year)}`}
                </span>
                {article.discontinued && (
                  <span className="mt-0.5 block text-sm text-text">
                    {copy.pick.replacedBy(
                      articleById(article.discontinued.successorId)?.code ?? '',
                    )}
                  </span>
                )}
              </span>
              <ArrowRight className="size-4 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
