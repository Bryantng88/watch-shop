"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { trackStorefrontEvent } from "@/domains/analytics/storefront/StorefrontAnalytics";

export type StorefrontCartItem = { productId: string; slug: string; title: string; imageUrl: string; priceAmount: number; priceMode: "SHOW" | "CONTACT"; currency: "VND"; isCollectible: boolean };
type CartToast = { item: StorefrontCartItem; duplicate: boolean };
type CartValue = { items: StorefrontCartItem[]; add: (item: StorefrontCartItem, track?: boolean) => boolean; remove: (id: string) => void; clear: () => void };
const STORAGE_KEY = "watch-shop:storefront-request:v1";
const CartContext = createContext<CartValue | null>(null);

export function StorefrontCartProvider({ children, initialItems = [] }: { children: React.ReactNode; initialItems?: StorefrontCartItem[] }) {
  const [items, setItems] = useState<StorefrontCartItem[]>(initialItems);
  const [toast, setToast] = useState<CartToast | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(stored)) {
        const normalized = stored.map((storedItem) => ({
          ...storedItem,
          isCollectible: storedItem?.isCollectible === true,
          priceMode: storedItem?.priceMode === "CONTACT" || !(Number(storedItem?.priceAmount) > 0)
            ? "CONTACT"
            : "SHOW",
        }));
        setItems((current) => [
          ...current,
          ...normalized.filter((storedItem) => !current.some((item) => item.productId === storedItem?.productId)),
        ].slice(0, 20));
      }
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  const add = useCallback((item: StorefrontCartItem, track = true) => {
    const duplicate = items.some((current) => current.productId === item.productId);
    if (!duplicate) setItems((current) => [...current, item].slice(0, 20));
    if (!duplicate && track) void trackStorefrontEvent("cart_item_added", item.productId);
    setToast({ item, duplicate });
    return !duplicate;
  }, [items]);
  const remove = useCallback((id: string) => {
    const removedSlug = items.find((item) => item.productId === id)?.slug ?? "";
    if (removedSlug) void trackStorefrontEvent("cart_item_removed", id);
    setItems((current) => current.filter((item) => item.productId !== id));
    setToast(null);
    if (removedSlug) void fetch("/api/public/request-cart", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: removedSlug }) });
  }, [items]);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, add, remove, clear }), [items, add, remove, clear]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return <CartContext.Provider value={value}>{children}{toast ? <div className="fixed inset-x-3 bottom-3 z-[100] sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:w-[390px]" role="status" aria-live="polite"><div className="overflow-hidden rounded-md border border-[#d9e0e3] bg-white shadow-[0_20px_55px_-22px_rgba(35,45,51,0.48)]"><div className="flex gap-3 p-4"><div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-[#f0f2f3]"><Image src={toast.item.imageUrl} alt="" fill sizes="56px" className="object-cover" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-2 text-sm font-semibold text-[#29363d]"><Check className="h-4 w-4 text-[#46545e]" />{toast.duplicate ? "Đã có trong yêu cầu" : "Đã thêm vào yêu cầu"}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#68757c]">{toast.item.title}</p></div><button type="button" onClick={() => setToast(null)} className="storefront-focus grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#8b959a] hover:bg-[#f1f3f4] hover:text-[#46545e]" aria-label="Đóng thông báo"><X className="h-4 w-4" /></button></div><div className="mt-3 flex items-center gap-3"><Link href="/request" onClick={() => setToast(null)} className="storefront-focus inline-grid min-h-9 place-items-center rounded-sm bg-[#46545e] px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#35434b]">Xem yêu cầu</Link><button type="button" onClick={() => setToast(null)} className="storefront-focus min-h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6f7b81] hover:text-[#35434b]">Tiếp tục xem</button></div></div></div></div></div> : null}</CartContext.Provider>;
}

export function useStorefrontCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("Storefront cart provider is missing");
  return value;
}
