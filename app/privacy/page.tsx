// app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy — WordSpring",
};

export default function PrivacyPage() {
  return (
    <main style={{ background: "#1C2333", minHeight: "100vh", padding: "48px 20px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "#D8DCE6", fontFamily: "sans-serif", lineHeight: 1.7 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#7C8BA3", textTransform: "uppercase", marginBottom: 10 }}>
          WordSpring
        </div>
        <h1 style={{ color: "#E9E5D8", fontSize: 30, marginBottom: 4 }}>Privacy Policy</h1>
        <p style={{ color: "#7C8BA3", fontSize: 13, marginBottom: 32 }}>
          Last updated: [DATE] — DRAFT, pending legal review. Not final.
        </p>

        <Section title="1. Who We Are">
          <p>
            This Privacy Policy explains how [LEGAL ENTITY / OWNER NAME] ("WordSpring", "we", "us", or "our")
            collects, uses, and shares information when you use the WordSpring website and application (the
            "Service"). It should be read together with our{" "}
            <a href="/terms" style={{ color: "#B33A3A" }}>Terms of Service</a>.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong>Account information:</strong> your email address, used to authenticate you via a one-time sign-in link.</p>
          <p><strong>Content you provide:</strong> voice recordings you dictate, the resulting transcribed text, the content you type or edit, saved email signatures, and formatting preferences (font, font size).</p>
          <p><strong>Usage data:</strong> basic technical information such as timestamps of requests, and, once usage limits are implemented, records of how many generations or transcriptions your account has used within a billing period.</p>
          <p><strong>Payment information</strong> (once paid plans are available): payment details are collected and processed directly by our payment processor; we do not store your full card number on our own servers.</p>
        </Section>

        <Section title="3. How We Use Information">
          <ul style={{ paddingLeft: 20 }}>
            <li>To provide, operate, and maintain the Service, including generating and transcribing content you request;</li>
            <li>To authenticate you and keep your account secure;</li>
            <li>To remember your preferences (such as saved signatures and formatting defaults) across sessions;</li>
            <li>To monitor and enforce usage limits associated with your plan;</li>
            <li>To communicate with you about your account, including transactional emails (such as sign-in links);</li>
            <li>To comply with legal obligations and enforce our Terms of Service.</li>
          </ul>
          <p>We do not sell your personal information.</p>
        </Section>

        <Section title="4. How Information Is Shared">
          <p>
            We share information with the following categories of third-party service providers ("subprocessors"),
            solely as necessary to operate the Service:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li>
              <strong>OpenAI</strong> — receives your dictated audio (for transcription) and the resulting text
              content (for email generation), in order to produce the transcription and generated correspondence
              you request. Content sent to OpenAI's API is subject to OpenAI's own API data usage terms.
            </li>
            <li>
              <strong>Supabase</strong> — hosts our database and authentication system, and stores your account
              information, saved signatures, and preferences.
            </li>
            <li>
              <strong>Resend</strong> — delivers transactional emails (such as sign-in links) on our behalf.
            </li>
            <li>
              <strong>Hosting/infrastructure providers</strong> (currently Vercel) — host the Service itself.
            </li>
          </ul>
          <p>
            We do not otherwise share your personal information with third parties, except where required by law,
            to protect our rights, or in connection with a merger, acquisition, or sale of assets (in which case we
            will make reasonable efforts to notify affected users).
          </p>
        </Section>

        <Section title="5. Voice Recordings">
          <p>
            Audio you record for transcription is transmitted to our transcription provider (OpenAI) for
            processing and is not stored longer than necessary to complete the transcription request on our own
            servers. <em>[Confirm and adjust this statement to match actual technical behavior before publishing —
            e.g., whether audio is temporarily cached, and for how long.]</em>
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your account information and saved preferences for as long as your account remains active.
            If you request deletion of your account, we will delete or anonymize your personal information within
            a reasonable period, except where we are required to retain certain records (such as billing records)
            for legal or accounting purposes.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>
            Depending on your location, you may have rights to access, correct, export, or delete your personal
            information, and to object to or restrict certain processing. To exercise these rights, contact us at{" "}
            <a href="mailto:[CONTACT EMAIL]" style={{ color: "#B33A3A" }}>[CONTACT EMAIL]</a>.
            <br />
            <em>
              [PLACEHOLDER: If you have users in the EU/EEA/UK, California, or other jurisdictions with specific
              privacy statutes (GDPR, CCPA, etc.), this section needs to name the applicable law(s) and the specific
              rights and request mechanisms those laws require — a lawyer should confirm which apply to you.]
            </em>
          </p>
        </Section>

        <Section title="8. Cookies and Local Storage">
          <p>
            The Service uses your browser's local storage and Supabase's authentication mechanisms to keep you
            signed in between visits and to remember interface preferences. We do not currently use advertising or
            cross-site tracking cookies.
          </p>
        </Section>

        <Section title="9. Security">
          <p>
            We use reasonable administrative and technical measures designed to protect your information, including
            transport encryption (HTTPS) and access controls provided by our infrastructure providers. No method of
            transmission or storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>
            The Service is not directed to individuals under 18, and we do not knowingly collect personal
            information from children. If you believe a child has provided us with personal information, please
            contact us so we can delete it.
          </p>
        </Section>

        <Section title="11. International Data Transfers">
          <p>
            Our subprocessors may process and store information in countries other than your own. Where required by
            applicable law, we will take appropriate steps to ensure such transfers are lawful.
            <br />
            <em>[PLACEHOLDER: confirm hosting regions for Supabase/Vercel/OpenAI/Resend and whether standard
            contractual clauses or similar mechanisms are needed for your user base.]</em>
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes will be communicated through the
            Service or by email before they take effect.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            Questions about this Privacy Policy can be sent to{" "}
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
