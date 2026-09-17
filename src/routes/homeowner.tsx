import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarCheck, Check, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  BRANDS,
  DEFAULT_QUANTITIES,
  PRODUCTS,
  PRODUCT_CATEGORIES,
  SIZE_LABELS,
  TIER_BLURB,
  brandPrice,
  buildBom,
  customBom,
  inr,
  type HouseSize,
  type Tier,
} from "@/lib/electrospot-data";

export const Route = createFileRoute("/homeowner")({
  head: () => ({
    meta: [
      { title: "Package Estimator for Homeowners — ElectroSpot" },
      {
        name: "description",
        content:
          "Estimate your home wiring package by size and tier, compare retail vs factory-direct pricing, and book a free on-site inspection.",
      },
      { property: "og:title", content: "Package Estimator for Homeowners — ElectroSpot" },
      {
        property: "og:description",
        content: "Compare retail vs ElectroSpot pricing on a complete bill of materials for your build.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeownerPage,
});

const SIZES: HouseSize[] = ["1000", "1500", "2000"];
const TIERS: Tier[] = ["Economy", "Standard", "Smart Home"];
const SLOTS = ["09:00 – 11:00", "11:00 – 13:00", "14:00 – 16:00", "16:00 – 18:00"];

function HomeownerPage() {
  const [size, setSize] = useState<HouseSize>("1500");
  const [tier, setTier] = useState<Tier>("Standard");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const bom = useMemo(() => buildBom(size, tier), [size, tier]);
  const retail = bom.reduce((s, i) => s + i.retail, 0);
  const ours = bom.reduce((s, i) => s + i.ours, 0);
  const savings = retail - ours;
  const pct = Math.round((savings / retail) * 100);

  function book() {
    if (name.trim().length < 2) { toast.error("Please enter your name."); return; }
    if (!/^[0-9+\s-]{8,20}$/.test(phone.trim())) { toast.error("Enter a valid phone number."); return; }
    if (!date) { toast.error("Pick an inspection date."); return; }
    if (!slot) { toast.error("Pick a time slot."); return; }
    toast.success(`Inspection booked for ${date}, ${slot}. Our technician will call to confirm.`);
    setOpen(false);
    setName("");
    setPhone("");
    setDate("");
    setSlot("");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Package Estimator</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pick your built-up area and package tier. We ship the complete bundle from the factory — no distributor
          markup.
        </p>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="text-base">1. House size</CardTitle>
                <CardDescription>Total built-up area across floors.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      size === s
                        ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                        : "border-border/70 bg-background/40 hover:border-primary/50",
                    )}
                  >
                    <span className="font-display text-lg font-semibold">{SIZE_LABELS[s]}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {s === "1000" ? "2 BHK typical" : s === "1500" ? "3 BHK typical" : "Duplex / villa"}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="text-base">2. Package tier</CardTitle>
                <CardDescription>All tiers are ISI-certified and installation-ready.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {TIERS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      tier === t
                        ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                        : "border-border/70 bg-background/40 hover:border-primary/50",
                    )}
                  >
                    <span className="font-display font-semibold">{t}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{TIER_BLURB[t]}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="surface-card">
              <CardHeader className="flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">3. Bill of materials</CardTitle>
                  <CardDescription>
                    {SIZE_LABELS[size]} · {tier} package
                  </CardDescription>
                </div>
                <Badge className="bg-success/15 text-success">Save {pct}%</Badge>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Retail</TableHead>
                        <TableHead className="text-right">ElectroSpot</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bom.map((i) => (
                        <TableRow key={i.name}>
                          <TableCell>
                            <span className="font-medium">{i.name}</span>
                            <span className="block text-xs text-muted-foreground">{i.spec}</span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{i.qty}</TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground line-through">
                            {inr(i.retail)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-primary">{inr(i.ours)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 border-primary/30">
                        <TableCell colSpan={2} className="font-semibold">
                          Package total
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground line-through">
                          {inr(retail)}
                        </TableCell>
                        <TableCell className="text-right font-display text-lg font-semibold text-primary">
                          {inr(ours)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="surface-card border-primary/40">
              <CardContent className="space-y-4 p-6">
                <div>
                  <p className="text-xs text-muted-foreground">Your estimate</p>
                  <p className="font-display text-3xl font-semibold text-primary">{inr(ours)}</p>
                  <p className="text-xs text-muted-foreground">
                    You save {inr(savings)} vs retail {inr(retail)}
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Factory-sealed, ISI-certified materials",
                    "Free on-site point counting & layout",
                    "Delivery to site in 5–7 working days",
                  ].map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" /> {f}
                    </li>
                  ))}
                </ul>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      <CalendarCheck className="size-4" /> Request Free On-Site Inspection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book your free inspection</DialogTitle>
                      <DialogDescription>
                        A technician visits your site, counts switch points and finalises your package.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="bname">Name</Label>
                          <Input
                            id="bname"
                            value={name}
                            maxLength={60}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bphone">Phone</Label>
                          <Input
                            id="bphone"
                            value={phone}
                            maxLength={20}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="bdate">Preferred date</Label>
                          <Input
                            id="bdate"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Time slot</Label>
                          <Select value={slot} onValueChange={setSlot}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {SLOTS.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p className="rounded-lg bg-background/50 p-3 text-xs text-muted-foreground">
                        Package in context: {SIZE_LABELS[size]} · {tier} · {inr(ours)}
                      </p>
                    </div>
                    <DialogFooter>
                      <Button onClick={book}>Confirm booking</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" /> 10-yr wire warranty
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="size-4 text-primary" /> Site delivery
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>
    </div>
  );
}
