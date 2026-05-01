import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the plan that fits your career goals. Precision-engineered AI for high-stakes executive career transitions.',
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
