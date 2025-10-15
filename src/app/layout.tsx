import React from "react";
import MarketingLayout from "../../components/layout/MarketingLayout";

/**
 * Root layout for marketing routes
 * This file is a server component (default). It uses the server MarketingLayout wrapper.
 */

export default function MarketingSegmentLayout({ children }: { children: React.ReactNode }) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
