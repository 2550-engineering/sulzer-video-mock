import { FileText } from 'lucide-react'
import { Link } from 'react-router'
import { assetById, customers } from '../../data/assets'
import { requestsPage as copy } from '../../data/selfServicePages'
import { formatDate } from '../../lib/format'
import { useToast } from '../../toast/useToast'
import type { ServiceRequest } from '../../types'

const head = 'border-b border-border bg-surface-sunken px-5 py-3 text-left font-semibold'
const cell = 'border-b border-border px-5 py-3.5 group-last:border-b-0'

type ClosedRequestsTableProps = {
  requests: ServiceRequest[]
  showCustomer: boolean
}

/** Finished requests: reference, service, asset, completion date, technician and service report. */
export function ClosedRequestsTable({ requests, showCustomer }: ClosedRequestsTableProps) {
  const showToast = useToast()
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[48rem] border-separate border-spacing-0 text-[15px]">
        <thead className="text-sm text-navy-900">
          <tr>
            <th scope="col" className={head}>
              {copy.table.reference}
            </th>
            <th scope="col" className={head}>
              {copy.table.service}
            </th>
            <th scope="col" className={head}>
              {copy.table.asset}
            </th>
            {showCustomer && (
              <th scope="col" className={head}>
                {copy.table.customer}
              </th>
            )}
            <th scope="col" className={head}>
              {copy.table.completed}
            </th>
            <th scope="col" className={head}>
              {copy.table.technician}
            </th>
            <th scope="col" className={`${head} text-right`}>
              {copy.table.report}
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const asset = assetById(request.assetId)
            return (
              <tr key={request.id} className="group transition-colors hover:bg-surface-subtle">
                <td className={`${cell} font-semibold text-navy-900 tabular-nums`}>{request.id}</td>
                <td className={cell}>{request.service}</td>
                <td className={cell}>
                  {asset && (
                    <Link
                      to={`/assets/${asset.id}`}
                      className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                    >
                      {asset.tag}
                    </Link>
                  )}
                </td>
                {showCustomer && (
                  <td className={cell}>
                    {customers.find((c) => c.id === request.customerId)?.name}
                  </td>
                )}
                <td className={`${cell} tabular-nums`}>
                  {request.visitDate && formatDate(request.visitDate)}
                </td>
                <td className={cell}>{request.technician}</td>
                <td className={`${cell} text-right`}>
                  {request.workOrder && (
                    <button
                      type="button"
                      onClick={() =>
                        showToast({ message: copy.reportDownloaded(request.workOrder ?? '') })
                      }
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      <FileText className="size-4" />
                      <span className="tabular-nums">{request.workOrder}</span>
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
