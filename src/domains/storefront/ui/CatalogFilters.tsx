"use client";

import * as Slider from "@radix-ui/react-slider";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import type { PublicCatalogFacets, PublicCatalogQuery } from "../contracts";

const money = (value: number) => `${Math.round(value).toLocaleString("vi-VN")}đ`;

function FilterSection({ title, active, defaultOpen = false, children }: { title: string; active?: boolean; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen || active);
  return <section className="border-t border-[#dedbd4] first:border-t-0">
    <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className="storefront-focus flex min-h-12 w-full items-center justify-between py-3 text-left text-[11px] uppercase tracking-[0.16em] text-[#57534d]">
      <span className="flex items-center gap-2">{title}{active ? <span className="h-1.5 w-1.5 rounded-full bg-[#383530]" /> : null}</span>
      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence initial={false}>
      {open ? <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden"><div className="pb-5">{children}</div></motion.div> : null}
    </AnimatePresence>
  </section>;
}

export default function CatalogFilters({ query, facets, compact = false }: { query: PublicCatalogQuery; facets: PublicCatalogFacets; compact?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query.q ?? "");
  const selectedRange = useMemo<[number, number]>(() => [query.priceMin ?? facets.priceBounds.min, query.priceMax ?? facets.priceBounds.max], [facets.priceBounds.max, facets.priceBounds.min, query.priceMax, query.priceMin]);
  const [range, setRange] = useState<[number, number]>(selectedRange);
  const activeCount = [query.brand, query.audience, query.availability, query.size, query.priceMin !== undefined || query.priceMax !== undefined].filter(Boolean).length;

  useEffect(() => setRange(selectedRange), [selectedRange]);
  useEffect(() => setSearch(query.q ?? ""), [query.q]);

  const hrefFor = useCallback((patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
    next.delete("cursor");
    return next.size ? `/products?${next.toString()}` : "/products";
  }, [searchParams]);
  const navigate = useCallback((patch: Record<string, string | undefined>, mode: "push" | "replace" = "replace") => {
    const href = hrefFor(patch);
    startTransition(() => mode === "push" ? router.push(href, { scroll: false }) : router.replace(href, { scroll: false }));
  }, [hrefFor, router]);

  useEffect(() => {
    const normalized = search.trim();
    if (normalized === (query.q ?? "")) return;
    const timer = window.setTimeout(() => navigate({ q: normalized || undefined }), 350);
    return () => window.clearTimeout(timer);
  }, [navigate, query.q, search]);

  const optionClass = (selected: boolean) => `storefront-focus flex min-h-9 w-full cursor-pointer items-center justify-between gap-3 py-1.5 text-left text-sm transition ${selected ? "font-medium text-[#272522]" : "text-[#706c65] hover:text-[#272522]"}`;
  const control = (
    <div className={compact ? "border border-[#dedbd4] bg-[#fbfaf7] px-4" : ""}>
      <div className="flex min-h-12 items-center justify-between border-b border-[#dedbd4]">
        <span className="text-[11px] uppercase tracking-[0.16em] text-[#57534d]">Bộ lọc {activeCount ? `· ${activeCount}` : ""}</span>
        {activeCount || query.q ? <button type="button" onClick={() => { setSearch(""); setRange([facets.priceBounds.min, facets.priceBounds.max]); router.push("/products", { scroll: false }); }} className="storefront-focus flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[#817d76] hover:text-black"><RotateCcw className="h-3 w-3" /> Xóa tất cả</button> : null}
      </div>

      <form onSubmit={(event) => { event.preventDefault(); navigate({ q: search.trim() || undefined }, "push"); }} className="flex items-center gap-2 border-b border-[#dedbd4] py-5" role="search">
        <label className="relative min-w-0 flex-1" htmlFor="catalog-search">
          <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c877f]" />
          <input id="catalog-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tên, thương hiệu, mã tham chiếu" className="storefront-focus h-10 w-full border-0 bg-transparent pl-7 pr-2 text-sm outline-none placeholder:text-[#aaa59d]" />
        </label>
        <button type="submit" className="storefront-focus border border-[#383530] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#383530] transition hover:bg-[#383530] hover:text-white">Tìm</button>
      </form>

      <FilterSection title="Tình trạng" active={Boolean(query.availability)} defaultOpen>
        {[{ value: undefined, label: "Tất cả", count: facets.availability.reduce((sum, item) => sum + item.count, 0) }, ...facets.availability.map((item) => ({ ...item, label: item.value === "AVAILABLE" ? "Có sẵn" : item.value === "HOLD" ? "HOLD" : "Đã bán" }))].map((item) => {
          const selected = query.availability === item.value || (!query.availability && !item.value);
          return <Link key={item.value ?? "ALL"} href={hrefFor({ availability: item.value })} scroll={false} className={optionClass(selected)}><span className="flex items-center gap-3"><span className={`grid h-4 w-4 place-items-center rounded-full border ${selected ? "border-[#34312d]" : "border-[#bbb6ae]"}`}>{selected ? <span className="h-2 w-2 rounded-full bg-[#34312d]" /> : null}</span>{item.label}</span><span className="text-xs font-normal text-[#aaa59d]">{item.count}</span></Link>;
        })}
      </FilterSection>

      <FilterSection title="Thương hiệu" active={Boolean(query.brand)} defaultOpen={Boolean(query.brand)}>
        <div className="max-h-60 overflow-y-auto pr-1">
          {facets.brands.map((brand) => <Link key={brand.slug} href={hrefFor({ brand: query.brand === brand.slug ? undefined : brand.slug })} scroll={false} className={optionClass(query.brand === brand.slug)}><span className="flex items-center gap-3"><span className={`h-3.5 w-3.5 border ${query.brand === brand.slug ? "border-[#34312d] bg-[#34312d] shadow-[inset_0_0_0_3px_#fbfaf7]" : "border-[#bbb6ae]"}`} />{brand.name}</span><span className="text-xs font-normal text-[#aaa59d]">{brand.count}</span></Link>)}
        </div>
      </FilterSection>

      <FilterSection title="Đối tượng" active={Boolean(query.audience)}>
        {[{ value: "MEN", label: "Nam" }, { value: "WOMEN", label: "Nữ" }, { value: "UNISEX", label: "Unisex" }].map((item) => <Link key={item.value} href={hrefFor({ audience: query.audience === item.value ? undefined : item.value })} scroll={false} className={optionClass(query.audience === item.value)}><span>{item.label}</span>{query.audience === item.value ? <span className="text-xs">✓</span> : null}</Link>)}
      </FilterSection>

      <FilterSection title="Kích thước vỏ" active={Boolean(query.size)}>
        {facets.sizes.map((item) => { const label = item.value === "SMALL" ? "Dưới 34 mm" : item.value === "MEDIUM" ? "34–38 mm" : "Trên 38 mm"; return item.count ? <Link key={item.value} href={hrefFor({ size: query.size === item.value ? undefined : item.value })} scroll={false} className={optionClass(query.size === item.value)}><span>{label}</span><span className="text-xs font-normal text-[#aaa59d]">{item.count}</span></Link> : <span key={item.value} className={`${optionClass(false)} cursor-not-allowed opacity-35`}><span>{label}</span><span className="text-xs font-normal text-[#aaa59d]">0</span></span>; })}
      </FilterSection>

      <FilterSection title="Khoảng giá" active={query.priceMin !== undefined || query.priceMax !== undefined} defaultOpen>
        <Slider.Root value={range} onValueChange={(value) => setRange([value[0], value[1]])} onValueCommit={(value) => navigate({ priceMin: value[0] === facets.priceBounds.min ? undefined : String(value[0]), priceMax: value[1] === facets.priceBounds.max ? undefined : String(value[1]) }, "push")} min={facets.priceBounds.min} max={facets.priceBounds.max} step={500_000} minStepsBetweenThumbs={1} className="relative flex h-6 w-full touch-none select-none items-center">
          <Slider.Track className="relative h-px grow bg-[#d5d0c8]"><Slider.Range className="absolute h-full bg-[#37342f]" /></Slider.Track>
          <Slider.Thumb aria-label="Giá thấp nhất" className="storefront-focus block h-3.5 w-3.5 rounded-full border border-[#37342f] bg-[#fbfaf7] shadow-sm" />
          <Slider.Thumb aria-label="Giá cao nhất" className="storefront-focus block h-3.5 w-3.5 rounded-full border border-[#37342f] bg-[#fbfaf7] shadow-sm" />
        </Slider.Root>
        <div className="mt-2 flex items-center justify-between text-[11px] tabular-nums text-[#77736c]"><span>{money(range[0])}</span><span>{money(range[1])}</span></div>
        <Link href={hrefFor({ priceMin: range[0] === facets.priceBounds.min ? undefined : String(range[0]), priceMax: range[1] === facets.priceBounds.max ? undefined : String(range[1]) })} scroll={false} className="storefront-focus mt-4 flex h-9 items-center justify-center border border-[#d7d3cb] text-[10px] uppercase tracking-[0.12em] text-[#57534d] transition hover:border-[#383530] hover:text-[#272522]">Áp dụng khoảng giá</Link>
      </FilterSection>

      <label className="block border-t border-[#dedbd4] py-5">
        <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-[#57534d]">Sắp xếp</span>
        <select value={query.sort} onChange={(event) => navigate({ sort: event.target.value === "NEWEST" ? undefined : event.target.value }, "push")} className="storefront-focus h-11 w-full border border-[#d7d3cb] bg-transparent px-3 text-sm text-[#55514b]">
          <option value="NEWEST">Mới cập nhật</option><option value="PRICE_ASC">Giá thấp đến cao</option><option value="PRICE_DESC">Giá cao đến thấp</option>
        </select>
      </label>
    </div>
  );
  return control;
}
