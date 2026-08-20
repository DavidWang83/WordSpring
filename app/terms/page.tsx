// app/terms/page.tsx
import { LegalDoc, Section, LEGAL_LINK } from "../lib/LegalDoc";

export const metadata = {
  title: "Terms of Service — Word Spring",
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of Service" lastUpdatedNote="Effective Date: [DATE — set this to the date you publish this document live] — DRAFT, pending legal review. Not final.">
      <Section title="1. Acceptance of Terms">
        <p>
          By creating an account, accessing, or using Word Spring ("the Service," "we," "us," or "our"), you agree to
          be bound by these Terms of Service ("Terms"), our{" "}
          <a href="/privacy" style={LEGAL_LINK}>Privacy Policy</a>, and our{" "}
          <a href="/usage-policy" style={LEGAL_LINK}>Usage Policy</a>, each incorporated by reference. If you do not
          agree, do not use the Service. You must be at least 18 years old, or the age of majority in your
          jurisdiction, to register.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          Word Spring converts voice dictation into formal, written email drafts using artificial intelligence,
          including third-party AI/language model providers, and offers multiple tone options and multilingual
          output across supported languages. AI-generated content may be inaccurate, incomplete, or contextually
          inappropriate. You are solely responsible for reviewing and editing any AI-generated content before
          sending it, and must not rely on it as the sole basis for decisions with legal, financial, or other
          significant consequences for yourself or others.
        </p>
      </Section>

      <Section title="3. Eligibility & Account Registration">
        <p>
          You must provide accurate, current, and complete registration information and keep it updated. You are
          responsible for safeguarding your login credentials and for all activity under your account, and must
          notify us immediately of any unauthorized use.
        </p>
      </Section>

      <Section title="4. Your Content, Our License, and AI Processing">
        <p>
          "User Content" means voice recordings, dictated text, uploaded material, and AI-generated email drafts you
          create using the Service.
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>You retain all ownership rights you have in your User Content.</li>
          <li>
            You grant Word Spring a limited, non-exclusive, worldwide license to process, store, and transmit your
            User Content — including to third-party AI providers — solely to operate, maintain, and improve the
            Service.
          </li>
          <li>
            <strong>We do not use your User Content to train our own AI models.</strong> Content processed by our
            third-party AI provider is subject to that provider's own API data usage terms, which — as of the date
            of this document — do not use content submitted through their developer API to train their models. If
            we change AI providers or this changes, we will update this section accordingly.
          </li>
          <li>You represent that you have the right to submit your User Content and that it does not infringe any third party's rights or violate applicable law.</li>
          <li>Output may be similar to content generated for other users given similar input, since outputs are probabilistic.</li>
        </ul>
      </Section>

      <Section title="5. Third-Party AI Providers & Third-Party Services">
        <p>
          The Service relies on third-party AI/language model providers to generate content. Word Spring is not
          responsible for the availability, accuracy, or practices of these third-party providers. If Word Spring
          integrates with other third-party services (e.g., calendar, email clients), those services are governed by
          their own terms and privacy policies.
        </p>
      </Section>

      <Section title="6. Prohibited Uses">
        <p>You agree not to:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Use the Service to generate unlawful, defamatory, fraudulent, harassing, or infringing content;</li>
          <li>Impersonate any person or misrepresent AI-generated content as entirely human-written where such disclosure is legally required;</li>
          <li>Reverse-engineer, decompile, or extract Word Spring's underlying models, prompts, or source code;</li>
          <li>Use automated means to scrape, bulk-extract, or overload the Service, or circumvent rate limits, paywalls, or security measures;</li>
          <li>Use outputs to develop a competing product or AI model;</li>
          <li>Use the Service in violation of our <a href="/usage-policy" style={LEGAL_LINK}>Usage Policy</a>.</li>
        </ul>
      </Section>

      <Section title="7. Subscription, Fees & Payment">
        <p>
          Paid features are billed on a recurring subscription basis via our third-party payment processor /
          Merchant of Record, which handles billing, applicable taxes, and payment security. Subscriptions
          automatically renew each billing cycle until cancelled. You may cancel at any time through your account
          settings; cancellation takes effect at the end of the current billing period. Fees already paid are
          non-refundable except where required by law or stated in our refund policy. If we increase subscription
          pricing, we will provide advance notice, and the new price will generally take effect at your next
          renewal. Failed payments may result in downgrade or suspension of paid features.
        </p>
      </Section>

      <Section title="8. Suspension & Termination">
        <p>
          We may suspend or terminate your account for violation of these Terms or our Usage Policy, non-payment,
          suspected fraud or risk to the Service, or as required by law. We will provide notice where reasonably
          practicable. You may terminate your account at any time.
        </p>
      </Section>

      <Section title="9. Intellectual Property">
        <p>
          Word Spring and its software, design, branding, and technology are owned by Word Spring or its licensors and
          protected by intellectual property laws. These Terms grant you no rights beyond the limited right to use
          the Service as intended.
        </p>
      </Section>

      <Section title="10. Disclaimer of Warranties">
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE
          DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT AI-GENERATED CONTENT WILL BE
          ACCURATE, COMPLETE, OR SUITABLE FOR ANY PARTICULAR PURPOSE.
        </p>
      </Section>

      <Section title="11. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WORDSPRING SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE OR RELIANCE ON
          AI-GENERATED CONTENT, INCLUDING DAMAGES ARISING FROM EMAILS SENT USING AI-GENERATED DRAFTS. OUR TOTAL
          LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID IN THE 12 MONTHS PRECEDING
          THE CLAIM, OR (B) USD $50.
        </p>
      </Section>

      <Section title="12. Dispute Resolution & Governing Law">
        <p>
          <em>
            [PLACEHOLDER — DRAFT ONLY: These Terms are currently drafted assuming governing law of the State of
            Delaware, United States, as Word Spring's intended entity formation state, without regard to
            conflict-of-law principles. No entity has been formed yet as of this draft. Any dispute shall be resolved
            through binding individual arbitration, and you waive any right to participate in a class action, except
            where prohibited by law or for small-claims-eligible disputes. You may opt out of this arbitration
            provision by notifying us in writing within 30 days of first accepting these Terms. This entire section
            must be re-confirmed once your actual business entity and jurisdiction are finalized, and reviewed by a
            lawyer for enforceability in the regions your users are located.]
          </em>
        </p>
      </Section>

      <Section title="13. Changes to These Terms">
        <p>
          We may update these Terms. Material changes affecting your rights will be communicated via email or
          in-app notice with reasonable advance notice. Continued use after changes take effect constitutes
          acceptance.
        </p>
      </Section>

      <Section title="14. Contact">
        <p>
          Questions about these Terms:{" "}
          <a href="mailto:support@word-spring.com" style={LEGAL_LINK}>support@word-spring.com</a>
        </p>
      </Section>
    </LegalDoc>
  );
}
