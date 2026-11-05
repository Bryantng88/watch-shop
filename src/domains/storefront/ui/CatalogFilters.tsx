"use client";

import { ChevronDown, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useRef, type ReactNode } from "react";

import { catalogRefinementHref } from "../shared/catalog-navigation";
import type { PublicCatalogFacets, PublicCatalogQuery } from "../contracts";
import { useStorefrontLocale } from "./StorefrontLocale";
import { formatStorefrontMoney } from "../shared/locale.utils";

const styleLabels: Record<NonNullable<PublicCatalogQuery["style"]>, string> = {
  MILITARY: "Military",
  DRESS: "Dress",
  SPORT: "Sport",
  TOOL: "Tool",
  CASUAL: "Casual",
  CLASSIC: "Classic",
  MINIMALIST: "Minimalist",
  LUXURY: "Luxury",
  RETRO: "Retro",
  FUTURISTIC: "Futuristic",
};
const movementLabels: Record<NonNullable<PublicCatalogQuery["movement"]>, string> = {
  AUTOMATIC: "Automatic",
  HAND_WOUND: "Manual Winding",
  QUARTZ: "Quartz",
  SOLAR: "Solar",
  KINETIC: "Kinetic",
  MECHAQUARTZ: "Mechaquartz",
  SPRING_DRIVE: "Spring Drive",
  HYBRID: "Hybrid",
};
const materialLabels: Record<NonNullable<PublicCatalogQuery["caseMaterial"]>, string> = {
  STAINLESS_STEEL: "Thép không gỉ",
  TITANIUM: "Titanium",
  TUNGSTEN: "Tungsten",
  CERAMIC: "Ceramic",
  CARBON: "Carbon",
  GOLD: "Vàng",
  PLATINUM: "Platinum",
  SILVER: "Bạc",
  BRASS: "Đồng thau",
  OTHER: "Khác",
};

