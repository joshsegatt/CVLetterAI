/**
 * Simple Checkout Button Component
 * Handles one-time payment of £5.99 for premium features
 */

"use client";

import React, { useState } from 'react';
import { usePaymentStatus } from '@/lib/persistence/localStorage';

interface SimpleCheckoutButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function SimpleCheckoutButton({ children, className = "" }: SimpleCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { markAsPaid } = usePaymentStatus();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark as paid locally (in production this would be handled by Stripe webhook)
      markAsPaid(`payment_${Date.now()}`);
      
      // Show success message
      alert('Payment successful! All premium features are now unlocked.');
      
      // Reload page to reflect new status
      window.location.reload();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`${className} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
      } transition-opacity`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default SimpleCheckoutButton;