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

// Deterministic per-product accent so the placeholder art tile isn't
// monotonous across a full grid of products without real photos yet.
const TILE_GRADIENTS = [
  "from-brand-200 to-brand-400",
  "from-harvest-200 to-harvest-400",
  "from-brand-300 to-brand-500",
  "from-harvest-100 to-harvest-300",
];

function tileGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return TILE_GRADIENTS[hash % TILE_GRADIENTS.length];
}

function ProductGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-white/90" aria-hidden>
      <path
        d="M21 8.5 12 4 3 8.5m18 0L12 13m9-4.5v8L12 21m0-8L3 8.5m9 4.5v8m-9-8v8l9 4"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
          <div
            className={`flex aspect-square items-center justify-center bg-gradient-to-br ${tileGradient(item.produkSampleId)}`}
          >
            <ProductGlyph />
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
