"use client";

import Image from "next/image";
import { useStorefrontLocale } from "./StorefrontLocale";

type HeroImage = {
  url: string;
  altText: string | null;
  focalX: number;
  focalY: number;
} | null;

export default function CatalogBanner({
  title,
  hero,
}: {
  title?: string;
  hero?: HeroImage;
}) {
  const { locale } = useStorefrontLocale();
  return (
    <header className={`vgc-intro${hero ? " vgc-intro--with-image" : ""}`}>
      {hero ? (
        <div className="vgc-intro-art">
          <Image
            src={hero.url}
            alt={
              hero.altText ||
              (locale === "en"
                ? "Vintage watch detail"
                : "Chi tiết đồng hồ vintage")
            }
            fill
            sizes="(max-width: 640px) 64vw, 600px"
            unoptimized
            priority
            style={{ objectPosition: `${hero.focalX}% ${hero.focalY}%` }}
          />
        </div>
      ) : null}
      <div className="vgc-intro-copy">
        <h1>{title || (locale === "en" ? "Watches" : "Đồng hồ")}</h1>
        <p className="vgc-intro-description">
          {locale === "en"
            ? "Vintage & pre-owned watches, selected by Vintic."
            : "Đồng hồ vintage & pre-owned, được Vintic tuyển chọn."}
        </p>
      </div>
    </header>
  );
}
