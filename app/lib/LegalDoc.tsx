// app/lib/LegalDoc.tsx
export function LegalDoc({
  title,
  lastUpdatedNote,
  children,
}: {
  title: string;
  lastUpdatedNote: string;
  children: React.ReactNode;
}) {
  return (
    <main style={{ background: "#1C2333", minHeight: "100vh", padding: "48px 20px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "#D8DCE6", fontFamily: "sans-serif", lineHeight: 1.7 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#7C8BA3", textTransform: "uppercase", marginBottom: 10 }}>
          Word Spring
        </div>
        <h1 style={{ color: "#E9E5D8", fontSize: 30, marginBottom: 4 }}>{title}</h1>
        <p style={{ color: "#7C8BA3", fontSize: 13, marginBottom: 32 }}>{lastUpdatedNote}</p>
        {children}
      </div>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ color: "#E9E5D8", fontSize: 18, marginBottom: 10 }}>{title}</h2>
      <div style={{ fontSize: 14, color: "#C4CADA" }}>{children}</div>
    </section>
  );
}

export const LEGAL_LINK: React.CSSProperties = { color: "#B33A3A" };
