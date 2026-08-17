"use client";

import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStorefrontCart } from "./StorefrontCart";
import { useStorefrontLocale } from "./StorefrontLocale";
import { formatStorefrontMoney } from "../shared/locale.utils";

const navigation = {
  VI: {
    watches: "Đồng hồ",
    all: "Tất cả",
    byAudience: "Theo đối tượng",
    bySegment: "Theo phân khúc",
    audienceLinks: [
      { href: "/products?audience=ALL", label: "Tất cả đồng hồ", description: "" },
      { href: "/products?audience=MEN", label: "Đồng hồ Nam", description: "Thiết kế cổ điển dành cho nam" },
      { href: "/products?audience=WOMEN", label: "Đồng hồ Nữ", description: "Thanh lịch, kích thước tinh tế" },
      { href: "/products?audience=UNISEX", label: "Đồng hồ Unisex", description: "Phù hợp nhiều phong cách" },
    ],
    segmentLinks: [
      { href: "/products?collection=STANDARD", label: "Phổ thông", description: "" },
      { href: "/products?collection=COLLECTIBLE", label: "Sưu tầm", description: "" },
    ],
  },
  EN: {
    watches: "Watches",
    all: "All",
    byAudience: "By audience",
    bySegment: "By segment",
    audienceLinks: [
      { href: "/products?audience=ALL", label: "All watches", description: "" },
      { href: "/products?audience=MEN", label: "Men's watches", description: "Classic designs for men" },
      { href: "/products?audience=WOMEN", label: "Women's watches", description: "Elegant, refined proportions" },
      { href: "/products?audience=UNISEX", label: "Unisex watches", description: "Designed for every style" },
    ],
    segmentLinks: [
      { href: "/products?collection=STANDARD", label: "Standard", description: "" },
      { href: "/products?collection=COLLECTIBLE", label: "Collectible", description: "" },
    ],
  },
} as const;

