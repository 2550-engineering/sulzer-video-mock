import { products } from '../config/demo'
import type { KnowledgeItem } from '../types'

/*
 * Learning material shown on application Explore tabs and product Learn tabs. Links go to Sulzer
 * Academy (/learn) until it has real pages. Images go in public/images/knowledge.
 */

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: 'intake-engineering-manual',
    type: 'Engineering manual',
    title: 'Engineering manual: raw water intake design',
    teaser: 'Sump layout, intake velocities and pump selection for river and lake intakes.',
    image: {
      src: '/images/knowledge/intake-engineering-manual.jpg',
      alt: 'Stack of printed technical manuals',
    },
    to: '/learn',
  },
  {
    id: 'expert-video-sump-design',
    type: 'Expert video',
    title: 'Ask the expert: why pump sump design matters',
    teaser: 'A Sulzer application engineer explains how to avoid vortices and air entrainment.',
    image: {
      src: '/images/knowledge/expert-video-sump-design.jpg',
      alt: 'Sulzer engineer talking a group of visitors through pump components',
    },
    to: '/learn',
  },
  {
    id: 'centrifugal-pump-handbook',
    type: 'Handbook',
    title: 'The Sulzer centrifugal pump handbook',
    teaser: 'Hydraulics, materials and operation, from the people who design the pumps.',
    image: {
      src: '/images/knowledge/centrifugal-pump-handbook.jpg',
      alt: 'See-through illustration of a centrifugal pump showing its internals',
    },
    to: '/learn',
  },
  {
    id: 'river-intake-customer-story',
    type: 'Customer story',
    title: 'A river intake that runs leaner, all year round',
    teaser: 'How one utility cut pumping energy after rebuilding its raw water station.',
    image: {
      src: '/images/knowledge/river-intake-customer-story.jpg',
      alt: 'River intake pumping station seen from the water on a clear day',
    },
    to: '/learn',
  },

  /* Condition monitoring: Learn tabs of the digital products. */
  {
    id: 'condition-monitoring-guide',
    type: 'Engineering manual',
    title: 'Engineering manual: condition monitoring for pump stations',
    teaser:
      'What to measure, where to mount sensors and how to set alert limits that mean something.',
    image: {
      src: '/images/knowledge/condition-monitoring-guide.jpg',
      alt: 'Wireless vibration sensor mounted on the bearing housing of a pump',
    },
    to: '/learn',
  },
  {
    id: 'expert-video-vibration-trends',
    type: 'Expert video',
    title: 'Ask the expert: reading a vibration trend',
    teaser: 'A Sulzer vibration analyst shows how bearing wear builds up, and when to act.',
    image: {
      src: '/images/knowledge/expert-video-vibration-trends.jpg',
      alt: 'Sulzer engineer pointing at a vibration trend on a laptop next to a pump',
    },
    to: '/learn',
  },
  {
    id: 'connect-getting-started',
    type: 'Handbook',
    title: `Getting started with ${products.connect}`,
    teaser: 'Connect your first pumps, invite your team and set up alerts in an afternoon.',
    image: {
      src: '/images/knowledge/connect-getting-started.jpg',
      alt: 'Technician using a tablet next to a pump in a clean pump room',
    },
    to: '/learn',
  },

  /* Customer stories on product pages. Portrait images, in public/images/stories. */
  {
    id: 'story-river-intake',
    type: 'Customer story',
    title: 'A Nordic water utility cuts raw water pumping energy by a fifth',
    teaser: 'New intake pumps sized for the real duty point, not the worst case.',
    image: {
      src: '/images/stories/story-river-intake.jpg',
      alt: 'Brick raw water pumping station on a riverbank, with its intake below the waterline',
    },
    to: '/learn',
  },
  {
    id: 'story-paper-mill',
    type: 'Customer story',
    title: 'Paper mill doubles time between overhauls on its process pumps',
    teaser: 'Shared wear parts and back pull-out design keep the line running.',
    image: {
      src: '/images/stories/story-paper-mill.jpg',
      alt: 'AHLSTAR process pump and motor in a paper mill pump room',
    },
    to: '/learn',
  },
  {
    id: 'story-desalination',
    type: 'Customer story',
    title: 'Coastal desalination plant secures its seawater supply',
    teaser: 'Corrosion-resistant materials for round-the-clock seawater duty.',
    image: {
      src: '/images/stories/story-desalination.jpg',
      alt: 'Sulzer engineers in the high-pressure pump hall of a seawater desalination plant',
    },
    to: '/learn',
  },
  {
    id: 'story-connect-pump-stations',
    type: 'Customer story',
    title: 'A municipal utility watches 42 remote pump stations from one screen',
    teaser: 'Remote monitoring replaced weekly site rounds and cut night-time call-outs.',
    image: {
      src: '/images/stories/story-connect-pump-stations.jpg',
      alt: 'Operator checking pump condition on a tablet inside a small pump station',
    },
    to: '/learn',
  },
]
