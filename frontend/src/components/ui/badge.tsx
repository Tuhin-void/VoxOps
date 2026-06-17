import * as React from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "default"
  | "secondary"
  | "outline"
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "open"
  | "progress"
  | "closed";

// Six-color palette only. Status semantics:
//   Open       → cyan      (primary)
//   In Progress→ amber     (warning)
//   Closed     → emerald   (success)
//   Critical   → red       (danger)
//   High/Med   → amber
//   Low        → emerald
const styles: Record<Variant, string> = {
  default: "bg-surface text-zinc-300 border border-hairline",
  secondary: "bg-surface text-zinc-400 border border-hairline",
  outline: "border border-hairline text-zinc-400",
  low: "bg-transparent text-emerald-400 border border-emerald-500/40",
  medium: "bg-transparent text-amber-400 border border-amber-500/40",
  high: "bg-transparent text-amber-300 border border-amber-500/60",
  critical: "bg-red-500/10 text-red-400 border border-red-500/50",
  open: "bg-primary/10 text-primary border border-primary/40",
  progress: "bg-transparent text-amber-400 border border-amber-500/40",
  closed: "bg-transparent text-emerald-400 border border-emerald-500/40",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: { variant?: Variant } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}

export function severityVariant(severity?: string | null): Variant {
  switch ((severity || "").toLowerCase()) {
    case "low":
      return "low";
    case "medium":
      return "medium";
    case "high":
      return "high";
    case "critical":
      return "critical";
    default:
      return "secondary";
  }
}

export function statusVariant(status?: string | null): Variant {
  switch ((status || "").toLowerCase()) {
    case "open":
      return "open";
    case "in progress":
      return "progress";
    case "closed":
      return "closed";
    default:
      return "secondary";
  }
}