export default function PublicHeader() {
  const { items, remove } = useStorefrontCart();
  const router = useRouter();
  const { locale, vndPerUsd } = useStorefrontLocale();
  const language = locale === "en" ? "EN" : "VI";
  const switchLanguage = (next: "VI" | "EN") => {
    document.cookie = `vintic-locale=${next === "EN" ? "en" : "vi"}; Max-Age=31536000; Path=/; SameSite=Lax`;
    router.refresh();
  };
  const menu = navigation[language];
  const estimatedTotal = items.reduce((total, item) => total + (Number(item.priceAmount) || 0), 0);
  return (
    <header className="border-b border-[#dedbd4] bg-white">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <details className="group relative lg:hidden">
          <summary className="storefront-focus grid h-9 w-9 cursor-pointer list-none place-items-center rounded-[3px] border border-[#d7d3cb] [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden h-5 w-5 group-open:block" aria-hidden="true" />
            <span className="sr-only">Mở menu</span>
          </summary>
          <nav className="absolute left-0 top-11 z-50 w-[min(88vw,360px)] border border-[#d7d3cb] bg-white p-4 shadow-xl">
            <CatalogMenu menu={menu} mobile />
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
          <div className="group/cart relative after:absolute after:left-0 after:top-full after:h-2 after:w-full after:content-['']">
            <Link href="/request" className="storefront-focus relative grid h-9 w-9 place-items-center rounded-[3px] hover:bg-[#efede7]" aria-label={language === "VI" ? "Yêu cầu của bạn" : "Your request"}>
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {items.length ? <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#d84b0b] px-1 text-[8px] font-bold text-white" aria-label={`${items.length} sản phẩm`}>{items.length}</span> : null}
            </Link>
            {items.length ? <div className="invisible absolute right-0 top-[calc(100%+8px)] z-[70] hidden w-[340px] translate-y-1 rounded-md border border-[#d9e0e3] bg-white p-4 opacity-0 shadow-[0_18px_50px_-24px_rgba(35,45,51,0.45)] transition duration-150 group-hover/cart:visible group-hover/cart:translate-y-0 group-hover/cart:opacity-100 group-focus-within/cart:visible group-focus-within/cart:translate-y-0 group-focus-within/cart:opacity-100 sm:block"><div className="flex items-center justify-between border-b border-[#e5e9eb] pb-3"><p className="text-sm font-semibold text-[#29363d]">{language === "VI" ? "Yêu cầu của bạn" : "Your request"}</p><span className="text-[10px] text-[#7d898f]">{items.length} {language === "VI" ? "sản phẩm" : "items"}</span></div><ul className="max-h-[330px] overflow-y-auto py-1">{items.map((item) => <li key={item.productId} className="flex items-center gap-3 border-b border-[#edf0f1] py-3 last:border-0"><Link href={`/products/${item.slug}`} className="relative h-14 w-12 shrink-0 overflow-hidden rounded-sm bg-[#f0f2f2]"><Image src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" /></Link><div className="min-w-0 flex-1"><Link href={`/products/${item.slug}`} className="line-clamp-2 text-xs font-medium leading-4 text-[#334149] hover:text-[#46545e]">{item.title}</Link><p className="mt-1 text-[10px] text-[#8a9499]">1 × {formatStorefrontMoney(Number(item.priceAmount) || 0, locale, vndPerUsd)}</p></div><button type="button" onClick={() => remove(item.productId)} className="storefront-focus grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#dce2e5] text-[#89949a] hover:border-[#bcc7cc] hover:text-[#35434b]" aria-label={`${language === "VI" ? "Xóa" : "Remove"} ${item.title}`}><X className="h-3 w-3" /></button></li>)}</ul><div className="flex items-center justify-between border-t border-[#dfe5e7] pt-3"><span className="text-xs font-medium text-[#65737b]">{language === "VI" ? "Tổng tham khảo" : "Estimated total"}</span><strong className="text-sm tabular-nums text-[#29363d]">{formatStorefrontMoney(estimatedTotal, locale, vndPerUsd)}</strong></div><Link href="/request" className="storefront-focus mt-3 grid min-h-10 place-items-center rounded-sm bg-[#46545e] px-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#35434b]">{language === "VI" ? "Xem yêu cầu" : "View request"}</Link></div> : null}
          </div>
        </div>
      </div>
      <nav className="relative hidden bg-[#46545e] lg:flex lg:h-10 lg:items-center lg:justify-center" aria-label="Điều hướng chính">
        <div className="group/menu relative flex h-full items-center">
          <Link href="/products" className="storefront-focus flex h-full items-center px-8 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 hover:text-white">
            {menu.watches}
            <ChevronDown className="ml-1.5 h-3 w-3 text-white/65 transition-transform duration-200 group-hover/menu:rotate-180" aria-hidden="true" />
          </Link>
          <div className="invisible absolute left-1/2 top-full z-[60] w-[680px] -translate-x-1/2 translate-y-2 border border-[#d8d5ce] bg-white p-7 opacity-0 shadow-[0_24px_60px_-28px_rgba(25,32,36,0.55)] transition duration-150 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100">
            <CatalogMenu menu={menu} />
          </div>
        </div>
      </nav>
    </header>
  );
}

type CatalogMenuData = (typeof navigation)[keyof typeof navigation];

function combineCatalogHref(audienceHref: string, segmentHref?: string) {
  const audience = new URL(audienceHref, "https://storefront.local").searchParams.get("audience") ?? "ALL";
  const params = new URLSearchParams({ audience });
  if (segmentHref) {
    const collection = new URL(segmentHref, "https://storefront.local").searchParams.get("collection");
    if (collection) params.set("collection", collection);
  }
  return `/products?${params.toString()}`;
}

function CatalogMenu({ menu, mobile = false }: { menu: CatalogMenuData; mobile?: boolean }) {
  const allAudience = menu.audienceLinks[0];
  const audiences = menu.audienceLinks.slice(1);
  return <div>
    <Link href={allAudience.href} className={`storefront-focus block font-semibold text-[#303b41] hover:text-[#d84b0b] ${mobile ? "border-b border-[#e8e4dd] px-3 py-3 text-sm" : "mb-5 border-b border-[#dedad2] pb-3 text-[12px]"}`}>{allAudience.label}</Link>
    <div className={mobile ? "space-y-5 pt-4" : "grid grid-cols-3 gap-7"}>
      {audiences.map((audience) => <section key={audience.href}>
        <p className={`${mobile ? "px-3" : "border-b border-[#e3dfd8] pb-2"} text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8b867e]`}>{audience.label}</p>
        <div className={`${mobile ? "mt-1 flex flex-wrap gap-2 px-3" : "space-y-1 pt-2"}`}>
          <CatalogChoice href={combineCatalogHref(audience.href)} label={menu.all} compact={mobile} />
          {menu.segmentLinks.map((segment) => <CatalogChoice key={segment.href} href={combineCatalogHref(audience.href, segment.href)} label={segment.label} compact={mobile} />)}
        </div>
      </section>)}
    </div>
  </div>;
}

function CatalogChoice({ href, label, compact }: { href: string; label: string; compact: boolean }) {
  return <Link href={href} className={compact ? "storefront-focus rounded-sm border border-[#e1ddd5] px-3 py-2 text-xs font-medium text-[#46545e] hover:border-[#bdb7ad] hover:bg-[#f5f3ef]" : "storefront-focus block px-2 py-2 text-[11px] font-medium text-[#46545e] transition hover:translate-x-0.5 hover:bg-[#f7f5f1] hover:text-[#d84b0b]"}>{label}</Link>;
}
