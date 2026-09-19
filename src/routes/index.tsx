import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, PackageCheck, Zap } from "lucide-react";

import heroImg from "@/assets/electrospot-home-products.jpg";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRANDS, PRODUCTS, brandPrice, inr } from "@/lib/electrospot-data";
import { cn } from "@/lib/utils";

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
        <section className="relative min-h-[34rem] overflow-hidden border-b border-border sm:min-h-[40rem]">
          <img
            src={heroImg}
            alt="Modern house under construction with electrical wires, switches, distribution board, conduits and lighting"
            width={1600}
            height={1000}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/5" />
          <div className="relative mx-auto flex min-h-[34rem] max-w-6xl items-center px-4 py-16 sm:min-h-[40rem]">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary/40 px-3 py-2 text-xs font-semibold uppercase text-primary-foreground backdrop-blur-sm">
                <Zap className="size-4" /> ElectroSpot
              </span>
              <h1 className="mt-6 text-4xl leading-[1.06] font-semibold text-primary-foreground sm:text-5xl lg:text-6xl">
                Direct-from-factory electrical packages for home construction
                <span className="block text-secondary">+ earn rewards.</span>
              </h1>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/homeowner" search={{ brand: brand.id, mode: "custom" }}>
                    Choose products <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/60 bg-background/90">
                  <Link to="/spotter">Earn rewards</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-accent">Available brands</p>
                <h2 className="mt-2 text-3xl font-semibold text-primary">Choose a brand for its products</h2>
              </div>
              <Button asChild>
                <Link to="/homeowner" search={{ brand: brand.id, mode: "custom" }}>
                  View all {brand.name} products <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-7 flex gap-2 overflow-x-auto pb-2" role="list" aria-label="Available electrical brands">
              {BRANDS.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={brand.id === item.id ? "default" : "outline"}
                  onClick={() => setBrandId(item.id)}
                  className="shrink-0"
                  aria-pressed={brand.id === item.id}
                >
                  {item.name}
                </Button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.slice(0, 6).map((product) => (
                <Card key={product.id} className="border-border shadow-none transition-colors hover:border-accent">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                        <PackageCheck className="size-5" />
                      </span>
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-primary">{product.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{product.spec}</p>
                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
                      <span className="text-xs font-medium text-accent">{brand.name}</span>
                      <div className="text-right">
                        <span className="mr-2 text-xs text-muted-foreground line-through">
                          {inr(brandPrice(product.retail, brand.factor))}
                        </span>
                        <span className="font-display text-lg font-semibold text-primary">
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

      <footer className="py-8">
        <div className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground">
          ElectroSpot — electrical supply & construction lead sourcing.
        </div>
      </footer>
    </div>
  );
}
