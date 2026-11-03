import { itemProduct } from '../../data/projectFiles'
import { myProjectsPage } from '../../data/projectPages'
import type { Project, ProjectItem } from '../../types'
import { Drawer } from '../Drawer'
import { ItemFiles } from './ItemFiles'

const copy = myProjectsPage.files

type ItemFilesDrawerProps = {
  open: boolean
  project: Project
  /** Kept after closing, so the drawer doesn't empty while it slides out. */
  item: ProjectItem | null
  onClose: () => void
}

/**
 * "Files" of a project product: CAD & BIM (choose a format, generate, download;
 * the file is saved to the project documents), drawings with a preview, and
 * documents.
 */
export function ItemFilesDrawer({ open, project, item, onClose }: ItemFilesDrawerProps) {
  const product = item && itemProduct(item)
  return (
    <Drawer
      open={open && Boolean(product)}
      title={product ? copy.title(product.name) : ''}
      subtitle={
        item && product
          ? copy.subtitle(item.position, item.customerPosition, product.productNumber)
          : undefined
      }
      closeLabel={copy.close}
      onClose={onClose}
    >
      {item && product && <ItemFiles key={item.id} project={project} item={item} />}
    </Drawer>
  )
}
