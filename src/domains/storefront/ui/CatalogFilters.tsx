import Link from "next/link";

import type { PublicCatalogQuery } from "../contracts";

export default function CatalogFilters({ query, compact = false }: { query: PublicCatalogQuery; compact?: boolean }) {
  return (
    <form action="/products" method="get" className={compact ? "grid gap-5" : "grid gap-7"}>
      <label className="grid gap-2" id="catalog-search">
        <span className="text-[11px] uppercase tracking-[0.15em] text-[#77746f]">Tìm kiếm</span>
        <input name="q" defaultValue={query.q ?? ""} placeholder="Tên, thương hiệu, mã tham chiếu" className="storefront-focus h-11 w-full border border-[#d7d3cb] bg-transparent px-3 text-sm placeholder:text-[#a4a099]" />
      </label>
      <fieldset className="grid gap-3 border-0 p-0">
        <legend className="mb-2 text-[11px] uppercase tracking-[0.15em] text-[#77746f]">Đối tượng</legend>
        {[{ value: "", label: "Tất cả" }, { value: "MEN", label: "Nam" }, { value: "WOMEN", label: "Nữ" }, { value: "UNISEX", label: "Unisex" }].map((item) => (
          <label key={item.value || "all"} className="flex min-h-8 cursor-pointer items-center gap-3 text-sm text-[#55524e]">
            <input type="radio" name="audience" value={item.value} defaultChecked={(query.audience ?? "") === item.value} className="h-4 w-4 accent-[#30302e]" />
            {item.label}
          </label>
        ))}
      </fieldset>
      <div className="grid gap-3">
        <span className="text-[11px] uppercase tracking-[0.15em] text-[#77746f]">Khoảng giá</span>
        <div className="grid grid-cols-2 gap-2">
          <input name="priceMin" type="number" min="0" step="100000" defaultValue={query.priceMin ?? ""} placeholder="Từ" className="storefront-focus h-11 min-w-0 border border-[#d7d3cb] bg-transparent px-3 text-sm" />
          <input name="priceMax" type="number" min="0" step="100000" defaultValue={query.priceMax ?? ""} placeholder="Đến" className="storefront-focus h-11 min-w-0 border border-[#d7d3cb] bg-transparent px-3 text-sm" />
        </div>
      </div>
      <label className="grid gap-2">
        <span className="text-[11px] uppercase tracking-[0.15em] text-[#77746f]">Sắp xếp</span>
        <select name="sort" defaultValue={query.sort} className="storefront-focus h-11 border border-[#d7d3cb] bg-transparent px-3 text-sm">
          <option value="NEWEST">Mới cập nhật</option>
          <option value="PRICE_ASC">Giá thấp đến cao</option>
          <option value="PRICE_DESC">Giá cao đến thấp</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button type="submit" className="storefront-focus h-11 bg-[#30302e] px-4 text-xs uppercase tracking-[0.13em] text-white hover:bg-black">Áp dụng</button>
        <Link href="/products" className="storefront-focus grid h-11 place-items-center border border-[#d7d3cb] text-xs uppercase tracking-[0.13em]">Đặt lại</Link>
      </div>
    </form>
  );
}

