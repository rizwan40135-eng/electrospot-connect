import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Camera, ImageUp, MapPin, Wallet } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { StatusPipeline } from "@/components/status-pipeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  SEED_LEADS,
  inr,
  type ConstructionStage,
  type Lead,
} from "@/lib/electrospot-data";

export const Route = createFileRoute("/spotter")({
  head: () => ({
    meta: [
      { title: "Lead Spotter Portal — ElectroSpot" },
      {
        name: "description",
        content: "Submit construction site leads, track verification status and watch your cashback wallet grow.",
      },
      { property: "og:title", content: "Lead Spotter Portal — ElectroSpot" },
      { property: "og:description", content: "Submit site leads and track cashback payouts on ElectroSpot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpotterPage,
});

const STAGES: ConstructionStage[] = ["Foundation", "Framing", "Wiring Stage"];

function SpotterPage() {
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [address, setAddress] = useState("");
  const [geo, setGeo] = useState("");
  const [stage, setStage] = useState<ConstructionStage | "">("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [photoName, setPhotoName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const wallet = useMemo(() => {
    const paid = leads.filter((l) => l.status === "Cashback Paid").reduce((s, l) => s + l.reward, 0);
    const pending = leads.filter((l) => l.status !== "Cashback Paid").reduce((s, l) => s + l.reward, 0);
    return { paid, pending };
  }, [leads]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (address.trim().length < 6) { toast.error("Enter a fuller site address (min 6 characters)."); return; }
    if (!stage) { toast.error("Pick the current construction stage."); return; }
    if (!photoName) { toast.error("Attach a site photo so we can verify the build."); return; }

    const lead: Lead = {
      id: "ES-" + Math.floor(1100 + Math.random() * 800),
      address: address.trim().slice(0, 140),
      stage,
      status: "Submitted",
      submittedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      reward: 0,
      ownerName: ownerName.trim().slice(0, 60) || undefined,
      ownerPhone: ownerPhone.trim().slice(0, 20) || undefined,
      photoNote: photoName,
      geo: geo.trim() || "Pin dropped",
    };
    setLeads((p) => [lead, ...p]);
    toast.success(`Lead ${lead.id} submitted — verification within 48 hrs.`);
    setAddress("");
    setGeo("");
    setStage("");
    setOwnerName("");
    setOwnerPhone("");
    setPhotoName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Lead Spotter Portal</h1>
            <p className="mt-3 max-w-xl rounded-lg border-l-4 border-accent bg-accent/10 px-4 py-3 text-base font-semibold leading-relaxed text-primary">
              Spot an ongoing build, submit it, and earn cashback once the deal closes.
            </p>
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <Wallet className="size-3.5" /> Spotter ID SP-3391
          </Badge>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card className="surface-card border-primary/40">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Total Earned</p>
              <p className="mt-1 font-display text-3xl font-semibold text-primary">{inr(wallet.paid)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Paid to your bank account</p>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Pending Payouts</p>
              <p className="mt-1 font-display text-3xl font-semibold text-accent">{inr(wallet.pending)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Releases after deal closure</p>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Active Leads</p>
              <p className="mt-1 font-display text-3xl font-semibold">{leads.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Across all pipeline stages</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submit" className="mt-8">
          <TabsList>
            <TabsTrigger value="submit">Submit a Lead</TabsTrigger>
            <TabsTrigger value="mine">My Submissions</TabsTrigger>
          </TabsList>

          <TabsContent
            value="submit"
            className="mt-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-2"
          >
            <Card className="surface-card">
              <CardHeader>
                <CardTitle>New construction site</CardTitle>
                <CardDescription>Takes about 30 seconds. Owner contact is optional.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="photo">Site photo</Label>
                    <label
                      htmlFor="photo"
                      className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background/40 p-4 transition-colors hover:border-primary/60"
                    >
                      <span className="grid size-10 place-items-center rounded-lg bg-primary/12 text-primary">
                        {photoName ? <ImageUp className="size-5" /> : <Camera className="size-5" />}
                      </span>
                      <span className="text-sm">
                        <span className="block font-medium">{photoName || "Upload or capture a site photo"}</span>
                        <span className="block text-xs text-muted-foreground">JPG or PNG, geotag preserved</span>
                      </span>
                    </label>
                    <input
                      ref={fileRef}
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setPhotoName(e.target.files?.[0]?.name.slice(0, 60) ?? "")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Site address</Label>
                    <Input
                      id="address"
                      value={address}
                      maxLength={140}
                      placeholder="Plot / street / locality"
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="geo">Map pin (lat, lng)</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        id="geo"
                        value={geo}
                        maxLength={40}
                        placeholder="17.5449, 78.4983"
                        onChange={(e) => setGeo(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setGeo("17.4401, 78.3489");
                          toast.success("Pin dropped at your current location.");
                        }}
                      >
                        <MapPin className="size-4" /> Drop pin
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Construction stage</Label>
                    <Select value={stage} onValueChange={(v) => setStage(v as ConstructionStage)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="owner">Owner name (optional)</Label>
                      <Input
                        id="owner"
                        value={ownerName}
                        maxLength={60}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Owner phone (optional)</Label>
                      <Input
                        id="phone"
                        value={ownerPhone}
                        maxLength={20}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Button type="submit" size="lg">
                      Submit lead
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mine" className="mt-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
            <div className="grid gap-4">
              {leads.map((l) => (
                <Card key={l.id} className="surface-card">
                  <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-semibold">{l.id}</span>
                        <Badge variant="outline">{l.stage}</Badge>
                        <span className="text-xs text-muted-foreground">Submitted {l.submittedOn}</span>
                      </div>
                      <p className="mt-2 text-sm">{l.address}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" /> {l.geo}
                        {l.ownerName ? ` · Owner: ${l.ownerName}` : ""}
                      </p>
                      <div className="mt-4">
                        <StatusPipeline status={l.status} />
                      </div>
                    </div>
                    <div className="lg:text-right">
                      <p className="text-xs text-muted-foreground">Cashback</p>
                      <p className="font-display text-xl font-semibold text-primary">
                        {l.reward ? inr(l.reward) : "—"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {l.status === "Cashback Paid" ? "Paid" : "Pending"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
