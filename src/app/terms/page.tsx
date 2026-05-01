import { LegalLayout } from "@/components/layout/legal-layout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="May 1, 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using cvletterai, you agree to be bound by these Terms of Service 
        and all applicable laws and regulations.
      </p>

      <h2>2. Use License</h2>
      <p>
        Permission is granted to use our AI tools for personal, non-commercial transition 
        of career documents. This is the grant of a license, not a transfer of title.
      </p>

      <h2>3. Disclaimer</h2>
      <p>
        The materials on cvletterai are provided on an 'as is' basis. We make no 
        warranties, expressed or implied, and hereby disclaim and negate all other warranties.
      </p>

      <h2>4. Account Responsibility</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account and 
        password. cvletterai shall not be liable for any loss or damage.
      </p>
    </LegalLayout>
  );
}
