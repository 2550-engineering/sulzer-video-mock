import {
  CalendarCheck,
  Cog,
  Droplets,
  Gauge,
  Recycle,
  ShieldCheck,
  Wrench,
  Zap,
} from 'lucide-react'
import { products as productNames } from '../config/demo'
import type { Product } from '../types'

/*
 * Product catalogue. Names come from config/demo.ts.
 * Image files go in _asset-source/images under the names below.
 */

export const products: Product[] = [
  {
    id: 'end-suction-pump',
    name: productNames.mainEndSuctionPump,
    family: 'Long-coupled, single-stage',
    category: 'End suction pumps',
    applications: [
      'surface-water-intake',
      'groundwater-intake',
      'water-distribution',
      'industrial-processes',
    ],
    summary:
      'Robust end suction pump to EN 733 for clean and slightly contaminated water, with best-in-class efficiency across a wide operating range.',
    keySpecs: {
      liquidTemp: '-20 .. 140 °C',
      maxFlow: '1 400 m³/h',
      maxHead: '160 m',
      maxPressure: '16 bar',
    },
    images: [
      {
        file: 'product-end-suction-pump.png',
        alt: `${productNames.mainEndSuctionPump} on base frame with motor`,
        tone: 'steel',
      },
    ],
    tabs: {
      explore: {
        title: 'Efficient, reliable water pumping',
        text: 'Optimised hydraulics and a back pull-out design make this the go-to pump for water supply, distribution and general industry. Service it without disturbing the pipework, and run it for years at peak efficiency.',
        highlights: [
          {
            label: 'High efficiency',
            text: 'Hydraulics tuned for low energy use at real-world duty points.',
            icon: Zap,
          },
          {
            label: 'Back pull-out design',
            text: 'Remove the rotating unit without touching the pipework.',
            icon: Wrench,
          },
          {
            label: 'Standardised',
            text: 'EN 733 dimensions make replacing an existing pump simple.',
            icon: Cog,
          },
        ],
      },
      services: [
        {
          label: 'Commissioning',
          text: 'Start-up and alignment by certified Sulzer technicians.',
          icon: CalendarCheck,
        },
        {
          label: 'Service agreements',
          text: 'Planned maintenance at a fixed annual cost.',
          icon: ShieldCheck,
        },
        {
          label: 'Condition monitoring',
          text: `Track vibration and temperature with ${productNames.iotOffering}.`,
          icon: Gauge,
        },
      ],
    },
  },
  {
    id: 'submersible-wastewater-pump',
    name: productNames.submersiblePump,
    family: 'Submersible, non-clogging',
    category: 'Submersible pumps',
    applications: ['wastewater', 'building-services', 'industrial-processes'],
    summary:
      'Heavy-duty submersible pump for raw sewage and wastewater, with a clog-resistant impeller and premium-efficiency motor.',
    keySpecs: {
      liquidTemp: '0 .. 40 °C',
      maxFlow: '2 700 m³/h',
      maxHead: '75 m',
      maxPressure: '10 bar',
    },
    images: [
      {
        file: 'product-submersible-pump.png',
        alt: productNames.submersiblePump,
        tone: 'slate',
      },
    ],
    tabs: {
      explore: {
        title: 'Built for tough wastewater',
        text: 'Wipes, rags and fibres pass straight through the clog-resistant impeller, so the pump keeps running where others stop. A premium-efficiency motor keeps energy costs down.',
        highlights: [
          {
            label: 'Clog-resistant',
            text: 'Self-cleaning impeller handles modern wastewater.',
            icon: Recycle,
          },
          {
            label: 'Premium efficiency',
            text: 'IE3-equivalent motor with high hydraulic efficiency.',
            icon: Zap,
          },
          {
            label: 'Sealed for life',
            text: 'Double mechanical seals protect the motor from ingress.',
            icon: Droplets,
          },
        ],
      },
      services: [
        {
          label: 'Pump station audits',
          text: 'Find energy savings and reliability risks in your network.',
          icon: Gauge,
        },
        {
          label: 'Repair & overhaul',
          text: 'Workshop repairs with genuine Sulzer parts.',
          icon: Wrench,
        },
        {
          label: 'Service agreements',
          text: 'Planned maintenance at a fixed annual cost.',
          icon: ShieldCheck,
        },
      ],
    },
  },
]
