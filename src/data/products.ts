import {
  Activity,
  ArrowDownToLine,
  Bell,
  BrainCircuit,
  Cable,
  ChartLine,
  Cog,
  Cpu,
  Droplets,
  Gauge,
  Layers,
  Leaf,
  Mountain,
  Recycle,
  Ruler,
  ShieldCheck,
  Smartphone,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react'
import { products as productNames } from '../config/demo'
import type { Product } from '../types'

/*
 * Product catalogue. Names come from config/demo.ts. Main images go in
 * public/images/products as <id>-main.png (cut-out on white or transparent).
 * Spec values are placeholders — see docs/content-to-confirm.md.
 */

export const products: Product[] = [
  {
    id: 'ahlstar',
    name: productNames.ahlstar,
    family: 'End-suction single-stage',
    category: 'End suction pumps',
    applications: [
      'surface-water-intake',
      'raw-water-transfer',
      'industrial-water-supply',
      'process-liquid-transfer',
      'stock-preparation',
    ],
    summary:
      'Versatile end-suction pump for clean and slightly contaminated liquids, with high efficiency across a wide operating range and a back pull-out design for fast service.',
    standard: 'Process pumps according to ISO 2858 / ISO 5199',
    keySpecs: {
      liquidTemp: '-40 .. 180 °C',
      maxFlow: '5 000 m³/h',
      maxHead: '160 m',
      maxPressure: '25 bar',
    },
    images: [
      {
        src: '/images/products/ahlstar-main.png',
        alt: `${productNames.ahlstar} end-suction pump on base frame with motor`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'One pump range, hundreds of duties',
          text: 'Optimised hydraulics, a wide choice of materials and a back pull-out design make this the go-to pump for water intake, transfer and general process duty. Service it without disturbing the pipework, and run it for years at peak efficiency.',
          more: [
            'The range shares a small set of bearing units, shaft seals and wear parts across dozens of sizes. That keeps your spare part stock small, makes maintenance predictable and lets one trained team look after every pump on site.',
          ],
        },
        feature: {
          title: 'High efficiency',
          text: 'Hydraulics designed for the duty points you actually run at, matched with premium-efficiency motors, keep energy use – the biggest share of a pump’s lifetime cost – as low as possible.',
          image: {
            src: '/images/products/ahlstar-feature.png',
            alt: `Two ${productNames.ahlstar} pumps side by side, one with the motor fitted`,
          },
        },
        highlights: [
          {
            label: 'Robust design',
            text: 'Heavy-duty casing and bearing unit built for continuous, around-the-clock operation.',
            icon: ShieldCheck,
          },
          {
            label: 'Sealing options',
            text: 'Packing, single or double mechanical seals – chosen to suit your liquid and site.',
            icon: Cog,
          },
          {
            label: 'Easy maintenance',
            text: 'Back pull-out design: lift out the rotating unit without touching the pipework.',
            icon: Wrench,
          },
        ],
        promo: {
          title: 'Fast delivery programme – the right pump, in weeks',
          text: 'Hundreds of the most popular AHLSTAR configurations are built from stock components, so they leave our factory fast and get your plant running again sooner. Download the brochure to see which models are included.',
          actionLabel: 'Download brochure',
          to: '/support/documentation',
          badge: { ring: 'Fast delivery programme', value: '2 weeks', caption: 'from order' },
        },
        storyIds: ['story-river-intake', 'story-paper-mill', 'story-desalination'],
      },
    },
    serviceIds: [
      'commissioning',
      'inspection',
      'vibration-analysis',
      'repair-overhaul',
      'service-agreements',
      'connect-asset-monitoring',
    ],
  },
  {
    id: 'sns',
    name: productNames.sns,
    family: 'End-suction single-stage',
    category: 'End suction pumps',
    applications: ['surface-water-intake', 'water-distribution', 'water-pressure-boosting'],
    summary:
      'Compact end-suction pump for clean water supply, irrigation and building services, built to standard dimensions for easy replacement.',
    keySpecs: {
      liquidTemp: '-20 .. 120 °C',
      maxFlow: '1 400 m³/h',
      maxHead: '150 m',
      maxPressure: '16 bar',
    },
    images: [
      {
        src: '/images/products/sns-main.png',
        alt: `${productNames.sns} compact end-suction pump with motor`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'Clean water, simply pumped',
          text: 'A compact, standardised pump for clean water duties, with high efficiency, a small footprint and parts that are easy to find.',
          more: [],
        },
        highlights: [
          {
            label: 'Standard dimensions',
            text: 'Drops into existing installations without pipework changes.',
            icon: Ruler,
          },
          {
            label: 'Efficient',
            text: 'Premium-efficiency motors and optimised impellers.',
            icon: Zap,
          },
          {
            label: 'Easy to service',
            text: 'Few parts and good access keep maintenance short.',
            icon: Wrench,
          },
        ],
      },
    },
    serviceIds: ['commissioning', 'service-agreements', 'repair-overhaul'],
  },
  {
    id: 'smd',
    name: productNames.smd,
    family: 'Axially split, double-suction',
    category: 'Split case pumps',
    applications: [
      'surface-water-intake',
      'raw-water-transfer',
      'water-distribution',
      'cooling-water',
    ],
    summary:
      'Axially split, double-suction pump for large water flows, with high efficiency and low NPSH requirements for long, trouble-free service.',
    keySpecs: {
      liquidTemp: '0 .. 120 °C',
      maxFlow: '12 000 m³/h',
      maxHead: '200 m',
      maxPressure: '25 bar',
    },
    images: [
      {
        src: '/images/products/smd-main.png',
        alt: `${productNames.smd} axially split double-suction pump`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'Big flows, low running costs',
          text: 'The double-suction impeller balances axial forces and keeps NPSH requirements low, while the axially split casing gives full access to the rotor without disconnecting the pipework.',
          more: [],
        },
        highlights: [
          {
            label: 'Low NPSH',
            text: 'Double-suction impeller for demanding suction conditions.',
            icon: ArrowDownToLine,
          },
          {
            label: 'Easy access',
            text: 'Lift the upper casing half to reach the rotor.',
            icon: Layers,
          },
          {
            label: 'High efficiency',
            text: 'Large-pump efficiency where energy costs matter most.',
            icon: Zap,
          },
        ],
      },
    },
    serviceIds: ['installation', 'vibration-analysis', 'energy-audit'],
  },
  {
    id: 'sjt',
    name: productNames.sjt,
    family: 'Vertical turbine',
    category: 'Vertical turbine pumps',
    applications: ['surface-water-intake', 'cooling-water', 'stormwater-flood-control'],
    summary:
      'Vertical turbine pump for intakes, cooling water and flood control, with the motor above the water and the bowl assembly deep in the sump.',
    keySpecs: {
      liquidTemp: '0 .. 60 °C',
      maxFlow: '15 000 m³/h',
      maxHead: '120 m',
      maxPressure: '16 bar',
    },
    images: [
      {
        src: '/images/products/sjt-main.png',
        alt: `${productNames.sjt} vertical turbine pump with column and motor head`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'Built for the intake sump',
          text: 'With the motor safely above water and the pump bowls deep in the sump, vertical turbine pumps handle changing water levels with a small footprint at ground level.',
          more: [],
        },
        highlights: [
          {
            label: 'Handles level swings',
            text: 'Column length matched to your lowest water level.',
            icon: Droplets,
          },
          {
            label: 'Small footprint',
            text: 'Only the motor and discharge head take floor space.',
            icon: Layers,
          },
          {
            label: 'Long service life',
            text: 'Wear-resistant materials for water carrying sand and silt.',
            icon: ShieldCheck,
          },
        ],
      },
    },
    serviceIds: ['installation', 'inspection', 'vibration-analysis'],
  },
  {
    id: 'xfp',
    name: productNames.xfp,
    family: 'Submersible, non-clogging',
    category: 'Submersible pumps',
    applications: [
      'surface-water-intake',
      'wastewater-collection',
      'stormwater-flood-control',
      'building-drainage',
    ],
    summary:
      'Heavy-duty submersible pump for raw water, sewage and stormwater, with a clog-resistant impeller and premium-efficiency motor.',
    keySpecs: {
      liquidTemp: '0 .. 40 °C',
      maxFlow: '2 700 m³/h',
      maxHead: '75 m',
      maxPressure: '10 bar',
    },
    images: [
      {
        src: '/images/products/xfp-main.png',
        alt: `${productNames.xfp} submersible pump`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'Keeps running where others stop',
          text: 'Debris, rags and fibres pass straight through the clog-resistant impeller, so the pump keeps running in raw water and sewage alike. A premium-efficiency motor keeps energy costs down.',
          more: [],
        },
        highlights: [
          {
            label: 'Clog-resistant',
            text: 'Self-cleaning impeller handles debris and fibres.',
            icon: Recycle,
          },
          {
            label: 'Premium efficiency',
            text: 'High-efficiency motor and hydraulics.',
            icon: Zap,
          },
          {
            label: 'Sealed for life',
            text: 'Double mechanical seals protect the motor from water.',
            icon: Droplets,
          },
        ],
      },
    },
    serviceIds: ['energy-audit', 'repair-overhaul', 'service-agreements'],
  },
  {
    id: 'sulzer-connect',
    name: productNames.connect,
    viewTo: '/connect',
    family: 'IoT monitoring',
    category: 'Monitoring and connectivity',
    applications: ['surface-water-intake', 'wastewater-collection', 'process-liquid-transfer'],
    summary:
      'Wireless sensors and a cloud dashboard that turn every pump into a connected asset, with live condition data and early warnings.',
    images: [
      {
        src: '/images/products/sulzer-connect-main.png',
        alt: `${productNames.connect} wireless sensor and gateway`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'See every pump, from anywhere',
          text: 'Clip-on sensors measure vibration and temperature, and the gateway sends the data to a dashboard your whole team can use – no changes to the pump needed.',
          more: [],
        },
        highlights: [
          {
            label: 'Live condition data',
            text: 'Vibration, temperature and run time for each asset.',
            icon: Activity,
          },
          {
            label: 'Early warnings',
            text: 'Alerts when readings drift, before a failure.',
            icon: Bell,
          },
          {
            label: 'Fits any pump',
            text: 'Retrofit to Sulzer and other brands alike.',
            icon: Cable,
          },
        ],
      },
    },
    serviceIds: ['connect-asset-monitoring', 'remote-expert-support'],
  },
  {
    id: 'motor-protection-relay',
    name: productNames.motorProtectionRelay,
    family: 'Motor protection',
    category: 'Monitoring and connectivity',
    applications: ['surface-water-intake', 'wastewater-collection'],
    summary:
      'Protects pump motors against overload, phase loss and dry running, and reports every trip to your control system.',
    images: [
      {
        src: '/images/products/motor-protection-relay-main.png',
        alt: 'DIN-rail motor protection relay with display',
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'Stop small faults becoming big repairs',
          text: 'The relay watches motor current and voltage continuously and trips before damage is done, then tells you why.',
          more: [],
        },
        highlights: [
          {
            label: 'Full protection',
            text: 'Overload, phase loss, imbalance and dry running.',
            icon: ShieldCheck,
          },
          {
            label: 'Clear diagnostics',
            text: 'Trip cause and history on the display.',
            icon: Gauge,
          },
          {
            label: 'Connects to SCADA',
            text: 'Standard fieldbus for your control system.',
            icon: Cable,
          },
        ],
      },
    },
    serviceIds: ['commissioning', 'remote-expert-support'],
  },
  {
    id: 'sjm',
    name: productNames.sjm,
    family: 'Vertical mixed-flow',
    category: 'Axial and mixed flow pumps',
    applications: ['raw-water-transfer', 'cooling-water', 'stormwater-flood-control'],
    summary:
      'Vertical mixed-flow pump for very large flows at low to medium head, from raw water transfer to cooling water and flood protection.',
    keySpecs: {
      liquidTemp: '0 .. 50 °C',
      maxFlow: '30 000 m³/h',
      maxHead: '60 m',
      maxPressure: '10 bar',
    },
    images: [
      {
        src: '/images/products/sjm-main.png',
        alt: `${productNames.sjm} vertical mixed-flow pump with discharge head and motor`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'Large volumes, small footprint',
          text: 'Mixed-flow hydraulics move very large volumes with a small footprint, so one station can do the work of many smaller pumps.',
          more: [],
        },
        highlights: [
          {
            label: 'Very large flows',
            text: 'Mixed-flow bowls sized to your station.',
            icon: Droplets,
          },
          {
            label: 'Compact station',
            text: 'Vertical layout keeps the building small.',
            icon: Layers,
          },
          {
            label: 'Efficient at part load',
            text: 'Flat efficiency curve when levels and demand change.',
            icon: Zap,
          },
        ],
      },
    },
    serviceIds: ['installation', 'inspection', 'energy-audit'],
  },
  {
    id: 'afp',
    name: productNames.afp,
    family: 'Submersible, solids-handling',
    category: 'Submersible pumps',
    applications: ['wastewater-collection', 'stormwater-flood-control', 'building-wastewater'],
    summary:
      'Submersible sewage pump for municipal and building wastewater, with a solids-handling impeller and a compact, cooling-jacket-free design.',
    keySpecs: {
      liquidTemp: '0 .. 40 °C',
      maxFlow: '1 200 m³/h',
      maxHead: '60 m',
      maxPressure: '6 bar',
    },
    images: [
      {
        src: '/images/products/afp-main.png',
        alt: `${productNames.afp} submersible sewage pump`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'Wastewater, handled',
          text: 'A solids-handling impeller and a sealed premium-efficiency motor keep sewage moving in pump stations of every size.',
          more: [],
        },
        highlights: [
          {
            label: 'Solids-handling',
            text: 'Free passage for the solids found in sewage.',
            icon: Recycle,
          },
          {
            label: 'Efficient motor',
            text: 'Premium-efficiency motor, sealed against water.',
            icon: Zap,
          },
          {
            label: 'Easy to lift out',
            text: 'Guide rail installation for quick service.',
            icon: Wrench,
          },
        ],
      },
    },
    serviceIds: ['service-agreements', 'repair-overhaul', 'connect-asset-monitoring'],
  },
  {
    id: 'j-dewatering',
    name: productNames.jDewatering,
    family: 'Submersible dewatering',
    category: 'Dewatering pumps',
    applications: ['mine-dewatering', 'building-drainage', 'stormwater-flood-control'],
    summary:
      'Portable submersible pump for construction sites, mines and emergency drainage, light enough to move by hand and tough enough for abrasive water.',
    keySpecs: {
      liquidTemp: '0 .. 40 °C',
      maxFlow: '600 m³/h',
      maxHead: '110 m',
      maxPressure: '11 bar',
    },
    images: [
      {
        src: '/images/products/j-dewatering-main.png',
        alt: `${productNames.jDewatering}, portable submersible pump with lifting handle`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'Dry ground, fast',
          text: 'Drop it in, plug it in and start pumping. Hard-wearing parts keep it running in water full of sand and grit.',
          more: [],
        },
        highlights: [
          {
            label: 'Portable',
            text: 'Light enough to move around site.',
            icon: Truck,
          },
          {
            label: 'Wear-resistant',
            text: 'Hard-metal wear parts for abrasive water.',
            icon: Mountain,
          },
          {
            label: 'Runs dry safely',
            text: 'Motor protection against overheating.',
            icon: ShieldCheck,
          },
        ],
      },
    },
    serviceIds: ['repair-overhaul', 'service-agreements'],
  },
  {
    id: 'pump-controller',
    name: productNames.pumpController,
    family: 'Pump control',
    category: 'Monitoring and connectivity',
    applications: ['wastewater-collection', 'building-wastewater', 'stormwater-flood-control'],
    summary:
      'Level-based controller for pump stations: starts, stops and alternates pumps, logs every run and sends alarms to your phone or SCADA.',
    images: [
      {
        src: '/images/products/pump-controller-main.png',
        alt: `${productNames.pumpController} with display, in a control cabinet`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'The brain of the pump station',
          text: 'The controller runs the station on level, shares the load between pumps and tells you as soon as something needs attention.',
          more: [],
        },
        highlights: [
          {
            label: 'Smart pump control',
            text: 'Level control, alternation and pipe cleaning.',
            icon: Cpu,
          },
          {
            label: 'Alarms anywhere',
            text: 'Text messages and SCADA alarms.',
            icon: Smartphone,
          },
          {
            label: 'Energy saving',
            text: 'Runs pumps at their most efficient points.',
            icon: Leaf,
          },
        ],
      },
    },
    serviceIds: ['commissioning', 'remote-expert-support'],
  },
  {
    id: 'blue-box',
    name: productNames.blueBox,
    family: 'Process analytics',
    category: 'Digital solutions',
    applications: ['wastewater-treatment', 'industrial-wastewater-treatment', 'water-reuse'],
    summary:
      'Analytics software for wastewater treatment plants that uses the data you already collect to optimise aeration and cut energy use.',
    images: [
      {
        src: '/images/products/blue-box-main.png',
        alt: `${productNames.blueBox} dashboard on a laptop in a treatment plant control room`,
      },
    ],
    tabs: {
      explore: {
        intro: {
          title: 'Your plant data, put to work',
          text: 'Models trained on your own plant predict load and adjust aeration in real time, so you use the energy the process needs and no more.',
          more: [],
        },
        highlights: [
          {
            label: 'Predictive control',
            text: 'Learns how your plant behaves.',
            icon: BrainCircuit,
          },
          {
            label: 'Lower energy use',
            text: 'Aeration matched to the real load.',
            icon: Leaf,
          },
          {
            label: 'Clear reporting',
            text: 'Savings and process KPIs at a glance.',
            icon: ChartLine,
          },
        ],
      },
    },
    serviceIds: ['remote-expert-support', 'energy-audit'],
  },
]
