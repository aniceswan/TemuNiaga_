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

const PRODUCT_EMOJI: [RegExp, string][] = [
  [/minyak|goreng|cooking.?oil/i, "🫒"],
  [/beras|padi|gabah/i, "🍚"],
  [/kopi|coffee/i, "☕"],
  [/teh|tea/i, "🍵"],
  [/gula|sugar/i, "🍬"],
  [/susu|milk/i, "🥛"],
  [/telur|egg/i, "🥚"],
  [/ikan|fish|lele|nila|gurame/i, "🐟"],
  [/ayam|chicken|broiler/i, "🐔"],
  [/daging|sapi|kambing|meat/i, "🥩"],
  [/sayur|bayam|kangkung|sawi|kol|kubis/i, "🥬"],
  [/buah|pisang|mangga|jeruk|apel|pepaya/i, "🍎"],
  [/cabai|cabe|chili/i, "🌶️"],
  [/bawang|onion|garlic/i, "🧅"],
  [/kelapa|santan/i, "🥥"],
  [/jahe|kunyit|kencur|temu/i, "🫚"],
  [/tempe|tahu|kedelai/i, "🫘"],
  [/garam|salt/i, "🧂"],
  [/madu|honey/i, "🍯"],
  [/roti|kue|bread|cake/i, "🍞"],
  [/coklat|cokelat|chocolate/i, "🍫"],
  [/sabun|soap/i, "🧼"],
  [/pupuk|kompos/i, "🪴"],
  [/pakan/i, "🌾"],
];

function productEmoji(nama: string): string {
  for (const [re, emoji] of PRODUCT_EMOJI) {
    if (re.test(nama)) return emoji;
  }
  return "📦";
}

const BG_COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2", "#4f46e5", "#b91c1c"];

function productPlaceholderUrl(nama: string): string {
  const label = (nama || "Produk").slice(0, 18);
  const emoji = productEmoji(label);
  const colorIdx = [...label].reduce((s, c) => s + c.charCodeAt(0), 0) % BG_COLORS.length;
  const bg = BG_COLORS[colorIdx];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="${bg}"/>
  <text x="200" y="200" text-anchor="middle" dy="-0.3em" font-size="80" fill="white" opacity="0.9">${emoji}</text>
  <text x="200" y="280" text-anchor="middle" font-size="22" fill="white" opacity="0.85" font-family="system-ui,sans-serif" font-weight="600">${label}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
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
              src={productPlaceholderUrl(item.namaProduk ?? "Produk")}
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
