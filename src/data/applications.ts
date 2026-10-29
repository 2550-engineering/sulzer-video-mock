import { Handshake, ShoppingCart, Wrench } from 'lucide-react'
import type { Application, HelpCard } from '../types'

/*
 * Application finder tree. The deck demo follows
 * Applications → Municipal water supply → Surface water intake.
 * Every node has two images in public/images/applications:
 * <slug>-hero.jpg (page hero) and <slug>-card.jpg (overview card / category tile).
 */

export const rootApplicationId = 'applications'

/** Hero and card image for a node. `shows` is the alt text and the brief for the photo. */
function images(slug: string, shows: string) {
  return {
    heroImage: { src: `/images/applications/${slug}-hero.jpg`, alt: shows },
    cardImage: { src: `/images/applications/${slug}-card.jpg`, alt: shows },
  }
}

/** "How can we help you?" cards at the end of an application's Explore tab. */
const helpCards: HelpCard[] = [
  {
    title: 'Ready to buy?',
    text: 'Tell us about your project and a Sulzer sales engineer will help you with the next steps.',
    icon: Handshake,
    actionLabel: 'Contact sales',
    to: '/contact/quote',
  },
  {
    title: 'Looking for our eShop?',
    text: 'Order pumps and genuine spare parts online, with your own prices and delivery times.',
    icon: ShoppingCart,
    actionLabel: 'Go to eShop',
    to: '/eshop',
  },
  {
    title: 'Need service?',
    text: 'Book a service visit, request a repair or get remote help from a Sulzer expert.',
    icon: Wrench,
    actionLabel: 'Request service',
    to: '/self-service/requests',
  },
]

