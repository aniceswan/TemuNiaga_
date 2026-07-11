"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import type { ProdukSummary } from "../../lib/api";
import { useCart } from "../../lib/cart-context";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    value,
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
    return <p className="text-sm text-stone-500 dark:text-stone-400">Tidak ada produk ditemukan.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.produkSampleId}>
          <CardHeader>
            <CardTitle className="text-base normal-case tracking-normal text-stone-900 dark:text-stone-100">
              {item.namaProduk ?? "Produk tanpa nama"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-stone-400">{item.namaKoperasi}</p>
            <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
              {formatRupiah(Number(item.hargaJual))}
              {item.unit ? <span className="text-xs font-normal text-stone-400"> / {item.unit}</span> : null}
            </p>
            <Badge tone={item.stok > 0 ? "success" : "harvest"}>
              {item.stok > 0 ? `Stok: ${item.stok.toLocaleString("id-ID")}` : "Stok habis"}
            </Badge>
            <Button
              size="sm"
              className="w-full"
              disabled={item.stok <= 0}
              onClick={() => handleAdd(item)}
            >
              {added[item.produkSampleId] ? "Ditambahkan ✓" : "+ Keranjang"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
