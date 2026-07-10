import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TemuNiaga — Cooperative Trade Operating System",
  description: "Menghubungkan koperasi desa, petani, dan industri melalui perdagangan yang transparan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
