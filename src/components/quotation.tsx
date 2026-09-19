import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Download, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BRAND_CATALOG, normalizeQuote, quoteMessage, type QuoteItem } from "@/lib/brand-catalog";
import { BRANDS } from "@/lib/electrospot-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "electrospot-quote-v1";
const QuoteContext = createContext<{
  items: QuoteItem[];
  add: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  show: () => void;
} | null>(null);

export function useQuotation() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error("QuotationProvider is required");
  return context;
}

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      setItems(normalizeQuote(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")));
    } catch {
      /* An invalid saved basket starts empty. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* The in-memory basket still works when storage is unavailable. */
    }
  }, [items, ready]);

  function setQuantity(productId: string, quantity: number) {
    setItems((current) =>
      normalizeQuote(
        current.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
      ),
    );
  }
  function add(productId: string) {
    if (!BRAND_CATALOG.some((p) => p.id === productId)) return;
    setItems((current) =>
      normalizeQuote(
        current.some((item) => item.productId === productId)
          ? current.map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
            )
          : [...current, { productId, quantity: 1 }],
      ),
    );
    toast.success("Added to your quotation", {
      action: { label: "Review", onClick: () => setOpen(true) },
    });
  }
  return (
    <QuoteContext.Provider value={{ items, add, setQuantity, show: () => setOpen(true) }}>
      {children}
      <QuoteDialog open={open} onOpenChange={setOpen} />
    </QuoteContext.Provider>
  );
}

export function QuotationButton() {
  const { items, show } = useQuotation();
  return (
    <Button
      size="sm"
      variant="outline"
      className="shrink-0"
      onClick={show}
      aria-label={`Review quotation, ${items.length} items`}
    >
      <ClipboardList className="size-4" />
      <span className="hidden sm:inline">Quotation</span>
      <span>{items.length}</span>
    </Button>
  );
}

function QuoteDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { items, setQuantity } = useQuotation();
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    location: "",
    notes: "",
    role: "Homeowner",
  });
  const [message, setMessage] = useState<string | null>(null);
  // Public business contact only: these VITE_ values are included in the client bundle.
  const rawWhatsapp = import.meta.env["VITE_QUOTE_WHATSAPP"]?.trim() ?? "";
  const whatsapp = /^\+?[1-9]\d{7,14}$/.test(rawWhatsapp) ? rawWhatsapp.replace(/^\+/, "") : "";
  const rawEmail = import.meta.env["VITE_QUOTE_EMAIL"]?.trim() ?? "";
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : "";
  const canSend = Boolean(whatsapp || email);
  function updateCustomer(field: keyof typeof customer, value: string) {
    setMessage(null);
    setCustomer((current) => ({ ...current, [field]: value }));
  }
  useEffect(() => {
    setMessage(null);
  }, [items]);

  function prepare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    if (customer.name.trim().length < 2 || customer.location.trim().length < 2) {
      toast.error("Enter your name and site location.");
      return;
    }
    const digits = customer.phone.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) {
      toast.error("Enter a valid phone number.");
      return;
    }
    setMessage(quoteMessage(items, customer));
  }
  function download() {
    if (!message) return;
    const url = URL.createObjectURL(new Blob([message], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "electrospot-quotation-enquiry.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Your quotation request</DialogTitle>
          <DialogDescription>
            Combine brands in one enquiry. Exact variants, availability and final prices are
            confirmed before ordering.
          </DialogDescription>
        </DialogHeader>
        {items.length === 0 ? (
          <div className="space-y-4 py-6 text-center">
            <p>Your quotation basket is empty.</p>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link to="/">Browse brands</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map((item) => {
                const product = BRAND_CATALOG.find((p) => p.id === item.productId)!;
                const brand = BRANDS.find((b) => b.id === product.brandId)!;
                return (
                  <li
                    key={item.productId}
                    className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1 basis-48">
                      <p className="text-xs text-accent">{brand.name}</p>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.model} · per {product.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease ${brand.name} ${product.model}`}
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={999}
                        step={1}
                        className="w-16 text-center"
                        aria-label={`${brand.name} ${product.model} quantity`}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          if (Number.isFinite(value) && value >= 1)
                            setQuantity(item.productId, value);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={item.quantity >= 999}
                        aria-label={`Increase ${brand.name} ${product.model}`}
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${brand.name} ${product.model}`}
                        onClick={() => setQuantity(item.productId, 0)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm font-medium">
              Price on request · {items.length} selected product{items.length === 1 ? "" : "s"}
            </p>
            <form onSubmit={prepare} className="space-y-4">
              <div>
                <Label htmlFor="quote-role">Buying as</Label>
                <select
                  id="quote-role"
                  className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={customer.role}
                  onChange={(e) => updateCustomer("role", e.target.value)}
                >
                  <option>Homeowner</option>
                  <option>Electrician</option>
                  <option>Contractor</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="quote-name">Your name</Label>
                  <Input
                    id="quote-name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={80}
                    value={customer.name}
                    onChange={(e) => updateCustomer("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quote-phone">Phone number</Label>
                  <Input
                    id="quote-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={24}
                    value={customer.phone}
                    onChange={(e) => updateCustomer("phone", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="quote-location">Site area / city</Label>
                <Input
                  id="quote-location"
                  required
                  minLength={2}
                  maxLength={140}
                  value={customer.location}
                  onChange={(e) => updateCustomer("location", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quote-notes">Requirements (optional)</Label>
                <Textarea
                  id="quote-notes"
                  maxLength={1000}
                  placeholder="Customer/project reference, colours, ratings or delivery date"
                  value={customer.notes}
                  onChange={(e) => updateCustomer("notes", e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your contact details stay in this page until you choose to share or download the
                enquiry.
              </p>
              <Button type="submit">Review enquiry</Button>
            </form>
            {message && (
              <div className="space-y-3 rounded-lg bg-secondary/50 p-4" aria-live="polite">
                <h3 className="font-semibold">Ready to share</h3>
                <pre className="max-h-52 overflow-y-auto whitespace-pre-wrap break-words text-xs">
                  {message}
                </pre>
                <div className="flex flex-wrap gap-2">
                  {whatsapp && (
                    <Button asChild>
                      <a
                        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open WhatsApp enquiry
                      </a>
                    </Button>
                  )}
                  {email && (
                    <Button asChild variant="outline">
                      <a
                        href={`mailto:${email}?subject=${encodeURIComponent("ElectroSpot quotation enquiry")}&body=${encodeURIComponent(message)}`}
                      >
                        Open email enquiry
                      </a>
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={download}>
                    <Download />
                    Download enquiry
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {canSend
                    ? "Complete sending in WhatsApp or your email app. Opening the draft does not send your enquiry."
                    : "Online enquiries are not available yet. You can download your request to share with ElectroSpot."}
                </p>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
