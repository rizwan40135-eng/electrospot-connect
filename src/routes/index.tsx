import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeIndianRupee, ClipboardCheck, HardHat, Home, PackageCheck, Zap } from "lucide-react";

import heroImg from "@/assets/hero-construction.jpg";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    ],
  }),
  component: Landing,
});

const roles = [
  {
    to: "/homeowner" as const,
    icon: Home,
    title: "Homeowner",
    copy: "Estimate your full wiring package by house size and tier, see the item-by-item bill of materials, and book a free site inspection.",
    cta: "Build my package",
  },
  {
    to: "/spotter" as const,
    icon: BadgeIndianRupee,
    title: "Lead Spotter",
    copy: "Spot a construction site, submit it in 30 seconds, and track your cashback from verification to payout.",
    cta: "Submit a lead",
  },
  {
    to: "/inspector" as const,
    icon: HardHat,
    title: "Site Inspector",
    copy: "Work the verification queue, review geotagged site photos, and generate digital quotations on the spot.",
    cta: "Open dashboard",
  },
];

const stats = [
  { value: "22–31%", label: "Average saving vs retail" },
  { value: "₹6,200", label: "Top spotter payout this month" },
  { value: "48 hrs", label: "Lead verification window" },
  { value: "1,400+", label: "Homes wired" },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <img
            src={heroImg}
            alt="House under construction at dusk with electrical conduit and wire coils"
            width={1600}
            height={1008}
            className="absolute inset-0 size-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Zap className="size-3.5" /> Factory-direct electrical supply
              </span>
              <h1 className="mt-6 text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
                Direct-from-factory electrical packages for home construction
                <span className="text-electric"> + earn rewards by spotting new builds.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
                One portal for three roles: homeowners price complete wiring packages, spotters get paid cashback for
                verified construction leads, and inspectors close the loop with on-site quotations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/homeowner">
                    Estimate my package <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/spotter">Become a spotter</Link>
                </Button>
              </div>
            </div>

            <Card className="surface-card self-center border-border/70">
              <CardContent className="grid grid-cols-2 gap-6 p-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl font-semibold text-primary">{s.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">Choose your view</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every role has its own workspace. Switch anytime from the top navigation.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {roles.map((r) => (
              <Card
                key={r.title}
                className="surface-card group border-border/70 transition-all hover:-translate-y-1 hover:border-primary/50"
              >
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
                    <r.icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="flex-1 text-sm text-muted-foreground">{r.copy}</p>
                  <Button asChild variant="ghost" className="justify-start px-0 text-primary hover:bg-transparent">
                    <Link to={r.to}>
                      {r.cta}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-semibold sm:text-3xl">How a lead becomes a wired home</h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-4">
              {[
                { icon: BadgeIndianRupee, t: "Spot", d: "A spotter photographs an ongoing build and drops a pin." },
                { icon: ClipboardCheck, t: "Verify", d: "Admin checks the geotag, stage and owner contact." },
                { icon: HardHat, t: "Inspect", d: "A technician visits, counts points and quotes digitally." },
                { icon: PackageCheck, t: "Deliver", d: "Package ships from factory; spotter cashback is paid." },
              ].map((s, i) => (
                <li key={s.t} className="rounded-xl border border-border/70 bg-background/40 p-5">
                  <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                  <s.icon className="mt-3 size-5 text-primary" />
                  <h3 className="mt-3 font-semibold">{s.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground">
          ElectroSpot — electrical supply & construction lead sourcing.
        </div>
      </footer>
    </div>
  );
}
