import { Breadcrumb } from '../components/Breadcrumb'
import { ComingSoonPanel } from '../components/ComingSoonPanel'

export function NotFoundPage() {
  return (
    <>
      <title>Page not found | Sulzer</title>

      <div className="site-container py-5">
        <Breadcrumb items={[{ label: 'Page not found' }]} />
      </div>

      <section className="site-container pt-6 pb-16">
        <ComingSoonPanel eyebrow="Error 404" title="We couldn't find that page">
          The page may have moved or no longer exists. Use the menu or search above to find what
          you're looking for.
        </ComingSoonPanel>
      </section>
    </>
  )
}