export const applications: Application[] = [
  {
    id: rootApplicationId,
    slug: 'applications',
    name: 'Applications',
    parentId: null,
    summary:
      'Choose an application to see how Sulzer helps you design, run and optimise your pumping system.',
    ...images('applications', 'Row of large Sulzer pumps in a bright, modern pump hall'),
    children: [
      'municipal-water-supply',
      'wastewater',
      'water-treatment',
      'energy-transition',
      'fertilizers',
      'mining-metals',
      'pulp-paper',
    ],
  },

  /* ── Municipal water supply ──────────────────────────────────────────────── */
  {
    id: 'municipal-water-supply',
    slug: 'municipal-water-supply',
    name: 'Municipal water supply',
    parentId: rootApplicationId,
    summary: 'Reliable intake, treatment and distribution of clean water, from source to tap.',
    ...images('municipal-water-supply', 'Municipal waterworks next to a river, seen from above'),
    children: [
      'surface-water-intake',
      'groundwater-intake',
      'drinking-water-treatment',
      'water-distribution',
      'desalination',
      'raw-water-transfer',
    ],
  },
  {
    id: 'surface-water-intake',
    slug: 'surface-water-intake',
    name: 'Surface water intake',
    parentId: 'municipal-water-supply',
    summary:
      'Reliable, energy-efficient raw water pumping from rivers, lakes and reservoirs, whatever the season brings.',
    ...images(
      'surface-water-intake',
      'Raw water intake pumping station with large vertical pumps and blue pipework',
    ),
    children: [],
    intro: {
      title: 'Raw water you can count on, whatever the river does',
      text: 'Surface water changes with the seasons – in level, temperature and the sand, silt and debris it carries. Sulzer intake solutions are built for that variation, keeping supply steady while using as little energy as possible.',
      more: [
        'From vertical turbine and split case pumps to monitoring and service, Sulzer covers the whole intake: pumps sized for the duty points you actually run at, low-velocity designs that are gentle on fish and aquatic life, and connected monitoring that flags wear before it puts supply at risk.',
      ],
    },
    knowledgeItemIds: [
      'intake-engineering-manual',
      'expert-video-sump-design',
      'centrifugal-pump-handbook',
      'river-intake-customer-story',
    ],
    helpCards,
    productGroups: [
      {
        id: 'monitoring-connectivity',
        title: 'Monitoring and connectivity',
        productIds: ['sulzer-connect', 'motor-protection-relay'],
      },
      { id: 'vertical-turbine-pumps', title: 'Vertical turbine pumps', productIds: ['sjt'] },
      { id: 'split-case-pumps', title: 'Split case pumps', productIds: ['smd'] },
      {
        id: 'end-suction-pumps',
        title: 'End-suction single-stage pumps',
        productIds: ['ahlstar', 'sns'],
      },
      { id: 'submersible-pumps', title: 'Submersible pumps', productIds: ['xfp'] },
      {
        id: 'digital-services',
        title: 'Digital services',
        serviceIds: ['connect-asset-monitoring', 'remote-expert-support'],
      },
      {
        id: 'operation-services',
        title: 'Operation services',
        serviceIds: ['commissioning', 'inspection', 'installation', 'vibration-analysis'],
      },
    ],
  },
  {
    id: 'groundwater-intake',
    slug: 'groundwater-intake',
    name: 'Groundwater intake',
    parentId: 'municipal-water-supply',
    summary: 'Efficient, low-maintenance pumping from boreholes and well fields.',
    ...images('groundwater-intake', 'Well field with borehole wellheads in green countryside'),
    children: [],
  },
  {
    id: 'drinking-water-treatment',
    slug: 'drinking-water-treatment',
    name: 'Drinking water treatment',
    parentId: 'municipal-water-supply',
    summary: 'Pumps and mixers for every treatment step, from coagulation to filtration.',
    ...images('drinking-water-treatment', 'Open filtration basins in a drinking water plant'),
    children: [],
  },
  {
    id: 'water-distribution',
    slug: 'water-distribution',
    name: 'Water distribution',
    parentId: 'municipal-water-supply',
    summary: 'Stable network pressure at the lowest possible energy cost.',
    ...images('water-distribution', 'Distribution pumping station with a row of horizontal pumps'),
    children: [],
  },
  {
    id: 'desalination',
    slug: 'desalination',
    name: 'Desalination',
    parentId: 'municipal-water-supply',
    summary: 'High-pressure and seawater intake pumps for reverse osmosis plants.',
    ...images('desalination', 'Coastal desalination plant with rows of membrane vessels'),
    children: [],
  },
  {
    id: 'raw-water-transfer',
    slug: 'raw-water-transfer',
    name: 'Raw water transfer',
    parentId: 'municipal-water-supply',
    summary: 'Moving large volumes of raw water over long distances, efficiently.',
    ...images('raw-water-transfer', 'Large raw water pipeline running across open landscape'),
    children: [],
  },

  /* ── Wastewater ──────────────────────────────────────────────────────────── */
  {
    id: 'wastewater',
    slug: 'wastewater',
    name: 'Wastewater',
    parentId: rootApplicationId,
    summary: 'Collection, transport and treatment of municipal wastewater.',
    ...images('wastewater', 'Round clarifier basins at a wastewater treatment plant, from above'),
    children: [
      'wastewater-collection',
      'stormwater-flood-control',
      'wastewater-treatment',
      'sludge-handling',
    ],
  },
  {
    id: 'wastewater-collection',
    slug: 'wastewater-collection',
    name: 'Wastewater collection and transport',
    parentId: 'wastewater',
    summary: 'Clog-resistant pumping for sewer networks and lift stations.',
    ...images(
      'wastewater-collection',
      'Submersible pumps being lifted out of a wastewater lift station',
    ),
    children: [],
  },
  {
    id: 'stormwater-flood-control',
    slug: 'stormwater-flood-control',
    name: 'Stormwater and flood control',
    parentId: 'wastewater',
    summary: 'High-flow pumping that keeps cities dry when the rain comes.',
    ...images('stormwater-flood-control', 'Stormwater pumping station beside a city canal'),
    children: [],
  },
  {
    id: 'wastewater-treatment',
    slug: 'wastewater-treatment',
    name: 'Wastewater treatment',
    parentId: 'wastewater',
    summary: 'Mixing, aeration and pumping for every stage of the treatment plant.',
    ...images('wastewater-treatment', 'Aeration basin with fine bubbles rising to the surface'),
    children: [],
  },
  {
    id: 'sludge-handling',
    slug: 'sludge-handling',
    name: 'Sludge handling',
    parentId: 'wastewater',
    summary: 'Reliable pumping and mixing of thick sludge and digester contents.',
    ...images('sludge-handling', 'Sludge digesters at a wastewater treatment plant'),
    children: [],
  },

  /* ── Water treatment ─────────────────────────────────────────────────────── */
  {
    id: 'water-treatment',
    slug: 'water-treatment',
    name: 'Water treatment',
    parentId: rootApplicationId,
    summary: 'Clean process water and responsible discharge for industry.',
    ...images(
      'water-treatment',
      'Industrial water treatment hall with filters and stainless pipework',
    ),
    children: [
      'industrial-water-supply',
      'industrial-wastewater-treatment',
      'process-water-treatment',
      'cooling-water',
      'boiler-feed-water',
      'reverse-osmosis',
      'ultrafiltration',
      'water-reuse',
    ],
  },
  {
    id: 'industrial-water-supply',
    slug: 'industrial-water-supply',
    name: 'Industrial water supply and transfer',
    parentId: 'water-treatment',
    summary: 'Dependable raw and process water supply for industrial sites.',
    ...images('industrial-water-supply', 'Industrial water intake pumps at a riverside plant'),
    children: [],
  },
  {
    id: 'industrial-wastewater-treatment',
    slug: 'industrial-wastewater-treatment',
    name: 'Industrial wastewater treatment',
    parentId: 'water-treatment',
    summary: 'Treat process effluent so it can be reused or safely discharged.',
    ...images('industrial-wastewater-treatment', 'Effluent treatment tanks at an industrial site'),
    children: [],
  },
  {
    id: 'process-water-treatment',
    slug: 'process-water-treatment',
    name: 'Process water treatment',
    parentId: 'water-treatment',
    summary: 'Water at the exact quality your process needs.',
    ...images('process-water-treatment', 'Process water treatment skid with pumps and filters'),
    children: [],
  },
  {
    id: 'cooling-water',
    slug: 'cooling-water',
    name: 'Cooling water',
    parentId: 'water-treatment',
    summary: 'Efficient circulation for cooling towers and heat exchangers.',
    ...images('cooling-water', 'Industrial cooling towers against a blue sky'),
    children: [],
  },
  {
    id: 'boiler-feed-water',
    slug: 'boiler-feed-water',
    name: 'Boiler feed water',
    parentId: 'water-treatment',
    summary: 'High-pressure feed pumps for steam generation.',
    ...images('boiler-feed-water', 'Multistage boiler feed pumps in a power plant'),
    children: [],
  },
  {
    id: 'reverse-osmosis',
    slug: 'reverse-osmosis',
    name: 'Reverse osmosis',
    parentId: 'water-treatment',
    summary: 'High-pressure pumping for membrane filtration.',
    ...images('reverse-osmosis', 'Racks of reverse osmosis membrane vessels'),
    children: [],
  },
  {
    id: 'ultrafiltration',
    slug: 'ultrafiltration',
    name: 'Ultrafiltration',
    parentId: 'water-treatment',
    summary: 'Gentle, steady feed and backwash for ultrafiltration units.',
    ...images('ultrafiltration', 'Ultrafiltration modules in a water treatment hall'),
    children: [],
  },
  {
    id: 'water-reuse',
    slug: 'water-reuse',
    name: 'Water reuse',
    parentId: 'water-treatment',
    summary: 'Close the loop by treating and reusing process water.',
    ...images('water-reuse', 'Clean treated water flowing out of a reuse plant'),
    children: [],
  },

  /* ── Energy transition ───────────────────────────────────────────────────── */
  {
    id: 'energy-transition',
    slug: 'energy-transition',
    name: 'Energy transition',
    parentId: rootApplicationId,
    summary:
      'Pumps, mixers and services for renewable power, carbon capture, energy storage and sustainable fuels.',
    ...images('energy-transition', 'Aerial views of geothermal springs, forest and a river valley'),
    children: [
      'carbon-capture',
      'biofuels',
      'energy-recovery-storage',
      'concentrated-solar-power',
      'geothermal',
      'wind-power',
      'nuclear-power',
    ],
  },
  {
    id: 'carbon-capture',
    slug: 'carbon-capture',
    name: 'Carbon capture, utilisation and storage',
    parentId: 'energy-transition',
    summary:
      'Separation packings capture CO₂ at the source, and pumps supply the high pressures for capture, transport and injection.',
    ...images(
      'carbon-capture',
      'Carbon capture plant with absorber columns beside an industrial site',
    ),
    children: [],
  },
  {
    id: 'biofuels',
    slug: 'biofuels',
    name: 'Biofuels',
    parentId: 'energy-transition',
    summary:
      'Pumping, mixing and distillation for biofuel production, from pilot plant to commercial scale.',
    ...images('biofuels', 'Biorefinery with storage tanks and distillation columns'),
    children: [],
  },
  {
    id: 'energy-recovery-storage',
    slug: 'energy-recovery-storage',
    name: 'Energy recovery and storage',
    parentId: 'energy-transition',
    summary:
      'Pumps and hydraulic power recovery turbines that store renewable power and recover energy from industrial processes.',
    ...images('energy-recovery-storage', 'Pumped storage reservoir in a mountain landscape'),
    children: [],
  },
  {
    id: 'concentrated-solar-power',
    slug: 'concentrated-solar-power',
    name: 'Concentrated solar power',
    parentId: 'energy-transition',
    summary:
      'Pumps and services for the solar and turbine islands of CSP plants, plus turbine and generator service.',
    ...images('concentrated-solar-power', 'Heliostat field focusing sunlight on a solar tower'),
    children: [],
  },
  {
    id: 'geothermal',
    slug: 'geothermal',
    name: 'Geothermal power',
    parentId: 'energy-transition',
    summary: 'Steam turbine overhaul and repair, plus pumps for the geothermal and power islands.',
    ...images('geothermal', 'Geothermal power plant with steam rising over the landscape'),
    children: [],
  },
  {
    id: 'wind-power',
    slug: 'wind-power',
    name: 'Wind power generation',
    parentId: 'energy-transition',
    summary:
      'Repair and maintenance of generators and other rotating electrical equipment, including in-situ repair.',
    ...images('wind-power', 'Onshore wind farm at sunset'),
    children: [],
  },
  {
    id: 'nuclear-power',
    slug: 'nuclear-power',
    name: 'Nuclear power generation',
    parentId: 'energy-transition',
    summary:
      'Pumps for the nuclear and turbine islands, including safety-related pumps, from single pumps to complete systems.',
    ...images('nuclear-power', 'Nuclear power plant with cooling towers'),
    children: [],
  },

  /* ── Fertilizers ─────────────────────────────────────────────────────────── */
  {
    id: 'fertilizers',
    slug: 'fertilizers',
    name: 'Fertilizers',
    parentId: rootApplicationId,
    summary:
      'Pumps, mixers and agitators for phosphate, potash, ammonia and NPK fertilizer production.',
    ...images('fertilizers', 'Close-up of a backlit green leaf'),
    children: [
      'ammonia-urea-fertilizers',
      'phosphate-fertilizers',
      'potash-fertilizers',
      'npk-fertilizers',
      'fertilizer-plant-water',
    ],
  },
  {
    id: 'ammonia-urea-fertilizers',
    slug: 'ammonia-urea-fertilizers',
    name: 'Ammonia and urea fertilizers',
    parentId: 'fertilizers',
    summary:
      'Pumping and mixing for ammonia and urea plants, built for high pressures and temperatures.',
    ...images('ammonia-urea-fertilizers', 'Ammonia and urea plant with prilling tower'),
    children: [],
  },
  {
    id: 'phosphate-fertilizers',
    slug: 'phosphate-fertilizers',
    name: 'Phosphate fertilizers',
    parentId: 'fertilizers',
    summary:
      'Slurry pumps, heavy-duty agitators and phosphoric acid plant equipment, from mine to MAP and DAP.',
    ...images('phosphate-fertilizers', 'Phosphoric acid plant with reactors and evaporators'),
    children: [],
  },
  {
    id: 'potash-fertilizers',
    slug: 'potash-fertilizers',
    name: 'Potash fertilizers',
    parentId: 'fertilizers',
    summary:
      'Brine intake and transfer, tailings pumps and heavy-duty flotation agitators for potash production.',
    ...images('potash-fertilizers', 'Potash flotation cells in a processing plant'),
    children: [],
  },
  {
    id: 'npk-fertilizers',
    slug: 'npk-fertilizers',
    name: 'NPK fertilizers',
    parentId: 'fertilizers',
    summary:
      'Reliable pumping of the acids, slurries and melts that go into compound NPK fertilizers.',
    ...images('npk-fertilizers', 'Granulation drum in an NPK fertilizer plant'),
    children: [],
  },
  {
    id: 'fertilizer-plant-water',
    slug: 'fertilizer-plant-water',
    name: 'Water in fertilizer complexes',
    parentId: 'fertilizers',
    summary:
      'Intake, cooling, process water and effluent treatment across the whole fertilizer site.',
    ...images('fertilizer-plant-water', 'Water treatment basins at a fertilizer complex'),
    children: [],
  },

  /* ── Mining and metals ───────────────────────────────────────────────────── */
  {
    id: 'mining-metals',
    slug: 'mining-metals',
    name: 'Mining and metals',
    parentId: rootApplicationId,
    summary:
      'Dewatering, slurry and process pumping for mines and metal producers, built for abrasive and corrosive liquids.',
    ...images(
      'mining-metals',
      'Aerial view of a bucket-wheel stacker loading ore by a railway line',
    ),
    children: [
      'open-pit-dewatering',
      'underground-dewatering',
      'ore-separation',
      'electrowinning',
      'tailings-water-reclamation',
      'metals-processing',
    ],
  },
  {
    id: 'open-pit-dewatering',
    slug: 'open-pit-dewatering',
    name: 'Open pit mine dewatering',
    parentId: 'mining-metals',
    summary: 'Light, robust submersible pumps and high-lift pumps that keep surface pits dry.',
    ...images('open-pit-dewatering', 'Dewatering pump at the bottom of an open-pit mine'),
    children: [],
  },
  {
    id: 'underground-dewatering',
    slug: 'underground-dewatering',
    name: 'Underground mine dewatering',
    parentId: 'mining-metals',
    summary: 'Drainage and high-head pumps that lift water from deep underground workings.',
    ...images(
      'underground-dewatering',
      'Submersible dewatering pump in an underground mine tunnel',
    ),
    children: [],
  },
  {
    id: 'ore-separation',
    slug: 'ore-separation',
    name: 'Ore separation',
    parentId: 'mining-metals',
    summary: 'Slurry pumps and agitators for grinding, flotation and leaching circuits.',
    ...images('ore-separation', 'Flotation cells in a mineral processing plant'),
    children: [],
  },
  {
    id: 'electrowinning',
    slug: 'electrowinning',
    name: 'Electrowinning',
    parentId: 'mining-metals',
    summary: 'Corrosion-resistant pumps for the acidic electrolytes of metal recovery.',
    ...images('electrowinning', 'Electrowinning cell house with rows of cathode plates'),
    children: [],
  },
  {
    id: 'tailings-water-reclamation',
    slug: 'tailings-water-reclamation',
    name: 'Tailings ponds and water reclamation',
    parentId: 'mining-metals',
    summary: 'Pumping tailings and reclaiming process water to cut fresh water use.',
    ...images('tailings-water-reclamation', 'Tailings pond with a floating reclaim pump barge'),
    children: [],
  },
  {
    id: 'metals-processing',
    slug: 'metals-processing',
    name: 'Metals processing',
    parentId: 'mining-metals',
    summary:
      'Pumping and mixing for corrosive and abrasive liquids in steel, aluminium, copper, nickel, zinc and lithium production.',
    ...images(
      'metals-processing',
      'Hydrometallurgical plant with acid-resistant pumps and pipework',
    ),
    children: [],
  },

  /* ── Pulp & paper ────────────────────────────────────────────────────────── */
  {
    id: 'pulp-paper',
    slug: 'pulp-paper',
    name: 'Pulp & paper',
    parentId: rootApplicationId,
    summary: 'Pumps and mixers for every step of pulp, paper and board production.',
    ...images('pulp-paper', 'Paper machine running at speed in a paper mill'),
    children: [
      'stock-preparation',
      'pulp-bleaching',
      'chemical-recovery',
      'paper-machine-approach',
    ],
  },
  {
    id: 'stock-preparation',
    slug: 'stock-preparation',
    name: 'Stock preparation',
    parentId: 'pulp-paper',
    summary: 'Pumping and mixing pulp suspensions at high consistency.',
    ...images('stock-preparation', 'Stock preparation area with pulp chests and pumps'),
    children: [],
  },
  {
    id: 'pulp-bleaching',
    slug: 'pulp-bleaching',
    name: 'Pulp bleaching',
    parentId: 'pulp-paper',
    summary: 'Medium-consistency pumping and chemical mixing for bleaching.',
    ...images('pulp-bleaching', 'Bleaching towers at a pulp mill'),
    children: [],
  },
  {
    id: 'chemical-recovery',
    slug: 'chemical-recovery',
    name: 'Chemical recovery',
    parentId: 'pulp-paper',
    summary: 'Reliable pumping of liquors through the recovery cycle.',
    ...images('chemical-recovery', 'Recovery boiler building at a pulp mill'),
    children: [],
  },
  {
    id: 'paper-machine-approach',
    slug: 'paper-machine-approach',
    name: 'Paper machine approach',
    parentId: 'pulp-paper',
    summary: 'Pulsation-free feed to the headbox for an even sheet.',
    ...images('paper-machine-approach', 'Fan pump feeding the headbox of a paper machine'),
    children: [],
  },
]
