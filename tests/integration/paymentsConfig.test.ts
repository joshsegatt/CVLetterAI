import { describe, expect, it } from 'vitest';
import { getCheckoutConfig } from '@/services/payments/stripe';

describe('getCheckoutConfig', () => {
  it('returns null when price IDs are not configured', () => {
    expect(getCheckoutConfig('price_one_time')).toBeNull();
    expect(getCheckoutConfig('price_subscription')).toBeNull();
  });
});
