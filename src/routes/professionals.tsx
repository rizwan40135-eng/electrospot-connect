import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/professionals")({
  head: () => ({ meta: [{ title: "ElectroSpot — Electricians & Contractors" }] }),
  component: Professionals,
});

function Professionals() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <section className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold text-accent">For electricians &amp; contractors</p>
          <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
            Buy for your customers. Build your business.
          </h1>
          <p className="text-muted-foreground">
            Plan electrical supplies for each project, explore brands and collect everything in one
            quotation — from wherever you work.
          </p>
          <Button asChild>
            <Link to="/homeowner" search={{ brand: undefined, mode: "custom" }}>
              Build a project quotation
            </Link>
          </Button>
        </section>
        <section className="grid gap-4 sm:grid-cols-3" aria-label="How it works">
          {[
            [
              "1. Choose supplies",
              "Browse a brand’s products and add the quantities your customer needs.",
            ],
            [
              "2. Review your project",
              "Combine brands, select Electrician or Contractor and include your project reference.",
            ],
            [
              "3. Request a quotation",
              "Prepare your enquiry to confirm prices, stock and delivery before placing an order.",
            ],
          ].map(([title, copy]) => (
            <article key={title} className="rounded-xl border bg-card p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
            </article>
          ))}
        </section>
        <section className="rounded-xl border border-accent/30 bg-accent/5 p-6">
          <p className="text-xs font-semibold uppercase text-accent">
            Rewards concept · under validation
          </p>
          <h2 className="mt-2 text-xl font-semibold">Buy. Earn rewards. Repeat.</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We are exploring a 20% discount offer plus instant purchase rewards for electrical
            professionals. This is a proposed pilot offer; discounts and rewards are not active.
            Eligibility, reward timing and terms will be confirmed before launch.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Direct ordering and delivery coverage are also planned. For now, build a quotation and
            confirm availability for your site.
          </p>
        </section>
      </main>
    </div>
  );
}
