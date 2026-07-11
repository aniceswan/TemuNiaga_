"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@temuniaga/ui";
import { useCart } from "../../../lib/cart-context";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    value,
  );
}

export function CartCheckout() {
  const { items, updateQty, removeItem, clear, totalHarga } = useCart();
  const [form, setForm] = useState({ namaPembeli: "", teleponPembeli: "", alamatPembeli: "" });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const res = await fetch("/api/pesanan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: items.map((i) => ({ produkSampleId: i.produkSampleId, jumlah: i.jumlah })),
      }),
    });
    const body = await res.json().catch(() => null);

    if (res.ok) {
      const refs = (body?.pesanan ?? []).map((p: { pesananRef: string }) => p.pesananRef).join(", ");
      setResult({ ok: true, message: `Pesanan berhasil dibuat (${refs}). Kopdes akan menghubungi Anda.` });
      clear();
    } else {
      setResult({ ok: false, message: body?.message ?? "Checkout gagal" });
    }
    setSubmitting(false);
  }

  if (items.length === 0 && !result) {
    return (
      <div className="text-center">
        <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">Keranjang Anda masih kosong.</p>
        <Link href="/marketplace">
          <Button variant="outline">Kembali Belanja</Button>
        </Link>
      </div>
    );
  }

  if (result) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className={`mb-4 text-sm ${result.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {result.message}
          </p>
          <Link href="/marketplace">
            <Button variant="outline">Kembali Belanja</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {items.map((item) => (
          <Card key={item.produkSampleId}>
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-stone-900 dark:text-stone-100">{item.namaProduk}</p>
                <p className="text-xs text-stone-400">{item.namaKoperasi}</p>
                <p className="text-sm text-brand-600 dark:text-brand-400">{formatRupiah(item.hargaJual)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={item.jumlah}
                  onChange={(e) => updateQty(item.produkSampleId, Number(e.target.value))}
                  className="w-16 py-1.5"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.produkSampleId)}
                  className="text-xs text-red-600 hover:underline dark:text-red-400"
                >
                  Hapus
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg font-bold text-stone-900 dark:text-stone-50">
            Total: {formatRupiah(totalHarga)}
          </p>
          <form onSubmit={handleCheckout} className="space-y-3">
            <Input
              type="text"
              required
              placeholder="Nama Anda"
              value={form.namaPembeli}
              onChange={(e) => setForm((f) => ({ ...f, namaPembeli: e.target.value }))}
            />
            <Input
              type="text"
              required
              placeholder="Nomor WhatsApp"
              value={form.teleponPembeli}
              onChange={(e) => setForm((f) => ({ ...f, teleponPembeli: e.target.value }))}
            />
            <Textarea
              required
              placeholder="Alamat pengiriman"
              value={form.alamatPembeli}
              onChange={(e) => setForm((f) => ({ ...f, alamatPembeli: e.target.value }))}
              rows={3}
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Memproses..." : "Buat Pesanan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
