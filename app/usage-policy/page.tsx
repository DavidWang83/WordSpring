// app/usage-policy/page.tsx
import { LegalDoc, Section } from "../lib/LegalDoc";

export const metadata = {
  title: "Usage Policy — Word Spring",
};

export default function UsagePolicyPage() {
  return (
    <LegalDoc title="Usage Policy" lastUpdatedNote="Effective Date: [DATE — set this to the date you publish this document live] — DRAFT, pending legal review. Not final.">
      <p style={{ fontSize: 14, color: "#C4CADA", marginBottom: 24 }}>Word Spring must not be used to:</p>

      <Section title="1. Harm to Individuals">
        <p>Generate threatening, harassing, defamatory content, or content that facilitates self-harm, violence, or illegal activity.</p>
      </Section>

      <Section title="2. Privacy Violations">
        <p>Draft emails that collect, expose, or distribute another person's private or sensitive information without authorization, or that are used for unauthorized surveillance or profiling.</p>
      </Section>

      <Section title="3. Fraud & Deception">
        <p>Generate phishing emails, impersonation of another individual or organization, or content designed to deceive recipients about the sender's identity or intent.</p>
      </Section>

      <Section title="4. Minors">
        <p>Any use involving the exploitation, endangerment, or inappropriate content concerning minors is strictly prohibited.</p>
      </Section>

      <Section title="5. High-Risk Use">
        <p>Do not use AI-generated content as the sole basis for decisions with legal, medical, financial, employment, or other significant consequences without independent human review by a qualified professional.</p>
      </Section>

      <Section title="6. Circumvention">
        <p>Do not attempt to bypass usage limits, rate limits, subscription tiers, or safety features of the Service.</p>
      </Section>

      <p style={{ fontSize: 14, color: "#C4CADA", marginTop: 8 }}>
        Violation of this Usage Policy may result in content removal, feature restriction, or account
        suspension/termination.
      </p>
    </LegalDoc>
  );
}
