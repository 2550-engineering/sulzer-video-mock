import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { serviceCentre } from '../../config/demo'
import { variantPage } from '../../data/variantPages'
import { Modal } from '../Modal'

const copy = variantPage.whereToBuy

type WhereToBuyDialogProps = {
  open: boolean
  onClose: () => void
  /** "Request a quotation": closes and opens the Quotation tab. */
  onRequestQuote: () => void
}

/** The nearest (fictional) Sulzer service centre for the demo user's market. */
export function WhereToBuyDialog({ open, onClose, onRequestQuote }: WhereToBuyDialogProps) {
  const row = 'flex gap-3'
  const icon = 'mt-0.5 size-4 shrink-0 text-primary'
  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-lg"
    >
      <div className="px-7 py-6">
        <p className="text-sm text-text-muted">{copy.intro}</p>
        <p className="mt-3 text-xl font-bold tracking-tight text-navy-900">{serviceCentre.name}</p>
        <p className="text-sm text-text-muted">{copy.distance(serviceCentre.distance)}</p>

        <ul className="mt-5 space-y-3 text-[15px] text-text">
          <li className={row}>
            <MapPin className={icon} />
            <span>
              {serviceCentre.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </li>
          <li className={row}>
            <Phone className={icon} />
            <span>
              <span className="sr-only">{copy.phone}: </span>
              <a
                href={`tel:${serviceCentre.phone.replace(/\s/g, '')}`}
                className="font-semibold text-primary hover:underline"
              >
                {serviceCentre.phone}
              </a>
            </span>
          </li>
          <li className={row}>
            <Mail className={icon} />
            <span>
              <span className="sr-only">{copy.email}: </span>
              <a
                href={`mailto:${serviceCentre.email}`}
                className="font-semibold text-primary hover:underline"
              >
                {serviceCentre.email}
              </a>
            </span>
          </li>
          <li className={row}>
            <Clock className={icon} />
            <span>
              <span className="sr-only">{copy.hours}: </span>
              {serviceCentre.hours}
            </span>
          </li>
        </ul>

        <p className="mt-6 text-sm font-semibold text-navy-900">{copy.offers}</p>
        <ul className="mt-2 space-y-1 pl-5 text-[15px] text-text [list-style:disc] marker:text-primary">
          {serviceCentre.services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={onRequestQuote}
            className="inline-flex h-11 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            {copy.contact}
          </button>
        </div>
      </div>
    </Modal>
  )
}
