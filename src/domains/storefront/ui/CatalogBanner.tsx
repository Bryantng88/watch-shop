"use client";

import Image from "next/image";
import Link from "next/link";
import { useStorefrontLocale } from "./StorefrontLocale";

type HeroImage = { url: string; altText: string | null; focalX: number; focalY: number } | null;
export default function CatalogBanner({ hero, title }: { hero?: HeroImage; title?: string }) {
  const { locale } = useStorefrontLocale();
  return (
    <header className={`vgc-intro${hero ? " vgc-intro--with-image" : ""}`}>
      <div className="vgc-intro-copy">
        <p className="vgc-kicker">Vintage & pre-owned</p>
        <h1>{title || (locale === "en" ? "Watches with character." : "Đồng hồ tuyển chọn.")}</h1>
        <p className="vgc-intro-description">
          {locale === "en"
            ? "Distinctive designs, presented through real photographs. Find the watch that feels like yours."
            : "Những thiết kế mang dấu ấn riêng, qua hình ảnh thực tế. Tìm chiếc đồng hồ hợp với gu của bạn."}
        </p>
        <Link className="vg-link" href="/request">
          {locale === "en"
            ? "Need a suggestion? Get in touch ↗"
            : "Cần gợi ý? Gửi yêu cầu tư vấn ↗"}
        </Link>
      </div>
      {hero ? (
        <div className="vgc-intro-photo">
          <Image
            src={hero.url}
            alt={
              hero.altText ||
              (locale === "en" ? "Vintic curated watches" : "Đồng hồ tuyển chọn tại Vintic")
            }
            fill
            sizes="(max-width: 640px) 90vw, 400px"
            unoptimized
            priority
            style={{ objectPosition: `${hero.focalX}% ${hero.focalY}%` }}
          />
        </div>
      ) : null}
    </header>
  );
}
