import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/homeowner", label: "Homeowner" },
  { to: "/spotter", label: "Lead Spotter" },
  { to: "/inspector", label: "Site Inspector" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <Zap className="size-4" />
          </span>
          <span className="text-base">
            Electro<span className="text-primary">Spot</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="whitespace-nowrap rounded-full px-3 py-1.5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
