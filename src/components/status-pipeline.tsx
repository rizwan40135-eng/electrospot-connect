import { Check } from "lucide-react";
import { LEAD_STAGES, type LeadStage } from "@/lib/electrospot-data";
import { cn } from "@/lib/utils";

export function StatusPipeline({ status }: { status: LeadStage }) {
  const current = LEAD_STAGES.indexOf(status);
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {LEAD_STAGES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex items-center gap-1">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                done && "border-primary/40 bg-primary/10 text-primary",
                active && "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]",
                !done && !active && "border-border/70 bg-muted/40 text-muted-foreground",
              )}
            >
              {done && <Check className="size-3" />}
              {s}
            </span>
            {i < LEAD_STAGES.length - 1 && (
              <span className={cn("h-px w-4", i < current ? "bg-primary/50" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
