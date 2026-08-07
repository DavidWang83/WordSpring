import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "語音生成書信",
  description: "口述內容，自動生成多語言、多語氣商務書信",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
