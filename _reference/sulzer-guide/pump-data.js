// Shared catalog + matching logic for the Sulzer sewage pump replacement guide.
// Existing (competitor) pumps the customer might already have installed,
// and the Sulzer ABS catalog used as replacements. One default replacement.

export const DEFAULT_REPLACEMENT_ID = "xfp-81c";

// ---- Sulzer replacement catalog (10 products) ----
export const REPLACEMENTS = [
  {
    id: "xfp-81c",
    range: "ABS XFP",
    model: "81C-CB1.3 PE22/4",
    article: "FF8201CB13",
    material: "60 80 1034",
    discharge: "DN 80",
    power: "2.2 kW",
    powerKw: 2.2,
    voltage: "400 V · 3~ · 50 Hz",
    impeller: "Contrablock Plus",
    maxHead: "24 m",
    maxFlow: "32 l/s",
    solids: "76 mm",
    efficiency: "IE3 Premium Efficiency",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "78 kg",
    tier: "Premium",
    availability: "In stock",
    comment: "Drop-in replacement — mounts on the existing guide rail with a Sulzer adapter claw.",
  },
  {
    id: "xfp-100c",
    range: "ABS XFP",
    model: "100C-CB1.4 PE30/4",
    article: "FF1001CB14",
    material: "60 80 1041",
    discharge: "DN 100",
    power: "3.0 kW",
    powerKw: 3.0,
    voltage: "400 V · 3~ · 50 Hz",
    impeller: "Contrablock Plus",
    maxHead: "27 m",
    maxFlow: "46 l/s",
    solids: "80 mm",
    efficiency: "IE3 Premium Efficiency",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "96 kg",
    tier: "Premium",
    availability: "In stock",
    comment: "Drop-in replacement for DN 100 stations — same footprint, higher hydraulic efficiency.",
  },
  {
    id: "xfp-150e",
    range: "ABS XFP",
    model: "150E-CB2.5 PE75/4",
    article: "FF1502CB25",
    material: "60 80 1078",
    discharge: "DN 150",
    power: "7.5 kW",
    powerKw: 7.5,
    voltage: "400 V · 3~ · 50 Hz",
    impeller: "Contrablock Plus 2-vane",
    maxHead: "31 m",
    maxFlow: "90 l/s",
    solids: "100 mm",
    efficiency: "IE3 Premium Efficiency",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "184 kg",
    tier: "Premium",
    availability: "2–3 week lead time",
    comment: "Higher-flow network station replacement. Requires guide-rail adapter on most legacy bases.",
  },
  {
    id: "xfp-201g",
    range: "ABS XFP",
    model: "201G-CB3.7 PE150/4",
    article: "FF2013CB37",
    material: "60 80 1132",
    discharge: "DN 200",
    power: "15 kW",
    powerKw: 15,
    voltage: "400 V · 3~ · 50 Hz",
    impeller: "Contrablock Plus 3-vane",
    maxHead: "34 m",
    maxFlow: "150 l/s",
    solids: "120 mm",
    efficiency: "IE3 Premium Efficiency",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "342 kg",
    tier: "Premium",
    availability: "2–3 week lead time",
    comment: "Heavy-duty main pumping station replacement with superior rag handling.",
  },
  {
    id: "xfp-305m",
    range: "ABS XFP",
    model: "305M-CB4.4 PE300/6",
    article: "FF3054CB44",
    material: "60 80 1190",
    discharge: "DN 300",
    power: "30 kW",
    powerKw: 30,
    voltage: "400 V · 3~ · 50 Hz",
    impeller: "Contrablock Plus 4-vane",
    maxHead: "29 m",
    maxFlow: "310 l/s",
    solids: "145 mm",
    efficiency: "IE3 Premium Efficiency",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "690 kg",
    tier: "Premium",
    availability: "Contact distributor",
    comment: "Headworks-scale duty. Engineered drop-in for large concrete wet wells.",
  },
  {
    id: "as-0530",
    range: "ABS AS",
    model: "0530/2 D01*10",
    article: "AS05302D01",
    material: "60 80 0530",
    discharge: "DN 50",
    power: "3.0 kW",
    powerKw: 3.0,
    voltage: "400 V · 3~ · 50 Hz",
    impeller: "Contrablock single-vane",
    maxHead: "26 m",
    maxFlow: "18 l/s",
    solids: "50 mm",
    efficiency: "IE2",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "41 kg",
    tier: "Standard",
    availability: "In stock",
    comment: "Compact submersible for small lifting stations and effluent transfer.",
  },
  {
    id: "piranha-08",
    range: "ABS Piranha",
    model: "08 D PE15/2",
    article: "PIR08DPE15",
    material: "60 80 0815",
    discharge: "DN 40",
    power: "1.5 kW",
    powerKw: 1.5,
    voltage: "400 V · 3~ · 50 Hz",
    impeller: "Cutter / grinder",
    maxHead: "38 m",
    maxFlow: "6 l/s",
    solids: "Grinds to slurry",
    efficiency: "IE2",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "33 kg",
    tier: "Grinder",
    availability: "In stock",
    comment: "Grinder pump for pressurised sewer systems and high-head small bore.",
  },
  {
    id: "scavenger-sc",
    range: "ABS Scavenger",
    model: "SC 380/2 D",
    article: "SC3802DXX",
    material: "60 80 0380",
    discharge: "DN 50",
    power: "2.4 kW",
    powerKw: 2.4,
    voltage: "400 V · 3~ · 50 Hz",
    impeller: "Open vortex",
    maxHead: "21 m",
    maxFlow: "14 l/s",
    solids: "44 mm",
    efficiency: "IE2",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "37 kg",
    tier: "Standard",
    availability: "2–3 week lead time",
    comment: "Robust general-purpose drainage and effluent pump for contractor duty.",
  },
  {
    id: "mf-154",
    range: "ABS MF",
    model: "154-MF PE90/8",
    article: "MF154PE90",
    material: "60 80 0154",
    discharge: "DN 400",
    power: "9.0 kW",
    powerKw: 9.0,
    voltage: "400 V · 3~ · 50 Hz",
    impeller: "Mixed-flow propeller",
    maxHead: "7 m",
    maxFlow: "420 l/s",
    solids: "—",
    efficiency: "IE3 Premium Efficiency",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "210 kg",
    tier: "High-flow",
    availability: "Contact distributor",
    comment: "Mixed-flow column pump for stormwater and high-volume / low-head transfer.",
  },
  {
    id: "robusta-300",
    range: "ABS Robusta",
    model: "300 TS/A",
    article: "ROB300TSA",
    material: "60 80 0300",
    discharge: "DN 40",
    power: "0.3 kW",
    powerKw: 0.3,
    voltage: "230 V · 1~ · 50 Hz",
    impeller: "Open vortex",
    maxHead: "8 m",
    maxFlow: "4 l/s",
    solids: "10 mm",
    efficiency: "—",
    protection: "IP68",
    temp: "−10 °C … 40 °C",
    weight: "6 kg",
    tier: "Drainage",
    availability: "In stock",
    comment: "Portable drainage pump for cellars, sumps and light dewatering.",
  },
];

