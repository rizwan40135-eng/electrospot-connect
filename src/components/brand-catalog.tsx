import { useState } from "react";
import { brandProducts, type CatalogProduct } from "@/lib/brand-catalog";
import { BRANDS } from "@/lib/electrospot-data";
import { BrandLogo, CatalogImage } from "@/components/catalog-image";
import { useQuotation } from "@/components/quotation";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

export function BrandProductCard({ product }: { product: CatalogProduct }) {
  const { add, items } = useQuotation();
  const quantity = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  return (
    <article className="flex items-start gap-3 rounded-xl border bg-card p-3">
      <CatalogImage
        src={product.image}
        alt={`${product.name} — representative image`}
        className="size-14"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold">{product.name}</h3>
        <p className="text-xs text-accent">{product.model}</p>
        <p className="mt-1 text-xs text-muted-foreground">{product.spec}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium">Price on request</span>
          <Button
            size="sm"
            onClick={() => add(product.id)}
            disabled={quantity >= 999}
            aria-label={`Add ${product.model} to quotation`}
          >
            Add to quote{quantity > 0 ? ` (${quantity})` : ""}
          </Button>
        </div>
        <a
          className="mt-2 inline-block text-xs text-muted-foreground underline underline-offset-2"
          href={product.source}
          target="_blank"
          rel="noopener noreferrer"
        >
          Manufacturer details
        </a>
      </div>
    </article>
  );
}

export function BrandCatalogPage({ initialBrand }: { initialBrand?: string | undefined }) {
  const [brandId, setBrandId] = useState(
    BRANDS.some((b) => b.id === initialBrand) ? initialBrand : null,
  );
  const brand = BRANDS.find((b) => b.id === brandId);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold">Build your quotation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a brand, add products, then review quantities in your quotation basket.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {BRANDS.map((b) => (
            <Button
              key={b.id}
              variant={brandId === b.id ? "default" : "outline"}
              className="h-auto flex-col whitespace-normal py-3"
              aria-pressed={brandId === b.id}
              onClick={() => setBrandId(b.id)}
            >
              <BrandLogo brand={b} />
              {b.name}
            </Button>
          ))}
        </div>
        {brand && (
          <section className="mt-6" aria-label={`${brand.name} catalog`}>
            <h2 className="text-xl font-semibold">{brand.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Representative images. Exact variants, stock and prices confirmed in your quotation.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {brandProducts(brand.id).map((p) => (
                <BrandProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
