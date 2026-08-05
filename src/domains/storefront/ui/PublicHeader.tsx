"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useStorefrontCart } from "./StorefrontCart";

const navigation = [
  { href: "/products", label: "Đồng hồ" },
  { href: "/products?audience=MEN", label: "Nam" },
  { href: "/products?audience=WOMEN", label: "Nữ" },
  { href: "#contact", label: "Liên hệ" },
];

export default function PublicHeader() {
  const { items } = useStorefrontCart();
  return (
    <header className="border-b border-[#dedbd4] bg-[#fbfaf7]">
      <div className="overflow-hidden border-b border-[#e9e6df] px-4 py-2 text-center text-[9px] uppercase tracking-[0.14em] text-[#6e6b66] sm:text-xs sm:tracking-[0.2em]">
        <span className="sm:hidden">Đồng hồ tuyển chọn · Tư vấn trực tiếp</span>
        <span className="hidden sm:inline">Đồng hồ tuyển chọn · Thông tin minh bạch · Tư vấn trực tiếp</span>
      </div>
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[92px] lg:px-10">
        <details className="group relative lg:hidden">
          <summary className="storefront-focus grid h-11 w-11 cursor-pointer list-none place-items-center rounded-full border border-[#d7d3cb] [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden h-5 w-5 group-open:block" aria-hidden="true" />
            <span className="sr-only">Mở menu</span>
          </summary>
          <nav className="absolute left-0 top-14 z-50 w-[min(82vw,320px)] border border-[#d7d3cb] bg-[#fbfaf7] p-3 shadow-xl">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="storefront-focus block border-b border-[#e5e1da] px-3 py-3 text-sm uppercase tracking-[0.12em] last:border-0">
                {item.label}
              </Link>
            ))}
          </nav>
        </details>

        <Link href="/products" className="storefront-focus min-w-0 text-center" aria-label="Watch Shop">
          <span className="storefront-display block text-[22px] tracking-[-0.04em] sm:text-3xl">Watch Shop</span>
          <span className="mt-1 hidden text-[9px] uppercase tracking-[0.28em] text-[#77746f] sm:block">Vintage &amp; pre-owned collection</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Điều hướng chính">
          {navigation.slice(0, 3).map((item) => (
            <Link key={item.href} href={item.href} className="storefront-focus text-xs uppercase tracking-[0.16em] text-[#56534f] hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link href="/products#catalog-search" className="storefront-focus hidden h-11 w-11 place-items-center rounded-full hover:bg-[#efede7] sm:grid" aria-label="Tìm kiếm">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
          <span className="hidden h-5 w-px bg-[#dedbd4] sm:block" />
          <Link href="/request" className="storefront-focus flex h-11 items-center gap-2 rounded-full px-2 text-xs uppercase tracking-[0.12em] hover:bg-[#efede7] sm:px-3">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">Yêu cầu</span>{items.length ? <span aria-label={`${items.length} sản phẩm`}>({items.length})</span> : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
