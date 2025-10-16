import React from "react";
import "./globals.css";
import { Providers } from "../components/providers/Providers";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-muted font-sans text-neutral-100 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
