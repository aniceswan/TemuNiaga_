import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin & Pendamping Portal — TemuNiaga",
  description: "Monitoring, verifikasi, readiness, audit, dan dampak.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
