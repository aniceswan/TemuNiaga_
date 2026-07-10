import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buyer Portal — TemuNiaga",
  description: "RFQ, pengadaan, kontrak, pengiriman, dan pembayaran.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
