import { searchPage } from '../data/catalogPages'
import { variantPage } from '../data/variantPages'
import { xfpDetails } from '../data/xfp'
import type { ProductModel, ProductVariant, ResultArticle } from '../types'
import { getModel, getProduct, getProductVariant } from './catalog'
import { groupThousands } from './format'
import { ratedPoint } from './variantCurves'

const labels = searchPage.variants.specs

/** A configured product's specs as label/value rows, in display order. */
export function variantSpecs(variant: ProductVariant) {
  return [
    { label: labels.frequency, value: `${variant.frequency} Hz` },
    { label: labels.phase, value: String(variant.phase) },
    {
      label: labels.power,
      value: `${groupThousands(variant.power, variant.power % 1 ? 1 : 0)} kW`,
    },
    { label: labels.speed, value: `${groupThousands(variant.speed)} rpm` },
    { label: labels.voltage, value: variant.voltage },
    { label: labels.ipClass, value: variant.ipClass },
    { label: labels.housing, value: variant.housingMaterial },
    {
      label: labels.impeller,
      value: `${variant.impeller.type}, ${variant.impeller.material}`,
    },
    { label: labels.inlet, value: `DN ${variant.connection.inlet}` },
    { label: labels.outlet, value: `DN ${variant.connection.outlet}` },
    { label: labels.ambient, value: `${variant.maxAmbientTemp} °C` },
    {
      label: labels.ex,
      value: variant.exApproved ? searchPage.variants.yesNo.yes : searchPage.variants.yesNo.no,
    },
    { label: labels.cable, value: `${variant.cableLength} m` },
    { label: labels.weight, value: `${groupThousands(variant.weight)} kg` },
  ]
}

/** Spec rows in the Specifications tab's groups (Liquid, Technical, Materials, Installation, Electrical data). */
export function variantSpecGroups(variant: ProductVariant) {
  const { groups, labels: specLabels } = variantPage.specifications
  const model = getModel(variant.modelId)
  const rated = ratedPoint(variant)
  const supply = variant.code.match(/-(D\d\d)\b/)?.[1] ?? ''
  const freePassage = xfpDetails.freePassage[variant.modelId]
  const yesNo = searchPage.variants.yesNo
  return [
    {
      title: groups.liquid,
      rows: [
        { label: specLabels.pumpedLiquids, value: xfpDetails.pumpedLiquids },
        { label: specLabels.liquidTemperature, value: xfpDetails.liquidTemperature },
        { label: labels.ambient, value: `${variant.maxAmbientTemp} °C` },
        { label: specLabels.maxDensity, value: xfpDetails.maxDensity },
        { label: specLabels.ph, value: xfpDetails.ph },
      ],
    },
    {
      title: groups.technical,
      rows: [
        { label: specLabels.ratedFlow, value: `${groupThousands(rated.flow)} m³/h` },
        {
          label: specLabels.ratedHead,
          value: `${groupThousands(rated.head, rated.head % 1 ? 1 : 0)} m`,
        },
        ...(model ? [{ label: specLabels.efficiency, value: `${model.efficiency} %` }] : []),
        { label: labels.speed, value: `${groupThousands(variant.speed)} rpm` },
        { label: specLabels.impellerType, value: variant.impeller.type },
        { label: specLabels.impellerDiameter, value: `${variant.impeller.diameter} mm` },
        ...(freePassage ? [{ label: specLabels.freePassage, value: `${freePassage} mm` }] : []),
      ],
    },
    {
      title: groups.materials,
      rows: [
        { label: labels.housing, value: variant.housingMaterial },
        { label: specLabels.impellerMaterial, value: variant.impeller.material },
        { label: specLabels.shaft, value: xfpDetails.shaft },
        { label: specLabels.shaftSeals, value: xfpDetails.shaftSeals },
        { label: specLabels.oRings, value: xfpDetails.oRings },
        { label: specLabels.fasteners, value: xfpDetails.fasteners },
      ],
    },
    {
      title: groups.installation,
      rows: [
        { label: specLabels.installation, value: xfpDetails.installation },
        { label: labels.inlet, value: `DN ${variant.connection.inlet}` },
        { label: labels.outlet, value: `DN ${variant.connection.outlet}` },
        { label: specLabels.maxImmersion, value: xfpDetails.maxImmersion },
        { label: labels.cable, value: `${variant.cableLength} m` },
        { label: labels.weight, value: `${groupThousands(variant.weight)} kg` },
      ],
    },
    {
      title: groups.electrical,
      rows: [
        {
          label: specLabels.ratedPower,
          value: `${groupThousands(variant.power, variant.power % 1 ? 1 : 0)} kW`,
        },
        { label: labels.voltage, value: variant.voltage },
        { label: labels.frequency, value: `${variant.frequency} Hz` },
        { label: labels.phase, value: String(variant.phase) },
        { label: specLabels.starting, value: xfpDetails.starting[supply] ?? '–' },
        { label: labels.ipClass, value: variant.ipClass },
        { label: specLabels.insulationClass, value: xfpDetails.insulationClass },
        { label: specLabels.dutyType, value: xfpDetails.dutyType },
        { label: specLabels.motorProtection, value: xfpDetails.motorProtection },
        { label: labels.ex, value: variant.exApproved ? yesNo.yes : yesNo.no },
      ],
    },
  ]
}

