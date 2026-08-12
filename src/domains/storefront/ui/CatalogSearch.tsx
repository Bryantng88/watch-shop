"use client";

import { ChevronDown, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useStorefrontLocale } from "./StorefrontLocale";

export default function CatalogSearch({ initialValue = "", sort = "NEWEST" }: { initialValue?: string; sort?: "NEWEST" | "PRICE_ASC" | "PRICE_DESC" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const { locale } = useStorefrontLocale();

  useEffect(() => setValue(initialValue), [initialValue]);

  const submit = () => {
    const next = new URLSearchParams(searchParams.toString());
    const normalized = value.trim();
    if (normalized) next.set("q", normalized);
    else next.delete("q");
    next.delete("cursor");
    const href = next.size ? `/products?${next.toString()}` : "/products";
    startTransition(() => router.push(href, { scroll: false }));
  };

  const changeSort = (nextSort: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (nextSort === "NEWEST") next.delete("sort");
    else next.set("sort", nextSort);
    next.delete("cursor");
    const href = next.size ? `/products?${next.toString()}` : "/products";
    startTransition(() => router.push(href, { scroll: false }));
  };

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
    <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex min-w-0 flex-1 items-center rounded-[3px] border border-[#d8d4cc] bg-white/70 p-1 shadow-[0_2px_8px_rgba(55,50,44,0.035)] transition focus-within:border-[#aaa59c] focus-within:bg-white sm:flex-none" role="search">
      <label className="relative min-w-0 flex-1 sm:w-72" htmlFor="catalog-search">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c877f]" />
        <input id="catalog-search" value={value} onChange={(event) => setValue(event.target.value)} placeholder={locale === "en" ? "Search name, brand, reference" : "Tìm tên, thương hiệu, mã tham chiếu"} className="h-8 w-full border-0 bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-[#aaa59d]" />
      </label>
      <button type="submit" className="storefront-focus h-8 shrink-0 rounded-[2px] bg-[#46545e] px-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition duration-200 hover:bg-[#35434d] hover:shadow-sm">{locale === "en" ? "Search" : "Tìm"}</button>
    </form>
      <label className="relative block shrink-0 rounded-[3px] border border-[#d8d4cc] bg-white/70">
        <span className="sr-only">{locale === "en" ? "Sort" : "Sắp xếp"}</span>
        <select value={sort} onChange={(event) => changeSort(event.target.value)} className="h-10 appearance-none border-0 bg-transparent pl-3 pr-8 text-xs text-[#55514b] outline-none focus:outline-none sm:w-32">
          <option value="NEWEST">{locale === "en" ? "Recently updated" : "Mới cập nhật"}</option><option value="PRICE_ASC">{locale === "en" ? "Price: low to high" : "Giá tăng dần"}</option><option value="PRICE_DESC">{locale === "en" ? "Price: high to low" : "Giá giảm dần"}</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77736d]" aria-hidden="true" />
      </label>
    </div>
  );
}
