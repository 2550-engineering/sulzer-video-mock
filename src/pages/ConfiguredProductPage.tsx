import { BimTab } from '../components/product/BimTab'
import { DocumentationTab } from '../components/product/DocumentationTab'
import { ConfigurationNotFound } from '../components/configured/ConfigurationNotFound'
import { ConfiguredHeader } from '../components/configured/ConfiguredHeader'
import { ProjectContextBar } from '../components/configured/ProjectContextBar'
import { TenderTextTab } from '../components/configured/TenderTextTab'
import { SparePartsTab } from '../components/spareparts/SparePartsTab'
import { TabBar } from '../components/TabBar'
import { TabComingSoon } from '../components/TabComingSoon'
import { TabHeading } from '../components/TabHeading'
import { TabPanel } from '../components/TabPanel'
import { CurvesTab } from '../components/variant/CurvesTab'
import { SpecGroupTable } from '../components/variant/SpecGroupTable'
import { productPage } from '../data/catalogPages'
import { configuredPage as copy } from '../data/configuredPages'
import { tenderDialog } from '../data/tenderTexts'
import { variantPage } from '../data/variantPages'
import { useConfiguredPump } from '../hooks/useConfiguredPump'
import { useHashTab } from '../hooks/useHashTab'
import { tenderFileName } from '../hooks/useTenderDialog'
import { documentsFor, getApplication } from '../lib/catalog'
import { baseModel, configuredSpecGroups, configuredSubject } from '../lib/configured'
import { NotFoundPage } from './NotFoundPage'

/**
 * A configured pump from the sizing variant generator
 * (/products/ahlstar/config/a25-200-150-400-t390-4p-c1-sd-f), rebuilt from
 * its URL. Opened from a project (?project=&item=) it shows the project
 * context and uses the item's duty point and position.
 */
export function ConfiguredProductPage() {
  const pump = useConfiguredPump()
  const { active: activeTab, select: selectTab, anchorRef } = useHashTab(copy.tabs, 'curves')
  if (!pump.product) return <NotFoundPage />
  if (!pump.variant) return <ConfigurationNotFound product={pump.product} />

  const { product, variant, duty, atDuty, result, article, fromProject } = pump
  const model = baseModel(variant)
  const application =
    (fromProject?.project.applicationId &&
      getApplication(fromProject.project.applicationId)?.name) ||
    undefined
  const subject = configuredSubject(variant, duty, result, {
    item: fromProject?.item,
    withDuty: atDuty,
    application,
  })

  return (
    <>
      <title>{`${variant.name} | Sulzer`}</title>

      <ConfiguredHeader
        variant={variant}
        article={article}
        product={product}
        result={result}
        atDuty={atDuty}
        quantity={fromProject?.item.quantity}
        context={
          fromProject && <ProjectContextBar project={fromProject.project} item={fromProject.item} />
        }
        onSelectTab={selectTab}
      />

      <TabBar
        tabs={copy.tabs}
        active={activeTab}
        onSelect={selectTab}
        anchorRef={anchorRef}
        idPrefix="configured"
      />

      {/* Keyed by variant and duty point, so a new configuration starts every tab fresh. */}
      <TabPanel
        key={`${variant.id}-${duty.flow}-${duty.head}`}
        idPrefix="configured"
        tabId={activeTab}
      >
        {activeTab === 'curves' && <CurvesTab article={article} showDuty={atDuty} />}
        {activeTab === 'specifications' && (
          <>
            <TabHeading title={variantPage.specifications.title} />
            <div className="mt-8 grid gap-x-16 gap-y-10 lg:grid-cols-2">
              {configuredSpecGroups(variant, article, duty, result).map((group) => (
                <SpecGroupTable key={group.title} title={group.title} rows={group.rows} />
              ))}
            </div>
          </>
        )}
        {activeTab === 'tender-text' && (
          <TenderTextTab
            subject={subject}
            documentTitle={tenderDialog.documentTitle(variant.name)}
            subtitle={
              fromProject &&
              `${fromProject.project.name} · ${fromProject.project.refNo} · ${copy.context.position(fromProject.item.customerPosition)}`
            }
            fileName={tenderFileName(
              fromProject
                ? `${fromProject.project.refNo}_pos_${fromProject.item.position}`
                : variant.name,
            )}
            position={fromProject?.item.customerPosition}
          />
        )}
        {activeTab === 'cad' &&
          (model ? (
            <BimTab product={product} models={[model]} />
          ) : (
            <TabComingSoon copy={productPage.tabEmpty} />
          ))}
        {activeTab === 'documentation' && (
          <DocumentationTab product={product} documents={documentsFor(product.id)} />
        )}
        {activeTab === 'spare-parts' &&
          (model ? (
            <>
              <p className="mb-6 text-text-muted">{copy.spareParts.base(model.name)}</p>
              <SparePartsTab ownerId={model.id} />
            </>
          ) : (
            <TabComingSoon copy={productPage.tabEmpty} />
          ))}
      </TabPanel>
    </>
  )
}
