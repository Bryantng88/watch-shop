import { SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import { publicCatalogQuerySchema, type PublicCatalogQuery } from "@/domains/storefront/contracts";
import { getActiveStorefrontHero, getPublicCatalogFacets, listPublicWatches } from "@/domains/storefront/server";
import CatalogFilters from "@/domains/storefront/ui/CatalogFilters";
import CatalogBanner from "@/domains/storefront/ui/CatalogBanner";
import CatalogSearch from "@/domains/storefront/ui/CatalogSearch";
import PublicWatchCardView from "@/domains/storefront/ui/PublicWatchCard";

export const metadata: Metadata = {
  title: "Vintic Watch Shop",
  description: "Khám phá đồng hồ vintage và pre-owned đang sẵn sàng tư vấn.",
};

export const dynamic = "force-dynamic";

type RawSearchParams = Record<string, string | string[] | undefined>;

function scalarSearchParams(raw: RawSearchParams) {
  return Object.fromEntries(
    Object.entries(raw).flatMap(([key, value]) => {
      const scalar = Array.isArray(value) ? value[0] : value;
      return scalar === undefined ? [] : [[key, scalar]];
    }),
  );
}

function pageHref(raw: RawSearchParams, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(scalarSearchParams(raw))) {
    if (key !== "cursor" && key !== "page" && value !== "") params.set(key, String(value));
  }
  if (page > 1) params.set("page", String(page));
  return `/products?${params.toString()}#catalog`;
}

function visiblePages(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const raw = await searchParams;
  const locale = (await cookies()).get("vintic-locale")?.value === "en" ? "en" : "vi";
  const parsed = publicCatalogQuerySchema.safeParse(scalarSearchParams(raw));
  const invalidFilters = !parsed.success;
  const parsedQuery: PublicCatalogQuery = parsed.success ? parsed.data : publicCatalogQuerySchema.parse({});
  const query: PublicCatalogQuery = parsedQuery.audience || parsedQuery.collection
    ? parsedQuery
    : { ...parsedQuery, audience: "MEN", collection: "STANDARD" };
  const [result, facets, hero] = await Promise.all([listPublicWatches(query), getPublicCatalogFacets(), getActiveStorefrontHero()]);
  const activeFilterCount = [query.brand, query.audience, query.collection, query.style, query.size, query.movement, query.caseMaterial, query.priceMax !== undefined].filter(Boolean).length;
  const currentPage = Math.min(query.page, result.pageInfo.totalPages);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pt-12">
      <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.16em] text-[#8a867f]">
        <Link href="/products">{locale === "en" ? "Home" : "Trang chủ"}</Link> <span className="px-2">/</span> <span className="text-[#474541]">{locale === "en" ? "Watches" : "Đồng hồ"}</span>
      </nav>

      <CatalogBanner
        hero={hero}
        galleryImageUrl={result.items.find((watch) => watch.hoverImage)?.hoverImage?.url}
      />

      {invalidFilters ? (
        <div role="alert" className="mt-6 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Bộ lọc không hợp lệ đã được đặt lại để bảo vệ truy vấn.
        </div>
      ) : null}

      <details className="mt-6 border-y border-[#dedbd4] py-3 lg:hidden">
        <summary className="storefront-focus flex min-h-11 cursor-pointer list-none items-center justify-between text-xs uppercase tracking-[0.15em] [&::-webkit-details-marker]:hidden">
          <span>{locale === "en" ? "Filters" : "Bộ lọc"}{activeFilterCount ? ` · ${activeFilterCount}` : ""}</span> <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        </summary>
        <div className="pb-4 pt-5"><CatalogFilters query={query} facets={facets} compact /></div>
      </details>

      <div className="mt-7 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block lg:sticky lg:top-6 lg:self-start"><CatalogFilters query={query} facets={facets} /></aside>
        <section id="catalog" aria-label="Danh sách đồng hồ">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#625f59]">{locale === "en" ? `${result.pageInfo.totalItems} products` : `${result.pageInfo.totalItems} sản phẩm`}</p>
            <CatalogSearch initialValue={query.q} sort={query.sort} />
          </div>
          {result.items.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
              {result.items.map((watch) => <PublicWatchCardView key={watch.productId} watch={watch} />)}
            </div>
          ) : (
            <div className="grid min-h-[360px] min-w-0 place-items-center overflow-hidden border border-[#dedbd4] bg-white/40 px-5 text-center sm:px-6">
              <div className="min-w-0 max-w-full">
                <h2 className="storefront-display break-words text-2xl sm:text-3xl">{locale === "en" ? "No matching watches found" : "Chưa tìm thấy đồng hồ phù hợp"}</h2>
                <p className="mt-3 text-sm text-[#77746f]">{locale === "en" ? "Reset the filters or try another search." : "Thử đặt lại bộ lọc hoặc tìm bằng một từ khóa khác."}</p>
                <Link href="/products" className="storefront-focus mt-6 inline-grid h-11 place-items-center bg-[#30302e] px-6 text-xs uppercase tracking-[0.14em] text-white">{locale === "en" ? "View all" : "Xem toàn bộ"}</Link>
              </div>
            </div>
          )}

          {result.pageInfo.totalPages > 1 ? (
            <nav aria-label={locale === "en" ? "Catalog pagination" : "Phân trang đồng hồ"} className="mt-14 flex flex-wrap items-center justify-center gap-2">
              {currentPage > 1 ? <Link href={pageHref(raw, currentPage - 1)} className="storefront-focus grid min-h-11 place-items-center border border-[#aaa59d] px-5 text-xs uppercase tracking-[0.12em] hover:border-[#3d3b38]">{locale === "en" ? "Previous" : "Trang trước"}</Link> : null}
              {visiblePages(currentPage, result.pageInfo.totalPages).map((page, index, pages) => (
                <span key={page} className="contents">
                  {index > 0 && page - pages[index - 1] > 1 ? <span className="px-1 text-[#8a867f]">…</span> : null}
                  <Link href={pageHref(raw, page)} aria-current={page === currentPage ? "page" : undefined} className={`storefront-focus grid h-11 min-w-11 place-items-center border px-3 text-xs ${page === currentPage ? "border-[#30302e] bg-[#30302e] text-white" : "border-[#d2cec6] hover:border-[#3d3b38]"}`}>{page}</Link>
                </span>
              ))}
              {currentPage < result.pageInfo.totalPages ? <Link href={pageHref(raw, currentPage + 1)} className="storefront-focus grid min-h-11 place-items-center border border-[#3d3b38] px-5 text-xs uppercase tracking-[0.12em] hover:bg-[#30302e] hover:text-white">{locale === "en" ? "Next" : "Trang sau"}</Link> : null}
            </nav>
          ) : null}
        </section>
      </div>
    </div>
  );
}
