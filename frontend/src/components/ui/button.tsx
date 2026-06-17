import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors cursor-pointer ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-black hover:bg-white",
        outline:
          "border border-zinc-800 bg-transparent text-zinc-200 hover:bg-zinc-900 hover:border-zinc-700",
        ghost: "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
        danger:
          "bg-rose-500/90 text-white hover:bg-rose-500",
        success: "bg-emerald-500/90 text-black hover:bg-emerald-500",
        subtle:
          "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-800",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-7 px-2.5 text-[12px]",
        lg: "h-11 px-5 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
