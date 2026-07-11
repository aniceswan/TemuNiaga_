import { geminiAnswer } from "./gemini";
import { getHarga, getSimpananStatus, laporPasokan, lookupRegistration } from "./api-client";

const MENU = `🏪 *TemuNiaga — Menu Petani*
1 *HARGA [komoditas]* — cek harga acuan, contoh: HARGA kopi
2 *LAPOR [komoditas] [kg]* — catat pasokan panen, contoh: LAPOR kopi 200
3 *STATUS* — status simpanan
0 / *MENU* — tampilkan menu ini lagi`;

export type Intent = "menu" | "cek_harga" | "lapor_pasokan" | "status_bayar" | "unregistered" | "unknown";

export function detectIntent(text: string): Intent {
  const t = text.toLowerCase().trim();
  if (/^(menu|halo|hai|assalamu|mulai|start|bantuan|help)\b/.test(t) || t === "0") return "menu";
  if (/harga/.test(t)) return "cek_harga";
  if (/^lapor|pasokan|panen saya/.test(t)) return "lapor_pasokan";
  if (/status|bayar|simpanan/.test(t)) return "status_bayar";
  return "unknown";
}

export interface HandleMessageResult {
  reply: string;
  intent: Intent;
}

export async function handleMessage(phone: string, rawText: string): Promise<HandleMessageResult> {
  const text = rawText.slice(0, 1000);
  const registration = await lookupRegistration(phone);

  const intent = detectIntent(text);
  let reply: string;

  switch (intent) {
    case "menu": {
      reply = `Halo!\n\n${MENU}`;
      break;
    }
    case "cek_harga": {
      const komoditas = text.toLowerCase().replace(/harga/gi, "").trim() || null;
      if (!komoditas) {
        reply = "Format: HARGA [komoditas], contoh: HARGA kopi";
        break;
      }
      const harga = await getHarga(komoditas);
      reply = harga
        ? `Harga acuan ${harga.komoditas} (${harga.region}): Rp${Number(harga.hargaMin).toLocaleString("id-ID")} - Rp${Number(harga.hargaMax).toLocaleString("id-ID")}/${harga.unit} (median Rp${Number(harga.hargaMedian).toLocaleString("id-ID")}). Sumber: ${harga.sumber}, per ${new Date(harga.updatedAt).toLocaleDateString("id-ID")}.`
        : `Belum ada data harga untuk "${komoditas}". Harga final ditentukan setelah grading dan persetujuan.`;
      break;
    }
    case "lapor_pasokan": {
      if (!registration?.koperasiRef) {
        reply = "Untuk lapor pasokan, daftarkan nomor Anda dulu melalui operator Kopdes. Akses menu registrasi di dashboard web.";
        break;
      }
      const match = /(\d+(?:[.,]\d+)?)\s*(?:kg|kilo)?/i.exec(text);
      const kg = match?.[1] ? Number(match[1].replace(",", ".")) : NaN;
      const komoditasMatch = /lapor\s+([a-z ]+?)\s*\d/i.exec(text) ?? /lapor\s+([a-z ]+)/i.exec(text);
      const komoditas = komoditasMatch?.[1]?.trim();
      if (!kg || kg <= 0 || kg > 100_000 || !komoditas) {
        reply = "Format: LAPOR [komoditas] [kg], contoh: LAPOR kopi 200";
        break;
      }
      const result = await laporPasokan({
        koperasiRef: registration.koperasiRef,
        komoditas,
        quantity: kg,
        unit: "kg",
        memberRef: registration.anggotaRef ?? undefined,
      });
      reply = result.ok
        ? `Laporan ${result.data.quantity} ${result.data.unit} ${result.data.komoditas} tercatat (status: ${result.data.status}). Operator akan menimbang, grading, dan memberi penawaran.`
        : `Laporan gagal dicatat: ${result.message}`;
      break;
    }
    case "status_bayar": {
      if (!registration?.anggotaRef) {
        reply = "Untuk cek status pembayaran, daftarkan nomor Anda dulu melalui operator Kopdes. Akses menu registrasi di dashboard web.";
        break;
      }
      const status = await getSimpananStatus(registration.anggotaRef);
      reply =
        status && status.riwayatSimpanan.length > 0
          ? status.riwayatSimpanan
              .map((s) => `${s.periode ?? "-"}: Rp${Number(s.jumlah).toLocaleString("id-ID")} (${s.status ?? "-"})`)
              .join("\n")
          : "Belum ada riwayat simpanan untuk Anda.";
      break;
    }
    default: {
      const aiReply = await geminiAnswer(text);
      reply = aiReply ?? `Maaf, perintah tidak dikenali.\n\n${MENU}`;
    }
  }

  return { reply, intent };
}
