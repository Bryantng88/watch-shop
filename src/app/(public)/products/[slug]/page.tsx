import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { cookies } from "next/headers";

import { getPublicWatchBySlug, listRelatedPublicWatches } from "@/domains/storefront/server";
import AddToRequestButton from "@/domains/storefront/ui/AddToRequestButton";
import { loadStorefrontCartItems } from "@/domains/storefront/server/request-cart.service";
import { getStorefrontUsdRate } from "@/domains/storefront/server/exchange-rate.service";
import { formatStorefrontMoney } from "@/domains/storefront/shared/locale.utils";
import ProductGallery from "@/domains/storefront/ui/ProductGallery";
import RelatedWatchSuggestions from "@/domains/storefront/ui/RelatedWatchSuggestions";
import { StorefrontAnalyticsSignal } from "@/domains/analytics/storefront/StorefrontAnalytics";

export const dynamic = "force-dynamic";

const getWatch = cache((slug: string) => getPublicWatchBySlug(slug));

const englishSpecLabels: Record<string, string> = { model: "Model", reference: "Reference", caseShape: "Case shape", caseSize: "Case size", caseMaterial: "Case material", dialColor: "Dial color", dialFinish: "Dial finish", crystal: "Crystal", movement: "Movement", calibre: "Calibre", powerReserve: "Power reserve", waterResistance: "Water resistance", bracelet: "Bracelet", strapMaterial: "Strap material", buckle: "Buckle" };
const humanizeSpecValue = (value: string) => value.includes("_") ? value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : value;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const watch = await getWatch(slug);
  if (!watch) return { title: "Không tìm thấy đồng hồ" };
  return {
    title: watch.seo.title,
    description: watch.seo.description,
    robots: { index: false, follow: false },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const watch = await getWatch(slug);
  if (!watch) notFound();
  const [requestItems, cookieStore, rate, relatedWatches] = await Promise.all([
    loadStorefrontCartItems(),
    cookies(),
    getStorefrontUsdRate(),
    listRelatedPublicWatches([watch.productId]),
  ]);
  const locale = cookieStore.get("vintic-locale")?.value === "en" ? "en" : "vi";

  return (
    <article className="mx-auto max-w-[1440px] px-4 pb-8 pt-6 sm:px-6 lg:px-10 lg:pt-10">
      <StorefrontAnalyticsSignal eventName="product_viewed" productId={watch.productId} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#89857e]">
        <Link href="/products" className="storefront-focus inline-flex min-h-11 items-center gap-2"><ArrowLeft className="h-3.5 w-3.5" /> {locale === "en" ? "Collection" : "Bộ sưu tập"}</Link>
        <span>/</span><span className="truncate text-[#4d4a46]">{watch.title}</span>
      </nav>

      <div className="mt-5 grid gap-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-14 xl:gap-20">
        <ProductGallery label={locale === "en" ? "Watch image" : "Hình ảnh đồng hồ"} images={watch.gallery.length ? watch.gallery : [watch.image]} />

        <section className="lg:sticky lg:top-6 lg:self-start">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#817d76]">{watch.brand ?? (locale === "en" ? "Curated watch" : "Đồng hồ tuyển chọn")}</p>
          {watch.availability !== "AVAILABLE" ? <span className="mt-3 inline-flex border border-[#bdb8af] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#55514b]">{watch.availability === "HOLD" ? (locale === "en" ? "On hold" : "Đang được giữ") : (locale === "en" ? "Out of stock" : "Hết hàng")}</span> : null}
          <h1 className="storefront-display mt-3 text-4xl leading-[1.08] sm:text-5xl">{watch.title}</h1>
          <p className="mt-6 text-xl font-semibold tabular-nums">
            {watch.price.mode === "SHOW" ? formatStorefrontMoney(watch.price.amount, locale, rate.vndPerUsd) : locale === "en" ? "Contact" : "Liên hệ"}
          </p>

          <div className="mt-7 flex items-start gap-3 border-y border-[#dedbd4] py-5 text-sm leading-6 text-[#66635e]">
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {locale === "en" ? "Condition and price are reconfirmed when our team receives your request." : "Tình trạng và giá được kiểm tra lại khi đội ngũ tiếp nhận yêu cầu."}
          </div>

          {watch.summary ? <p className="mt-7 text-sm leading-7 text-[#66635e] sm:text-base">{watch.summary}</p> : null}

          <AddToRequestButton locale={locale} availability={watch.availability} added={requestItems.some((item) => item.productId === watch.productId)} orderable={watch.availability === "AVAILABLE"} item={{ productId: watch.productId, slug: watch.slug, title: watch.title, imageUrl: watch.image.url, priceAmount: watch.price.amount ?? 0, priceMode: watch.price.mode, currency: "VND" }} />

          {watch.specs.length ? (
            <div className="mt-10 border-t border-[#dedbd4]">
              <h2 className="storefront-display py-5 text-2xl">{locale === "en" ? "Specifications" : "Thông số"}</h2>
              <dl>
                {watch.specs.map((spec) => (
                  <div key={spec.key} className="grid grid-cols-[minmax(110px,0.8fr)_1.2fr] gap-4 border-t border-[#e5e1da] py-3 text-sm">
                    <dt className="text-[#858079]">{locale === "en" ? englishSpecLabels[spec.key] ?? spec.label : spec.label}</dt>
                    <dd className="text-right text-[#44413d]">{locale === "en" ? humanizeSpecValue(spec.value) : spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>
      </div>
      <RelatedWatchSuggestions watches={relatedWatches} selectedProductIds={[watch.productId]} />
    </article>
  );
}
