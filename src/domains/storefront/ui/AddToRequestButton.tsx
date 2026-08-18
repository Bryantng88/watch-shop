"use client";

import { Check, LoaderCircle, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useStorefrontCart, type StorefrontCartItem } from "./StorefrontCart";

export default function AddToRequestButton({ item, orderable, availability = "AVAILABLE", added = false, locale = "vi" }: { item: StorefrontCartItem; orderable: boolean; availability?: "AVAILABLE" | "HOLD" | "SOLD"; added?: boolean; locale?: "vi" | "en" }) {
  const { items, add } = useStorefrontCart();
  const [pending, setPending] = useState(false);
  const isAdded = added || items.some((current) => current.productId === item.productId);
  const classes = "storefront-focus mt-8 flex min-h-12 w-full items-center justify-center gap-3 bg-[#30302e] px-6 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-70";
  if (availability !== "AVAILABLE") return <div className="mt-8 flex min-h-12 w-full items-center justify-center border border-[#c9c5bd] bg-[#efede8] px-6 text-xs uppercase tracking-[0.15em] text-[#66635e]">{availability === "HOLD" ? (locale === "en" ? "On hold" : "Đồng hồ đang được giữ") : (locale === "en" ? "Out of stock" : "Hết hàng")}</div>;
  if (!orderable) return <a href="#contact" className={classes}><MessageCircle className="h-4 w-4" /> {locale === "en" ? "Contact us" : "Liên hệ tư vấn"}</a>;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const newlyAdded = add(item);
    if (!newlyAdded) return;
    setPending(true);
    try {
      await fetch("/api/public/request-cart", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body: new URLSearchParams({ slug: item.slug, returnTo: `/products/${item.slug}` }),
      });
    } finally {
      setPending(false);
    }
  };

  if (isAdded) return <button type="button" onClick={() => add(item)} className={classes}><Check className="h-4 w-4" /> {locale === "en" ? "Added to request" : "Đã thêm vào yêu cầu"}</button>;
  return <form action="/api/public/request-cart" method="post" className="mt-8" onSubmit={submit}>
    <input type="hidden" name="slug" value={item.slug} />
    <input type="hidden" name="returnTo" value={`/products/${item.slug}`} />
    <button type="submit" disabled={pending} className={classes.replace("mt-8 ", "")}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />} {locale === "en" ? "Add to request" : "Thêm vào yêu cầu"}</button>
  </form>;
}
