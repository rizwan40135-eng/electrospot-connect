import { useMemo, useState } from "react";
import { CalendarCheck, Check, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";

import { BrandLogo, CatalogImage } from "@/components/catalog-image";
import { OrderRequest } from "@/components/order-request";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const SIZES: HouseSize[] = ["1000", "1500", "2000"];
const TIERS: Tier[] = ["Economy", "Standard", "Smart Home"];
const SLOTS = ["09:00 – 11:00", "11:00 – 13:00", "14:00 – 16:00", "16:00 – 18:00"];

type Mode = "size" | "custom";

export function PackageEstimator({
  professional = false,
  search = {},
}: {
  professional?: boolean;
  search?: { brand?: string | undefined; mode?: "custom" | undefined };
}) {
  const requestedBrand = BRANDS.some((item) => item.id === search.brand) ? search.brand : undefined;
  const [mode, setMode] = useState<Mode>(search.mode ?? (professional ? "custom" : "size"));
  const [size, setSize] = useState<HouseSize>("1500");
  const [tier, setTier] = useState<Tier>("Standard");
  const [brandId, setBrandId] = useState(requestedBrand ?? "gm");
  const [qty, setQty] = useState<Record<string, number>>({ ...DEFAULT_QUANTITIES });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const brand = BRANDS.find((b) => b.id === brandId) ?? BRANDS[0]!;

  const bom = useMemo(
    () =>
      mode === "size"
        ? buildBom(size, tier).map((item) => ({
            ...item,
            retail: brandPrice(item.retail, brand.factor),
            ours: brandPrice(item.ours, brand.factor),
          }))
        : customBom(qty, brand.factor),
    [mode, size, tier, qty, brand.factor],
  );
  const retail = bom.reduce((s, i) => s + i.retail, 0);
  const ours = bom.reduce((s, i) => s + i.ours, 0);
  const savings = retail - ours;
  const pct = retail > 0 ? Math.round((savings / retail) * 100) : 0;
  const itemCount = bom.length;

  function setQ(id: string, v: number) {
    setQty((p) => ({ ...p, [id]: Math.max(0, Math.min(999, v)) }));
  }

  function book() {
    if (name.trim().length < 2) {
      toast.error("Please enter your name.");
      return;
    }
    if (!/^[0-9+\s-]{8,20}$/.test(phone.trim())) {
      toast.error("Enter a valid phone number.");
      return;
    }
    if (!date) {
      toast.error("Pick an inspection date.");
      return;
    }
    if (!slot) {
      toast.error("Pick a time slot.");
      return;
    }
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
        <h1 className="text-3xl font-semibold">
          {professional ? "Electrician / Contractor" : "Homeowner"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {professional
            ? "Buy electrical materials on behalf of homeowners. Build a project list, review the order and earn rewards on eligible purchases."
            : "Estimate a package by house size, or select Place Order to choose products and quantities."}
        </p>

        {professional && (
          <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm">
            <p className="font-semibold text-primary">Buy for owners. Earn rewards.</p>
            <p className="mt-1 text-muted-foreground">
              Rewards will apply to eligible confirmed purchases. Reward rates and payout terms are
              being configured; this preview does not credit rewards.
            </p>
          </div>
        )}
        <div className="mt-6 inline-flex flex-wrap gap-2 rounded-xl border border-border/70 bg-background/40 p-1">
          {(
            [
              { id: "size", label: professional ? "By house size" : "Package Estimator" },
              { id: "custom", label: professional ? "By products & quantity" : "Place Order" },
            ] as { id: Mode; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                mode === m.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <section className="mt-6" aria-label="Brand selection">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">Choose a brand</CardTitle>
              <CardDescription>
                Choose your preferred brand for your estimate or order. Prices are illustrative.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {BRANDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBrandId(b.id)}
                  aria-pressed={brandId === b.id}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all",
                    brandId === b.id
                      ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                      : "border-border/70 bg-background/40 hover:border-primary/50",
                  )}
                >
                  <BrandLogo brand={b} className="mb-3" />
                  <span className="block font-display font-semibold">{b.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{b.note}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0 space-y-6">
            {mode === "size" ? (
              <>
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
                          {s === "1000"
                            ? "2 BHK typical"
                            : s === "1500"
                              ? "3 BHK typical"
                              : "Duplex / villa"}
                        </span>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="text-base">2. Package tier</CardTitle>
                    <CardDescription>
                      All tiers are ISI-certified and installation-ready.
                    </CardDescription>
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
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {TIER_BLURB[t]}
                        </span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="surface-card">
                  <CardHeader className="flex-row items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">2. Products & quantities</CardTitle>
                      <CardDescription>
                        Everything a house wiring job typically needs — set your own counts.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQty({ ...DEFAULT_QUANTITIES })}
                    >
                      Reset
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <div key={cat}>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {cat}
                        </p>
                        <div className="space-y-2">
                          {PRODUCTS.filter((p) => p.category === cat).map((p) => (
                            <div
                              key={p.id}
                              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/40 p-3"
                            >
                              <div className="flex min-w-0 basis-full items-center gap-3 sm:basis-auto sm:flex-1">
                                <CatalogImage src={p.image} alt={p.name} />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium">{p.name}</p>
                                  <p className="text-xs text-muted-foreground">{p.spec}</p>
                                </div>
                              </div>
                              <div className="text-right text-xs">
                                <span className="text-muted-foreground line-through">
                                  {inr(brandPrice(p.retail, brand.factor))}
                                </span>{" "}
                                <span className="font-medium text-primary">
                                  {inr(brandPrice(p.ours, brand.factor))}
                                </span>
                                <span className="block text-muted-foreground">per {p.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  aria-label={`Decrease ${p.name}`}
                                  onClick={() => setQ(p.id, (qty[p.id] ?? 0) - 1)}
                                >
                                  <Minus className="size-4" />
                                </Button>
                                <Input
                                  aria-label={`${p.name} quantity`}
                                  className="w-16 text-center"
                                  inputMode="numeric"
                                  value={qty[p.id] ?? 0}
                                  onChange={(e) =>
                                    setQ(p.id, Number(e.target.value.replace(/\D/g, "")) || 0)
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  aria-label={`Increase ${p.name}`}
                                  onClick={() => setQ(p.id, (qty[p.id] ?? 0) + 1)}
                                >
                                  <Plus className="size-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            <Card className="surface-card">
              <CardHeader className="flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">3. Bill of materials</CardTitle>
                  <CardDescription>
                    {mode === "size"
                      ? `${brand.name} / ${SIZE_LABELS[size]} · ${tier} package`
                      : `${brand.name} · ${itemCount} product${itemCount === 1 ? "" : "s"} selected`}
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
                      {bom.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="py-6 text-center text-sm text-muted-foreground"
                          >
                            Add quantities above to build your list.
                          </TableCell>
                        </TableRow>
                      )}
                      {bom.map((i) => (
                        <TableRow key={i.name}>
                          <TableCell>
                            <span className="font-medium">{i.name}</span>
                            <span className="block text-xs text-muted-foreground">{i.spec}</span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {i.qty}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground line-through">
                            {inr(i.retail)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-primary">
                            {inr(i.ours)}
                          </TableCell>
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

                <OrderRequest
                  items={bom}
                  packageLabel={
                    mode === "size" ? `${brand.name} / ${SIZE_LABELS[size]} / ${tier}` : brand.name
                  }
                  professional={professional}
                />
                <p className="text-xs text-muted-foreground">
                  Illustrative prices. Final pricing, stock, taxes and delivery are confirmed before
                  payment.
                </p>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="h-auto min-h-10 w-full whitespace-normal px-4 py-2"
                    >
                      <CalendarCheck className="size-4" /> Request Free On-Site Inspection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book your free inspection</DialogTitle>
                      <DialogDescription>
                        A technician visits your site, counts switch points and finalises your
                        package.
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
                        Package in context:{" "}
                        {mode === "size"
                          ? `${brand.name} / ${SIZE_LABELS[size]} · ${tier}`
                          : `${brand.name} · ${itemCount} products`}{" "}
                        · {inr(ours)}
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
