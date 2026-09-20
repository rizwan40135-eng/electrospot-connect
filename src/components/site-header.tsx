import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/homeowner", label: "Homeowner" },
  { to: "/electrician", label: "Electrician/Contractor" },
  { to: "/spotter", label: "Lead Spotter" },
  { to: "/inspector", label: "Site Inspector" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-9 rotate-3 place-items-center rounded-md bg-accent text-accent-foreground shadow-[var(--shadow-glow)]">
            <Zap className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">
            Electro<span className="text-accent">Spot</span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex max-w-full items-center gap-1 overflow-x-auto text-sm"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-secondary text-primary" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="whitespace-nowrap rounded-md px-3 py-1.5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
