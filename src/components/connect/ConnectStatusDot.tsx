import { statusNames } from '../../data/connect'
import { statusTonesOnDark } from '../../lib/statusTones'
import type { AssetStatus } from '../../types'

/** Status dot for navy surfaces. Warnings and alarms pulse gently. */
export function ConnectStatusDot({ status }: { status: AssetStatus }) {
  return (
    <span className="relative flex size-2.5 shrink-0">
      {status !== 'ok' && (
        <span
          aria-hidden
          className={`absolute inset-0 animate-ping rounded-full opacity-50 [animation-duration:2s] ${statusTonesOnDark[status].dot}`}
        />
      )}
      <span
        role="img"
        aria-label={statusNames[status]}
        className={`relative size-2.5 rounded-full ring-4 ${statusTonesOnDark[status].dot}`}
      />
    </span>
  )
}