/** Spec rows of a model (AHLSTAR), in the same groups. Values not in the model data are typical. */
export function modelSpecGroups(model: ProductModel, article: ResultArticle) {
  const { groups, labels: specLabels } = variantPage.specifications
  const product = getProduct(model.productId)
  const duplex = model.casingMaterial === 'Duplex stainless steel'
  const kW = groupThousands(model.power, model.power % 1 ? 1 : 0)
  return [
    {
      title: groups.liquid,
      rows: [
        ...(product?.keySpecs
          ? [{ label: specLabels.liquidTemperature, value: product.keySpecs.liquidTemp }]
          : []),
        { label: specLabels.maxPressure, value: `${model.maxPressure} bar` },
      ],
    },
    {
      title: groups.technical,
      rows: [
        { label: specLabels.ratedFlow, value: `${groupThousands(model.flow)} m³/h` },
        { label: specLabels.ratedHead, value: `${groupThousands(model.head)} m` },
        { label: specLabels.efficiency, value: `${model.efficiency} %` },
        { label: specLabels.maxFlow, value: `${groupThousands(article.maxFlow)} m³/h` },
        { label: specLabels.maxHead, value: `${groupThousands(article.maxHead, 1)} m` },
        { label: labels.speed, value: `${groupThousands(model.speed)} rpm` },
        { label: specLabels.impellerType, value: article.impellerType },
        { label: specLabels.impellerDiameter, value: `${model.impeller} mm` },
      ],
    },
    {
      title: groups.materials,
      rows: [
        { label: labels.housing, value: model.casingMaterial },
        {
          label: specLabels.impellerMaterial,
          value: duplex ? 'Duplex stainless steel' : 'Grey cast iron',
        },
        { label: specLabels.shaft, value: 'Stainless steel 1.4021' },
        { label: specLabels.shaftSealType, value: model.shaftSeal },
      ],
    },
    {
      title: groups.installation,
      rows: [
        { label: specLabels.mounting, value: 'Horizontal, on base plate (back pull-out)' },
        { label: labels.inlet, value: `DN ${article.inlet}` },
        { label: labels.outlet, value: `DN ${article.outlet}` },
        { label: labels.weight, value: `${groupThousands(model.weight)} kg` },
      ],
    },
    {
      title: groups.electrical,
      rows: [
        { label: specLabels.ratedPower, value: `${kW} kW` },
        { label: specLabels.supply, value: article.supply },
        { label: specLabels.poles, value: String(model.speed > 2000 ? 2 : 4) },
        { label: labels.ipClass, value: article.ipClass },
        { label: specLabels.efficiencyClass, value: 'IE3' },
      ],
    },
  ]
}

/** Spec groups of a variant or model. */
export function articleSpecGroups(article: ResultArticle) {
  if (article.kind === 'variant') {
    const variant = getProductVariant(article.id)
    return variant ? variantSpecGroups(variant) : []
  }
  const model = getModel(article.id)
  return model ? modelSpecGroups(model, article) : []
}
