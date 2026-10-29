import {
  Activity,
  CalendarCheck,
  ClipboardCheck,
  Gauge,
  Headset,
  HardHat,
  ShieldCheck,
  Waves,
  Wrench,
} from 'lucide-react'
import { products } from '../config/demo'
import type { Service } from '../types'

/*
 * Sulzer services. Listed on the application Products & solutions tab and on
 * product Services tabs. Images go in public/images/services.
 */

export const services: Service[] = [
  {
    id: 'connect-asset-monitoring',
    name: `${products.connect} asset monitoring`,
    summary:
      'Live vibration, temperature and run-time data from every connected pump, with alerts that reach you before a failure does.',
    icon: Activity,
    image: {
      src: '/images/services/connect-asset-monitoring.jpg',
      alt: 'Operator checking live pump data on a tablet in a pump station',
    },
    to: '/connect',
  },
  {
    id: 'remote-expert-support',
    name: 'Remote expert support',
    summary:
      'Share live data with a Sulzer application engineer and get a diagnosis without waiting for a site visit.',
    icon: Headset,
    image: {
      src: '/images/services/remote-expert-support.jpg',
      alt: 'Sulzer engineer on a video call, reviewing pump performance curves',
    },
    to: '/support',
  },
  {
    id: 'commissioning',
    name: 'Commissioning',
    summary:
      'Certified Sulzer technicians check alignment, rotation and duty point so your pumps start right and stay efficient.',
    icon: CalendarCheck,
    image: {
      src: '/images/services/commissioning.jpg',
      alt: 'Technician aligning a pump and motor on a base frame',
    },
    to: '/support/service-portal',
  },
  {
    id: 'inspection',
    name: 'Inspection',
    summary:
      'A structured on-site check of your installed pumps, with a clear report on condition, risks and recommended actions.',
    icon: ClipboardCheck,
    image: {
      src: '/images/services/inspection.jpg',
      alt: 'Service engineer with a checklist inspecting a pump in a pump station',
    },
    to: '/support/service-portal',
  },
  {
    id: 'installation',
    name: 'Installation',
    summary:
      'Leave mechanical and electrical installation to Sulzer crews who know the equipment inside out.',
    icon: HardHat,
    image: {
      src: '/images/services/installation.jpg',
      alt: 'Installation crew lowering a large pump into place with a crane',
    },
    to: '/support/service-portal',
  },
  {
    id: 'vibration-analysis',
    name: 'Vibration analysis',
    summary:
      'Find imbalance, misalignment and bearing wear early with on-site measurements and expert interpretation.',
    icon: Waves,
    image: {
      src: '/images/services/vibration-analysis.jpg',
      alt: 'Vibration sensor being held against a pump bearing housing',
    },
    to: '/support/service-portal',
  },
  {
    id: 'service-agreements',
    name: 'Service agreements',
    summary:
      'Planned maintenance at a fixed annual cost, tailored to how hard your equipment works.',
    icon: ShieldCheck,
    image: {
      src: '/images/services/service-agreements.jpg',
      alt: 'Sulzer service engineer and plant manager shaking hands next to a pump',
    },
    to: '/support/service-portal',
  },
  {
    id: 'repair-overhaul',
    name: 'Repair & overhaul',
    summary:
      'Workshop repairs with genuine Sulzer parts, returning your pump to as-new performance.',
    icon: Wrench,
    image: {
      src: '/images/services/repair-overhaul.jpg',
      alt: 'Sulzer technician restoring a pump part with a laser cladding robot in a service center',
    },
    to: '/support/service-centers',
  },
  {
    id: 'energy-audit',
    name: 'Energy audit',
    summary:
      'Measure how your pumps really run and see where upgrades pay back fastest in energy saved.',
    icon: Gauge,
    image: {
      src: '/images/services/energy-audit.jpg',
      alt: 'Engineer reading a flow meter and power analyser in a pump station',
    },
    to: '/support/service-portal',
  },
]
