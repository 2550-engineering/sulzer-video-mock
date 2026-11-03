/*
 * Price copy for partner net prices (list price, discount, net price), wherever
 * prices show. The discount is `partnerPricing.discount` in config/demo.ts.
 */
export const priceCopy = {
  listPrice: (price: string) => `List ${price}`,
  discount: (percent: number) => `Your discount ${percent}%`,
  netPrice: 'Your net price',
}
