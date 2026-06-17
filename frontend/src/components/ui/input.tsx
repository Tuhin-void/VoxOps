import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-[13px] text-zinc-50",
      "placeholder:text-zinc-600 transition-colors",
      "focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
      "disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
