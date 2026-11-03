import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { siteById } from '../../data/assets'
import { replacementPage } from '../../data/replacement'
import { getProduct } from '../../lib/catalog'
import { formatDate, groupThousands } from '../../lib/format'
import { energyPerYear, type ExistingPump } from '../../lib/replacement'
import { ProductThumb } from '../ProductThumb'

const copy = replacementPage.existing

/** "Your pump today": what it is, where it runs and what it uses. */
export function ExistingPumpCard({ existing }: { existing: ExistingPump }) {
  const { asset, model, operation, connection } = existing
  const site = asset && siteById(asset.siteId)
  const product = getProduct(asset?.productId ?? model?.productId ?? '')
  const source =
    existing.kind === 'asset'
      ? copy.fromSerial(asset!.serialNumber)
      : existing.kind === 'type'
        ? copy.fromType
        : copy.otherBrand

  const rows: [string, string, string?][] = [
    ...(site ? [[copy.site, site.name] as [string, string]] : []),
    ...(asset
      ? ([
          [copy.installed, formatDate(asset.installedOn)],
          [copy.runHours, `${groupThousands(asset.runHours)} h`],
        ] as [string, string][])
      : []),
    ...(operation
      ? ([
          [
            copy.dutyPoint,
            copy.dutyValue(
              groupThousands(operation.duty.flow),
              groupThousands(operation.duty.head),
            ),
            copy.dutySource[operation.dutySource],
          ],
          ...(operation.pumpHead > operation.duty.head + 0.5
            ? [
                [
                  copy.pumpHead,
                  `${groupThousands(operation.pumpHead, 1)} m`,
                  copy.throttled(groupThousands(operation.pumpHead - operation.duty.head, 1)),
                ],
              ]
            : []),
          ...(operation.bepRatio !== undefined
            ? [[copy.bep, `${Math.round(operation.bepRatio * 100)} %`]]
            : []),
          [copy.efficiency, `${groupThousands(operation.efficiency, 1)} %`],
          [copy.power, `${groupThousands(operation.p1, 1)} kW`],
          [
            copy.energy,
            `${groupThousands(Math.round(energyPerYear(operation.p1) / 100) * 100)} kWh`,
          ],
        ] as [string, string, string?][])
      : []),
    ...(connection?.suction
      ? [
          [copy.connections, copy.connectionValue(connection.suction, connection.discharge)] as [
            string,
            string,
          ],
        ]
      : []),
    ...(model
      ? [[copy.motor, `${model.power} kW · ${groupThousands(model.speed)} rpm`] as [string, string]]
      : []),
  ]

  return (
    <section className="flex h-full flex-col rounded-lg border border-border bg-white">
      <div className="flex items-center gap-4 border-b border-border px-6 py-5">
        {product && <ProductThumb product={product} />}
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
            {copy.title}
          </p>
          <h2 className="mt-0.5 truncate text-xl font-bold tracking-tight text-navy-900">
            {asset ? `${asset.tag} · ${existing.name}` : existing.name}
          </h2>
          <p className="text-sm text-text-muted tabular-nums">{source}</p>
        </div>
      </div>
      <dl className="flex-1 divide-y divide-border px-6 text-[15px]">
        {rows.map(([label, value, note]) => (
          <div key={label} className="flex justify-between gap-4 py-2.5">
            <dt className="text-text-muted">{label}</dt>
            <dd className="text-right">
              <span className="font-semibold text-navy-900 tabular-nums">{value}</span>
              {note && <span className="block text-xs text-text-muted">{note}</span>}
            </dd>
          </div>
        ))}
      </dl>
      {asset && (
        <div className="border-t border-border px-6 py-3.5">
          <Link
            to={`/assets/${asset.id}`}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            {copy.viewAsset}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </section>
  )
}
