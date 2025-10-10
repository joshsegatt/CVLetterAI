'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/Button';
import type { PricingPlanId } from '@/services/payments/stripe';

const STRIPE_CHECKOUT_URLS: Record<PricingPlanId, string | null> = {
  price_free: null,
  price_one_time: 'https://buy.stripe.com/test_5kQ4gBfeaaftdVydSHgQE00',
  price_subscription: 'https://buy.stripe.com/test_00w5kF7LIevJaJmcODgQE01'
};

interface CheckoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  planId: PricingPlanId;
  label: string;
}

export function CheckoutButton({ planId, label, intent, size, className, ...props }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = () => {
    setIsLoading(true);
    setError(null);

    try {
      const checkoutUrl = STRIPE_CHECKOUT_URLS[planId];

      if (!checkoutUrl) {
        setError('This plan is handled inside the app. Please continue in the product.');
        return;
      }

      window.location.href = checkoutUrl;
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
