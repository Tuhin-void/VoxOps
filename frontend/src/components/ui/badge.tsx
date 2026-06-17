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

const styles: Record<Variant, string> = {
  default: "bg-zinc-900 text-zinc-300 border border-zinc-800",
  secondary: "bg-zinc-900 text-zinc-400 border border-zinc-800",
  outline: "border border-zinc-800 text-zinc-400",
  low: "bg-transparent text-emerald-400 border border-emerald-500/30",
  medium: "bg-transparent text-amber-400 border border-amber-500/30",
  high: "bg-transparent text-orange-400 border border-orange-500/30",
  critical: "bg-rose-500/10 text-rose-300 border border-rose-500/40",
  open: "bg-transparent text-accent-300 border border-accent-400/30",
  progress: "bg-transparent text-amber-400 border border-amber-500/30",
  closed: "bg-transparent text-zinc-500 border border-zinc-800",
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
