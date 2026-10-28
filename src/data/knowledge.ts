import type { KnowledgeItem } from '../types'

/*
 * Learning material shown on application Explore tabs. Links go to Sulzer
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
      alt: 'Cover of a technical manual on a desk, with an intake structure drawing beside it',
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
      alt: 'Sulzer application engineer presenting in front of a pump sump model',
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
      alt: 'Centrifugal pump handbook lying open next to a pump impeller',
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

  /* Customer stories on product pages. Portrait images, in public/images/stories. */
  {
    id: 'story-river-intake',
    type: 'Customer story',
    title: 'A Nordic water utility cuts raw water pumping energy by a fifth',
    teaser: 'New intake pumps sized for the real duty point, not the worst case.',
    image: {
      src: '/images/stories/story-river-intake.jpg',
      alt: 'River intake pumping station at dawn, with mist on the water',
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
      alt: 'Maintenance engineer next to a row of process pumps in a paper mill',
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
      alt: 'Coastal desalination plant beside the sea under a clear sky',
    },
    to: '/learn',
  },
]
