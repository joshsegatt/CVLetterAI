export default function WizardLayout({ children }: { children: React.ReactNode }) {
  // Zero-distraction — no navbar, no footer
  return <div className="min-h-screen bg-white">{children}</div>;
}
