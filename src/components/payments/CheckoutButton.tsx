"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "../ui/Button";
import type { PricingPlanId } from "../../services/payments/stripe";

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
  disabled,
  ...props
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (planId === 'price_free') {
      // Redirect to sign-up for free plan
      window.location.href = '/sign-up';
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Erro no pagamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      intent={intent}
      size={size}
      className={className}
    >
      {isLoading ? 'Processing...' : label}
    </Button>
  );
}
