"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStorefrontCart } from "./StorefrontCart";
import { useStorefrontLocale } from "./StorefrontLocale";

const navigation = {
  VI: [
    { href: "/products", label: "Đồng hồ Nam" },
    { href: "/products?audience=WOMEN", label: "Đồng hồ Nữ" },
    { href: "/products?collection=COLLECTIBLE", label: "Collectibles" },
  ],
  EN: [
    { href: "/products", label: "Men's Watches" },
    { href: "/products?audience=WOMEN", label: "Women's Watches" },
    { href: "/products?collection=COLLECTIBLE", label: "Collectibles" },
  ],
} as const;

export default function PublicHeader() {
  const { items } = useStorefrontCart();
  const router = useRouter();
  const { locale } = useStorefrontLocale();
  const language = locale === "en" ? "EN" : "VI";
  const switchLanguage = (next: "VI" | "EN") => {
    document.cookie = `vintic-locale=${next === "EN" ? "en" : "vi"}; Max-Age=31536000; Path=/; SameSite=Lax`;
    router.refresh();
  };
  const links = navigation[language];
  return (
    <header className="border-b border-[#dedbd4] bg-[#fbfaf7]">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <details className="group relative lg:hidden">
          <summary className="storefront-focus grid h-9 w-9 cursor-pointer list-none place-items-center rounded-[3px] border border-[#d7d3cb] [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden h-5 w-5 group-open:block" aria-hidden="true" />
            <span className="sr-only">Mở menu</span>
          </summary>
          <nav className="absolute left-0 top-11 z-50 w-[min(82vw,320px)] border border-[#d7d3cb] bg-[#fbfaf7] p-3 shadow-xl">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className="storefront-focus block border-b border-[#e5e1da] px-3 py-3 text-sm uppercase tracking-[0.12em] last:border-0">
                {item.label}
              </Link>
            ))}
          </nav>
        </details>

        <Link href="/products" className="storefront-focus min-w-0 text-center lg:text-left" aria-label="Vintic">
          <span className="storefront-display block text-xl tracking-[-0.035em]">Vintic</span>
          <span className="hidden text-[8px] uppercase tracking-[0.2em] text-[#77746f] sm:block">Vintage &amp; pre-owned</span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link href="/products#catalog-search" className="storefront-focus hidden h-9 w-9 place-items-center hover:bg-[#efede7] sm:grid" aria-label="Tìm kiếm">
            <Search className="h-4 w-4" aria-hidden="true" />
          </Link>
          <span className="hidden h-5 w-px bg-[#dedbd4] sm:block" />
          <div className="flex h-8 items-center border border-[#dedbd4] p-0.5 text-[9px] font-semibold tracking-[0.08em]">
            {(["VI", "EN"] as const).map((item) => <button key={item} type="button" onClick={() => switchLanguage(item)} aria-pressed={language === item} className={`h-6 px-2 transition ${language === item ? "bg-[#46545e] text-white" : "text-[#77736d] hover:text-[#252525]"}`}>{item}</button>)}
          </div>
          <Link href="/request" className="storefront-focus relative grid h-9 w-9 place-items-center rounded-[3px] hover:bg-[#efede7]" aria-label={language === "VI" ? "Yêu cầu của bạn" : "Your requests"}>
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {items.length ? <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#d84b0b] px-1 text-[8px] font-bold text-white" aria-label={`${items.length} sản phẩm`}>{items.length}</span> : null}
          </Link>
        </div>
      </div>
      <nav className="hidden bg-[#46545e] lg:flex lg:h-9 lg:items-center lg:justify-center lg:gap-10" aria-label="Điều hướng chính">
        {links.map((item) => <Link key={item.href} href={item.href} className="storefront-focus py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/90 hover:text-white">{item.label}</Link>)}
      </nav>
    </header>
  );
}
