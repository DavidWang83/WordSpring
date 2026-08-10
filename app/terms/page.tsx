// app/terms/page.tsx
export const metadata = {
  title: "Terms of Service — WordSpring",
};

export default function TermsPage() {
  return (
    <main style={{ background: "#1C2333", minHeight: "100vh", padding: "48px 20px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "#D8DCE6", fontFamily: "sans-serif", lineHeight: 1.7 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#7C8BA3", textTransform: "uppercase", marginBottom: 10 }}>
          WordSpring
        </div>
        <h1 style={{ color: "#E9E5D8", fontSize: 30, marginBottom: 4 }}>Terms of Service</h1>
        <p style={{ color: "#7C8BA3", fontSize: 13, marginBottom: 32 }}>
          Last updated: [DATE] — DRAFT, pending legal review. Not final.
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            These Terms of Service ("Terms") form a legally binding agreement between you ("you" or "User") and
            [LEGAL ENTITY / OWNER NAME] ("WordSpring", "we", "us", or "our"), governing your access to and use of
            the WordSpring website, application, and related services (collectively, the "Service"). By creating an
            account, signing in, or otherwise using the Service, you confirm that you have read, understood, and
            agree to be bound by these Terms and by our{" "}
            <a href="/privacy" style={{ color: "#B33A3A" }}>Privacy Policy</a>, which is incorporated by reference.
            If you do not agree, you must not use the Service.
          </p>
        </Section>

        <Section title="2. Description of the Service">
          <p>
            WordSpring allows users to dictate or type informal content and receive AI-generated, formatted
            business correspondence in a language of their choosing, including tone variations and, where
            applicable, a reference translation. The Service relies on third-party subprocessors to function,
            including but not limited to speech-to-text and text-generation providers (currently OpenAI), an
            authentication and database provider (currently Supabase), and a transactional email provider
            (currently Resend). We may add, remove, or change subprocessors at our discretion, and will make
            reasonable efforts to update our{" "}
            <a href="/privacy" style={{ color: "#B33A3A" }}>Privacy Policy</a> to reflect material changes.
          </p>
        </Section>

        <Section title="3. Eligibility and Accounts">
          <p>
            You must be at least 18 years old, or the age of legal majority in your jurisdiction, to use the
            Service. You are responsible for maintaining the confidentiality of your account access (including any
            sign-in links or credentials sent to your email address) and for all activity that occurs under your
            account. You agree to provide accurate information and to notify us promptly of any unauthorized use of
            your account.
          </p>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree not to use the Service to:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li>Generate or transmit content that is unlawful, defamatory, fraudulent, harassing, or infringing on the rights of others;</li>
            <li>Attempt to gain unauthorized access to the Service, other users' accounts, or our underlying systems and APIs;</li>
            <li>Circumvent, disable, or interfere with usage limits, rate limits, or security features of the Service;</li>
            <li>Use the Service to generate spam or unsolicited bulk communications;</li>
            <li>Reverse engineer, resell, or use the Service to build a directly competing product without our written consent.</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that we reasonably believe violate this section,
            with or without notice.
          </p>
        </Section>

        <Section title="5. AI-Generated Content — No Warranty of Accuracy">
          <p>
            The Service uses third-party artificial intelligence models to draft correspondence. AI-generated
            content may contain factual errors, mistranslations, tonal misjudgments, or omissions. You are solely
            responsible for reviewing, editing, and approving any content before sending or relying on it. We make
            no representation or warranty that generated content is accurate, complete, appropriate for your
            specific purpose, or free of errors.
          </p>
        </Section>

        <Section title="6. Subscriptions, Fees, and Refunds">
          <p>
            Certain features of the Service may require a paid subscription. Where applicable, fees, billing
            frequency, and usage limits for each plan will be presented to you before purchase and are governed by
            the payment processor's terms in addition to these Terms. Except where required by applicable law, fees
            are non-refundable once a billing period has begun; however, we may, at our discretion, issue refunds or
            credits on a case-by-case basis. Consumers in jurisdictions that grant a statutory right of withdrawal or
            cooling-off period will receive the protections required by that law, notwithstanding anything to the
            contrary in this section.
            <br />
            <em>[This section must be finalized once the specific subscription plans, pricing, and refund policy are set, and reviewed against consumer-protection law in the jurisdictions you serve.]</em>
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            We retain all rights, title, and interest in the Service itself, including its software, design, and
            branding. As between you and us, you retain ownership of the content you dictate or type into the
            Service. You grant us a limited, non-exclusive license to process that content solely as necessary to
            provide the Service to you (including transmitting it to the third-party subprocessors described in
            Section 2).
          </p>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
            IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            NON-INFRINGEMENT, OR THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WORDSPRING AND ITS OWNER(S) SHALL NOT BE LIABLE FOR
            ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR
            GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF
            SUCH DAMAGES. OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS SHALL NOT EXCEED
            THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE THREE (3) MONTHS PRECEDING THE CLAIM, OR (B)
            [PLACEHOLDER AMOUNT].
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            You may stop using the Service and request deletion of your account at any time. We may suspend or
            terminate your access to the Service, with or without cause or notice, including for violation of these
            Terms. Sections that by their nature should survive termination (including Sections 6-9) will survive.
          </p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p>
            We may modify these Terms from time to time. If we make material changes, we will make reasonable
            efforts to notify you (for example, by email or an in-app notice) before the changes take effect.
            Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="12. Governing Law and Dispute Resolution">
          <p>
            <em>
              [PLACEHOLDER: These Terms shall be governed by the laws of [JURISDICTION], without regard to its
              conflict-of-laws principles. Disputes shall be resolved in the courts located in [VENUE] / through
              [ARBITRATION PROVIDER], as applicable. This section must be completed by a qualified lawyer based on
              where you and your users are located.]
            </em>
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            Questions about these Terms can be sent to{" "}
            <a href="mailto:[CONTACT EMAIL]" style={{ color: "#B33A3A" }}>[CONTACT EMAIL]</a>.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ color: "#E9E5D8", fontSize: 18, marginBottom: 10 }}>{title}</h2>
      <div style={{ fontSize: 14, color: "#C4CADA" }}>{children}</div>
    </section>
  );
}
