import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Class Quiz Portal",
  description: "Online quiz and exam portal powered by Next.js + Laravel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
