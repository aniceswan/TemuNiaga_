"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select } from "@temuniaga/ui";
import type { KoperasiSummary, AnggotaSummary } from "@temuniaga/contracts";

const WA_BOT_PHONE = process.env.NEXT_PUBLIC_WA_BOT_PHONE;

export function WaRegisterForm({ koperasiList }: { koperasiList: KoperasiSummary[] }) {
  const [phone, setPhone] = useState("");
  const [koperasiRef, setKoperasiRef] = useState("");
  const [anggotaRef, setAnggotaRef] = useState("");
  const [anggotaOptions, setAnggotaOptions] = useState<AnggotaSummary[]>([]);
  const [loadingAnggota, setLoadingAnggota] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; registeredPhone?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleKoperasiChange(ref: string) {
    setKoperasiRef(ref);
    setAnggotaRef("");
    setAnggotaOptions([]);
    if (!ref) return;

    setLoadingAnggota(true);
    const res = await fetch(`/api/anggota?koperasiRef=${encodeURIComponent(ref)}`);
    const body = await res.json().catch(() => null);
    setAnggotaOptions(res.ok ? (body?.items ?? []) : []);
    setLoadingAnggota(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const res = await fetch("/api/wa/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, anggotaRef, koperasiRef }),
    });
    const body = await res.json().catch(() => null);

    if (res.ok) {
      setResult({ ok: true, message: `Nomor ${phone} berhasil didaftarkan.`, registeredPhone: phone });
      setPhone("");
    } else {
      setResult({ ok: false, message: body?.message ?? "Pendaftaran gagal." });
    }
    setSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftarkan Nomor WhatsApp Anggota</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
          Hubungkan nomor WhatsApp warga ke data keanggotaan koperasi yang sudah terdaftar, supaya bot WA
          (HARGA/LAPOR/STATUS) bisa mengenali pesan dari nomor tersebut.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="koperasi">Koperasi</Label>
            <Select id="koperasi" required value={koperasiRef} onChange={(e) => handleKoperasiChange(e.target.value)}>
              <option value="">Pilih koperasi...</option>
              {koperasiList.map((k) => (
                <option key={k.koperasiRef} value={k.koperasiRef}>
                  {k.namaKoperasi}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="anggota">Anggota</Label>
            <Select
              id="anggota"
              required
              disabled={!koperasiRef || loadingAnggota}
              value={anggotaRef}
              onChange={(e) => setAnggotaRef(e.target.value)}
            >
              <option value="">{loadingAnggota ? "Memuat..." : "Pilih anggota..."}</option>
              {anggotaOptions.map((a) => (
                <option key={a.anggotaRef} value={a.anggotaRef}>
                  {a.nama ?? a.anggotaRef} ({a.anggotaRef})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="phone">Nomor WhatsApp</Label>
            <Input
              id="phone"
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="628123456789"
            />
          </div>

          {result ? (
            <div className="space-y-2">
              <p className={`text-sm ${result.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {result.message}
              </p>
              {result.ok && result.registeredPhone && WA_BOT_PHONE ? (
                <a
                  href={`https://wa.me/${WA_BOT_PHONE}?text=${encodeURIComponent("Halo TemuNiaga")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
                >
                  Buka Chat WhatsApp Bot →
                </a>
              ) : null}
            </div>
          ) : null}
          <Button type="submit" disabled={submitting || !anggotaRef}>
            {submitting ? "Menyimpan..." : "Daftarkan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
