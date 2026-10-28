import { Fish, Gauge, Leaf, ShieldCheck, Waves, Zap } from 'lucide-react'
import type { Application } from '../types'

/*
 * Application finder tree. The deck demo follows
 * Applications → Municipal water supply → Surface water intake.
 * Image files go in _asset-source/images under the names below.
 */

export const rootApplicationId = 'applications'

export const applications: Application[] = [
  {
    id: rootApplicationId,
    name: 'Applications',
    parentId: null,
    heroImage: {
      file: 'applications-hero.jpg',
      alt: 'Sulzer pumps in a municipal water plant',
      tone: 'deep',
    },
    summary: "Solutions engineered for the world's most demanding fluid processes.",
    intro:
      'From raw water intake to industrial process lines, find proven Sulzer solutions for your application – with the products, sizing tools and know-how to match.',
    children: [
      'municipal-water-supply',
      'wastewater',
      'industrial-processes',
      'building-services',
      'pulp-paper',
      'oil-gas',
    ],
  },
  {
    id: 'municipal-water-supply',
    name: 'Municipal water supply',
    parentId: rootApplicationId,
    heroImage: {
      file: 'app-municipal-water.jpg',
      alt: 'Municipal water treatment plant',
      tone: 'ocean',
    },
    summary: 'Reliable intake, treatment and distribution of clean water.',
    intro:
      'Secure a safe, efficient water supply for your community. Sulzer pumps, mixers and monitoring cover every step from the source to the tap.',
    children: ['surface-water-intake', 'groundwater-intake', 'water-distribution'],
    explore: {
      title: 'From source to tap',
      text: 'Water utilities need equipment that runs around the clock, uses as little energy as possible and is easy to service. Choose your stage of the water cycle to see the solutions that fit.',
      highlights: [
        {
          label: 'Energy-optimised',
          text: 'High-efficiency hydraulics and IE4 motors cut lifetime energy costs.',
          icon: Zap,
        },
        {
          label: 'Proven reliability',
          text: 'Designed for continuous duty in critical water infrastructure.',
          icon: ShieldCheck,
        },
        {
          label: 'Connected',
          text: 'Remote monitoring shows problems coming before supply is at risk.',
          icon: Gauge,
        },
      ],
    },
  },
  {
    id: 'surface-water-intake',
    name: 'Surface water intake',
    parentId: 'municipal-water-supply',
    heroImage: {
      file: 'app-surface-water-intake.jpg',
      alt: 'Raw water intake pumping station on a river',
      tone: 'ocean',
    },
    summary: 'Raw water pumping from rivers, lakes and reservoirs.',
    intro:
      'You need a cost-effective, reliable and energy-optimised raw water pumping solution for surface water sources. Sulzer supplies pumps, monitoring and connectivity for river, lake and reservoir extraction.',
    children: [],
    explore: {
      title: 'Raw water intake, done right',
      text: 'Surface water varies with the seasons – in level, temperature and solids content. Sulzer intake solutions handle that variation while protecting both the pumps and the environment around the intake.',
      highlights: [
        {
          label: 'Handles changing conditions',
          text: 'Wide operating range for seasonal swings in level and flow.',
          icon: Waves,
        },
        {
          label: 'Low lifetime cost',
          text: 'Best-in-class efficiency at the duty point where you actually run.',
          icon: Zap,
        },
        {
          label: 'Gentle on the environment',
          text: 'Low-velocity intake designs that protect fish and aquatic life.',
          icon: Fish,
        },
        {
          label: 'Built to last',
          text: 'Wear-resistant materials for water carrying sand and silt.',
          icon: Leaf,
        },
      ],
    },
  },
  {
    id: 'groundwater-intake',
    name: 'Groundwater intake',
    parentId: 'municipal-water-supply',
    heroImage: { file: 'app-groundwater-intake.jpg', alt: 'Groundwater well field', tone: 'steel' },
    summary: 'Efficient pumping from boreholes and well fields.',
    intro:
      'Lift groundwater from boreholes and well fields with pumps built for decades of efficient, low-maintenance service.',
    children: [],
  },
  {
    id: 'water-distribution',
    name: 'Water distribution',
    parentId: 'municipal-water-supply',
    heroImage: {
      file: 'app-water-distribution.jpg',
      alt: 'Water distribution pumping station',
      tone: 'slate',
    },
    summary: 'Stable pressure across the network, at the lowest energy cost.',
    intro:
      'Keep pressure stable across your distribution network while cutting energy use and leakage.',
    children: [],
  },
  {
    id: 'wastewater',
    name: 'Wastewater',
    parentId: rootApplicationId,
    heroImage: { file: 'app-wastewater.jpg', alt: 'Wastewater treatment basins', tone: 'deep' },
    summary: 'Collection, transport and treatment of municipal wastewater.',
    intro:
      'Clog-resistant pumps, mixers and aeration for every stage from the sewer network to the treatment plant outlet.',
    children: [],
  },
  {
    id: 'industrial-processes',
    name: 'Industrial processes',
    parentId: rootApplicationId,
    heroImage: {
      file: 'app-industrial-processes.jpg',
      alt: 'Process pumps in an industrial plant',
      tone: 'steel',
    },
    summary: 'Process pumps and mixers built for continuous operation.',
    intro:
      'Pumps and mixers for demanding process duties, engineered for uptime and easy maintenance.',
    children: [],
  },
  {
    id: 'building-services',
    name: 'Building services',
    parentId: rootApplicationId,
    heroImage: {
      file: 'app-building-services.jpg',
      alt: 'Pump room in a commercial building',
      tone: 'slate',
    },
    summary: 'Drainage, sewage and water handling in buildings.',
    intro: 'Compact, quiet solutions for drainage, sewage and water handling in buildings.',
    children: [],
  },
  {
    id: 'pulp-paper',
    name: 'Pulp & paper',
    parentId: rootApplicationId,
    heroImage: { file: 'app-pulp-paper.jpg', alt: 'Paper machine', tone: 'steel' },
    summary: 'Stock preparation, bleaching and chemical recovery.',
    intro: 'Process pumps and mixers for every step of pulp, paper and board production.',
    children: [],
  },
  {
    id: 'oil-gas',
    name: 'Oil & gas',
    parentId: rootApplicationId,
    heroImage: { file: 'app-oil-gas.jpg', alt: 'Oil and gas processing facility', tone: 'deep' },
    summary: 'Upstream, midstream and downstream pumping solutions.',
    intro: 'Engineered pumps for upstream, midstream and downstream oil and gas operations.',
    children: [],
  },
]
