import { Check, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { StorefrontCartItem } from "./StorefrontCart";

export default function AddToRequestButton({ item, orderable, availability = "AVAILABLE", added = false }: { item: StorefrontCartItem; orderable: boolean; availability?: "AVAILABLE" | "HOLD" | "SOLD"; added?: boolean }) {
  const classes = "storefront-focus mt-8 flex min-h-12 w-full items-center justify-center gap-3 bg-[#30302e] px-6 text-xs uppercase tracking-[0.15em] text-white hover:bg-black";
  if (availability !== "AVAILABLE") return <div className="mt-8 flex min-h-12 w-full items-center justify-center border border-[#c9c5bd] bg-[#efede8] px-6 text-xs uppercase tracking-[0.15em] text-[#66635e]">{availability === "HOLD" ? "Đồng hồ đang được giữ" : "Đồng hồ đã bán"}</div>;
  if (!orderable) return <a href="#contact" className={classes}><MessageCircle className="h-4 w-4" /> Liên hệ tư vấn</a>;
  if (added) return <Link href="/request" className={classes}><Check className="h-4 w-4" /> Xem yêu cầu</Link>;
  return <form action="/api/public/request-cart" method="post" className="mt-8">
    <input type="hidden" name="slug" value={item.slug} />
    <input type="hidden" name="returnTo" value={`/products/${item.slug}`} />
    <button type="submit" className={classes.replace("mt-8 ", "")}><MessageCircle className="h-4 w-4" /> Thêm vào yêu cầu</button>
  </form>;
}
