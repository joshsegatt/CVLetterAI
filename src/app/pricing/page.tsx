import { PricingShell } from '@/features/pricing/components/PricingShell';

interface PricingPageProps {
  searchParams?: {
    purchase?: string;
  };
}

export default function PricingPage({ searchParams }: PricingPageProps) {
  const purchaseState = searchParams?.purchase ?? '';
  const banner =
    purchaseState === 'success'
      ? { tone: 'success' as const, message: 'Payment confirmed. Your upgraded features are now active.' }
      : purchaseState === 'cancelled'
        ? { tone: 'warning' as const, message: 'Checkout cancelled. You can resume your purchase at any time.' }
        : null;

  return <PricingShell banner={banner} />;
}
