"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type StorefrontCartItem = { productId: string; slug: string; title: string; imageUrl: string };
type CartValue = { items: StorefrontCartItem[]; add: (item: StorefrontCartItem) => void; remove: (id: string) => void; clear: () => void };
const STORAGE_KEY = "watch-shop:storefront-request:v1";
const CartContext = createContext<CartValue | null>(null);

export function StorefrontCartProvider({ children, initialItems = [] }: { children: React.ReactNode; initialItems?: StorefrontCartItem[] }) {
  const [items, setItems] = useState<StorefrontCartItem[]>(initialItems);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(stored)) setItems((current) => [...current, ...stored.filter((storedItem) => !current.some((item) => item.productId === storedItem?.productId))].slice(0, 20));
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
  const add = useCallback((item: StorefrontCartItem) => setItems((current) => current.some((x) => x.productId === item.productId) ? current : [...current, item].slice(0, 20)), []);
  const remove = useCallback((id: string) => setItems((current) => current.filter((x) => x.productId !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, add, remove, clear }), [items, add, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useStorefrontCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("Storefront cart provider is missing");
  return value;
}
