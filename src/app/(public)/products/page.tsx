import { SlidersHorizontal, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import { publicCatalogQuerySchema, type PublicCatalogQuery } from "@/domains/storefront/contracts";
import {
  getActiveStorefrontHero,
  getPublicCatalogFacets,
  listPublicWatches,
} from "@/domains/storefront/server";
import { catalogRefinementHref } from "@/domains/storefront/shared/catalog-navigation";
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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const raw = await searchParams;
  const locale = (await cookies()).get("vintic-locale")?.value === "en" ? "en" : "vi";
  const parsed = publicCatalogQuerySchema.safeParse(scalarSearchParams(raw));
  const invalidFilters = !parsed.success;
  const parsedQuery: PublicCatalogQuery = parsed.success
    ? parsed.data
    : publicCatalogQuerySchema.parse({});
  const query: PublicCatalogQuery =
    parsedQuery.audience || parsedQuery.collection
      ? parsedQuery
      : { ...parsedQuery, audience: "MEN", collection: "STANDARD" };
  const [result, facets, hero] = await Promise.all([
    listPublicWatches(query),
    getPublicCatalogFacets(),
    getActiveStorefrontHero(),
  ]);
  const search = new URLSearchParams(scalarSearchParams(raw)).toString();
  const refinements = [
    ...(query.q
      ? [{ key: "q", label: `“${query.q}”`, href: catalogRefinementHref(search, { q: undefined }) }]
      : []),
    ...(query.brand
      ? [
          {
            key: "brand",
            label: facets.brands.find((b) => b.slug === query.brand)?.name || query.brand,
            href: catalogRefinementHref(search, { brand: undefined }),
          },
        ]
      : []),
    ...(["style", "size", "movement", "caseMaterial", "strapType"] as const).flatMap((key) =>
      query[key]
        ? [
            {
              key,
              label:
                key === "size"
                  ? {
                      SMALL: locale === "en" ? "Under 34 mm" : "Dưới 34 mm",
                      MEDIUM: "34–38 mm",
                      LARGE: locale === "en" ? "Over 38 mm" : "Trên 38 mm",
                    }[query[key] as "SMALL" | "MEDIUM" | "LARGE"]
                  : String(query[key]).replaceAll("_", " "),
              href: catalogRefinementHref(search, { [key]: undefined }),
            },
          ]
        : [],
    ),
    ...(query.priceMin !== undefined || query.priceMax !== undefined
      ? [
          {
            key: "price",
            label: locale === "en" ? "Price range" : "Khoảng giá",
            href: catalogRefinementHref(search, { priceMin: undefined, priceMax: undefined }),
          },
        ]
      : []),
  ];
  const tabs = [
    {
      label: locale === "en" ? "All watches" : "Tất cả",
      patch: { audience: "ALL", collection: undefined },
      active: query.audience === "ALL" && !query.collection,
    },
    {
      label: locale === "en" ? "For men" : "Nam",
      patch: { audience: "MEN", collection: undefined },
      active: query.audience === "MEN" && query.collection !== "COLLECTIBLE",
    },
    {
      label: locale === "en" ? "For women" : "Nữ",
      patch: { audience: "WOMEN", collection: undefined },
      active: query.audience === "WOMEN" && !query.collection,
    },
    {
      label: locale === "en" ? "Collectible" : "Sưu tầm",
      patch: { audience: "ALL", collection: "COLLECTIBLE" },
      active: query.collection === "COLLECTIBLE",
    },
  ];
  const title =
    query.collection === "COLLECTIBLE"
      ? locale === "en"
        ? "Collectible watches."
        : "Đồng hồ sưu tầm."
      : query.audience === "WOMEN"
        ? locale === "en"
          ? "Watches for her."
          : "Đồng hồ nữ."
        : locale === "en"
          ? "Curated watches."
          : "Đồng hồ tuyển chọn.";
  const currentPage = Math.min(query.page, result.pageInfo.totalPages);

  return (
    <div className="vg-catalog">
      <nav aria-label="Breadcrumb" className="vgc-breadcrumb">
        <Link href="/">{locale === "en" ? "Home" : "Trang chủ"}</Link>
        <span aria-hidden>/</span>
        <span>{locale === "en" ? "Watches" : "Đồng hồ"}</span>
      </nav>
      <CatalogBanner hero={hero} title={title} />
      <nav
        className="vgc-categories"
        aria-label={locale === "en" ? "Watch collections" : "Bộ sưu tập đồng hồ"}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.patch.audience + tab.patch.collection}
            href={catalogRefinementHref(search, tab.patch)}
            aria-current={tab.active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      {invalidFilters ? (
        <div role="alert" className="vgc-notice">
          {locale === "en"
            ? "Invalid filters have been reset."
            : "Bộ lọc không hợp lệ đã được đặt lại."}
        </div>
      ) : null}
      <details className="vgc-mobile-filters">
        <summary className="storefront-focus">
          <span>
            {locale === "en" ? "Filters" : "Bộ lọc"}
            {refinements.length ? ` · ${refinements.length}` : ""}
          </span>
          <SlidersHorizontal size={16} aria-hidden />
        </summary>
        <CatalogFilters query={query} facets={facets} compact />
      </details>
      <div className="vgc-layout">
        <aside
          className="vgc-sidebar"
          aria-label={locale === "en" ? "Filter watches" : "Lọc đồng hồ"}
        >
          <CatalogFilters query={query} facets={facets} />
        </aside>
        <section id="catalog" aria-label={locale === "en" ? "Watch catalog" : "Danh sách đồng hồ"}>
          <div className="vgc-toolbar">
            <p className="vgc-count" aria-live="polite">
              <strong>{result.pageInfo.totalItems}</strong>{" "}
              {locale === "en" ? "watches" : "chiếc đồng hồ"}
            </p>
            <CatalogSearch initialValue={query.q} sort={query.sort} />
          </div>
          {refinements.length ? (
            <div
              className="vgc-refinements"
              aria-label={locale === "en" ? "Active filters" : "Bộ lọc đang chọn"}
            >
              {refinements.map((filter) => (
                <Link
                  key={filter.key}
                  href={filter.href}
                  scroll={false}
                  aria-label={`${locale === "en" ? "Remove" : "Bỏ lọc"} ${filter.label}`}
                >
                  {filter.label}
                  <X size={12} aria-hidden />
                </Link>
              ))}
              <Link className="vgc-clear" href="/products">
                {locale === "en" ? "Clear all" : "Xóa tất cả"}
              </Link>
            </div>
          ) : null}
          {result.items.length ? (
            <div className="vgc-grid">
              {result.items.map((watch, index) => (
                <PublicWatchCardView key={watch.productId} watch={watch} priority={index === 0} />
              ))}
            </div>
          ) : (
            <div className="vgc-empty">
              <p className="vgc-kicker">Vintic / Selection</p>
              <h2>
                {locale === "en" ? "No matching watches found." : "Chưa tìm thấy chiếc phù hợp."}
              </h2>
              <p>
                {locale === "en"
                  ? "Try another search or reset the filters."
                  : "Thử từ khóa khác hoặc đặt lại bộ lọc để khám phá thêm."}
              </p>
              <Link href="/products" className="vg-button">
                {locale === "en" ? "View all watches" : "Xem toàn bộ đồng hồ"}
                <span aria-hidden>↗</span>
              </Link>
            </div>
          )}
          {result.pageInfo.totalPages > 1 ? (
            <nav
              className="vgc-pagination"
              aria-label={locale === "en" ? "Catalog pagination" : "Phân trang đồng hồ"}
            >
              {currentPage > 1 ? (
                <Link href={pageHref(raw, currentPage - 1)} className="vgc-page-direction">
                  {locale === "en" ? "← Previous" : "← Trang trước"}
                </Link>
              ) : null}
              {visiblePages(currentPage, result.pageInfo.totalPages).map((page, index, pages) => (
                <span key={page} className="contents">
                  {index > 0 && page - pages[index - 1] > 1 ? (
                    <span className="vgc-page-gap">…</span>
                  ) : null}
                  <Link
                    href={pageHref(raw, page)}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </Link>
                </span>
              ))}
              {currentPage < result.pageInfo.totalPages ? (
                <Link href={pageHref(raw, currentPage + 1)} className="vgc-page-direction">
                  {locale === "en" ? "Next →" : "Trang sau →"}
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </div>
    </div>
  );
}
