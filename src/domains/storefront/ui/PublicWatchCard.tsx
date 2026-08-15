"use client";

import Image from "next/image";
import Link from "next/link";

import type { PublicWatchCard } from "../contracts";
import { useStorefrontLocale } from "./StorefrontLocale";
import { formatStorefrontMoney } from "../shared/locale.utils";

function tagLabel(tag: string | null) {
  if (tag === "PRE_OWNED") return "Pre-owned";
  if (tag === "VINTAGE") return "Vintage";
  if (tag === "NEW") return "New";
  return tag;
}

function availabilityLabel(availability: PublicWatchCard["availability"]) {
  if (availability === "SOLD") return "Đã bán";
  return null;
}

export default function PublicWatchCardView({ watch }: { watch: PublicWatchCard }) {
  const { locale, vndPerUsd } = useStorefrontLocale();
  return (
    <article className="storefront-card group min-w-0">
      <Link href={`/products/${watch.slug}`} className="storefront-focus block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#efede8]">
          <Image
            src={watch.image.url}
            alt={watch.image.alt}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className={`storefront-card-image storefront-card-cover-image object-cover ${watch.availability === "SOLD" ? "opacity-70 saturate-[0.7]" : ""}`}
          />
          {watch.hoverImage ? <Image src={watch.hoverImage.url} alt="" fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw" className={`storefront-card-hover-image object-cover ${watch.availability === "SOLD" ? "saturate-[0.7]" : ""}`} /> : null}
          {watch.availability === "HOLD" ? (
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center bg-[#f8f5ee]/65 px-5 py-2.5 text-[#393631] shadow-[0_1px_8px_rgba(35,31,26,0.04)]">
              <span className="text-[9px] font-medium uppercase tracking-[0.34em]">Hold</span>
            </div>
          ) : null}
          {availabilityLabel(watch.availability) ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#34322f] shadow-sm">
              {availabilityLabel(watch.availability)}
            </span>
          ) : null}
          {tagLabel(watch.tag) ? (
            <span className="absolute bottom-3 right-3 rounded-full bg-[#3f4d58] px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-white">
              {tagLabel(watch.tag)}
            </span>
          ) : null}
        </div>
        <div className="pt-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#858079]">{watch.brand ?? "Tuyển chọn"}</p>
          <h2 className="mt-2 line-clamp-2 min-h-10 text-sm font-normal leading-5 text-[#4f4c48] sm:text-[15px]">{watch.title}</h2>
          <p className="mt-2 text-sm font-semibold tabular-nums text-[#31302e]">
            {watch.price.mode === "SHOW" ? formatStorefrontMoney(watch.price.amount, locale, vndPerUsd) : locale === "en" ? "Contact" : "Liên hệ"}
          </p>
        </div>
      </Link>
    </article>
  );
}
