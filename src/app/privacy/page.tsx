import { LegalLayout } from "@/components/layout/legal-layout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="May 1, 2026">
      <h2>1. Information We Collect</h2>
      <p>
        We collect information to provide better services to all our users. This includes 
        CV data you upload, which we process securely using AI to provide tailored results.
      </p>

      <h2>2. How We Use Information</h2>
      <p>
        We use the information we collect to provide, maintain, protect and improve our 
        services, to develop new ones, and to protect cvletterai and our users.
      </p>

      <h2>3. Data Protection</h2>
      <p>
        Your document data is encrypted at rest and in transit. We do not sell your 
        personal data to third parties.
      </p>

      <h2>4. GDPR Compliance</h2>
      <p>
        We fully comply with GDPR regulations. You have the right to access, rectify, 
        or erase your personal data at any time via your dashboard settings.
      </p>
    </LegalLayout>
  );
}
