import { MarketingLayout } from '@/components/layout/MarketingLayout';

export default function MarketingSegmentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
