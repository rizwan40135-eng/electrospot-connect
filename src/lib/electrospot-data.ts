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
  ownerName?: string;
  ownerPhone?: string;
  photoNote?: string;
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
