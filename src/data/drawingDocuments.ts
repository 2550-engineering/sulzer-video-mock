import type { Document, ResultArticle } from '../types'

/*
 * The Drawings tab of a variant or model: dimensional drawing, exploded view
 * and wiring diagram. Numbers, sizes and dates are invented; there are no
 * files, so the preview shows the designed cover.
 */

/** "XFP 150E" from an XFP variant's model, "AHLSTAR 100-80-250" for a model. */
const sizeName = (article: ResultArticle) =>
  article.kind === 'variant' ? article.code.split(' ').slice(0, 2).join(' ') : article.code

const key = (article: ResultArticle) => sizeName(article).replace(/\s+/g, '').toUpperCase()

export function drawingDocuments(article: ResultArticle, explodedNumber?: string): Document[] {
  const common = {
    productIds: [article.productId],
    languages: ['English'],
    format: 'PDF',
    date: '2025-09-15',
    revision: 'B',
    href: null,
  }
  const supply =
    article.code.match(/-(D\d\d)\b/)?.[1] ?? (article.frequency === 60 ? 'IEC60' : 'IEC50')
  return [
    {
      ...common,
      id: `drawing-dim-${article.id}`,
      title: `Dimensional drawing, ${sizeName(article)}`,
      type: 'Dimensional drawing',
      number: `DD-${key(article)}-01`,
      size: '0.6 MB',
    },
    {
      ...common,
      id: `drawing-exploded-${article.id}`,
      title: `Exploded view with part positions, ${sizeName(article)}`,
      type: 'Exploded view',
      number: explodedNumber ?? `TD-${key(article)}-01`,
      size: '1.1 MB',
    },
    {
      ...common,
      id: `drawing-wiring-${article.id}`,
      title: `Wiring diagram, ${article.supply}, with sensors`,
      type: 'Wiring diagram',
      number: `WD-${supply}`,
      size: '0.3 MB',
      date: '2025-06-02',
      revision: 'C',
    },
  ]
}
