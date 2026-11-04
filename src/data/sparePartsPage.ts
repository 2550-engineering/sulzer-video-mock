import { market } from '../config/demo'

/* Copy for the Spare parts tab on configured products. */

export const sparePartsTab = {
  title: 'Service parts',
  version: 'Product version',
  model: 'Model',
  modelOption: (name: string, hz: number) => `${name} · ${hz} Hz`,
  versionHint: 'Year and week of production are on the rating plate.',
  search: 'Find part',
  searchPlaceholder: 'Name, position or part number',
  collapse: 'Collapse',
  expand: 'Expand',
  clear: 'Clear',
  recommended: 'Recommended service parts',
  serviceKits: 'Service kits',
  serviceParts: 'Service parts',
  kitLabel: (years: number) => `${years} years of operation`,
  parts: (count: number) => `${count} ${count === 1 ? 'part' : 'parts'}`,
  pieces: (count: number) => `${count} pcs`,
  noMatches: (query: string) => `No parts match ‘${query}’.`,
  showPart: (position: string, name: string) => `${position} ${name}`,

  view: {
    label: 'Show as',
    tree: 'Tree',
    bom: 'BOM table',
  },
  bom: {
    title: 'Bill of material',
    count: (shown: number, total: number) =>
      shown === total ? `${total} positions` : `${shown} of ${total} positions`,
    columns: {
      position: 'Pos.',
      name: 'Name',
      partNumber: 'Part no.',
      quantity: 'Qty',
      material: 'Material',
      kits: 'Service sets',
      price: `List price (${market.currency})`,
      stock: 'Stock',
      leadTime: 'Lead time',
    },
    sortBy: (column: string) => `Sort by ${column}`,
    kitShort: (years: number) => `${years} years`,
    stock: {
      'in-stock': 'In stock',
      'lead-time': 'Short lead time',
      'made-to-order': 'Made to order',
      discontinued: 'Discontinued',
    },
    export: 'Export BOM',
    exported: 'BOM exported',
    exportedDetail: (file: string) => file,
    print: 'Print',
    fileName: (code: string, version: string) =>
      `BOM_${code.replace(/[^A-Za-z0-9.]+/g, '_').replace(/_+$/, '')}_${version}.csv`,
    printTitle: 'Bill of material',
    printBack: 'Back to spare parts',
    printButton: 'Print or save as PDF',
    printProductNumber: 'Product no.',
    printVersion: 'Product version',
    printDrawing: 'Drawing',
    printFooter:
      'Positions refer to the exploded view. Prices are list prices excl. VAT and subject to change.',
  },

  drawing: {
    label: (number: string) => `Exploded view ${number}. Select a part to see its details.`,
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset view',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    hint: 'Scroll to zoom · drag to move · click a part',
  },

  detail: {
    empty: 'Select a part',
    emptyText:
      'Click a part on the drawing or in the list to see its part number, price and lead time.',
    position: 'Pos.',
    partNumber: 'Part no.',
    copy: 'Copy part number',
    copied: 'Copied',
    material: 'Material',
    quantity: 'Quantity in pump',
    partOf: 'Part of',
    notInKit: 'Not in a recommended set',
    price: 'List price',
    each: `each, ${market.currency} excl. VAT`,
    total: `${market.currency} excl. VAT`,
    signIn: 'Sign in to see price and lead time',
    order: 'Quantity',
    addToCart: 'Add to cart',
    addKit: 'Add kit to cart',
    kitParts: (count: number) => `${count} parts in this set`,
    close: 'Clear selection',
  },
}

/** /spare-parts: find parts by number or name, or start from a product. */
export const sparePartsLanding = {
  breadcrumb: [{ label: 'Products & services', to: '/products' }],
  crumb: 'Spare parts',
  title: 'Spare parts',
  description:
    'Identify genuine Sulzer spare parts on the exploded drawing of your pump, check price and lead time, and order online.',
  search: 'Find spare parts for your pump',
  placeholder: 'Product number, model or part number, e.g. 24150231',
  hint: 'The product number is on the rating plate. Press Enter to open its spare parts.',
  pumps: 'Pumps',
  pumpNumber: (number: string) => `Product no. ${number}`,
  partsOnline: 'Parts list and exploded drawing online',
  partsNotOnline: 'Parts list not offered in this demo',
  parts: 'Spare parts',
  results: (count: number) => `${count} ${count === 1 ? 'part' : 'parts'}`,
  more: (count: number) =>
    `Showing the first ${count}. Type more of the number to narrow the list.`,
  none: (query: string) =>
    `No pumps or spare parts match ‘${query}’. Check the product number on the rating plate.`,
  products: {
    title: 'Start from your pump',
    text: 'Open the parts list and exploded drawing, then click the part you need.',
    open: 'Open spare parts',
  },
}
