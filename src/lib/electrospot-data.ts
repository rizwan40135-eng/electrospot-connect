export const LEAD_STAGES = [
  "Submitted",
  "Verified",
  "Site Inspected",
  "Deal Closed",
  "Cashback Paid",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export type ConstructionStage = "Foundation" | "Framing" | "Wiring Stage";

export type Lead = {
  id: string;
  address: string;
  stage: ConstructionStage;
  status: LeadStage;
  submittedOn: string;
  reward: number;
  ownerName?: string | undefined;
  ownerPhone?: string | undefined;
  photoNote?: string | undefined;
  geo: string;
};

export const SEED_LEADS: Lead[] = [
  {
    id: "ES-1042",
    address: "Plot 18, Green Meadows, Kompally",
    stage: "Framing",
    status: "Cashback Paid",
    submittedOn: "12 Aug 2026",
    reward: 4500,
    ownerName: "R. Prasad",
    ownerPhone: "+91 98••• ••210",
    geo: "17.5449, 78.4983",
  },
  {
    id: "ES-1058",
    address: "Survey 44/2, Nallagandla Main Rd",
    stage: "Wiring Stage",
    status: "Deal Closed",
    submittedOn: "16 Aug 2026",
    reward: 6200,
    ownerName: "S. Fatima",
    geo: "17.4732, 78.3121",
  },
  {
    id: "ES-1071",
    address: "Villa 7, Sunrise Enclave, Shamirpet",
    stage: "Foundation",
    status: "Site Inspected",
    submittedOn: "20 Aug 2026",
    reward: 3000,
    geo: "17.6109, 78.5687",
  },
  {
    id: "ES-1088",
    address: "H.No 3-11, Beeramguda Extension",
    stage: "Framing",
    status: "Verified",
    submittedOn: "23 Aug 2026",
    reward: 3000,
    ownerName: "K. Rao",
    ownerPhone: "+91 90••• ••477",
    geo: "17.5001, 78.3212",
  },
  {
    id: "ES-1093",
    address: "Lane 5, Bachupally Housing Board",
    stage: "Foundation",
    status: "Submitted",
    submittedOn: "25 Aug 2026",
    reward: 0,
    geo: "17.5541, 78.3822",
  },
];

export type HouseSize = "1000" | "1500" | "2000";
export type Tier = "Economy" | "Standard" | "Smart Home";

export type BomItem = {
  name: string;
  spec: string;
  qty: string;
  retail: number;
  ours: number;
};

const BASE_BOM: Record<Tier, BomItem[]> = {
  Economy: [
    { name: "FR Copper Wire", spec: "1.5 / 2.5 sq mm coils", qty: "12 coils", retail: 32400, ours: 25900 },
    { name: "PVC Conduit Pipe", spec: "25mm ISI heavy duty", qty: "60 lengths", retail: 10800, ours: 8200 },
    { name: "Distribution Board", spec: "8-way SPN + MCBs", qty: "1 set", retail: 9400, ours: 7100 },
    { name: "Modular Switches", spec: "Matte white, 6A", qty: "72 points", retail: 21600, ours: 16400 },
    { name: "Junction & Concealed Boxes", spec: "GI, 1M–8M", qty: "48 nos", retail: 6200, ours: 4600 },
  ],
  Standard: [
    { name: "FR-LSH Copper Wire", spec: "1.5 / 2.5 / 4 sq mm", qty: "16 coils", retail: 46800, ours: 36200 },
    { name: "PVC Conduit Pipe", spec: "25mm + 32mm heavy duty", qty: "78 lengths", retail: 14600, ours: 11100 },
    { name: "Distribution Board", spec: "12-way TPN + RCCB", qty: "1 set", retail: 16800, ours: 12900 },
    { name: "Modular Switches", spec: "Premium glossy, 6A/16A", qty: "96 points", retail: 34600, ours: 26300 },
    { name: "Earthing Kit", spec: "Copper plate + chemical", qty: "1 kit", retail: 12400, ours: 9500 },
    { name: "Cat6 + Coax Backbone", spec: "TV / LAN drops", qty: "8 drops", retail: 9800, ours: 7400 },
  ],
  "Smart Home": [
    { name: "FR-LSH Copper Wire", spec: "1.5 / 2.5 / 4 / 6 sq mm", qty: "20 coils", retail: 58900, ours: 44800 },
    { name: "PVC Conduit Pipe", spec: "Full concealed network", qty: "92 lengths", retail: 18200, ours: 13800 },
    { name: "Smart Distribution Board", spec: "16-way TPN + surge + RCCB", qty: "1 set", retail: 28400, ours: 21600 },
    { name: "Smart Switch Modules", spec: "Wi-Fi + retrofit relays", qty: "110 points", retail: 74500, ours: 56200 },
    { name: "Automation Hub & Sensors", spec: "Hub, motion, door, smoke", qty: "1 kit", retail: 31200, ours: 23400 },
    { name: "Structured Cabling", spec: "Cat6A, rack, patch panel", qty: "14 drops", retail: 21800, ours: 16300 },
  ],
};

const SIZE_FACTOR: Record<HouseSize, number> = {
  "1000": 1,
  "1500": 1.42,
  "2000": 1.86,
};

export const SIZE_LABELS: Record<HouseSize, string> = {
  "1000": "1000 sq ft",
  "1500": "1500 sq ft",
  "2000": "2000+ sq ft",
};

export const TIER_BLURB: Record<Tier, string> = {
  Economy: "ISI-grade essentials for a safe, budget-first build.",
  Standard: "Balanced premium wiring with data backbone included.",
  "Smart Home": "Full automation-ready wiring with app control.",
};

export function buildBom(size: HouseSize, tier: Tier): BomItem[] {
  const f = SIZE_FACTOR[size];
  return BASE_BOM[tier].map((i) => ({
    ...i,
    qty: scaleQty(i.qty, f),
    retail: Math.round((i.retail * f) / 100) * 100,
    ours: Math.round((i.ours * f) / 100) * 100,
  }));
}

function scaleQty(qty: string, f: number) {
  return qty.replace(/^(\d+)/, (m) => String(Math.round(Number(m) * f)));
}

export function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/* ---------- Product-wise (custom) estimator ---------- */

export type Brand = {
  id: string;
  name: string;
  note: string;
  factor: number; // price multiplier vs base
};

export const BRANDS: Brand[] = [
  { id: "gm", name: "GM Modular", note: "Popular value-for-money modular range", factor: 1 },
  { id: "havells", name: "Havells", note: "Wide service network, premium finish", factor: 1.18 },
  { id: "polycab", name: "Polycab", note: "Strong in wires & cables", factor: 1.1 },
  { id: "anchor", name: "Anchor by Panasonic", note: "Budget-friendly essentials", factor: 0.92 },
  { id: "legrand", name: "Legrand", note: "High-end switches & automation", factor: 1.35 },
];

export type ProductCategory =
  | "Wires & Cables"
  | "Conduits & Boxes"
  | "Switches & Sockets"
  | "Protection & DB"
  | "Lighting & Fans"
  | "Data & Smart";

export type Product = {
  id: string;
  name: string;
  spec: string;
  category: ProductCategory;
  unit: string;
  retail: number; // per unit, base brand
  ours: number; // per unit, base brand
  defaultQty: number;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Wires & Cables",
  "Conduits & Boxes",
  "Switches & Sockets",
  "Protection & DB",
  "Lighting & Fans",
  "Data & Smart",
];

export const PRODUCTS: Product[] = [
  { id: "w15", name: "FR Copper Wire 1.5 sq mm", spec: "90m coil, lighting circuits", category: "Wires & Cables", unit: "coil", retail: 2450, ours: 1890, defaultQty: 6 },
  { id: "w25", name: "FR Copper Wire 2.5 sq mm", spec: "90m coil, power circuits", category: "Wires & Cables", unit: "coil", retail: 3850, ours: 2990, defaultQty: 4 },
  { id: "w40", name: "FR-LSH Copper Wire 4 sq mm", spec: "90m coil, AC / geyser lines", category: "Wires & Cables", unit: "coil", retail: 6100, ours: 4780, defaultQty: 2 },
  { id: "w60", name: "FR-LSH Copper Wire 6 sq mm", spec: "90m coil, mains sub-feed", category: "Wires & Cables", unit: "coil", retail: 8900, ours: 6950, defaultQty: 1 },
  { id: "c25", name: "PVC Conduit Pipe 25mm", spec: "ISI heavy duty, 3m length", category: "Conduits & Boxes", unit: "length", retail: 185, ours: 139, defaultQty: 60 },
  { id: "c32", name: "PVC Conduit Pipe 32mm", spec: "ISI heavy duty, 3m length", category: "Conduits & Boxes", unit: "length", retail: 265, ours: 198, defaultQty: 18 },
  { id: "cbox", name: "Concealed GI Box", spec: "1M / 2M / 4M sizes", category: "Conduits & Boxes", unit: "no", retail: 145, ours: 105, defaultQty: 40 },
  { id: "jbox", name: "Junction / Fan Box", spec: "Deep GI with hook", category: "Conduits & Boxes", unit: "no", retail: 210, ours: 158, defaultQty: 10 },
  { id: "sw6", name: "Modular Switch 6A", spec: "1-way, matte finish", category: "Switches & Sockets", unit: "no", retail: 165, ours: 122, defaultQty: 60 },
  { id: "sk16", name: "Modular Socket 16A", spec: "6A/16A universal", category: "Switches & Sockets", unit: "no", retail: 340, ours: 255, defaultQty: 18 },
  { id: "plate", name: "Modular Plate + Frame", spec: "2M – 8M, glossy white", category: "Switches & Sockets", unit: "no", retail: 420, ours: 315, defaultQty: 32 },
  { id: "dimmer", name: "Fan Regulator / Dimmer", spec: "Step-type modular", category: "Switches & Sockets", unit: "no", retail: 480, ours: 360, defaultQty: 6 },
  { id: "db8", name: "Distribution Board 8-way", spec: "SPN, double door", category: "Protection & DB", unit: "set", retail: 3200, ours: 2450, defaultQty: 1 },
  { id: "mcb", name: "MCB 6A–32A", spec: "C-curve, 10kA", category: "Protection & DB", unit: "no", retail: 320, ours: 240, defaultQty: 12 },
  { id: "rccb", name: "RCCB 40A 30mA", spec: "Shock protection", category: "Protection & DB", unit: "no", retail: 2600, ours: 1990, defaultQty: 1 },
  { id: "earth", name: "Earthing Kit", spec: "Copper plate + chemical", category: "Protection & DB", unit: "kit", retail: 8600, ours: 6700, defaultQty: 1 },
  { id: "led", name: "LED Panel / COB Light", spec: "10W–15W recessed", category: "Lighting & Fans", unit: "no", retail: 560, ours: 410, defaultQty: 24 },
  { id: "batten", name: "LED Batten 20W", spec: "4ft, cool white", category: "Lighting & Fans", unit: "no", retail: 640, ours: 470, defaultQty: 8 },
  { id: "fan", name: "Ceiling Fan 1200mm", spec: "BEE 5-star", category: "Lighting & Fans", unit: "no", retail: 3400, ours: 2650, defaultQty: 5 },
  { id: "exhaust", name: "Exhaust Fan 150mm", spec: "Bath / kitchen", category: "Lighting & Fans", unit: "no", retail: 1450, ours: 1090, defaultQty: 3 },
  { id: "cat6", name: "Cat6 LAN Cable", spec: "305m box", category: "Data & Smart", unit: "box", retail: 7400, ours: 5600, defaultQty: 1 },
  { id: "coax", name: "TV Coax + Outlets", spec: "RG6 with faceplates", category: "Data & Smart", unit: "drop", retail: 850, ours: 640, defaultQty: 4 },
  { id: "smartsw", name: "Smart Wi-Fi Switch Module", spec: "Retrofit relay, app control", category: "Data & Smart", unit: "no", retail: 1850, ours: 1420, defaultQty: 0 },
  { id: "hub", name: "Automation Hub + Sensors", spec: "Hub, motion, door, smoke", category: "Data & Smart", unit: "kit", retail: 14500, ours: 11200, defaultQty: 0 },
];

export function brandPrice(base: number, factor: number) {
  return Math.round((base * factor) / 5) * 5;
}

export function customBom(quantities: Record<string, number>, factor: number): BomItem[] {
  return PRODUCTS.filter((p) => (quantities[p.id] ?? 0) > 0).map((p) => {
    const q = quantities[p.id] as number;
    return {
      name: p.name,
      spec: p.spec,
      qty: `${q} ${p.unit}${q > 1 ? "s" : ""}`,
      retail: brandPrice(p.retail, factor) * q,
      ours: brandPrice(p.ours, factor) * q,
    };
  });
}

export const DEFAULT_QUANTITIES: Record<string, number> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p.defaultQty]),
);
