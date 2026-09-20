import { useState } from "react";
import { ShoppingCart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { inr, type BomItem } from "@/lib/electrospot-data";

export function OrderRequest({
  items,
  packageLabel,
  professional,
}: {
  items: BomItem[];
  packageLabel: string;
  professional: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    phone: "",
    owner: "",
    address: "",
    notes: "",
  });
  const total = items.reduce((sum, item) => sum + item.ours, 0);
  const summary = [
    "ElectroSpot order request — NOT SUBMITTED",
    `Buying as: ${professional ? "Electrician / Contractor on behalf of owner" : "Homeowner"}`,
    `Buyer: ${details.name.trim()}`,
    `Phone: ${details.phone.trim()}`,
    ...(professional
      ? [
          `Owner: ${details.owner.trim()}`,
          "Rewards: eligibility and rate to be confirmed; no reward credited",
        ]
      : []),
    `Delivery address: ${details.address.trim()}`,
    `Package / brand: ${packageLabel}`,
    "",
    ...items.map((item) => `${item.name} | ${item.spec} | ${item.qty} | ${inr(item.ours)}`),
    "",
    `Illustrative total: ${inr(total)}`,
    `Notes: ${details.notes.trim() || "None"}`,
    "Please confirm stock, specifications, final prices, taxes, delivery charges and payment arrangements before accepting this order.",
  ].join("\n");
  function download() {
    const url = URL.createObjectURL(new Blob([summary], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "electrospot-order-request.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function field(key: keyof typeof details, value: string) {
    setReview(false);
    setDetails((current) => ({ ...current, [key]: value }));
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        setReview(false);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full" disabled={!items.length || total <= 0}>
          <ShoppingCart className="size-4" />
          {professional ? "Order for homeowner" : "Place order"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {review
              ? "Review your order request"
              : professional
                ? "Order on behalf of homeowner"
                : "Order your electrical package"}
          </DialogTitle>
          <DialogDescription>
            Review your materials and delivery details. Online order submission and payment are not
            connected yet.
          </DialogDescription>
        </DialogHeader>
        {review ? (
          <div className="space-y-4">
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-secondary/50 p-4 text-xs">
              {summary}
            </pre>
            <p role="status" className="text-sm text-muted-foreground">
              Your request is ready to download. No order has been placed or payment collected.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setReview(false)}>
                Edit details
              </Button>
              <Button onClick={download}>
                <Download className="size-4" />
                Download order request
              </Button>
            </div>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setReview(true);
            }}
          >
            <div className="rounded-lg bg-secondary/50 p-3 text-sm">
              <p className="font-semibold">{packageLabel}</p>
              <p>
                {items.length} material types · Estimated {inr(total)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Prices are illustrative; final total and delivery are subject to confirmation.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="order-name">
                  {professional ? "Electrician / contractor name" : "Your name"}
                </Label>
                <Input
                  id="order-name"
                  required
                  pattern=".*\S.*"
                  minLength={2}
                  maxLength={80}
                  value={details.name}
                  onChange={(e) => field("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="order-phone">Contact phone</Label>
                <Input
                  id="order-phone"
                  type="tel"
                  required
                  pattern="\+?[0-9]{8,15}"
                  title="Enter 8–15 digits, optionally starting with +"
                  maxLength={16}
                  value={details.phone}
                  onChange={(e) => field("phone", e.target.value)}
                />
              </div>
            </div>
            {professional && (
              <div>
                <Label htmlFor="order-owner">Homeowner name</Label>
                <Input
                  id="order-owner"
                  required
                  pattern=".*\S.*"
                  minLength={2}
                  maxLength={80}
                  value={details.owner}
                  onChange={(e) => field("owner", e.target.value)}
                />
              </div>
            )}
            <div>
              <Label htmlFor="order-address">Delivery address with PIN code</Label>
              <Textarea
                id="order-address"
                required
                minLength={10}
                maxLength={500}
                value={details.address}
                onChange={(e) => field("address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="order-notes">Project notes (optional)</Label>
              <Textarea
                id="order-notes"
                maxLength={1000}
                value={details.notes}
                onChange={(e) => field("notes", e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              These details stay in this page. Downloading creates a file on your device; it does
              not send the request.
            </p>
            <Button type="submit">Review order</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
