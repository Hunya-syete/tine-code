import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christine Jumawan | Portfolio",
  description: "Personal portfolio and resume powered by Next.js and Laravel API.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