// ---- Existing competitor pumps, grouped by brand ----
// Each carries the few specs needed for the comparison + the recommended
// Sulzer replacement id and whether it is a true drop-in.
export const EXISTING = {
  Flygt: [
    { model: "NP 3085 SH", partNo: "NP3085.181-SH", rsk: "581 22 10", discharge: "DN 80", power: "2.4 kW", powerKw: 2.4, voltage: "400 V · 3~", maxHead: "22 m", maxFlow: "30 l/s", rep: "xfp-81c", fit: "drop-in" },
    { model: "NP 3102 MT", partNo: "NP3102.181-MT", rsk: "581 22 14", discharge: "DN 100", power: "3.1 kW", powerKw: 3.1, voltage: "400 V · 3~", maxHead: "25 m", maxFlow: "44 l/s", rep: "xfp-100c", fit: "drop-in" },
    { model: "NP 3127 HT", partNo: "NP3127.181-HT", rsk: "581 22 31", discharge: "DN 150", power: "9.0 kW", powerKw: 9.0, voltage: "400 V · 3~", maxHead: "30 m", maxFlow: "88 l/s", rep: "xfp-150e", fit: "adapter" },
    { model: "DP 3068", partNo: "DP3068.181", rsk: "581 20 68", discharge: "DN 50", power: "2.8 kW", powerKw: 2.8, voltage: "400 V · 3~", maxHead: "20 m", maxFlow: "13 l/s", rep: "scavenger-sc", fit: "drop-in" },
  ],
  Grundfos: [
    { model: "SE1.80.80.22", partNo: "98044186", rsk: "581 30 22", discharge: "DN 80", power: "2.2 kW", powerKw: 2.6, voltage: "400 V · 3~", maxHead: "21 m", maxFlow: "29 l/s", rep: "xfp-81c", fit: "drop-in" },
    { model: "SEV.80.80.40", partNo: "96872079", rsk: "581 30 40", discharge: "DN 80", power: "4.0 kW", powerKw: 4.2, voltage: "400 V · 3~", maxHead: "26 m", maxFlow: "34 l/s", rep: "xfp-100c", fit: "adapter" },
    { model: "S1.100.150.75", partNo: "98669235", rsk: "581 31 75", discharge: "DN 150", power: "7.5 kW", powerKw: 8.4, voltage: "400 V · 3~", maxHead: "29 m", maxFlow: "92 l/s", rep: "xfp-150e", fit: "drop-in" },
    { model: "SL1.50.65.15", partNo: "98621750", rsk: "581 32 15", discharge: "DN 40", power: "1.5 kW", powerKw: 1.7, voltage: "400 V · 3~", maxHead: "36 m", maxFlow: "6 l/s", rep: "piranha-08", fit: "drop-in" },
  ],
  KSB: [
    { model: "Amarex N F 80-220", partNo: "47900220", rsk: "581 40 22", discharge: "DN 80", power: "2.4 kW", powerKw: 2.7, voltage: "400 V · 3~", maxHead: "23 m", maxFlow: "31 l/s", rep: "xfp-81c", fit: "adapter" },
    { model: "Amarex KRT F 100-251", partNo: "47910251", rsk: "581 41 25", discharge: "DN 100", power: "3.0 kW", powerKw: 3.3, voltage: "400 V · 3~", maxHead: "26 m", maxFlow: "45 l/s", rep: "xfp-100c", fit: "drop-in" },
    { model: "Amarex KRT K 200-401", partNo: "47920401", rsk: "581 42 40", discharge: "DN 200", power: "15 kW", powerKw: 16.2, voltage: "400 V · 3~", maxHead: "33 m", maxFlow: "148 l/s", rep: "xfp-201g", fit: "drop-in" },
  ],
  Wilo: [
    { model: "Rexa FIT V06DA", partNo: "6079565", rsk: "581 50 06", discharge: "DN 80", power: "2.5 kW", powerKw: 2.8, voltage: "400 V · 3~", maxHead: "22 m", maxFlow: "30 l/s", rep: "xfp-81c", fit: "drop-in" },
    { model: "Rexa PRO V08DA", partNo: "6086821", rsk: "581 50 08", discharge: "DN 100", power: "4.0 kW", powerKw: 4.4, voltage: "400 V · 3~", maxHead: "27 m", maxFlow: "47 l/s", rep: "xfp-100c", fit: "adapter" },
    { model: "EMU FA 15.52", partNo: "6077442", rsk: "581 51 52", discharge: "DN 300", power: "30 kW", powerKw: 32.5, voltage: "400 V · 3~", maxHead: "28 m", maxFlow: "305 l/s", rep: "xfp-305m", fit: "drop-in" },
  ],
  Ebara: [
    { model: "DW VOX 200", partNo: "DWVOX200", rsk: "581 60 20", discharge: "DN 50", power: "1.5 kW", powerKw: 1.8, voltage: "400 V · 3~", maxHead: "19 m", maxFlow: "12 l/s", rep: "scavenger-sc", fit: "drop-in" },
    { model: "Right 100 DL", partNo: "RIGHT100DL", rsk: "581 61 00", discharge: "DN 100", power: "3.0 kW", powerKw: 3.4, voltage: "400 V · 3~", maxHead: "24 m", maxFlow: "43 l/s", rep: "xfp-100c", fit: "adapter" },
  ],
  Tsurumi: [
    { model: "80B41.5", partNo: "80B415", rsk: "581 70 15", discharge: "DN 80", power: "1.5 kW", powerKw: 1.8, voltage: "400 V · 3~", maxHead: "13 m", maxFlow: "16 l/s", rep: "as-0530", fit: "drop-in" },
    { model: "KTZ 411", partNo: "KTZ411", rsk: "581 70 41", discharge: "DN 100", power: "11 kW", powerKw: 12.1, voltage: "400 V · 3~", maxHead: "28 m", maxFlow: "60 l/s", rep: "xfp-150e", fit: "adapter" },
  ],
};

