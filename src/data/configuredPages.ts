import type { CouplingCode, TabDef } from '../types'

/* Copy for a configured pump's page, /products/<productId>/config/<slug>. */

export const configuredPage = {
  tabs: [
    { id: 'curves', label: 'Curves' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'tender-text', label: 'Tender text' },
    { id: 'cad', label: 'CAD & BIM' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'spare-parts', label: 'Spare parts' },
  ] satisfies TabDef[],
  configured: 'Configured product',
  onRequest: 'On request',
  productNumber: (number: string | null) => (number ? `No. ${number}` : 'Product no. on request'),

  keyData: {
    title: 'At the duty point',
    rated: 'At the rated point',
    flow: 'Flow',
    head: 'Head',
    efficiency: 'Efficiency',
    p2: 'P2',
    npshr: 'NPSHr',
  },

  context: {
    from: 'From project:',
    position: (tag: string) => `Position ${tag}`,
    alternative: (letter: string, selected: boolean) =>
      `Alternative ${letter}${selected ? ' – selected' : ''}`,
    back: 'Back to project',
    sizing: (flow: string, head: string) => `Sized for ${flow} m³/h at ${head} m`,
    backToSizing: 'Back to sizing results',
  },

  price: {
    onRequest: 'Price on request',
    onRequestText: 'Configured to order. A sales engineer confirms price and delivery.',
    madeToOrder: (leadTime: string) => `Made to order – ${leadTime}`,
    quotationTitle: 'Request quotation',
  },

  tender: {
    title: 'Tender text',
    intro:
      'Ready to paste into your specification. Follows the duty point and options of this pump.',
    introProject: (position: string) =>
      `Ready to paste into your specification, for position ${position} and its duty point.`,
  },

  spareParts: {
    base: (model: string) => `Parts list of the base hydraulic, ${model}.`,
  },

  specs: {
    liquid: 'Liquid',
    ratedTemperature: 'Allowed liquid temperature',
    flow: 'Flow at duty point',
    head: 'Head at duty point',
    efficiency: 'Pump efficiency at duty point',
    npshr: 'NPSH required at duty point',
    speed: 'Rated speed',
    trim: (trim: number, min: number, max: number) => `${trim} mm (trim range ${min}–${max} mm)`,
    hydraulic: 'Hydraulic',
    material: 'Material code',
    housing: 'Pump casing',
    mounting: 'Horizontal, on base plate (back pull-out)',
    coupling: 'Coupling',
    couplings: {
      F: 'Flexible coupling',
      FS: 'Flexible coupling with spacer',
    } satisfies Record<CouplingCode, string>,
    suction: 'Suction',
    discharge: 'Discharge',
    flanges: 'Flanges',
    flangeStandard: 'EN 1092-1, PN 16',
    p2: 'Shaft power P2 at duty point',
    motorEfficiency: 'Motor efficiency',
    enclosure: 'Motor cooling',
    motorNumber: 'Motor',
  },

  notFound: {
    title: 'Configuration not found',
    text: 'This configuration is not available. It may have been changed in the configurator, or the link is incomplete.',
    back: (product: string) => `Go to ${product}`,
    sizing: 'Size a new pump',
  },
}
