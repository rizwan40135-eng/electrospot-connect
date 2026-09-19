import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

import heroImg from "@/assets/electrical-products-hero.webp";
import { BrandProductCard } from "@/components/brand-catalog";
import { brandProducts } from "@/lib/brand-catalog";
import { BrandLogo } from "@/components/catalog-image";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { BRANDS } from "@/lib/electrospot-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ElectroSpot — Electrical Supplies for Homes & Professionals" },
      {
        name: "description",
        content:
          "Compare electrical brands, plan your home budget and build a quotation for your next project.",
      },
      {
        property: "og:title",
        content: "ElectroSpot — Electrical Supplies for Homes & Professionals",
      },
      {
        property: "og:description",
        content: "Electrical supplies for homeowners, electricians and contractors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [brandId, setBrandId] = useState<string | null>(null);
  const brand = BRANDS.find((item) => item.id === brandId);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="border-b border-border bg-[#ece4d8]">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:gap-8">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl leading-tight font-semibold text-primary sm:text-3xl">
                Electrical supplies for every home.
                <span className="block text-accent">More value for every professional.</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Homeowners: estimate costs and compare brands. Electricians &amp; contractors:
                source supplies for your customers, wherever you work.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/homeowner" search={{ brand: undefined, mode: undefined }}>Estimate my home</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="bg-background/90">
                  <Link to="/professionals">For electricians &amp; contractors</Link>
                </Button>
              </div>
            </div>
            <img
              src={heroImg}
              alt="House under construction with warm lights and scaffolding, behind electrical wires, conduits, breakers, switches and lighting supplies"
              width={1200}
              height={400}
              className="h-44 w-full shrink-0 object-contain md:w-1/2"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 4%, black 96%, transparent), linear-gradient(to bottom, transparent, black 6%, black 94%, transparent)",
                maskComposite: "intersect",
              }}
            />
          </div>
        </section>

        <section id="brands" className="scroll-mt-24 border-b border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-accent">Explore brands</p>
                <h2 className="mt-1 text-xl font-semibold text-primary">
                  Choose a brand for its products
                </h2>
              </div>
              {brand && (
                <Button asChild>
                  <Link to="/homeowner" search={{ brand: brand.id, mode: "custom" }}>
                    Browse {brand.name} catalog <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>

            <div
              className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
              role="list"
              aria-label="Available electrical brands"
            >
              {BRANDS.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={brandId === item.id ? "default" : "outline"}
                  onClick={() => setBrandId(item.id)}
                  className="h-auto min-w-0 flex-col gap-1 px-2 py-2 text-xs whitespace-normal"
                  aria-pressed={brandId === item.id}
                  aria-controls="brand-products"
                >
                  <BrandLogo brand={item} className="h-9 w-24 p-1" />
                  {item.name}
                </Button>
              ))}
            </div>

            <div id="brand-products" aria-live="polite">
              {brand ? (
                <div
                  className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
                  role="region"
                  aria-label={`${brand.name} products`}
                >
                  <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-3">
                    Representative images. Exact variants, stock and prices confirmed in your
                    quotation.
                  </p>
                  {brandProducts(brand.id).map((product) => (
                    <BrandProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-2">
        <div className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground">
          ElectroSpot — marketplace pilot. Quotations now; direct ordering and purchase rewards are planned.
        </div>
      </footer>
    </div>
  );
}
