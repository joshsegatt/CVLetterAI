import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "outline" | "success";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
      {
        "bg-indigo-600 text-white": variant === "default",
        "bg-zinc-100 text-zinc-700": variant === "secondary",
        "border border-zinc-200 text-zinc-700": variant === "outline",
        "bg-emerald-50 text-emerald-700 border border-emerald-200": variant === "success",
      },
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
