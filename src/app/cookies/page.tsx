import { LegalLayout } from "@/components/layout/legal-layout";

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="May 1, 2026">
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small pieces of text sent by your web browser by a website you visit. 
        They help the website to remember information about your visit.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>
        We use essential cookies for authentication and security. We also use analytics 
        cookies to understand how users interact with our platform to improve experience.
      </p>

      <h2>3. Third-Party Cookies</h2>
      <p>
        In addition to our own cookies, we may also use various third-party cookies to 
        report usage statistics of the service (e.g., Google Analytics).
      </p>

      <h2>4. Your Choices</h2>
      <p>
        If you'd like to delete cookies or instruct your web browser to delete or refuse 
        cookies, please visit the help pages of your web browser.
      </p>
    </LegalLayout>
  );
}
