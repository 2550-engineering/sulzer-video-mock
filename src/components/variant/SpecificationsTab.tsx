import { variantPage } from '../../data/variantPages'
import { articleSpecGroups } from '../../lib/variantSpecs'
import type { ResultArticle } from '../../types'
import { TabHeading } from '../TabHeading'
import { SpecGroupTable } from './SpecGroupTable'

/** Grouped spec tables: Liquid, Technical, Materials, Installation, Electrical data. */
export function SpecificationsTab({ article }: { article: ResultArticle }) {
  return (
    <>
      <TabHeading title={variantPage.specifications.title} />
      <div className="mt-8 grid gap-x-16 gap-y-10 lg:grid-cols-2">
        {articleSpecGroups(article).map((group) => (
          <SpecGroupTable key={group.title} title={group.title} rows={group.rows} />
        ))}
      </div>
    </>
  )
}
