"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "text-foreground border-border",
        primary:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        success:
          "border-teal-500/30 bg-teal-500/15 text-teal-700 dark:text-teal-300",
        warning:
          "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
        danger:
          "border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-400",
        neutral:
          "border-border bg-muted text-muted-foreground",
        soon:
          "border-purple-500/30 bg-purple-500/15 text-purple-700 dark:text-purple-300",
        free:
          "border-transparent bg-emerald-600 text-white font-bold shadow-xs",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
