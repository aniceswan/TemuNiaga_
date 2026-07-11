"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import type { KoperasiSummary, ProdukSummary } from "@temuniaga/contracts";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    value,
  );
}

export function ProdukManager({ koperasiList }: { koperasiList: KoperasiSummary[] }) {
  const [koperasiRef, setKoperasiRef] = useState("");
  const [produkList, setProdukList] = useState<ProdukSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [newProduk, setNewProduk] = useState({ namaProduk: "", unit: "", hargaJual: "", stok: "" });
  const [creating, setCreating] = useState(false);
  const [editingHarga, setEditingHarga] = useState<Record<string, string>>({});

  async function loadProduk(ref: string) {
    setKoperasiRef(ref);
    setMessage(null);
    if (!ref) {
      setProdukList([]);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/produk?koperasiRef=${encodeURIComponent(ref)}`);
    const body = await res.json().catch(() => null);
    setProdukList(res.ok ? (body?.items ?? []) : []);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!koperasiRef) return;
    setCreating(true);
    setMessage(null);

    const res = await fetch("/api/produk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        koperasiRef,
        namaProduk: newProduk.namaProduk,
        unit: newProduk.unit || undefined,
        hargaJual: Number(newProduk.hargaJual),
        stok: newProduk.stok ? Number(newProduk.stok) : 0,
      }),
    });
    const body = await res.json().catch(() => null);

    if (res.ok) {
      setMessage(`Produk "${body.namaProduk}" berhasil ditambahkan.`);
      setNewProduk({ namaProduk: "", unit: "", hargaJual: "", stok: "" });
      loadProduk(koperasiRef);
    } else {
      setMessage(body?.message ?? "Gagal menambah produk.");
    }
    setCreating(false);
  }

  async function handleUpdateHarga(produkSampleId: string) {
    const value = editingHarga[produkSampleId];
    if (!value) return;
    const res = await fetch(`/api/produk/${encodeURIComponent(produkSampleId)}/harga`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hargaJual: Number(value) }),
    });
    if (res.ok) {
      setMessage("Harga berhasil diperbarui.");
      loadProduk(koperasiRef);
    } else {
      const body = await res.json().catch(() => null);
      setMessage(body?.message ?? "Gagal mengubah harga.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="max-w-sm">
        <label htmlFor="koperasi" className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          Koperasi
        </label>
        <select
          id="koperasi"
          value={koperasiRef}
          onChange={(e) => loadProduk(e.target.value)}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-stone-700 dark:bg-stone-900"
        >
          <option value="">Pilih koperasi...</option>
          {koperasiList.map((k) => (
            <option key={k.koperasiRef} value={k.koperasiRef}>
              {k.namaKoperasi}
            </option>
          ))}
        </select>
      </div>

      {message ? <p className="text-sm text-brand-600 dark:text-brand-400">{message}</p> : null}

      {koperasiRef ? (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Produk Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <input
                type="text"
                required
                placeholder="Nama produk"
                value={newProduk.namaProduk}
                onChange={(e) => setNewProduk((p) => ({ ...p, namaProduk: e.target.value }))}
                className="rounded-md border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900 sm:col-span-2"
              />
              <input
                type="text"
                placeholder="Satuan (kg, pcs, ...)"
                value={newProduk.unit}
                onChange={(e) => setNewProduk((p) => ({ ...p, unit: e.target.value }))}
                className="rounded-md border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
              />
              <input
                type="number"
                required
                min={1}
                placeholder="Harga (Rp)"
                value={newProduk.hargaJual}
                onChange={(e) => setNewProduk((p) => ({ ...p, hargaJual: e.target.value }))}
                className="rounded-md border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
              />
              <input
                type="number"
                min={0}
                placeholder="Stok awal"
                value={newProduk.stok}
                onChange={(e) => setNewProduk((p) => ({ ...p, stok: e.target.value }))}
                className="rounded-md border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
              />
              <Button type="submit" disabled={creating} className="sm:col-span-4 sm:w-fit">
                {creating ? "Menyimpan..." : "+ Tambah Produk"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {loading ? <p className="text-sm text-stone-400">Memuat produk...</p> : null}

      {koperasiRef && !loading ? (
        <div className="space-y-2">
          {produkList.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">Belum ada produk untuk koperasi ini.</p>
          ) : (
            produkList.map((p) => (
              <Card key={p.produkSampleId}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-stone-900 dark:text-stone-100">
                      {p.namaProduk ?? "Produk tanpa nama"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <span>Stok: {p.stok}</span>
                      {Number(p.hargaJual) > 0 ? (
                        <Badge tone="success">Dijual: {formatRupiah(Number(p.hargaJual))}</Badge>
                      ) : (
                        <Badge tone="harvest">Belum ada harga</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Harga baru"
                      value={editingHarga[p.produkSampleId] ?? ""}
                      onChange={(e) =>
                        setEditingHarga((prev) => ({ ...prev, [p.produkSampleId]: e.target.value }))
                      }
                      className="w-28 rounded-md border border-stone-300 px-2 py-1.5 text-sm dark:border-stone-700 dark:bg-stone-900"
                    />
                    <Button size="sm" variant="outline" onClick={() => handleUpdateHarga(p.produkSampleId)}>
                      Simpan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
