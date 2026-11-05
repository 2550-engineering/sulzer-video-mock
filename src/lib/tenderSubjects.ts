import { getLiquid } from '../data/liquids'
import { tenderDefaults } from '../data/tenderTexts'
import { xfpDetails } from '../data/xfp'
import type {
  DutyPoint,
  ProductModel,
  ProjectItem,
  PumpVariant,
  ResultArticle,
  SizingResult,
  TenderSubject,
} from '../types'
import { getArticle } from './articles'
import { getModel, getProduct, getProductVariant, partOwner } from './catalog'
import { evaluateVariant } from './sizing'
import { getVariant } from './variants'

/* What a tender text says about a sized pump, a variant or a model, or a project item. */

/** Submersibles (XFP, J …) get the submersible wording; everything else is end-suction. */
const kindOf = (productId: string): TenderSubject['kind'] =>
  getProduct(productId)?.family.startsWith('Submersible') ? 'submersible' : 'end-suction'

const polesOf = (speed: number) => (speed > 2000 ? 2 : speed > 1200 ? 4 : 6)

/** A sized pump (sizing results, compare, projects) at its duty point. */
export function sizedSubject(
  variant: PumpVariant,
  result: Omit<SizingResult, 'rank'> | undefined,
  duty: DutyPoint,
  application?: string,
): TenderSubject {
  const kind = kindOf(variant.productId)
  return {
    productId: variant.productId,
    kind,
    model: variant.name,
    productNumber: variant.productNumber,
    quantity: 1,
    application,
    duty: {
      flow: duty.flow,
      head: duty.head,
      liquid: getLiquid(duty.liquid).label,
      temperature: duty.temperature,
    },
    hydraulic: {
      flow: result?.operatingPoint.flow ?? duty.flow,
      head: result?.operatingPoint.head ?? duty.head,
      efficiency: result?.efficiency ?? 0,
      npshr: result?.npshr,
      speed: variant.speed,
      impeller: variant.impeller,
    },
    materials: {
      casing: `${variant.housingMaterial} ${variant.housingGrade}`,
      impeller: variant.impellerMaterial,
      shaft: tenderDefaults.shaft,
      wearParts: tenderDefaults.wearParts[kind],
    },
    seal: variant.seal,
    motor: {
      power: result?.motorPower ?? variant.motorPower,
      voltage: `3 × ${variant.motorVoltage}`,
      frequency: duty.frequency,
      poles: variant.poles,
      efficiencyClass: variant.motorClass,
      enclosure: `${tenderDefaults.enclosure}, ${variant.motorEnclosure}`,
    },
    connections: { suction: variant.connection.suction, discharge: variant.connection.discharge },
  }
}

/** A configured variant (XFP) or a model (AHLSTAR) at its rated point. */
export function articleSubject(article: ResultArticle, application?: string): TenderSubject {
  const kind = kindOf(article.productId)
  const variant = article.kind === 'variant' ? getProductVariant(article.id) : undefined
  const model = getModel(article.modelId)
  const base = {
    productId: article.productId,
    kind,
    model: article.code,
    productNumber: article.productNumber,
    quantity: 1,
    application,
    hydraulic: {
      flow: article.rated.flow,
      head: article.rated.head,
      efficiency: model?.efficiency ?? 0,
      speed: article.speed,
      impeller: article.impellerDiameter,
    },
    connections: {
      suction: kind === 'submersible' ? undefined : article.inlet,
      discharge: article.outlet,
    },
  }
  if (variant) {
    return {
      ...base,
      materials: {
        casing: variant.housingMaterial,
        impeller: variant.impeller.material,
        shaft: xfpDetails.shaft,
        wearParts: tenderDefaults.wearParts[kind],
      },
      seal: 'submersible',
      motor: {
        power: variant.power,
        voltage: `${variant.phase} × ${variant.voltage}`,
        frequency: variant.frequency,
        poles: polesOf(variant.speed),
        efficiencyClass: tenderDefaults.efficiencyClass,
        enclosure: variant.ipClass,
      },
      exApproved: variant.exApproved,
      cableLength: variant.cableLength,
    }
  }
  const duplex = model?.casingMaterial === 'Duplex stainless steel'
  return {
    ...base,
    materials: {
      casing: article.housing,
      impeller: model?.impellerMaterial ?? (duplex ? 'Duplex stainless steel' : 'Grey cast iron'),
      shaft: tenderDefaults.shaft,
      wearParts: tenderDefaults.wearParts[kind],
    },
    seal: model?.shaftSeal ?? 'Single mechanical seal',
    motor: {
      power: article.power,
      voltage: article.supply.split(',')[0],
      frequency: article.frequency,
      poles: polesOf(article.speed),
      efficiencyClass: tenderDefaults.efficiencyClass,
      enclosure: article.ipClass,
    },
  }
}

/** A model on the Models tab. */
export function modelSubject(model: ProductModel, application?: string) {
  const article = getArticle(model.productId, model.id)
  return article && articleSubject(article, application)
}

/**
 * A project item: a sized pump at its duty point, or a catalogue variant or
 * model; with its quantity and position.
 */
export function projectItemSubject(
  item: ProjectItem,
  application?: string,
): TenderSubject | undefined {
  const sized = getVariant(item.variantId)
  const owner = sized ? undefined : partOwner(item.variantId)
  const article = owner && getArticle(owner.productId, owner.id)
  const subject = sized
    ? sizedSubject(sized, evaluateVariant(sized, item.dutyPoint), item.dutyPoint, application)
    : article && articleSubject(article, application)
  return (
    subject && {
      ...subject,
      quantity: item.quantity,
      position: { number: item.position, tag: item.customerPosition },
    }
  )
}
