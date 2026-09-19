import { BRANDS, PRODUCTS } from "./electrospot-data";

export type CatalogProduct = {
  id: string;
  brandId: string;
  name: string;
  model: string;
  spec: string;
  unit: string;
  image: string;
  source: string;
};

// Manufacturer references identify products, not ElectroSpot stock or selling prices.
// Images are representative until the merchant supplies approved SKU photography.
const illustration = (id: string) => PRODUCTS.find((p) => p.id === id)!.image;
const gm = "https://www.gmmodular.com/switches-and-accessories/switches";
const havells = "https://havellspowerplus.havells.com/NotificationUpload/357_flashAttachment.pdf";
const polycab =
  "https://cms.polycab.com/media/q33mxdlf/house-wires-catalogue-with-suprema-march-25.pdf";
const anchor = "https://lsin.panasonic.com/switches-sockets/roma/roma-urban";

export const BRAND_CATALOG: CatalogProduct[] = [
  {
    id: "gm-aa1601",
    brandId: "gm",
    name: "Zurico 1-way switch",
    model: "AA 1 601",
    spec: "6AX · 1 module",
    unit: "piece",
    image: illustration("sw6"),
    source: gm,
  },
  {
    id: "gm-aa1602",
    brandId: "gm",
    name: "Zurico switch with indicator",
    model: "AA 1 602",
    spec: "6AX · 1-way · 1 module",
    unit: "piece",
    image: illustration("sw6"),
    source: gm,
  },
  {
    id: "gm-aa2379",
    brandId: "gm",
    name: "Zicono DP switch",
    model: "AA 2 379",
    spec: "32A · 2 modules · with indicator",
    unit: "piece",
    image: illustration("sw6"),
    source: gm,
  },
  {
    id: "havells-s3-15",
    brandId: "havells",
    name: "Life Line Plus S3 wire",
    model: "Life Line Plus S3 · 1.5 sq mm",
    spec: "1.5 sq mm · 90 m pack · colour to confirm",
    unit: "coil",
    image: illustration("w15"),
    source: havells,
  },
  {
    id: "havells-s3-25",
    brandId: "havells",
    name: "Life Line Plus S3 wire",
    model: "Life Line Plus S3 · 2.5 sq mm",
    spec: "2.5 sq mm · 90 m pack · colour to confirm",
    unit: "coil",
    image: illustration("w25"),
    source: havells,
  },
  {
    id: "havells-s3-40",
    brandId: "havells",
    name: "Life Line Plus S3 wire",
    model: "Life Line Plus S3 · 4 sq mm",
    spec: "4 sq mm · 90 m pack · colour to confirm",
    unit: "coil",
    image: illustration("w40"),
    source: havells,
  },
  {
    id: "polycab-optima-15",
    brandId: "polycab",
    name: "Optima+ LF FR wire",
    model: "Optima+ · 1.5 sq mm",
    spec: "1.5 sq mm · pack length and colour to confirm",
    unit: "coil",
    image: illustration("w15"),
    source: polycab,
  },
  {
    id: "polycab-optima-25",
    brandId: "polycab",
    name: "Optima+ LF FR wire",
    model: "Optima+ · 2.5 sq mm",
    spec: "2.5 sq mm · pack length and colour to confirm",
    unit: "coil",
    image: illustration("w25"),
    source: polycab,
  },
  {
    id: "polycab-optima-40",
    brandId: "polycab",
    name: "Optima+ LF FR wire",
    model: "Optima+ · 4 sq mm",
    spec: "4 sq mm · pack length and colour to confirm",
    unit: "coil",
    image: illustration("w40"),
    source: polycab,
  },
  {
    id: "anchor-roma-switch",
    brandId: "anchor",
    name: "Roma Urban switch",
    model: "Roma Urban · switch",
    spec: "Select rating, colour and module size in enquiry",
    unit: "piece",
    image: illustration("sw6"),
    source: anchor,
  },
  {
    id: "anchor-roma-socket",
    brandId: "anchor",
    name: "Roma Urban socket",
    model: "Roma Urban · socket",
    spec: "Select rating, colour and module size in enquiry",
    unit: "piece",
    image: illustration("sk16"),
    source: anchor,
  },
  {
    id: "anchor-roma-regulator",
    brandId: "anchor",
    name: "Roma Urban fan regulator",
    model: "Roma Urban · fan regulator",
    spec: "Finish and compatible variant to confirm",
    unit: "piece",
    image: illustration("dimmer"),
    source: anchor,
  },
  {
    id: "legrand-679412",
    brandId: "legrand",
    name: "Myrius 20A 1-way switch",
    model: "679412",
    spec: "1 module · Charcoal Grey",
    unit: "piece",
    image: illustration("sw6"),
    source: "https://shop.legrand.co.in/catalog/product/view/id/5094",
  },
  {
    id: "legrand-679402",
    brandId: "legrand",
    name: "Myrius switch with indicator",
    model: "679402",
    spec: "6A · 1-way · 1 module · Charcoal Grey",
    unit: "piece",
    image: illustration("sw6"),
    source: "https://shop.legrand.co.in/legrand-myrius-nextgen-6a-switch-1-way-1m-ind-graphite",
  },
  {
    id: "legrand-679313",
    brandId: "legrand",
    name: "Myrius touch switch",
    model: "679313",
    spec: "16A · 1-way · 2 modules · Silver",
    unit: "piece",
    image: illustration("smartsw"),
    source: "https://shop.legrand.co.in/legrand-myrius-nextgen-16a-touch-switch-2mod-1-way",
  },
];

export function brandProducts(brandId: string) {
  return BRAND_CATALOG.filter((product) => product.brandId === brandId);
}

export type QuoteItem = { productId: string; quantity: number };

export function normalizeQuote(value: unknown): QuoteItem[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, number>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    if (!BRAND_CATALOG.some((p) => p.id === item.productId)) continue;
    if (typeof item.quantity !== "number" || !Number.isFinite(item.quantity) || item.quantity < 1)
      continue;
    unique.set(item.productId, Math.min(999, Math.floor(item.quantity)));
  }
  return Array.from(unique, ([productId, quantity]) => ({ productId, quantity }));
}

export function quoteMessage(
  items: QuoteItem[],
  customer: { name: string; phone: string; location: string; notes: string; role: string },
) {
  const lines = normalizeQuote(items).map((item) => {
    const product = BRAND_CATALOG.find((p) => p.id === item.productId)!;
    const brand = BRANDS.find((b) => b.id === product.brandId)!;
    return `${brand.name} — ${product.name}\nModel/range: ${product.model}\n${product.spec}\nQuantity: ${item.quantity} ${product.unit}${item.quantity > 1 ? "s" : ""}`;
  });
  return [
    "ElectroSpot quotation enquiry",
    `Buying as: ${customer.role}`,
    `Name: ${customer.name.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    `Site/location: ${customer.location.trim()}`,
    "",
    ...lines.flatMap((line, i) => [`${i + 1}. ${line}`, ""]),
    `Requirements: ${customer.notes.trim() || "None specified"}`,
    "Please confirm exact variants, availability, final prices, taxes, delivery charges and lead time.",
  ].join("\n");
}