export const BRANDS = Object.keys(EXISTING);

export function getReplacement(id) {
  return REPLACEMENTS.find((r) => r.id === id) || REPLACEMENTS[0];
}

export function findExisting(brand, model) {
  const list = EXISTING[brand] || [];
  return list.find((m) => m.model === model) || null;
}

const normCode = (s) => String(s || "").replace(/[^a-z0-9]/gi, "").toUpperCase();

// Resolve a competitor part number, RSK number, or model code directly to the
// installed pump (and therefore its Sulzer replacement). Exact normalised
// match first, then a forgiving startsWith on part / RSK numbers.
export function searchByCode(raw) {
  const q = normCode(raw);
  if (!q) return null;
  let partial = null;
  for (const brand of BRANDS) {
    for (const m of EXISTING[brand]) {
      const codes = [m.rsk, m.partNo, m.model].map(normCode);
      if (codes.includes(q)) return { brand, model: m.model };
      if (!partial && q.length >= 4 && (normCode(m.partNo).startsWith(q) || normCode(m.rsk).startsWith(q))) {
        partial = { brand, model: m.model };
      }
    }
  }
  return partial;
}

export default { REPLACEMENTS, EXISTING, BRANDS, DEFAULT_REPLACEMENT_ID, getReplacement, findExisting, searchByCode };
