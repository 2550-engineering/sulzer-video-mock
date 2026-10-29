import { Handshake, ShoppingCart, Wrench } from 'lucide-react'
import type { Application, HelpCard } from '../types'

/*
 * Application finder tree. The deck demo follows
 * Applications → Municipal water supply → Surface water intake.
 * Every node has two images in public/images/applications:
 * <slug>-hero.jpg (page hero) and <slug>-card.jpg (overview card / category tile).
 */

export const rootApplicationId = 'applications'

/** Hero and card image for a node. `shows` is the alt text; `cardShows` when the card is a different photo. */
function images(slug: string, shows: string, cardShows = shows) {
  return {
    heroImage: { src: `/images/applications/${slug}-hero.jpg`, alt: shows },
    cardImage: { src: `/images/applications/${slug}-card.jpg`, alt: cardShows },
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
    ...images('applications', 'Range of Sulzer AHLSTAR process pumps on display in a bright hall'),
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
    ...images(
      'municipal-water-supply',
      'Clarifier at a municipal water treatment plant under a blue sky',
    ),
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
    ...images('surface-water-intake', 'Raw water intake tower on a lake between forested hills'),
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
    ...images('groundwater-intake', 'Well pump discharging groundwater into an irrigation canal'),
    children: [],
  },
  {
    id: 'drinking-water-treatment',
    slug: 'drinking-water-treatment',
    name: 'Drinking water treatment',
    parentId: 'municipal-water-supply',
    summary: 'Pumps and mixers for every treatment step, from coagulation to filtration.',
    ...images(
      'drinking-water-treatment',
      'Rows of open filtration basins at a water treatment plant',
    ),
    children: [],
  },
  {
    id: 'water-distribution',
    slug: 'water-distribution',
    name: 'Water distribution',
    parentId: 'municipal-water-supply',
    summary: 'Stable network pressure at the lowest possible energy cost.',
    ...images(
      'water-distribution',
      'Large Sulzer axially split pump with green pipework in a pumping station',
    ),
    children: [],
  },
  {
    id: 'desalination',
    slug: 'desalination',
    name: 'Desalination',
    parentId: 'municipal-water-supply',
    summary: 'High-pressure and seawater intake pumps for reverse osmosis plants.',
    ...images('desalination', 'Aerial view of a coastal seawater desalination plant'),
    children: [],
  },
  {
    id: 'raw-water-transfer',
    slug: 'raw-water-transfer',
    name: 'Raw water transfer',
    parentId: 'municipal-water-supply',
    summary: 'Moving large volumes of raw water over long distances, efficiently.',
    ...images(
      'raw-water-transfer',
      'Large water transmission pipeline running across open landscape',
    ),
    children: [],
  },

  /* ── Wastewater ──────────────────────────────────────────────────────────── */
  {
    id: 'wastewater',
    slug: 'wastewater',
    name: 'Wastewater',
    parentId: rootApplicationId,
    summary: 'Collection, transport and treatment of municipal wastewater.',
    ...images(
      'wastewater',
      'Clarifier at a wastewater treatment plant at sunset',
      'Water droplets splashing on a dark water surface',
    ),
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
      'Sulzer service van beside a wastewater pumping station control cabinet',
    ),
    children: [],
  },
  {
    id: 'stormwater-flood-control',
    slug: 'stormwater-flood-control',
    name: 'Stormwater and flood control',
    parentId: 'wastewater',
    summary: 'High-flow pumping that keeps cities dry when the rain comes.',
    ...images('stormwater-flood-control', 'River flooding its banks after heavy rain'),
    children: [],
  },
  {
    id: 'wastewater-treatment',
    slug: 'wastewater-treatment',
    name: 'Wastewater treatment',
    parentId: 'wastewater',
    summary: 'Mixing, aeration and pumping for every stage of the treatment plant.',
    ...images('wastewater-treatment', 'Aeration basin with air bubbling up through the wastewater'),
    children: [],
  },
  {
    id: 'sludge-handling',
    slug: 'sludge-handling',
    name: 'Sludge handling',
    parentId: 'wastewater',
    summary: 'Reliable pumping and mixing of thick sludge and digester contents.',
    ...images('sludge-handling', 'Anaerobic digesters and a biogas holder at a treatment plant'),
    children: [],
  },

  /* ── Water treatment ─────────────────────────────────────────────────────── */
  {
    id: 'water-treatment',
    slug: 'water-treatment',
    name: 'Water treatment',
    parentId: rootApplicationId,
    summary: 'Clean process water and responsible discharge for industry.',
    ...images('water-treatment', 'Clarifier at an industrial water treatment plant'),
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
    ...images(
      'industrial-water-supply',
      'Row of Sulzer end-suction pumps with pipework at an industrial site',
    ),
    children: [],
  },
  {
    id: 'industrial-wastewater-treatment',
    slug: 'industrial-wastewater-treatment',
    name: 'Industrial wastewater treatment',
    parentId: 'water-treatment',
    summary: 'Treat process effluent so it can be reused or safely discharged.',
    ...images('industrial-wastewater-treatment', 'Operator inspecting an effluent treatment basin'),
    children: [],
  },
  {
    id: 'process-water-treatment',
    slug: 'process-water-treatment',
    name: 'Process water treatment',
    parentId: 'water-treatment',
    summary: 'Water at the exact quality your process needs.',
    ...images(
      'process-water-treatment',
      'Dissolved air flotation unit at a process water treatment plant',
    ),
    children: [],
  },
  {
    id: 'cooling-water',
    slug: 'cooling-water',
    name: 'Cooling water',
    parentId: 'water-treatment',
    summary: 'Efficient circulation for cooling towers and heat exchangers.',
    ...images('cooling-water', 'Coastal power plant that draws its cooling water from the sea'),
    children: [],
  },
  {
    id: 'boiler-feed-water',
    slug: 'boiler-feed-water',
    name: 'Boiler feed water',
    parentId: 'water-treatment',
    summary: 'High-pressure feed pumps for steam generation.',
    ...images('boiler-feed-water', 'Multistage boiler feed pump and motor in a power plant'),
    children: [],
  },
  {
    id: 'reverse-osmosis',
    slug: 'reverse-osmosis',
    name: 'Reverse osmosis',
    parentId: 'water-treatment',
    summary: 'High-pressure pumping for membrane filtration.',
    ...images(
      'reverse-osmosis',
      'Sulzer engineers in a reverse osmosis hall with rows of membrane racks',
    ),
    children: [],
  },
  {
    id: 'ultrafiltration',
    slug: 'ultrafiltration',
    name: 'Ultrafiltration',
    parentId: 'water-treatment',
    summary: 'Gentle, steady feed and backwash for ultrafiltration units.',
    ...images('ultrafiltration', 'Covered filtration basin at a water treatment plant'),
    children: [],
  },
  {
    id: 'water-reuse',
    slug: 'water-reuse',
    name: 'Water reuse',
    parentId: 'water-treatment',
    summary: 'Close the loop by treating and reusing process water.',
    ...images('water-reuse', 'Clean treated water pouring out of an outlet pipe'),
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
    ...images(
      'energy-transition',
      'Layers of misty blue mountains',
      'Aerial views of geothermal springs, forest and a river valley',
    ),
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
    ...images('carbon-capture', 'Gas processing plant with pipe racks and pressure vessels'),
    children: [],
  },
  {
    id: 'biofuels',
    slug: 'biofuels',
    name: 'Biofuels',
    parentId: 'energy-transition',
    summary:
      'Pumping, mixing and distillation for biofuel production, from pilot plant to commercial scale.',
    ...images('biofuels', 'Aerial view of a bioethanol plant with storage tanks'),
    children: [],
  },
  {
    id: 'energy-recovery-storage',
    slug: 'energy-recovery-storage',
    name: 'Energy recovery and storage',
    parentId: 'energy-transition',
    summary:
      'Pumps and hydraulic power recovery turbines that store renewable power and recover energy from industrial processes.',
    ...images(
      'energy-recovery-storage',
      'Hydropower dam with intake towers standing in the reservoir',
    ),
    children: [],
  },
  {
    id: 'concentrated-solar-power',
    slug: 'concentrated-solar-power',
    name: 'Concentrated solar power',
    parentId: 'energy-transition',
    summary:
      'Pumps and services for the solar and turbine islands of CSP plants, plus turbine and generator service.',
    ...images('concentrated-solar-power', 'Solar tower surrounded by a field of heliostats'),
    children: [],
  },
  {
    id: 'geothermal',
    slug: 'geothermal',
    name: 'Geothermal power',
    parentId: 'energy-transition',
    summary: 'Steam turbine overhaul and repair, plus pumps for the geothermal and power islands.',
    ...images('geothermal', 'Geothermal power plant with steam rising beside a blue lagoon'),
    children: [],
  },
  {
    id: 'wind-power',
    slug: 'wind-power',
    name: 'Wind power generation',
    parentId: 'energy-transition',
    summary:
      'Repair and maintenance of generators and other rotating electrical equipment, including in-situ repair.',
    ...images('wind-power', 'Wind turbines silhouetted against a sunset sky'),
    children: [],
  },
  {
    id: 'nuclear-power',
    slug: 'nuclear-power',
    name: 'Nuclear power generation',
    parentId: 'energy-transition',
    summary:
      'Pumps for the nuclear and turbine islands, including safety-related pumps, from single pumps to complete systems.',
    ...images('nuclear-power', 'Nuclear power plant cooling towers beside a river'),
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
    ...images('ammonia-urea-fertilizers', 'Ammonia plant with process columns and pipe racks'),
    children: [],
  },
  {
    id: 'phosphate-fertilizers',
    slug: 'phosphate-fertilizers',
    name: 'Phosphate fertilizers',
    parentId: 'fertilizers',
    summary:
      'Slurry pumps, heavy-duty agitators and phosphoric acid plant equipment, from mine to MAP and DAP.',
    ...images('phosphate-fertilizers', 'Phosphate mine processing mill with ore stockpiles'),
    children: [],
  },
  {
    id: 'potash-fertilizers',
    slug: 'potash-fertilizers',
    name: 'Potash fertilizers',
    parentId: 'fertilizers',
    summary:
      'Brine intake and transfer, tailings pumps and heavy-duty flotation agitators for potash production.',
    ...images('potash-fertilizers', 'Aerial view of a potash fertilizer plant among farm fields'),
    children: [],
  },
  {
    id: 'npk-fertilizers',
    slug: 'npk-fertilizers',
    name: 'NPK fertilizers',
    parentId: 'fertilizers',
    summary:
      'Reliable pumping of the acids, slurries and melts that go into compound NPK fertilizers.',
    ...images('npk-fertilizers', 'Hands holding a scoop of granular NPK fertilizer'),
    children: [],
  },
  {
    id: 'fertilizer-plant-water',
    slug: 'fertilizer-plant-water',
    name: 'Water in fertilizer complexes',
    parentId: 'fertilizers',
    summary:
      'Intake, cooling, process water and effluent treatment across the whole fertilizer site.',
    ...images('fertilizer-plant-water', 'Large axial flow pump running at a fertilizer plant'),
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
    ...images('open-pit-dewatering', 'Flooded open-pit mine with a dewatering discharge line'),
    children: [],
  },
  {
    id: 'underground-dewatering',
    slug: 'underground-dewatering',
    name: 'Underground mine dewatering',
    parentId: 'mining-metals',
    summary: 'Drainage and high-head pumps that lift water from deep underground workings.',
    ...images('underground-dewatering', 'Underground pump station in a gold mine'),
    children: [],
  },
  {
    id: 'ore-separation',
    slug: 'ore-separation',
    name: 'Ore separation',
    parentId: 'mining-metals',
    summary: 'Slurry pumps and agitators for grinding, flotation and leaching circuits.',
    ...images(
      'ore-separation',
      'Aerial view of a copper mine processing plant with round thickener tanks',
    ),
    children: [],
  },
  {
    id: 'electrowinning',
    slug: 'electrowinning',
    name: 'Electrowinning',
    parentId: 'mining-metals',
    summary: 'Corrosion-resistant pumps for the acidic electrolytes of metal recovery.',
    ...images('electrowinning', 'Close-up of copper ore'),
    children: [],
  },
  {
    id: 'tailings-water-reclamation',
    slug: 'tailings-water-reclamation',
    name: 'Tailings ponds and water reclamation',
    parentId: 'mining-metals',
    summary: 'Pumping tailings and reclaiming process water to cut fresh water use.',
    ...images('tailings-water-reclamation', 'Tailings pond at a copper mine surrounded by forest'),
    children: [],
  },
  {
    id: 'metals-processing',
    slug: 'metals-processing',
    name: 'Metals processing',
    parentId: 'mining-metals',
    summary:
      'Pumping and mixing for corrosive and abrasive liquids in steel, aluminium, copper, nickel, zinc and lithium production.',
    ...images('metals-processing', 'Glowing heat-treated pump castings hanging from chains'),
    children: [],
  },

  /* ── Pulp & paper ────────────────────────────────────────────────────────── */
  {
    id: 'pulp-paper',
    slug: 'pulp-paper',
    name: 'Pulp & paper',
    parentId: rootApplicationId,
    summary: 'Pumps and mixers for every step of pulp, paper and board production.',
    ...images('pulp-paper', 'Close-up of stacked paper rolls'),
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
    ...images('stock-preparation', 'Sulzer process pump and pipework in a bioproduct mill'),
    children: [],
  },
  {
    id: 'pulp-bleaching',
    slug: 'pulp-bleaching',
    name: 'Pulp bleaching',
    parentId: 'pulp-paper',
    summary: 'Medium-consistency pumping and chemical mixing for bleaching.',
    ...images('pulp-bleaching', 'Sulzer medium-consistency pump with yellow hoses in a pulp mill'),
    children: [],
  },
  {
    id: 'chemical-recovery',
    slug: 'chemical-recovery',
    name: 'Chemical recovery',
    parentId: 'pulp-paper',
    summary: 'Reliable pumping of liquors through the recovery cycle.',
    ...images('chemical-recovery', 'Pulp mill with chimneys and a wood chip pile beside the water'),
    children: [],
  },
  {
    id: 'paper-machine-approach',
    slug: 'paper-machine-approach',
    name: 'Paper machine approach',
    parentId: 'pulp-paper',
    summary: 'Pulsation-free feed to the headbox for an even sheet.',
    ...images(
      'paper-machine-approach',
      'Sulzer end-suction pump with large pipework in a paper mill',
    ),
    children: [],
  },
]
