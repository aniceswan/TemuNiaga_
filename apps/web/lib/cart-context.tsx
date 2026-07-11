"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  produkSampleId: string;
  namaProduk: string;
  namaKoperasi: string;
  hargaJual: number;
  unit: string | null;
  jumlah: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "jumlah">, jumlah?: number) => void;
  removeItem: (produkSampleId: string) => void;
  updateQty: (produkSampleId: string, jumlah: number) => void;
  clear: () => void;
  totalItems: number;
  totalHarga: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "temuniaga_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed cart state
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "jumlah">, jumlah = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.produkSampleId === item.produkSampleId);
      if (existing) {
        return prev.map((i) =>
          i.produkSampleId === item.produkSampleId ? { ...i, jumlah: i.jumlah + jumlah } : i,
        );
      }
      return [...prev, { ...item, jumlah }];
    });
  }

  function removeItem(produkSampleId: string) {
    setItems((prev) => prev.filter((i) => i.produkSampleId !== produkSampleId));
  }

  function updateQty(produkSampleId: string, jumlah: number) {
    if (jumlah <= 0) return removeItem(produkSampleId);
    setItems((prev) => prev.map((i) => (i.produkSampleId === produkSampleId ? { ...i, jumlah } : i)));
  }

  function clear() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.jumlah, 0);
  const totalHarga = items.reduce((sum, i) => sum + i.hargaJual * i.jumlah, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, totalItems, totalHarga }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
