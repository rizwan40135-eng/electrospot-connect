import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";

import heroImg from "@/assets/construction-home-soft.webp";
import spotterImg from "@/assets/site-spotter-freelancer.png";
import professionalsImg from "@/assets/professionals-banner.webp";
import { BrandLogo } from "@/components/catalog-image";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { BRANDS } from "@/lib/electrospot-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ElectroSpot — Factory-Direct Wiring Packages & Lead Rewards" },
      {
        name: "description",
        content:
          "Direct-from-factory electrical packages for home construction. Earn cashback by spotting new builds near you.",
      },
      {
        property: "og:title",
        content: "ElectroSpot — Factory-Direct Wiring Packages & Lead Rewards",
      },
      {
        property: "og:description",
        content: "Bundled wiring packages for homeowners and cashback rewards for site spotters.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border bg-[#ece4d8]">
          <div className="mx-auto grid max-w-[1440px] items-center md:grid-cols-2">
            <div className="min-w-0 px-6 py-7 lg:pl-12 lg:pr-8">
              <h1 className="text-2xl leading-tight font-semibold text-primary sm:text-3xl">
                Building a Home?
                <span className="block text-accent">Bring Your Electrical Costs Down.</span>
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Get your complete electrical materials package from ElectroSpot—sourced directly
                from manufacturers to deliver better value for your entire home.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/homeowner" search={{ brand: undefined, mode: undefined }}>
                    Plan Your Home Package
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="bg-background/90">
                  <Link to="/homeowner" search={{ brand: undefined, mode: "custom" }}>
                    Shop Electrical Products
                  </Link>
                </Button>
              </div>
            </div>
            <img
              src={heroImg}
              alt="Unfinished concrete home in daylight with scaffolding and electrical wires, conduits, breakers and switches in the foreground"
              width={1774}
              height={887}
              className="mx-auto block h-auto max-h-48 w-[85%] object-contain md:max-h-52"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 5%, black 95%, transparent), linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
                maskComposite: "intersect",
              }}
            />
          </div>
        </section>

        <section id="brands" aria-labelledby="brands-heading" className="border-b border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <h2 id="brands-heading" className="text-xl font-semibold text-primary">
              Available Brands
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" aria-label="Available electrical brands">
              {BRANDS.map((item) => (
                <li key={item.id} className="flex min-w-0 flex-col items-center gap-1 rounded-md border border-border px-2 py-2 text-center text-xs">
                  <BrandLogo brand={item} className="h-9 w-24 p-1" />
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 md:grid-cols-2">
          <section aria-labelledby="professionals-heading" className="relative isolate flex overflow-hidden rounded-xl bg-[#291e16]">
            <img src={professionalsImg} alt="Electrician and contractor reviewing installation plans" width={1440} height={720} className="absolute inset-0 h-full w-full object-cover object-right" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#291e16] via-[#291e16]/90 to-[#291e16]/40" />
            <div className="relative flex w-full flex-col items-start px-6 py-6">
              <p className="text-xs font-semibold tracking-widest text-[#dfb77d]">ELECTRICIANS &amp; CONTRACTORS</p>
              <h2 id="professionals-heading" className="mt-2 text-2xl font-semibold leading-tight text-[#fff9f1]">Buy for Your Customers.<br />Earn Rewards.</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#f1e6d8]">Compare brands and source materials for every project, with better value through direct manufacturer sourcing.</p>
              <div className="mt-auto pt-4">
                <Button asChild size="sm" className="bg-[#a77b52] text-white hover:bg-[#8c633e]"><Link to="/electrician">Build Your Project Order <ArrowRight className="size-4" /></Link></Button>
                <p className="mt-2 text-xs text-[#e0cfbd]">Purchase rewards coming soon.</p>
              </div>
            </div>
          </section>
          <section aria-labelledby="spotter-heading" className="relative isolate flex min-h-[340px] overflow-hidden rounded-xl border border-[#c7ad8e] bg-[#ece4d8]">
            <img src={spotterImg} alt="Site spotter photographing a red-brick bungalow with a partially built tiled roof" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-[35%_center]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,transparent_15%,rgba(236,228,216,0.2)_30%,rgba(236,228,216,0.94)_52%,#ece4d8_100%)]" />
            <div className="relative ml-auto flex w-[57%] flex-col items-start justify-center py-6 pl-2 pr-4 sm:pr-6">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#79532f]">SITE SPOTTER</p>
              <h2 id="spotter-heading" className="mt-3 text-2xl font-semibold leading-tight text-[#291e16]">Spot a Site.<br /><span className="text-[#895d33]">Earn a Reward.</span></h2>
              <p className="mt-3 text-sm leading-relaxed text-[#423326]">Know of a home under construction? Share the details and earn cashback once the deal closes.</p>
              <Button asChild size="sm" className="mt-5 bg-[#895d33] text-white shadow-sm hover:bg-[#704a28]"><Link to="/spotter">Submit a Site <ArrowRight className="size-4" /></Link></Button>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border bg-[#ece4d8]/40 pt-4 pb-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-muted-foreground">
            ElectroSpot — electrical supply &amp; construction lead sourcing.
          </p>
          <address className="flex min-w-0 flex-col gap-2 text-sm not-italic text-primary sm:flex-row sm:flex-wrap sm:gap-x-5">
            <a href="tel:+919550421466" className="inline-flex items-center gap-2 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
              +91 9550421466
            </a>
            <a href="mailto:md.rizwan.shaik.devops.cloud@gmail.com" className="inline-flex min-w-0 items-center gap-2 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="break-all">md.rizwan.shaik.devops.cloud@gmail.com</span>
            </a>
          </address>
        </div>
      </footer>
      <a
        href={`https://wa.me/919550421466?text=${encodeURIComponent("Hi ElectroSpot, I’d like to know more about your electrical materials and home packages.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with ElectroSpot on WhatsApp (opens in a new tab)"
        className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#128C4A] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#0e713c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C4A]"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
        Chat on WhatsApp
      </a>
    </div>
  );
}

