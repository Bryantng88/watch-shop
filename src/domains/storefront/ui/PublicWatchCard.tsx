"use client";

import Image from "next/image";
import Link from "next/link";
import type { PublicWatchCard } from "../contracts";
import { useStorefrontLocale } from "./StorefrontLocale";
import { formatStorefrontWatchMoney } from "../shared/locale.utils";

function tagLabel(tag: string | null) {
  if (tag === "PRE_OWNED") return "Pre-owned";
  if (tag === "VINTAGE") return "Vintage";
  if (tag === "NEW") return "New";
  return tag;
}
export default function PublicWatchCardView({
  watch,
  priority = false,
}: {
  watch: PublicWatchCard;
  priority?: boolean;
}) {
  const { locale, vndPerUsd } = useStorefrontLocale();
  return (
    <article
      className={`storefront-card vgc-card${watch.hoverImage ? " storefront-card--has-hover" : ""}`}
    >
      <Link href={`/products/${watch.slug}`} className="storefront-focus vgc-card-link">
        <div className="vgc-card-media">
          <Image
            src={watch.image.url}
            alt={watch.image.alt}
            fill
            priority={priority}
            sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, (max-width: 1279px) 25vw, 20vw"
            className="storefront-card-image storefront-card-cover-image"
          />
          {watch.hoverImage ? (
            <Image
              src={watch.hoverImage.url}
              alt=""
              fill
              sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 20vw"
              className="storefront-card-hover-image"
            />
          ) : null}
          {tagLabel(watch.tag) ? <span className="vgc-card-tag">{tagLabel(watch.tag)}</span> : null}
          {watch.availability !== "AVAILABLE" ? (
            <span className="vgc-card-status">
              {watch.availability === "SOLD" ? (locale === "en" ? "Sold" : "Đã bán") : "Hold"}
            </span>
          ) : null}
        </div>
        <div className="vgc-card-copy">
          <p className="vgc-card-brand">
            {watch.brand || (locale === "en" ? "Vintic Selects" : "Tuyển chọn")}
          </p>
          <h2>{watch.title}</h2>
          <p className="vgc-card-price">
            {watch.price.mode === "SHOW"
              ? formatStorefrontWatchMoney(
                  watch.price.amount,
                  locale,
                  vndPerUsd,
                  watch.isCollectible,
                )
              : locale === "en"
                ? "Contact"
                : "Liên hệ"}
            <span aria-hidden>↗</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
