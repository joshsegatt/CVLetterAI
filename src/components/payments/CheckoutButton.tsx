import { Button, type ButtonProps } from "@/components/ui/Button";
import type { PricingPlanId } from "@/services/payments/stripe";

type CheckoutButtonBaseProps = Omit<ButtonProps, "children" | "intent" | "size">;

export type CheckoutButtonProps = CheckoutButtonBaseProps & {
  planId: PricingPlanId;
  label: string;
  intent?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
};

export function CheckoutButton({
  planId,
  label,
  intent = "secondary",
  size = "md",
  className,
  ...props
}: CheckoutButtonProps) {
  return (
    <Button
      {...props}
      data-plan-id={planId}
      intent={intent}
      size={size}
      className={className}
    >
      {label}
    </Button>
  );
}
