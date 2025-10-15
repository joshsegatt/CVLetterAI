import React from "react";
import Button, { type ButtonProps } from "@/components/ui/Button";

type PricingPlanId = "price_one_time" | "price_subscription";

export type CheckoutButtonProps = {
  planId: PricingPlanId;
  label: string;
  // add intent & size used by callers (optional)
  intent?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
} & Omit<ButtonProps, "className">;

export function CheckoutButton({
  planId,
  label,
  intent = "secondary",
  size = "md",
  className,
  ...props
}: CheckoutButtonProps) {
  const variant = intent === "primary" ? "primary" : "ghost";
  const sizing = size === "sm" ? "px-3 py-1" : size === "lg" ? "px-5 py-3" : "px-4 py-2";

  return (
    <Button {...props} variant={variant} className={`${sizing} ${className ?? ""}`}>
      {label}
    </Button>
  );
}
