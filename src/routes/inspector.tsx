import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Download, MapPin, XCircle } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEED_LEADS, inr, type Lead } from "@/lib/electrospot-data";

export const Route = createFileRoute("/inspector")({
  head: () => ({
    meta: [
      { title: "Inspector & Admin Dashboard — ElectroSpot" },
      {
        name: "description",
        content:
          "Verify geotagged construction leads and generate digital quotations with switch points, wire bundles and final package pricing.",
      },
      { property: "og:title", content: "Inspector & Admin Dashboard — ElectroSpot" },
      {
        property: "og:description",
        content: "Lead verification queue and digital quotation builder for ElectroSpot technicians.",
      },
    ],
  }),
  component: InspectorPage,
});

const RATE_PER_POINT = 640;
const RATE_PER_BUNDLE = 2150;
const DB_RATE = 7400;

function InspectorPage() {
  const [queue, setQueue] = useState<Lead[]>(SEED_LEADS.filter((l) => l.status === "Submitted" || l.status === "Verified"));
  const [points, setPoints] = useState(84);
  const [rooms, setRooms] = useState(7);
  const [dbBoxes, setDbBoxes] = useState(1);
  const [client, setClient] = useState("");

  const quote = useMemo(() => {
    const bundles = Math.ceil((points * 12.5) / 90);
    const wiring = bundles * RATE_PER_BUNDLE;
    const switches = points * RATE_PER_POINT;
    const boards = dbBoxes * DB_RATE;
    const conduit = rooms * 3800;
    const subtotal = wiring + switches + boards + conduit;
    const gst = Math.round(subtotal * 0.18);
    return { bundles, wiring, switches, boards, conduit, subtotal, gst, total: subtotal + gst };
  }, [points, rooms, dbBoxes]);

  function decide(id: string, ok: boolean) {
    setQueue((p) => p.filter((l) => l.id !== id));
    toast[ok ? "success" : "error"](ok ? `${id} verified — inspection scheduled.` : `${id} rejected.`);
  }

  function downloadQuote() {
    if (client.trim().length < 2) { toast.error("Enter the homeowner name first."); return; }
    const lines = [
      "ElectroSpot — Final Package Quotation",
      `Homeowner: ${client.trim().slice(0, 60)}`,
      `Date: ${new Date().toLocaleDateString("en-IN")}`,
      "",
      `Switch points: ${points} @ ${inr(RATE_PER_POINT)} = ${inr(quote.switches)}`,
      `Wire bundles: ${quote.bundles} @ ${inr(RATE_PER_BUNDLE)} = ${inr(quote.wiring)}`,
      `Conduit & boxes (${rooms} rooms) = ${inr(quote.conduit)}`,
      `Distribution boards: ${dbBoxes} = ${inr(quote.boards)}`,
      "",
      `Subtotal: ${inr(quote.subtotal)}`,
      `GST 18%: ${inr(quote.gst)}`,
      `Total payable: ${inr(quote.total)}`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([lines], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `electrospot-quotation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Quotation downloaded and emailed to the homeowner.");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Inspector & Admin Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Verify incoming spotter leads and turn site visits into final package pricing.
        </p>

        <Tabs defaultValue="queue" className="mt-8">
          <TabsList>
            <TabsTrigger value="queue">Verification Queue ({queue.length})</TabsTrigger>
            <TabsTrigger value="quote">Digital Quotation</TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="mt-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
            {queue.length === 0 ? (
              <Card className="surface-card">
                <CardContent className="p-10 text-center text-sm text-muted-foreground">
                  Queue is clear. New spotter leads land here within minutes.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {queue.map((l) => (
                  <Card key={l.id} className="surface-card overflow-hidden">
                    <div className="relative h-40 bg-secondary/60">
                      <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                        Site photo · {l.id}.jpg
                      </div>
                      <Badge className="absolute top-3 left-3 gap-1">
                        <MapPin className="size-3" /> {l.geo}
                      </Badge>
                    </div>
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-semibold">{l.id}</span>
                        <Badge variant="outline">{l.stage}</Badge>
                      </div>
                      <p className="text-sm">{l.address}</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {l.submittedOn}
                        {l.ownerName ? ` · Owner ${l.ownerName}` : " · Owner contact not shared"}
                        {l.ownerPhone ? ` · ${l.ownerPhone}` : ""}
                      </p>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" onClick={() => decide(l.id, true)}>
                          <CheckCircle2 className="size-4" /> Verify
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => decide(l.id, false)}>
                          <XCircle className="size-4" /> Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quote" className="mt-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
            <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-base">Site measurements</CardTitle>
                  <CardDescription>Counted during the on-site inspection.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="client">Homeowner name</Label>
                    <Input
                      id="client"
                      value={client}
                      maxLength={60}
                      onChange={(e) => setClient(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="points">Switch points</Label>
                    <Input
                      id="points"
                      type="number"
                      min={1}
                      max={500}
                      value={points}
                      onChange={(e) => setPoints(Math.max(1, Math.min(500, Number(e.target.value) || 0)))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rooms">Rooms / zones</Label>
                    <Input
                      id="rooms"
                      type="number"
                      min={1}
                      max={40}
                      value={rooms}
                      onChange={(e) => setRooms(Math.max(1, Math.min(40, Number(e.target.value) || 0)))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="db">Distribution boards</Label>
                    <Input
                      id="db"
                      type="number"
                      min={1}
                      max={10}
                      value={dbBoxes}
                      onChange={(e) => setDbBoxes(Math.max(1, Math.min(10, Number(e.target.value) || 0)))}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-card border-primary/40 lg:sticky lg:top-24 lg:h-fit">
                <CardHeader>
                  <CardTitle className="text-base">Quotation summary</CardTitle>
                  <CardDescription>{quote.bundles} wire bundles required</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {[
                    ["Switch points", quote.switches],
                    ["Wire bundles", quote.wiring],
                    ["Conduit & boxes", quote.conduit],
                    ["Distribution boards", quote.boards],
                  ].map(([label, v]) => (
                    <div key={label as string} className="flex justify-between">
                      <span className="text-muted-foreground">{label}</span>
                      <span>{inr(v as number)}</span>
                    </div>
                  ))}
                  <Separator className="my-3" />
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST 18%</span>
                    <span>{inr(quote.gst)}</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-medium">Total payable</span>
                    <span className="font-display text-2xl font-semibold text-primary">{inr(quote.total)}</span>
                  </div>
                  <Button className="mt-4 w-full" onClick={downloadQuote}>
                    <Download className="size-4" /> Generate final quotation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
