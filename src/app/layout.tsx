import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontline — AI-Powered Review Management",
  description:
    "Turn every customer review into a reputation win. Frontline uses AI to craft perfect responses in seconds.",
  keywords: ["review management", "AI responses", "reputation management", "Google reviews"],
  openGraph: {
    title: "Frontline — AI-Powered Review Management",
    description:
      "Turn every customer review into a reputation win. Frontline uses AI to craft perfect responses in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
