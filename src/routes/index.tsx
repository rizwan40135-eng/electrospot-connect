import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

import heroImg from "@/assets/electrospot-home-products.jpg";
import { BrandLogo, CatalogImage } from "@/components/catalog-image";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRANDS, PRODUCTS, brandPrice, inr } from "@/lib/electrospot-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ElectroSpot — Factory-Direct Wiring Packages & Lead Rewards" },
      {
        name: "description",
        content:
          "Direct-from-factory electrical packages for home construction. Earn cashback by spotting new builds near you.",
      },
      { property: "og:title", content: "ElectroSpot — Factory-Direct Wiring Packages & Lead Rewards" },
      {
        property: "og:description",
        content: "Bundled wiring packages for homeowners and cashback rewards for lead spotters.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [brandId, setBrandId] = useState(BRANDS[0]?.id ?? "gm");
  const brand = BRANDS.find((item) => item.id === brandId) ?? BRANDS[0];

  if (!brand) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="border-b border-border bg-primary">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:gap-8">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl leading-tight font-semibold text-primary-foreground sm:text-3xl">
                Direct-from-factory electrical packages for home construction
                <span className="block text-secondary">+ earn rewards.</span>
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link to="/homeowner" search={{ brand: brand.id, mode: "custom" }}>
                    Choose products <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-primary-foreground/60 bg-background/90">
                  <Link to="/spotter">Earn rewards</Link>
                </Button>
              </div>
            </div>
            <img
              src={heroImg}
              alt="Modern house under construction with electrical wires, switches, distribution board, conduits and lighting"
              width={1600}
              height={1000}
              className="h-44 w-full shrink-0 object-contain md:w-2/5"
            />
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-accent">Available brands</p>
                <h2 className="mt-1 text-xl font-semibold text-primary">Choose a brand for its products</h2>
              </div>
              <Button asChild>
                <Link to="/homeowner" search={{ brand: brand.id, mode: "custom" }}>
                  View all {brand.name} products <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" role="list" aria-label="Available electrical brands">
              {BRANDS.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={brand.id === item.id ? "default" : "outline"}
                  onClick={() => setBrandId(item.id)}
                  className="h-auto min-w-0 flex-col gap-1 px-2 py-2 text-xs whitespace-normal"
                  aria-pressed={brand.id === item.id}
                >
                  <BrandLogo brand={item} className="h-9 w-24 p-1" />
                  {item.name}
                </Button>
              ))}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.slice(0, 6).map((product) => (
                <Card key={product.id} className="border-border shadow-none transition-colors hover:border-accent">
                  <CardContent className="flex items-center gap-3 p-3">
                    <CatalogImage src={product.image} alt={product.name} className="size-14" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm leading-snug font-semibold text-primary">{product.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{product.spec}</p>
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                        <span className="text-xs text-muted-foreground line-through">
                          {inr(brandPrice(product.retail, brand.factor))}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {inr(brandPrice(product.ours, brand.factor))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-2">
        <div className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground">
          ElectroSpot — electrical supply & construction lead sourcing.
        </div>
      </footer>
    </div>
  );
}