function FilterSection({
  title,
  active,
  defaultOpen = false,
  children,
}: {
  title: string;
  active?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen || active}
      className="vgc-filter-section group border-t border-[#e6e6e6]"
    >
      <summary className="storefront-focus flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm text-[#292929] [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          {title}
          {active ? <span className="h-1.5 w-1.5 rounded-full bg-[#702d32]" /> : null}
        </span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

export default function CatalogFilters({
  query,
  facets,
  compact = false,
}: {
  query: PublicCatalogQuery;
  facets: PublicCatalogFacets;
  compact?: boolean;
}) {
  const router = useRouter();
  const { locale, vndPerUsd, rateSource } = useStorefrontLocale();
  const money = useCallback(
    (value: number) => formatStorefrontMoney(value, locale, vndPerUsd),
    [locale, vndPerUsd],
  );
  const searchParams = useSearchParams();
  const priceInputRef = useRef<HTMLInputElement>(null);
  const priceOutputRef = useRef<HTMLOutputElement>(null);
  const initialPriceMax = query.priceMax ?? facets.priceBounds.max;
  const activeCount = [
    query.brand,
    query.style,
    query.size,
    query.movement,
    query.caseMaterial,
    query.strapType,
    query.priceMax !== undefined,
  ].filter(Boolean).length;

  useEffect(() => {
    const input = priceInputRef.current;
    if (!input) return;
    input.value = String(initialPriceMax);
    const syncPrice = () => {
      if (priceOutputRef.current)
        priceOutputRef.current.textContent = `${money(0)} — ${money(Number(input.value))}`;
    };
    syncPrice();
    input.addEventListener("input", syncPrice);
    input.addEventListener("change", syncPrice);
    return () => {
      input.removeEventListener("input", syncPrice);
      input.removeEventListener("change", syncPrice);
    };
  }, [initialPriceMax, money]);

  const hrefFor = useCallback(
    (patch: Record<string, string | undefined>) => {
      return catalogRefinementHref(searchParams.toString(), patch);
    },
    [searchParams],
  );
  const navigate = useCallback(
    (patch: Record<string, string | undefined>, mode: "push" | "replace" = "replace") => {
      const href = hrefFor(patch);
      startTransition(() =>
        mode === "push"
          ? router.push(href, { scroll: false })
          : router.replace(href, { scroll: false }),
      );
    },
    [hrefFor, router],
  );

  const optionClass = (selected: boolean) =>
    `storefront-focus flex min-h-9 w-full items-center justify-between gap-3 py-1.5 text-left text-sm transition ${selected ? "font-medium text-[#1d1d1d]" : "text-[#737373] hover:text-[#1d1d1d]"}`;
  const options = (
    items: Array<{ value: string; label?: string; count: number }>,
    key: "style" | "size" | "movement" | "caseMaterial" | "strapType",
    selected?: string,
  ) =>
    items.map((item) => (
      <Link
        key={item.value}
        href={hrefFor({ [key]: selected === item.value ? undefined : item.value })}
        scroll={false}
        aria-current={selected === item.value ? "true" : undefined}
        className={optionClass(selected === item.value)}
      >
        <span className="flex items-center gap-3">
          <span
            className={`h-3.5 w-3.5 border ${selected === item.value ? "border-[#1d1d1d] bg-[#1d1d1d] shadow-[inset_0_0_0_3px_#ffffff]" : "border-[#c7c7c7]"}`}
          />
          {item.label ?? item.value}
        </span>
        <span className="text-xs font-normal text-[#999999]">{item.count}</span>
      </Link>
    ));

  return (
    <div className={`vgc-filters${compact ? " vgc-filters--compact" : ""}`}>
      <div className="flex min-h-10 items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.16em] text-[#333333]">
          {locale === "en" ? "Filters" : "Bộ lọc"} {activeCount ? `· ${activeCount}` : ""}
        </span>
        {activeCount || query.q ? (
          <button
            type="button"
            onClick={() => router.push("/products", { scroll: false })}
            className="storefront-focus flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[#737373] hover:text-black"
          >
            <RotateCcw className="h-3 w-3" /> {locale === "en" ? "Clear all" : "Xóa tất cả"}
          </button>
        ) : null}
      </div>

      <section className="pb-5 pt-3">
        <h2 className="mb-2 text-sm text-[#292929]">
          {locale === "en" ? "Price range" : "Khoảng giá"}
        </h2>
        <div className="h-8 w-full">
          <input
            ref={priceInputRef}
            type="range"
            aria-label="Giá tối đa"
            min={0}
            max={facets.priceBounds.max}
            step={500_000}
            defaultValue={initialPriceMax}
            className="storefront-price-slider block"
          />
        </div>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const value = Number(priceInputRef.current?.value ?? facets.priceBounds.max);
              navigate(
                {
                  priceMin: undefined,
                  priceMax: value === facets.priceBounds.max ? undefined : String(value),
                },
                "push",
              );
            }}
            className="storefront-focus vgc-filter-apply shrink-0 bg-[#1d1d1d] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
          >
            {locale === "en" ? "Apply" : "Lọc"}
          </button>
          <output
            ref={priceOutputRef}
            className="min-w-0 text-[11px] tabular-nums leading-4 text-[#737373]"
            aria-live="polite"
          >
            {money(0)} — {money(initialPriceMax)}
          </output>
        </div>
        {locale === "en" ? (
          <p className="mt-1.5 text-[9px] text-[#9a958d]">
            USD · Vietcombank{rateSource === "FALLBACK" ? " fallback" : ""}
          </p>
        ) : null}
      </section>

      <FilterSection
        title={locale === "en" ? "Brand" : "Thương hiệu"}
        active={Boolean(query.brand)}
        defaultOpen
      >
        <div className="max-h-60 overflow-y-auto pr-1">
          {facets.brands.map((brand) => (
            <Link
              key={brand.slug}
              href={hrefFor({ brand: query.brand === brand.slug ? undefined : brand.slug })}
              scroll={false}
              aria-current={query.brand === brand.slug ? "true" : undefined}
              className={optionClass(query.brand === brand.slug)}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`h-3.5 w-3.5 border ${query.brand === brand.slug ? "border-[#1d1d1d] bg-[#1d1d1d] shadow-[inset_0_0_0_3px_#ffffff]" : "border-[#c7c7c7]"}`}
                />
                {brand.name}
              </span>
              <span className="text-xs text-[#999999]">{brand.count}</span>
            </Link>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Style" active={Boolean(query.style)}>
        {options(
          facets.styles.map((item) => ({ ...item, label: styleLabels[item.value] })),
          "style",
          query.style,
        )}
      </FilterSection>
      <FilterSection
        title={locale === "en" ? "Case size" : "Kích thước vỏ"}
        active={Boolean(query.size)}
      >
        {options(
          facets.sizes.map((item) => ({
            ...item,
            label:
              item.value === "SMALL"
                ? locale === "en"
                  ? "Under 34 mm"
                  : "Dưới 34 mm"
                : item.value === "MEDIUM"
                  ? "34–38 mm"
                  : locale === "en"
                    ? "Over 38 mm"
                    : "Trên 38 mm",
          })),
          "size",
          query.size,
        )}
      </FilterSection>
      <FilterSection
        title={locale === "en" ? "Movement" : "Loại máy"}
        active={Boolean(query.movement)}
      >
        {options(
          facets.movements.map((item) => ({
            ...item,
            label: movementLabels[item.value as NonNullable<PublicCatalogQuery["movement"]>],
          })),
          "movement",
          query.movement,
        )}
      </FilterSection>
      <FilterSection
        title={locale === "en" ? "Strap type" : "Loại dây"}
        active={Boolean(query.strapType)}
      >
        {options(
          facets.strapTypes.map((item) => ({
            ...item,
            label:
              item.value === "BRACELET"
                ? "Bracelet"
                : locale === "en"
                  ? "Leather strap"
                  : "Dây da (Leather strap)",
          })),
          "strapType",
          query.strapType,
        )}
      </FilterSection>
      <FilterSection
        title={locale === "en" ? "Case material" : "Chất liệu vỏ"}
        active={Boolean(query.caseMaterial)}
      >
        {options(
          facets.caseMaterials.map((item) => ({
            ...item,
            label:
              locale === "en"
                ? item.value
                    .replaceAll("_", " ")
                    .toLowerCase()
                    .replace(/^./, (letter) => letter.toUpperCase())
                : materialLabels[item.value as NonNullable<PublicCatalogQuery["caseMaterial"]>],
          })),
          "caseMaterial",
          query.caseMaterial,
        )}
      </FilterSection>
    </div>
  );
}
