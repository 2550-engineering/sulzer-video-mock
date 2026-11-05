import { statusLabels } from '../../data/assetPages'
import type { AssetStatus } from '../../types'
import { statusTones } from '../../lib/statusTones'

/** Coloured dot with a soft halo. Warnings and alarms pulse gently. */
export function AssetStatusDot({ status }: { status: AssetStatus }) {
  return (
    <span className="relative flex size-2.5 shrink-0">
      {status !== 'ok' && (
        <span
          aria-hidden
          className={`absolute inset-0 animate-ping rounded-full opacity-40 [animation-duration:2s] ${statusTones[status].dot}`}
        />
      )}
      <span
        role="img"
        aria-label={statusLabels[status]}
        className={`relative size-2.5 rounded-full ring-4 ${statusTones[status].dot}`}
      />
    </span>
  )
}
