// app/privacy/page.tsx
import { LegalDoc, Section, LEGAL_LINK } from "../lib/LegalDoc";

export const metadata = {
  title: "Privacy Policy — Word Spring",
};

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy Policy" lastUpdatedNote="Effective Date: [DATE — set this to the date you publish this document live] — DRAFT, pending legal review. Not final.">
      <Section title="1. What We Collect">
        <p><strong>Account Data:</strong> email address, login session data, payment/billing information (processed by our third-party Merchant of Record — we do not store your full payment card details), and transaction history.</p>
        <p><strong>User Content:</strong> voice recordings, dictated audio, transcribed text, and AI-generated email drafts, as well as saved signatures and formatting preferences.</p>
        <p><strong>Technical & Usage Data:</strong> device type, browser, IP address, approximate location (derived from IP), usage logs, and cookies (see our <a href="/cookie-policy" style={LEGAL_LINK}>Cookie Policy</a>).</p>
      </Section>

      <Section title="2. How We Use Your Data">
        <p>
          We use collected data to: (a) provide and maintain the Service, including generating your email drafts;
          (b) process payments; (c) communicate with you about your account; (d) detect and prevent fraud and abuse;
          (e) comply with legal obligations. We do not use your User Content to train AI models — see our{" "}
          <a href="/terms" style={LEGAL_LINK}>Terms of Service</a>, Section 4, for details.
        </p>
      </Section>

      <Section title="3. How We Share Your Data">
        <p>We may share data with:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Third-party AI/language model providers, solely to generate your email drafts and transcriptions;</li>
          <li>Our Merchant of Record / payment processor, to process payments;</li>
          <li>Service providers who support our infrastructure (e.g., cloud hosting, database, transactional email), under confidentiality obligations;</li>
          <li>Government authorities, where required by law.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </Section>

      <Section title="4. Your Choices & Rights">
        <p>
          <strong>Access, Correction, Deletion:</strong> Depending on your location, you may have the right to
          access, correct, delete, or export your personal data, and to withdraw consent. Contact us at{" "}
          <a href="mailto:privacy@word-spring.com" style={LEGAL_LINK}>privacy@word-spring.com</a> to exercise these rights.
        </p>
        <p>
          <strong>California Residents (CCPA/CPRA):</strong> You have the right to know what personal information we
          collect, request deletion, and opt out of any "sale" or "sharing" of personal information (we do not sell
          personal information as defined by CCPA).
        </p>
        <p>
          <strong>EEA/UK/Switzerland Residents (if applicable):</strong> You may have rights under GDPR, including
          data portability and the right to lodge a complaint with a supervisory authority.
        </p>
        <p>
          <strong>Japan Residents:</strong> Where the Act on the Protection of Personal Information (APPI) applies to
          our processing of your information, we will handle your information in accordance with its requirements,
          including with respect to the purpose of use and any cross-border transfer of your information.
        </p>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We retain your data for as long as your account is active or as needed to provide the Service. Upon
          account deletion, we will delete or de-identify your personal data within 30 days, except where retention
          is required for legal, security, or fraud-prevention purposes.
        </p>
      </Section>

      <Section title="6. Data Security">
        <p>
          We implement reasonable technical and organizational measures to protect your data, including encryption
          in transit. No system is completely secure, and we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="7. International Data Transfers">
        <p>
          Your data may be processed in countries other than your own, including the United States, and by
          third-party providers located elsewhere. We take steps to ensure appropriate safeguards are in place for
          such transfers.
        </p>
      </Section>

      <Section title="8. Children's Privacy">
        <p>
          The Service is not directed to individuals under 18. We do not knowingly collect personal information
          from minors.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>We may update this Privacy Policy. Material changes will be notified via email or in-app notice.</p>
      </Section>

      <Section title="10. Contact">
        <p>
          Privacy questions:{" "}
          <a href="mailto:privacy@word-spring.com" style={LEGAL_LINK}>privacy@word-spring.com</a>
        </p>
      </Section>
    </LegalDoc>
  );
}
