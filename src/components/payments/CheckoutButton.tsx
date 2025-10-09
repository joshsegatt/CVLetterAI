'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/Button';
import type { PricingPlanId } from '@/services/payments/stripe';

interface CheckoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  planId: PricingPlanId;
  label: string;
}

export function CheckoutButton({ planId, label, intent, size, className, ...props }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId })
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || typeof payload.url !== 'string') {
        throw new Error(payload.error ?? 'Unable to start checkout');
      }

      window.location.href = payload.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : 'Unexpected error during checkout.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        intent={intent}
        size={size}
        className={className}
        disabled={isLoading}
        onClick={handleCheckout}
        {...props}
      >
        {isLoading ? 'Redirecting…' : label}
      </Button>
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </div>
  );
}
