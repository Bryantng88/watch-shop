"use client";

import { Check, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useStorefrontCart, type StorefrontCartItem } from "./StorefrontCart";

export default function AddToRequestButton({ item, orderable }: { item: StorefrontCartItem; orderable: boolean }) {
  const { add } = useStorefrontCart();
  const [added, setAdded] = useState(false);
  const classes = "storefront-focus mt-8 flex min-h-12 w-full items-center justify-center gap-3 bg-[#30302e] px-6 text-xs uppercase tracking-[0.15em] text-white hover:bg-black";
  if (!orderable) return <a href="#contact" className={classes}><MessageCircle className="h-4 w-4" /> Liên hệ tư vấn</a>;
  if (added) return <Link href="/request" className={classes}><Check className="h-4 w-4" /> Xem yêu cầu</Link>;
  return <Link href={`/request?product=${encodeURIComponent(item.slug)}`} onClick={() => { add(item); setAdded(true); }} className={classes}><MessageCircle className="h-4 w-4" /> Thêm vào yêu cầu</Link>;
}
