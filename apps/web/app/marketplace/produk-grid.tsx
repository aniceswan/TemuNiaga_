"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, CardTitle } from "@temuniaga/ui";
import type { ProdukSummary } from "../../lib/api";
import { useCart } from "../../lib/cart-context";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    value,
  );
}

// No per-product photography exists in the dataset yet -- until koperasi
// upload real photos, each product gets a deterministic stock photo (same
// product always shows the same image) from Lorem Picsum instead of an
// icon placeholder.
function stockPhotoUrl(id: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(id)}/400/400`;
}

export function ProdukGrid({ items }: { items: ProdukSummary[] }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState<Record<string, boolean>>({});

  function handleAdd(item: ProdukSummary) {
    addItem({
      produkSampleId: item.produkSampleId,
      namaProduk: item.namaProduk ?? "Produk tanpa nama",
      namaKoperasi: item.namaKoperasi,
      hargaJual: Number(item.hargaJual),
      unit: item.unit,
    });
    setAdded((prev) => ({ ...prev, [item.produkSampleId]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.produkSampleId]: false })), 1500);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-stone-300 py-16 text-center dark:border-stone-700">
        <p className="text-sm text-stone-500 dark:text-stone-400">Tidak ada produk ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.produkSampleId} interactive className="flex flex-col overflow-hidden">
          <div className="aspect-square overflow-hidden bg-stone-100 dark:bg-brand-950/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stockPhotoUrl(item.produkSampleId)}
              alt={item.namaProduk ?? "Produk"}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <CardContent className="flex flex-1 flex-col gap-2 p-3.5">
            <CardTitle className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug">
              {item.namaProduk ?? "Produk tanpa nama"}
            </CardTitle>
            <p className="truncate text-xs text-stone-400">{item.namaKoperasi}</p>
            <p className="font-display text-base font-semibold text-brand-700 dark:text-brand-400">
              {formatRupiah(Number(item.hargaJual))}
              {item.unit ? <span className="text-xs font-normal text-stone-400"> /{item.unit}</span> : null}
            </p>
            <Badge tone={item.stok > 0 ? "success" : "harvest"} className="w-fit">
              {item.stok > 0 ? `Stok ${item.stok.toLocaleString("id-ID")}` : "Stok habis"}
            </Badge>
            <Button size="sm" className="mt-auto w-full" disabled={item.stok <= 0} onClick={() => handleAdd(item)}>
              {added[item.produkSampleId] ? "Ditambahkan ✓" : "+ Keranjang"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
