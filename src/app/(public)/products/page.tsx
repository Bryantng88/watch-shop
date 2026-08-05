import { SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { publicCatalogQuerySchema, type PublicCatalogQuery } from "@/domains/storefront/contracts";
import { listPublicWatches } from "@/domains/storefront/server";
import CatalogFilters from "@/domains/storefront/ui/CatalogFilters";
import PublicWatchCardView from "@/domains/storefront/ui/PublicWatchCard";

export const metadata: Metadata = {
  title: "Đồng hồ tuyển chọn",
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

function nextPageHref(raw: RawSearchParams, cursor: string) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(scalarSearchParams(raw))) {
    if (key !== "cursor" && value !== "") params.set(key, String(value));
  }
  params.set("cursor", cursor);
  return `/products?${params.toString()}`;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const raw = await searchParams;
  const parsed = publicCatalogQuerySchema.safeParse(scalarSearchParams(raw));
  const invalidFilters = !parsed.success;
  const query: PublicCatalogQuery = parsed.success ? parsed.data : publicCatalogQuerySchema.parse({});
  const result = await listPublicWatches(query);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pt-12">
      <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.16em] text-[#8a867f]">
        <Link href="/products">Trang chủ</Link> <span className="px-2">/</span> <span className="text-[#474541]">Đồng hồ</span>
      </nav>

      <div className="mt-8 border-b border-[#dedbd4] pb-8 lg:flex lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#817d76]">Vintage &amp; pre-owned</p>
          <h1 className="storefront-display mt-3 text-4xl sm:text-5xl lg:text-6xl">Đồng hồ tuyển chọn</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#706d67] sm:text-base">
            Những chiếc đồng hồ đã hoàn tất nội dung, hình ảnh và sẵn sàng để đội ngũ xác nhận tình trạng cùng bạn.
          </p>
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.14em] text-[#817d76] lg:mt-0">{result.items.length} sản phẩm trong trang này</p>
      </div>

      {invalidFilters ? (
        <div role="alert" className="mt-6 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Bộ lọc không hợp lệ đã được đặt lại để bảo vệ truy vấn.
        </div>
      ) : null}

      <details className="mt-6 border-y border-[#dedbd4] py-3 lg:hidden">
        <summary className="storefront-focus flex min-h-11 cursor-pointer list-none items-center justify-between text-xs uppercase tracking-[0.15em] [&::-webkit-details-marker]:hidden">
          Bộ lọc và sắp xếp <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        </summary>
        <div className="pb-4 pt-5"><CatalogFilters query={query} compact /></div>
      </details>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block"><CatalogFilters query={query} /></aside>
        <section aria-label="Danh sách đồng hồ">
          {result.items.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
              {result.items.map((watch) => <PublicWatchCardView key={watch.productId} watch={watch} />)}
            </div>
          ) : (
            <div className="grid min-h-[360px] min-w-0 place-items-center overflow-hidden border border-[#dedbd4] bg-white/40 px-5 text-center sm:px-6">
              <div className="min-w-0 max-w-full">
                <h2 className="storefront-display break-words text-2xl sm:text-3xl">Chưa tìm thấy đồng hồ phù hợp</h2>
                <p className="mt-3 text-sm text-[#77746f]">Thử đặt lại bộ lọc hoặc tìm bằng một từ khóa khác.</p>
                <Link href="/products" className="storefront-focus mt-6 inline-grid h-11 place-items-center bg-[#30302e] px-6 text-xs uppercase tracking-[0.14em] text-white">Xem toàn bộ</Link>
              </div>
            </div>
          )}

          {result.pageInfo.nextCursor ? (
            <div className="mt-14 flex justify-center">
              <Link href={nextPageHref(raw, result.pageInfo.nextCursor)} className="storefront-focus grid min-h-12 place-items-center border border-[#3d3b38] px-8 text-xs uppercase tracking-[0.15em] hover:bg-[#30302e] hover:text-white">
                Xem thêm đồng hồ
              </Link>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
