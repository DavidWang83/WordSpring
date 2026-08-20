// app/cookie-policy/page.tsx
import { LegalDoc, Section } from "../lib/LegalDoc";

export const metadata = {
  title: "Cookie Policy — Word Spring",
};

export default function CookiePolicyPage() {
  return (
    <LegalDoc title="Cookie Policy" lastUpdatedNote="Effective Date: [DATE — set this to the date you publish this document live] — DRAFT, pending legal review. Not final.">
      <p style={{ fontSize: 14, color: "#C4CADA", marginBottom: 24 }}>
        Word Spring's website and app use cookies and similar tracking technologies (including browser local storage)
        for:
      </p>

      <Section title="Essential">
        <p>Required for login, security, and core functionality. Cannot be disabled.</p>
      </Section>

      <Section title="Preference">
        <p>Remember your settings — for example, your saved email signatures, and font/formatting preferences.</p>
      </Section>

      <p style={{ fontSize: 14, color: "#C4CADA", marginTop: 8 }}>
        We do not currently use analytics or third-party advertising cookies. If this changes in the future, we
        will update this policy and, where required, ask for your consent before enabling them.
      </p>
    </LegalDoc>
  );
}
