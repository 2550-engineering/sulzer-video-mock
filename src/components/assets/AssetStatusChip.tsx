import { statusLabels } from '../../data/assetPages'
import type { AssetStatus } from '../../types'
import { statusTones } from '../../lib/statusTones'

/** Status as a small pill: "Normal", "Warning" or "Alarm". */
export function AssetStatusChip({ status }: { status: AssetStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusTones[status].chip}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  )
}
