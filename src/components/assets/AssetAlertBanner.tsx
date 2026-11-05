import { ArrowRight, Lightbulb, TriangleAlert } from 'lucide-react'
import { assetPage, channels } from '../../data/assetPages'
import { readingTime, type AssetAlert } from '../../lib/assetList'

const copy = assetPage.alert

const tones = {
  warning: {
    box: 'border-warning/40 bg-warning-tint',
    icon: 'bg-warning text-white',
    title: 'text-warning-strong',
  },
  alarm: {
    box: 'border-danger/40 bg-danger-tint',
    icon: 'bg-danger text-white',
    title: 'text-danger-strong',
  },
}

type AssetAlertBannerProps = {
  alert: AssetAlert
  onViewCondition: () => void
  onRequestService: () => void
}

/** The active alert: what crossed which limit and when, and Sulzer Connect's recommended action. */
export function AssetAlertBanner({
  alert,
  onViewCondition,
  onRequestService,
}: AssetAlertBannerProps) {
  const { label, unit, decimals } = channels[alert.channel]
  const tone = tones[alert.level]

  return (
    <div className="site-container pt-8">
      <section
        className={`grid animate-fade-in items-center gap-x-8 gap-y-5 rounded-lg border px-6 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] ${tone.box}`}
      >
        <div className="flex items-start gap-4">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${tone.icon}`}
          >
            <TriangleAlert className="size-5" strokeWidth={2} />
          </span>
          <div>
            <h2 className={`text-lg font-bold tracking-tight ${tone.title}`}>
              {copy.title(label, alert.level)}
              {alert.since !== null && (
                <span className="font-semibold"> {copy.since(readingTime(alert.since))}</span>
              )}
            </h2>
            <p className="mt-0.5 text-[15px] text-navy-900 tabular-nums">
              {copy.now(`${alert.value.toFixed(decimals)} ${unit}`, `${alert.limit} ${unit}`)}
            </p>
          </div>
        </div>

        {alert.finding && (
          <div className="flex items-start gap-3 lg:border-l lg:border-navy-900/10 lg:pl-8">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-navy-700" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
                {copy.recommended}
              </p>
              <p className="mt-0.5 text-[15px] font-semibold text-navy-900">
                {alert.finding.title} – {alert.finding.action.toLowerCase()}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onViewCondition}
            className="inline-flex h-10 items-center rounded-pill border border-navy-900/20 bg-white px-5 text-sm font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
          >
            {copy.viewCondition}
          </button>
          <button
            type="button"
            onClick={onRequestService}
            className="group inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            {assetPage.actions.requestService}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  )
}
