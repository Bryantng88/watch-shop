"use client";

import type { PublicWatchCard } from "../contracts";
import { useEffect, useMemo, useState } from "react";
import AddToRequestButton from "./AddToRequestButton";
import PublicWatchCardView from "./PublicWatchCard";
import { useStorefrontCart } from "./StorefrontCart";
import { useStorefrontLocale } from "./StorefrontLocale";

export default function RelatedWatchSuggestions({ watches, selectedProductIds }: { watches: PublicWatchCard[]; selectedProductIds: string[] }) {
  const { items } = useStorefrontCart();
  const { locale } = useStorefrontLocale();
  const [suggestions, setSuggestions] = useState(watches);
  const productIds = useMemo(() => [...new Set([...selectedProductIds, ...items.map((item) => item.productId)])], [items, selectedProductIds]);
  const productIdsKey = productIds.join(",");

  useEffect(() => {
    if (!productIds.length) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    void fetch("/api/public/catalog/related-watches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
      signal: controller.signal,
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("RELATED_WATCH_REQUEST_FAILED")))
      .then((payload) => {
        if (Array.isArray(payload?.items)) setSuggestions(payload.items);
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setSuggestions(watches);
      });
    return () => controller.abort();
  // The serialized key keeps this stable when the cart provider recreates arrays.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIdsKey]);

  const excluded = new Set(productIds);
  const visible = suggestions.filter((watch) => !excluded.has(watch.productId));
  if (!visible.length) return null;

  return <section className="mt-16 border-t border-[#dedbd4] pt-10 lg:mt-20 lg:pt-12" aria-labelledby="related-watch-title">
    <div className="max-w-2xl"><p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#807a72]">{locale === "en" ? "Selected for you" : "Gợi ý dành cho bạn"}</p><h2 id="related-watch-title" className="storefront-display mt-3 text-3xl text-[#29363d] sm:text-4xl">{locale === "en" ? "You may also like" : "Có thể bạn cũng sẽ thích"}</h2><p className="mt-3 text-sm leading-6 text-[#706b64]">{locale === "en" ? "Available watches selected from the style and price range of your current request." : "Các mẫu đang có sẵn, được chọn theo phong cách và khoảng giá trong yêu cầu hiện tại."}</p></div>
    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">{visible.map((watch) => <div key={watch.productId} className="min-w-0"><PublicWatchCardView watch={watch} />{process.env.NODE_ENV === "development" && watch.relatedScore !== undefined ? <div className="mt-3 flex items-center justify-between border border-dashed border-[#b9b4aa] bg-[#f7f4ed] px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-[#645f57]"><span>Match score</span><strong className="text-xs tabular-nums text-[#302e2a]">{watch.relatedScore.toFixed(1)} / 100</strong></div> : null}<AddToRequestButton item={{ productId: watch.productId, slug: watch.slug, title: watch.title, imageUrl: watch.image.url, priceAmount: watch.price.mode === "SHOW" ? watch.price.amount : 0, priceMode: watch.price.mode, currency: "VND" }} availability={watch.availability} orderable={watch.availability === "AVAILABLE"} locale={locale} /></div>)}</div>
  </section>;
}
